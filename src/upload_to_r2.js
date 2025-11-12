// upload_to_r2.js
// 上传视频到Cloudflare R2

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// 初始化R2客户端
const r2Client = new S3Client({
    region: 'auto',
    endpoint: config.R2_ENDPOINT,
    credentials: {
        accessKeyId: config.R2_ACCESS_KEY_ID,
        secretAccessKey: config.R2_SECRET_ACCESS_KEY
    }
});

/**
 * 上传文件到Cloudflare R2
 * @param {string} filePath - 本地文件路径
 * @returns {Promise<string>} 返回公开访问URL
 */
async function uploadToR2(filePath) {
    try {
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            throw new Error(`文件不存在: ${filePath}`);
        }

        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);
        const fileSizeInMB = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);

        console.log(`📤 上传视频到Cloudflare R2: ${fileName} (${fileSizeInMB} MB)`);

        // 上传文件
        const command = new PutObjectCommand({
            Bucket: config.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
            ContentType: 'video/mp4'
        });

        await r2Client.send(command);

        // 生成公开URL
        const publicUrl = `${config.R2_PUBLIC_URL}/${fileName}`;

        console.log(`✅ 上传成功！`);
        console.log(`🔗 公开URL: ${publicUrl}`);

        return publicUrl;

    } catch (error) {
        console.error(`❌ 上传到R2失败:`, error.message);
        throw error;
    }
}

// 如果直接运行此脚本（测试用）
if (require.main === module) {
    const testVideoPath = process.argv[2];

    if (!testVideoPath) {
        console.log('用法: node upload_to_r2.js <视频文件路径>');
        console.log('示例: node upload_to_r2.js ./videos/test.mp4');
        process.exit(1);
    }

    uploadToR2(testVideoPath)
        .then(url => {
            console.log('\n测试完成！');
            console.log('视频URL:', url);
        })
        .catch(error => {
            console.error('\n测试失败:', error.message);
            process.exit(1);
        });
}

module.exports = { uploadToR2 };
