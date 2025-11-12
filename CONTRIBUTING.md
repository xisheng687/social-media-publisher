# 贡献指南

感谢你考虑为 **Social Media Batch Publisher** 做贡献！

---

## 🎯 贡献方式

### 1. 报告Bug

发现问题？请[创建Issue](https://github.com/xisheng687/social-media-batch-publisher/issues/new)并包含：

- 📝 详细的问题描述
- 🔢 复现步骤
- 💻 系统环境（Node.js版本、操作系统等）
- 📷 截图（如果适用）

### 2. 提出新功能

有好想法？我们很乐意听取！请：

1. 先[搜索现有Issue](https://github.com/xisheng687/social-media-batch-publisher/issues)看看是否已有人提出
2. 如果没有，[创建新Issue](https://github.com/xisheng687/social-media-batch-publisher/issues/new)
3. 描述功能的用途和价值

### 3. 改进文档

文档永远可以更好！你可以：

- 修正错别字
- 补充说明
- 添加示例
- 翻译文档

### 4. 提交代码

准备贡献代码？太棒了！

---

## 🔧 开发流程

### 1. Fork & Clone

```bash
# Fork仓库（点击GitHub上的Fork按钮）

# Clone你的fork
git clone https://github.com/xisheng687/social-media-batch-publisher.git
cd social-media-batch-publisher

# 添加upstream
git remote add upstream https://github.com/original-username/social-media-batch-publisher.git
```

### 2. 创建分支

```bash
# 从main分支创建新分支
git checkout -b feature/your-feature-name

# 或修复bug
git checkout -b fix/bug-description
```

**分支命名规范**:
- `feature/功能名` - 新功能
- `fix/bug名` - Bug修复
- `docs/说明` - 文档更新
- `refactor/说明` - 代码重构

### 3. 开发

```bash
# 安装依赖
npm install

# 开发你的功能
# ...

# 测试
npm test
```

### 4. 提交

```bash
# 添加修改
git add .

# 提交（使用清晰的commit message）
git commit -m "feat: 添加xxx功能"
```

**Commit Message规范**:
- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

### 5. Push & PR

```bash
# Push到你的fork
git push origin feature/your-feature-name

# 在GitHub上创建Pull Request
```

**PR描述应包含**:
- 📝 修改内容说明
- 🎯 解决的问题（链接到Issue）
- 🧪 测试方法
- 📷 截图（如果是UI相关）

---

## 📋 代码规范

### JavaScript风格

```javascript
// ✅ 好的
async function uploadToMetricool(title, content, videoUrl) {
    const payload = {
        text: content,
        media: [videoUrl]
    };

    const response = await metricoolAxios.post(API_URL, payload);
    return response.data;
}

// ❌ 不好的
function upload(t,c,v){
  var p={text:c,media:[v]};
  return axios.post(API_URL,p).then(r=>r.data);
}
```

**规范要点**:
- 使用有意义的变量名
- 函数名使用动词开头
- 常量使用大写
- 适当的注释

### 文档风格

```markdown
# 标题使用中文

## 清晰的层级结构

### 示例代码

​```javascript
// 代码需要注释
const result = doSomething();
​```

### 表格对比

| 项目 | 说明 |
|------|------|
| A | 说明A |
```

---

## 🧪 测试

### 运行测试

```bash
# 测试R2上传
node upload_to_r2.js ./videos/test.mp4

# 测试Excel处理
node process_excel_posts.js
```

### 测试checklist

提交PR前请确保：

- [ ] 代码可以正常运行
- [ ] 没有破坏现有功能
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试了边界情况

---

## 🎨 特别贡献领域

我们特别欢迎以下方面的贡献：

### 1. API发现

本项目通过逆向工程发现了**Metricool DELETE API**。如果你发现了：

- 其他未公开的API
- 新的平台支持
- API参数的新用法

请记录下来并分享！

### 2. 平台扩展

添加新的社交平台支持：

- LinkedIn
- Twitter/X
- Pinterest
- Snapchat

### 3. 功能增强

- 图片批量发布
- 视频自动压缩
- 批量编辑工具
- 数据分析面板

### 4. 本地化

翻译文档到其他语言：

- English
- 日本語
- 한국어
- Español

---

## 📞 需要帮助？

- 💬 [讨论区](https://github.com/xisheng687/social-media-batch-publisher/discussions)
- 📝 [提Issue](https://github.com/xisheng687/social-media-batch-publisher/issues)
- 👤 联系作者：见LICENSE文件

---

## 🏆 贡献者

感谢所有贡献者！

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- 贡献者列表将自动生成 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

**再次感谢你的贡献！每一个PR都让这个项目变得更好。** 🎉

---

## 📜 贡献原则

参与本项目时，请保持：
- ✅ 友善和尊重
- ✅ 建设性的讨论
- ✅ 开放的心态
- ❌ 避免人身攻击
- ❌ 避免歧视性言论
