// delete_all_posts.js
// 删除所有已排期的Metricool帖子

const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');
const config = require('../config');

// 配置代理
const proxyAgent = config.USE_PROXY
    ? new SocksProxyAgent(`socks5://${config.PROXY_HOST}:${config.PROXY_PORT}`)
    : undefined;

const metricoolAxios = axios.create({
    httpsAgent: proxyAgent,
    timeout: 60000
});

/**
 * 获取所有已排期的帖子
 */
async function getAllScheduledPosts() {
    try {
        console.log('📖 获取所有已排期的帖子...\n');

        // 获取未来一个月的帖子
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 30);

        const startStr = start.toISOString().split('T')[0] + 'T00:00:00';
        const endStr = end.toISOString().split('T')[0] + 'T23:59:59';

        const url = `https://app.metricool.com/api/v2/scheduler/posts?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}&timezone=Asia/Shanghai&extendedRange=true&userId=${config.METRICOOL_USER_ID}&blogId=${config.METRICOOL_BLOG_ID}`;

        const response = await metricoolAxios.get(url, {
            headers: {
                'X-Mc-Auth': config.METRICOOL_TOKEN,
                'Accept': 'application/json'
            }
        });

        const posts = response.data.data || [];
        console.log(`✅ 找到 ${posts.length} 条已排期的帖子\n`);

        return posts;

    } catch (error) {
        console.error('❌ 获取帖子失败:', error.message);
        throw error;
    }
}

/**
 * 删除单个帖子
 */
async function deletePost(postId, title) {
    try {
        const url = `https://app.metricool.com/api/v2/scheduler/posts/${postId}?userId=${config.METRICOOL_USER_ID}&blogId=${config.METRICOOL_BLOG_ID}`;

        await metricoolAxios.delete(url, {
            headers: {
                'X-Mc-Auth': config.METRICOOL_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log(`   ✅ 已删除: ${title.substring(0, 30)}...`);
        return true;

    } catch (error) {
        console.error(`   ❌ 删除失败: ${title.substring(0, 30)}... - ${error.message}`);
        return false;
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始删除所有已排期的帖子\n');
    console.log('='.repeat(60) + '\n');

    try {
        // 1. 获取所有帖子
        const posts = await getAllScheduledPosts();

        if (posts.length === 0) {
            console.log('没有需要删除的帖子');
            return;
        }

        // 2. 显示将要删除的帖子
        console.log('将要删除的帖子:\n');
        posts.forEach((post, index) => {
            const title = post.text ? post.text.substring(0, 50) : '无标题';
            const pubDate = post.publicationDate ? post.publicationDate.dateTime : '未知时间';
            console.log(`   ${index + 1}. ID: ${post.id} | ${pubDate} | ${title}...`);
        });

        console.log('\n' + '='.repeat(60) + '\n');

        // 3. 批量删除
        console.log('开始删除...\n');
        let successCount = 0;
        let failCount = 0;

        for (const post of posts) {
            const title = post.text ? post.text.substring(0, 50) : '无标题';
            const result = await deletePost(post.id, title);

            if (result) {
                successCount++;
            } else {
                failCount++;
            }

            // 延迟避免过载
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 4. 统计
        console.log('\n' + '='.repeat(60));
        console.log('📊 删除完成统计:');
        console.log(`   总计: ${posts.length} 条`);
        console.log(`   ✅ 成功: ${successCount} 条`);
        console.log(`   ❌ 失败: ${failCount} 条`);

    } catch (error) {
        console.error('\n❌ 处理失败:', error.message);
        process.exit(1);
    }
}

// 运行
if (require.main === module) {
    main();
}

module.exports = { getAllScheduledPosts, deletePost };
