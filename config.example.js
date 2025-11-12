// config.example.js
// 配置文件模板 - 复制为config.js后填入真实信息

module.exports = {
    // Notion凭证（可选，当前未使用）
    NOTION_TOKEN: "你的Notion Token",
    NOTION_DATABASE_ID: "你的Database ID",

    // Metricool凭证（必填）
    METRICOOL_TOKEN: "你的Metricool Token",
    METRICOOL_USER_ID: "你的User ID",
    METRICOOL_BLOG_ID: "你的Blog ID",

    // Cloudflare R2设置（必填）
    // 详见: 用户指南.md - 配置教程部分
    R2_ACCESS_KEY_ID: "你的Access Key ID",
    R2_SECRET_ACCESS_KEY: "你的Secret Access Key",
    R2_ENDPOINT: "https://账号ID.r2.cloudflarestorage.com",
    R2_BUCKET_NAME: "metricool-videos",
    R2_PUBLIC_URL: "https://pub-xxxxxx.r2.dev",

    // 视频设置
    VIDEOS_FOLDER: "./videos",

    // 代理设置（可选）
    USE_PROXY: true,   // 是否使用代理（如Clash）
    PROXY_HOST: "127.0.0.1",
    PROXY_PORT: 7897   // Clash默认端口
};
