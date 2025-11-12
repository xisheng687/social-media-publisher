# Social Media Batch Publisher

**AI驱动的批量发布工具 - 3分钟发布20个视频到多个平台，替代3小时手动劳动**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![AI-Powered](https://img.shields.io/badge/AI-Powered-purple)](https://claude.com/claude-code)

---

## 💡 这个工具是什么？

一个自动化批量发布工具，帮助内容创作者将视频一次性发布到多个社交媒体平台：
- **支持平台**: 20+平台，包括Instagram、TikTok、YouTube、Facebook、LinkedIn、X(Twitter)、Pinterest、Twitch、Threads等
- **核心功能**: Excel管理内容 + 批量上传 + 定时排期
- **特色**: AI驱动操作，口述发布规则即可完成配置

---

## 🎯 解决什么问题？

### 痛点
- 手动上传20个视频到多个平台 = **3小时重复劳动**
- 逐个设置发布时间，容易出错
- 视频托管服务费用高昂（AWS S3等）

### 解决方案
1. **Excel管理内容** - 一次填写，批量处理
2. **自动上传托管** - Cloudflare R2低成本托管
3. **智能排期** - Metricool API统一管理多平台
4. **AI辅助操作** - 口述规则，AI自动执行

**效果**: 3小时工作量 → 3分钟完成 ⚡

---

## 🌟 核心优势

### 1. 性价比最优组合

经过调研选择的最划算服务组合：

**Metricool** ($15-30/月)
- 市面上最便宜的多平台API工具
- 支持20+主流社交平台
- 提供数据分析和排期管理

**Cloudflare R2** (~$0.01/月)
- **零出口流量费用**（AWS S3 收费$0.09/GB）
- 存储费用极低（$0.015/GB/月）
- 自动删除规则，7天后视频自动清理

**成本对比**：
```
传统方案（AWS S3 + Buffer）:    $50-80/月
本工具（R2 + Metricool）:       $15-30/月
节省: 60-70%
```

### 2. AI驱动灵活性

**传统工具**: 需要在界面中逐个填写平台、日期、时间、文件路径

**本工具 + AI CLI**:
```
口述: "把这20个视频发布到Instagram和TikTok，
      从明天开始每天晚上8点发一条"

AI自动执行:
✅ 解析平台选择
✅ 计算发布日期
✅ 匹配视频文件
✅ 生成发布排期
```

**推荐AI工具**: Claude Code、Gemini CLI、Aider、Qodo Gen CLI、Cline

### 3. 智能成本优化

- ✅ R2自动删除规则，7天后视频自动清理
- ✅ 按需存储，不累积成本
- ✅ 零流量费用，无论访问多少次

---

## 👋 新手友好提示

**看起来文件挺多？别担心！** 你只需要关心4样东西：

1. **[README.md](README.md)** ← 你现在看的这个，了解项目概况
2. **[用户指南.md](用户指南.md)** ← 详细操作步骤（从安装到使用）
3. **[贴文模板.xlsx](贴文模板.xlsx)** ← 填写你的视频标题和内容
4. **[videos/](videos/)** ← 放你的视频文件

**其他文件干什么的？**
- `src/` - 程序代码（不用管，AI或系统自动运行）
- `docs/` - 技术文档（遇到问题时查阅）
- `package.json`、`config.example.js` - 配置文件（用户指南会教你）
- `node_modules/` - 依赖包文件夹（运行`npm install`后自动生成，不用管）

**简单流程**：下载 → 看README → 读用户指南 → 填Excel → 放视频 → 运行脚本 ✅

---

## ⚠️ 使用前必读（不满足请勿浪费时间）

### 🔴 硬性要求

**1. Metricool付费订阅**（$15-30/月）
- 免费版**无法使用API**
- 本工具需要API来批量发布
- [Metricool官网](https://metricool.com)

**2. Cloudflare R2账户**（免费/低成本）
- 用于临时托管视频文件
- 配置需要获取Access Key和Secret
- [Cloudflare R2](https://www.cloudflare.com/products/r2/)

**3. Node.js环境**（免费）
- 需要安装Node.js 14.0以上版本
- 用于运行本工具

**4. 推荐AI CLI工具**（部分免费）
- 用于智能配置和灵活操作
- 没有AI CLI也能用，但会失去最大优势
- 推荐：Claude Code、Gemini CLI、Aider等

**5. 一定技术基础**
- 需要配置R2、Metricool凭证
- 需要理解Excel-视频文件名匹配原理
- 完全不懂技术会比较困难

**💰 总成本**: $15-30/月（主要是Metricool订阅费）

### ✅ 如果你能接受以上条件，继续往下看 👇

---

## 🚀 快速开始

### 📋 大致流程

1. **准备环境**
   - 下载本项目
   - 安装Node.js依赖
   - 准备Metricool和R2账户

2. **配置凭证**
   - 获取Metricool API Token和账户信息
   - 获取Cloudflare R2访问密钥
   - 创建配置文件

3. **准备内容**
   - 在Excel模板中填写视频信息
   - 将视频文件放入指定文件夹
   - 确保文件名与Excel标题一一对应

4. **执行发布**
   - 运行发布脚本
   - 系统自动上传、托管、排期
   - 检查Metricool后台确认

### 📖 详细教程

**所有具体操作步骤、命令、配置方法，请查看：**

👉 **[用户指南.md](用户指南.md)** 👈

用户指南包含：
- 三种安装方法（AI辅助10分钟 / 简单手动15分钟 / 详细手动30分钟）
- Metricool完整配置教程（5分钟）
- Cloudflare R2完整配置教程（15分钟）
- Excel模板使用说明
- 文件名匹配原理
- 常见问题解答

---

## 📁 项目结构

```
social-media-publisher/
├── src/                    # 核心脚本
│   ├── process_excel_posts.js    # 主发布脚本
│   ├── delete_all_posts.js       # 删除所有排期
│   ├── reset_excel_status.js     # 重置Excel状态
│   └── upload_to_r2.js           # R2上传模块
├── docs/                   # 技术文档
│   ├── Metricool API文档.md
│   └── 技术说明.md
├── videos/                 # 视频文件夹
├── config.example.js       # 配置文件示例
├── 贴文模板.xlsx           # Excel模板
├── 用户指南.md             # 完整使用教程
└── README.md              # 本文件
```

---

## 🎯 适合人群

### ✅ 适合

- 视频内容创作者（需批量发布到多平台）
- 社交媒体运营（定期发布营销内容）
- 短视频工作室（规模化分发）
- 愿意尝试AI工具的技术用户

### ❌ 不适合

- 每次只发1-2条内容（手动更快）
- 完全不懂技术且不愿学习
- 不想为Metricool付费
- 不想配置R2和API

---

## ⚠️ 重要限制

**视频要求**（因平台而异）:
- **文件大小**: <500MB（Metricool限制）
- **时长限制**: 各平台不同
  - Instagram轮播: 60秒
  - Instagram单视频: 15分钟（自动）/60分钟（手动）
  - TikTok: 10分钟
  - YouTube: 15分钟（未验证账号）/无限制（已验证）
  - 其他平台详见用户指南

**Metricool限制**:
- API Token可能过期（尤其TikTok，需重新授权）
- 免费版有排期数量限制

**网络要求**: 建议配置代理访问Metricool（中国大陆用户）

---

## 🌟 特别贡献

本项目发现了**Metricool DELETE API**（官方未公开）

详见：[Metricool API文档](docs/Metricool API文档.md)

---

## 💬 关于本项目

**声明**: 这是一个**新手利用AI编程**的开源作品。

- ⚠️ 可能存在问题和考虑不足
- ⚠️ 不一定是最优解决方案
- ⚠️ 代码质量可能不够专业

**但我们相信**:
- ✅ AI降低了编程门槛
- ✅ 分享比完美更重要
- ✅ 开源让大家一起改进

**如果你发现问题，非常欢迎**:
- 提Issue指出问题
- 提PR改进代码
- 分享更好的方案

我们会虚心学习和改进。感谢理解！🙏

---

## 📚 文档导航

| 文档 | 用途 |
|------|------|
| **[用户指南.md](用户指南.md)** | ⭐ **首次使用必读** - 完整安装配置教程 |
| [Metricool API文档.md](docs/Metricool API文档.md) | 🔧 API参考 - 遇到错误时查阅 |
| [技术说明.md](docs/技术说明.md) | 💻 技术细节 - 二次开发参考 |

---

## 🤝 贡献

欢迎贡献！详见[CONTRIBUTING.md](CONTRIBUTING.md)

- 报告Bug
- 改进文档
- 提交PR
- 分享使用经验

---

## 📄 开源许可

MIT License - 详见[LICENSE](LICENSE)

---

## 📞 需要帮助？

1. 📖 [查看用户指南](用户指南.md)
2. 🐛 [报告问题](https://github.com/xisheng687/social-media-batch-publisher/issues)
3. 💬 [讨论区](https://github.com/xisheng687/social-media-batch-publisher/discussions)

---

<div align="center">

**⚠️ 关于教程准确性**

部分教程由AI生成，可能与实际界面不符。
遇到不符时，请以实际界面为准，欢迎提Issue更新。

---

**如果这个项目帮到了你，请给个⭐Star！**

Made with ❤️ and AI for Content Creators

</div>
