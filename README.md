# 🎛️ dsh-client-ui-mode-scroll

> **专为 DSH 智能体设计 · Designed for the DeepSeek Harness agent**

让 DeepSeek Harness Web 的模式选择器保持整洁——打开时只显示前 4 个内置模式，其余自定义模式收进折叠区，**鼠标滚轮自然下滑即可浏览**，像浏览器滚动一样顺滑，无需强制分页。

Keep the agent-preset picker compact: show only the first 4 built-in modes, fold the rest, and let the mouse wheel scroll them into view — browser-style, no forced paging.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-DeepSeek%20Harness%20Web-2b6cb0.svg)](#)
[![Type](https://img.shields.io/badge/type-Client%20Plugin-38b2ac.svg)](#)

---

## ✨ 特性 Features

- **🧹 极简呈现** — 打开模式选择器时只露出前 4 个内置模式（Standard / PTC / Minimal / Creator），不被自建模式淹没
- **📏 精确测量** — 折叠高度按前 4 行实际渲染高度精确量取（`getBoundingClientRect` + padding），非固定像素截断，第 4 个完整可见
- **🖱️ 浏览器式滚动** — 滚轮下滑自然浏览折叠的其余模式，上滑回到前 4 个；`overscroll-behavior: contain` 防止滚动穿透
- **🔌 零依赖** — 纯浏览器端 DOM 增强，无网络请求、无服务端状态、无存储
- **♻️ 即插即用** — 挂载一行 patch 即可，卸载同理，不留残留

## 📦 安装 Install

插件是 Harness **客户端（浏览器端）** 插件。持久挂载到 `web` profile：

```powershell
# 1. 复制插件包到 profile 目录（$DSH_HOME 默认为 ~/.dsh）
Copy-Item -Recurse . "$env:USERPROFILE\.dsh\profiles\web\mode-scroll"
```

```json
// 2. 在 profiles/web/package.json 声明依赖
"dependencies": {
  "@deepseek-ai/dsh-client-ui-mode-scroll": "file:./mode-scroll"
}
```

```powershell
# 3. 链接到 profile 的 node_modules（junction / 普通复制 / pnpm install 均可）
New-Item -ItemType Junction -Path "$env:USERPROFILE\.dsh\profiles\web\node_modules\@deepseek-ai\dsh-client-ui-mode-scroll" -Target "$env:USERPROFILE\.dsh\profiles\web\mode-scroll"
```

```yaml
# 4. 在 profiles/web/cordis.patch.yml 挂载插件行
- insert:
    - id: ui-mode-scroll
      name: '@deepseek-ai/dsh-client-ui-mode-scroll'
```

```powershell
# 5. 重启 dsh web，打开模式选择器即可生效
```

## 🚀 用法 Usage

无需任何操作。安装后每次打开模式选择器自动生效：

| 打开前 | 打开后 |
| --- | --- |
| 7+ 个模式一次性全部列出 | 只显示前 4 个内置模式 |
| 找自定义模式需要眯眼扫 | 自定义模式折叠在下方，滚轮下滑即见 |

## ⚙️ 工作原理 How it works

客户端半监听 agent-preset 选择器的打开（`[role="menu"]` + seat/selector 触发器）。当菜单项超过 4 个时：

1. 将 `max-height` 设为前 4 行的实际渲染高度（含 padding）
2. 启用 `overflow-y: auto` + `overscroll-behavior: contain`
3. 其余元素保持不变——选择器就是一个可正常滚动的浏览器菜单

主机半是一个空的 `apply()`，仅用于让插件行在 Loader 中挂载。

## 📁 项目结构 Structure

```
dsh-client-ui-mode-scroll/
├── package.json          # 插件声明（dsh.client.platform: web）
├── lib/
│   ├── client.js         # 浏览器端：折叠 + 滚动逻辑
│   └── index.js          # 主机端：空 apply（保证挂载）
└── README.md
```

## ❓ FAQ

**为什么用 `@deepseek-ai/` 前缀？**
Harness 的 client-modules 加载器按包名挂载插件，`@deepseek-ai/` 只是命名空间要求。⚠️ 这是**本地作者插件**，非 DeepSeek 官方维护。

**会读取或发送任何数据吗？**
不会。插件只读取选择器菜单的 DOM 几何信息（浏览器内），无网络请求、无存储、无遥测。

**模式多了会怎样？**
折叠区始终显示前 4 行，其余全部通过滚轮浏览——无论多少个自定义模式，选择器都保持同样的紧凑高度。

## 🤝 贡献 Contributing

PR、Issue 均欢迎。保持无依赖、无网络、无个人信息的原则即可。

## 📄 License

[MIT](LICENSE)
