// process_excel_posts.js
// 从Excel读取贴文，上传视频到R2，发布到Metricool

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { uploadToR2 } = require('./upload_to_r2');
const config = require('../config');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { SocksProxyAgent } = require('socks-proxy-agent');
const https = require('https');
const http = require('http');

// 配置代理和axios实例
const httpsAgentOptions = {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000
};

const httpAgentOptions = { ...httpsAgentOptions };

const proxyAgent = config.USE_PROXY
    ? new SocksProxyAgent(`socks5://${config.PROXY_HOST}:${config.PROXY_PORT}`, {
        timeout: 60000
    })
    : undefined;

const metricoolAxios = axios.create({
    httpsAgent: proxyAgent || new https.Agent(httpsAgentOptions),
    httpAgent: proxyAgent || new http.Agent(httpAgentOptions),
    timeout: 60000
});

axiosRetry(metricoolAxios, {
    retries: 5,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error)
            || error.code === 'ECONNABORTED'
            || error.code === 'ETIMEDOUT'
            || (error.response && error.response.status >= 500);
    },
    onRetry: (retryCount, error) => {
        console.log(`  🔄 Metricool重试 (${retryCount}/5): ${error.message}`);
    }
});

// Excel文件路径
const EXCEL_FILE = '贴文发布.xlsx';

/**
 * 读取Excel文件
 */
function readExcel() {
    console.log(`📖 读取Excel文件: ${EXCEL_FILE}`);

    if (!fs.existsSync(EXCEL_FILE)) {
        throw new Error(`Excel文件不存在: ${EXCEL_FILE}`);
    }

    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 转换为JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`✅ 读取到 ${data.length} 条记录`);
    console.log('\n前3条记录示例:');
    console.log(JSON.stringify(data.slice(0, 3), null, 2));

    return { workbook, worksheet, data, sheetName };
}

/**
 * 查找本地视频文件
 */
function findLocalVideo(title) {
    const videosDir = config.VIDEOS_FOLDER;
    const videoExtensions = ['.mp4', '.mov'];

    // 读取所有视频文件
    const files = fs.readdirSync(videosDir);

    // 精确匹配
    for (const ext of videoExtensions) {
        const exactMatch = `${title}${ext}`;
        if (files.includes(exactMatch)) {
            return path.join(videosDir, exactMatch);
        }
    }

    // 模糊匹配（文件名包含标题）
    for (const file of files) {
        if (file.includes(title) && videoExtensions.some(ext => file.endsWith(ext))) {
            return path.join(videosDir, file);
        }
    }

    return null;
}

/**
 * 上传到Metricool
 */
async function uploadToMetricool(title, content, videoUrl, scheduledTime) {
    console.log(`   🔄 上传到Metricool...`);

    try {
        // 格式化发布时间（Asia/Shanghai时区）
        const shanghaiTime = new Date(scheduledTime.getTime() + (8 * 60 * 60 * 1000));
        const dateTimeStr = shanghaiTime.toISOString().split('.')[0];

        const payload = {
            text: content,
            media: [videoUrl],
            publicationDate: {
                dateTime: dateTimeStr,
                timezone: 'Asia/Shanghai'
            },
            providers: [
                { network: 'instagram' },
                { network: 'tiktok' },
                { network: 'threads' },
                { network: 'facebook' },
                { network: 'youtube' }
            ],
            instagramData: { type: 'REEL' },
            tiktokData: {
                disableComment: false,
                disableDuet: false,
                disableStitch: false,
                privacyOption: 'PUBLIC_TO_EVERYONE'
            },
            threadsData: {},
            facebookData: { type: 'REEL' },
            youtubeData: {
                title: title,
                type: 'short',
                privacy: 'public',
                madeForKids: false
            },
            autoPublish: true,
            draft: false,
            firstCommentText: '',
            hasNotReadNotes: false,
            mediaAltText: [],
            shortener: false,
            smartLinkData: { ids: [] },
            descendants: []
        };

        const response = await metricoolAxios.post(
            `https://app.metricool.com/api/v2/scheduler/posts?userId=${config.METRICOOL_USER_ID}&blogId=${config.METRICOOL_BLOG_ID}&integrationSource=MCP`,
            payload,
            {
                headers: {
                    'X-Mc-Auth': config.METRICOOL_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        console.log(`   ✅ Metricool上传成功！ID: ${response.data.id || 'N/A'}`);
        console.log(`   📅 发布时间: ${scheduledTime.toLocaleString('zh-CN')}`);

        return response.data;

    } catch (error) {
        console.error(`   ❌ Metricool上传失败: ${error.message}`);
        if (error.response) {
            console.error(`   状态码: ${error.response.status}`);
            console.error(`   错误详情:`, JSON.stringify(error.response.data, null, 2).substring(0, 500));
        }
        throw error;
    }
}

/**
 * 处理单条贴文
 */
async function processPost(post, index) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 处理第 ${index + 1} 条贴文: ${post.标题 || '未命名'}`);

    const title = post.标题;
    const content = post.贴文内容;
    const currentUrl = post.视频url;
    const status = post.状态;

    console.log(`   标题: ${title}`);
    console.log(`   当前URL: ${currentUrl || '无'}`);
    console.log(`   状态: ${status || '无'}`);

    // 如果已有R2 URL且状态是"已排期"，跳过
    if (currentUrl && currentUrl.includes('r2.dev') && status === '已排期') {
        console.log('   ⏭️  已完全处理，跳过');
        return { ...post, skipped: true };
    }

    // 1. 查找本地视频
    const videoPath = findLocalVideo(title);
    if (!videoPath) {
        console.log(`   ❌ 未找到本地视频文件: ${title}`);
        return { ...post, error: '视频文件不存在' };
    }
    console.log(`   ✅ 找到视频: ${videoPath}`);

    // 2. 上传到R2（如果已有R2 URL则跳过上传）
    let r2Url = currentUrl;
    if (!r2Url || !r2Url.includes('r2.dev')) {
        try {
            r2Url = await uploadToR2(videoPath);
            console.log(`   ✅ R2 URL: ${r2Url}`);
        } catch (error) {
            console.log(`   ❌ 上传R2失败: ${error.message}`);
            return { ...post, error: `上传失败: ${error.message}` };
        }
    } else {
        console.log(`   ✅ 使用已有R2 URL: ${r2Url}`);
    }

    // 3. 上传到Metricool
    // 计算发布时间：所有帖子都在每天晚上8点，一天一条
    const baseTime = new Date();
    baseTime.setDate(baseTime.getDate() + index); // 第index天
    baseTime.setHours(20, 0, 0, 0); // 晚上8点
    const scheduledTime = baseTime;

    try {
        await uploadToMetricool(title, content, r2Url, scheduledTime);
        console.log('   ✅ 已上传到Metricool');
    } catch (error) {
        console.log(`   ❌ Metricool上传失败: ${error.message}`);
        return {
            ...post,
            视频url: r2Url,
            状态: '已上传R2',
            error: `Metricool失败: ${error.message}`
        };
    }

    // 4. 更新记录
    return {
        ...post,
        视频url: r2Url,
        状态: '已排期',
        发布时间: scheduledTime.toLocaleString('zh-CN'),
        处理时间: new Date().toLocaleString('zh-CN')
    };
}

/**
 * 更新Excel文件
 */
function updateExcel(workbook, sheetName, updatedData) {
    console.log(`\n💾 更新Excel文件...`);

    // 转换回worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets[sheetName] = newWorksheet;

    // 直接写入更新（不备份）
    XLSX.writeFile(workbook, EXCEL_FILE);
    console.log(`✅ Excel文件已更新: ${EXCEL_FILE}`);
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始处理Excel贴文\n');

    try {
        // 1. 读取Excel
        const { workbook, data, sheetName } = readExcel();

        // 2. 处理每条记录
        const updatedData = [];
        for (let i = 0; i < data.length; i++) {
            const result = await processPost(data[i], i);
            updatedData.push(result);

            // 每条记录间延迟，避免过载
            if (i < data.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // 3. 更新Excel
        updateExcel(workbook, sheetName, updatedData);

        // 4. 统计
        const uploaded = updatedData.filter(p => p.视频url && p.视频url.includes('r2.dev')).length;
        const skipped = updatedData.filter(p => p.skipped).length;
        const errors = updatedData.filter(p => p.error).length;

        console.log(`\n${'='.repeat(60)}`);
        console.log('📊 处理完成统计:');
        console.log(`   总计: ${data.length} 条`);
        console.log(`   ✅ 已上传: ${uploaded} 条`);
        console.log(`   ⏭️  跳过: ${skipped} 条`);
        console.log(`   ❌ 失败: ${errors} 条`);

    } catch (error) {
        console.error('\n❌ 处理失败:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// 运行
if (require.main === module) {
    main();
}

module.exports = { readExcel, processPost, updateExcel };
