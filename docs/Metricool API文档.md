# Metricool API 完整文档

> 本文档记录了Metricool API的实战使用，包括官方未公开的DELETE API的发现过程

---

## 📋 目录

1. [API认证](#api认证)
2. [创建排期帖子](#创建排期帖子-post)
3. [获取已排期帖子](#获取已排期帖子-get)
4. [删除帖子](#删除帖子-delete-重要发现)
5. [完整示例代码](#完整示例代码)

---

## 🔑 API认证

### 获取凭证

1. 登录 [Metricool](https://app.metricool.com)
2. 进入 Settings → API
3. 复制以下信息：
   - `METRICOOL_TOKEN`: API Token
   - `METRICOOL_USER_ID`: 用户ID
   - `METRICOOL_BLOG_ID`: 博客ID

### 认证方式

所有API请求需要在Header中添加：

```javascript
headers: {
    'X-Mc-Auth': 'YOUR_TOKEN',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
```

---

## 📤 创建排期帖子 (POST)

### Endpoint

```
POST https://app.metricool.com/api/v2/scheduler/posts
    ?userId={userId}
    &blogId={blogId}
    &integrationSource=MCP
```

### 请求体 (Payload)

```javascript
{
    // 文案内容
    "text": "你的贴文内容 #hashtag",

    // 媒体文件（视频或图片URL）
    "media": ["https://your-cdn.com/video.mp4"],

    // 发布时间
    "publicationDate": {
        "dateTime": "2025-11-12T20:00:00",  // ISO 8601格式，UTC+0
        "timezone": "Asia/Shanghai"          // 时区
    },

    // 发布平台
    "providers": [
        { "network": "instagram" },
        { "network": "tiktok" },
        { "network": "threads" },
        { "network": "facebook" },
        { "network": "youtube" }
    ],

    // Instagram配置
    "instagramData": {
        "type": "REEL"  // 或 "POST", "STORY"
    },

    // TikTok配置
    "tiktokData": {
        "disableComment": false,
        "disableDuet": false,
        "disableStitch": false,
        "privacyOption": "PUBLIC_TO_EVERYONE"  // 或 "MUTUAL_FOLLOW_FRIENDS", "SELF_ONLY"
    },

    // Threads配置
    "threadsData": {},

    // Facebook配置
    "facebookData": {
        "type": "REEL"  // 或 "POST"
    },

    // YouTube配置
    "youtubeData": {
        "title": "视频标题",
        "type": "short",  // 或 "video"
        "privacy": "public",  // 或 "private", "unlisted"
        "madeForKids": false
    },

    // 其他配置
    "autoPublish": true,      // 自动发布
    "draft": false,            // 是否为草稿
    "firstCommentText": "",    // 首条评论
    "hasNotReadNotes": false,
    "mediaAltText": [],        // 媒体描述文本
    "shortener": false,        // 是否使用短链
    "smartLinkData": { "ids": [] },
    "descendants": []
}
```

### 响应

**成功 (200 OK)**:
```javascript
{
    "id": "260927612",  // 帖子ID
    "status": "scheduled",
    "publicationDate": "2025-11-12T20:00:00",
    // ... 其他信息
}
```

**失败**:
```javascript
{
    "error": "Invalid token",
    "message": "Authentication failed"
}
```

### 时间格式重要说明

⚠️ **关键**: Metricool API要求UTC+0时间，但可以指定时区

```javascript
// 如果你想在北京时间晚上8点发布
const localTime = new Date('2025-11-12T20:00:00');  // 本地时间
const utcTime = new Date(localTime.getTime() + (8 * 60 * 60 * 1000));  // 转UTC
const dateTimeStr = utcTime.toISOString().split('.')[0];  // "2025-11-13T04:00:00"

// Payload中
{
    "publicationDate": {
        "dateTime": dateTimeStr,  // UTC时间
        "timezone": "Asia/Shanghai"  // 指定显示时区
    }
}
```

---

## 📥 获取已排期帖子 (GET)

### Endpoint

```
GET https://app.metricool.com/api/v2/scheduler/posts
    ?start={startDateTime}
    &end={endDateTime}
    &timezone={timezone}
    &extendedRange=true
    &userId={userId}
    &blogId={blogId}
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| start | string | 是 | 开始时间 (ISO 8601) |
| end | string | 是 | 结束时间 (ISO 8601) |
| timezone | string | 否 | 时区，如 "Asia/Shanghai" |
| extendedRange | boolean | 否 | 扩展范围 |
| userId | string | 是 | 用户ID |
| blogId | string | 是 | 博客ID |

### 示例请求

```javascript
const start = new Date();
const end = new Date();
end.setDate(end.getDate() + 30);  // 未来30天

const startStr = start.toISOString().split('T')[0] + 'T00:00:00';
const endStr = end.toISOString().split('T')[0] + 'T23:59:59';

const url = `https://app.metricool.com/api/v2/scheduler/posts?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}&timezone=Asia/Shanghai&extendedRange=true&userId=${userId}&blogId=${blogId}`;
```

### 响应

```javascript
{
    "data": [
        {
            "id": "260927612",
            "text": "贴文内容",
            "media": ["https://..."],
            "publicationDate": {
                "dateTime": "2025-11-12T20:00:00",
                "timezone": "Asia/Shanghai"
            },
            "providers": [...],
            "status": "scheduled"
        },
        // ... 更多帖子
    ],
    "total": 20
}
```

---

## 🗑️ 删除帖子 (DELETE) - ⭐重要发现

### 背景故事

**问题**: Metricool官方文档中**没有公开DELETE API**，只能在网页界面中手动删除。

**解决过程**:
1. 使用Chrome DevTools监控网页删除操作
2. 捕获DELETE请求
3. 分析请求格式
4. 编写测试脚本验证
5. 成功！🎉

### Endpoint

```
DELETE https://app.metricool.com/api/v2/scheduler/posts/{postId}
    ?userId={userId}
    &blogId={blogId}
```

### 参数

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| postId | URL路径 | string | 是 | 帖子ID |
| userId | Query | string | 是 | 用户ID |
| blogId | Query | string | 是 | 博客ID |

### Headers

```javascript
{
    'X-Mc-Auth': 'YOUR_TOKEN',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
```

### 示例请求

```javascript
const axios = require('axios');

async function deletePost(postId, userId, blogId, token) {
    const url = `https://app.metricool.com/api/v2/scheduler/posts/${postId}?userId=${userId}&blogId=${blogId}`;

    const response = await axios.delete(url, {
        headers: {
            'X-Mc-Auth': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    return response.data;
}
```

### 响应

**成功 (200 OK)**:
```javascript
{
    "data": true
}
```

**失败 (404)**:
```javascript
{
    "error": "Post not found",
    "message": "The requested post does not exist"
}
```

**失败 (401)**:
```javascript
{
    "error": "Unauthorized",
    "message": "Invalid token or insufficient permissions"
}
```

### 批量删除示例

```javascript
async function deleteAllPosts() {
    // 1. 获取所有帖子
    const posts = await getAllScheduledPosts();

    // 2. 批量删除
    for (const post of posts) {
        try {
            await deletePost(post.id, userId, blogId, token);
            console.log(`✅ 已删除: ${post.text}`);
        } catch (error) {
            console.error(`❌ 删除失败: ${post.text}`, error.message);
        }

        // 延迟避免过载
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
```

---

## 🔧 完整示例代码

### 1. 配置axios实例（带代理和重试）

```javascript
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { SocksProxyAgent } = require('socks-proxy-agent');
const https = require('https');

// 配置代理（可选）
const proxyAgent = new SocksProxyAgent('socks5://127.0.0.1:7897');

// 创建axios实例
const metricoolAxios = axios.create({
    httpsAgent: proxyAgent || new https.Agent({
        keepAlive: true,
        timeout: 60000
    }),
    timeout: 60000
});

// 配置重试机制
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
        console.log(`🔄 重试 (${retryCount}/5): ${error.message}`);
    }
});
```

### 2. 创建排期

```javascript
async function createScheduledPost(title, content, videoUrl, scheduledTime) {
    // 时间转换（本地时间 → UTC）
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
        draft: false
    };

    const response = await metricoolAxios.post(
        `https://app.metricool.com/api/v2/scheduler/posts?userId=${userId}&blogId=${blogId}&integrationSource=MCP`,
        payload,
        {
            headers: {
                'X-Mc-Auth': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    );

    return response.data;
}
```

### 3. 获取所有排期

```javascript
async function getAllScheduledPosts() {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);

    const startStr = start.toISOString().split('T')[0] + 'T00:00:00';
    const endStr = end.toISOString().split('T')[0] + 'T23:59:59';

    const url = `https://app.metricool.com/api/v2/scheduler/posts?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}&timezone=Asia/Shanghai&extendedRange=true&userId=${userId}&blogId=${blogId}`;

    const response = await metricoolAxios.get(url, {
        headers: {
            'X-Mc-Auth': token,
            'Accept': 'application/json'
        }
    });

    return response.data.data || [];
}
```

### 4. 删除单个帖子

```javascript
async function deletePost(postId) {
    const url = `https://app.metricool.com/api/v2/scheduler/posts/${postId}?userId=${userId}&blogId=${blogId}`;

    const response = await metricoolAxios.delete(url, {
        headers: {
            'X-Mc-Auth': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    return response.data;
}
```

---

## 📊 错误代码

| 状态码 | 说明 | 解决方法 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查payload格式 |
| 401 | 认证失败 | 检查Token是否正确 |
| 403 | 权限不足 | 检查userId和blogId |
| 404 | 资源不存在 | 检查postId是否有效 |
| 500 | 服务器错误 | 稍后重试 |

---

## ⚠️ 重要提示

### 1. Token过期问题

**TikTok Token经常过期** (Error 40131: Refresh token is invalid or expired)

**解决方法**:
1. 登录Metricool网页
2. Settings → Social Networks
3. 断开TikTok连接
4. 重新授权

### 2. 时区处理

- API接受UTC+0时间
- 但可以指定时区参数
- 建议统一使用ISO 8601格式

### 3. 媒体URL要求

- 必须是公开可访问的URL
- 支持https
- 推荐使用CDN（如Cloudflare R2）
- 视频大小限制各平台不同

### 4. 速率限制

- 官方未公开具体限制
- 建议请求间隔500ms以上
- 使用重试机制处理超时

---

## 🎯 最佳实践

### 1. 使用重试机制

```javascript
axiosRetry(metricoolAxios, {
    retries: 5,
    retryDelay: axiosRetry.exponentialDelay
});
```

### 2. 批量操作添加延迟

```javascript
for (const post of posts) {
    await processPost(post);
    await new Promise(resolve => setTimeout(resolve, 500));
}
```

### 3. 完整的错误处理

```javascript
try {
    await createPost(data);
} catch (error) {
    console.error('操作失败:', error.message);
    if (error.response) {
        console.error('状态码:', error.response.status);
        console.error('错误详情:', error.response.data);
    }
}
```

---

## 📚 参考资源

- **Metricool官方文档**: [app.metricool.com/api/v2/docs](https://app.metricool.com/api/v2/docs)
- **本项目GitHub**: [待添加]
- **社区讨论**: [待添加]

---

## 🙏 贡献

本文档通过实际逆向工程发现了DELETE API。如果你发现了更多未公开的API，欢迎贡献！

---

*最后更新: 2025-11-12*
*维护者: [Your Name]*
