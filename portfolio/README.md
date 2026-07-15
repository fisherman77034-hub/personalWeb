# Feige 个人作品集 — 运行说明

## 项目简介

React 18 + Vite 5 构建的个人作品集网站，暗色系主题，Indigo 强调色，面向视觉设计师 / AI 设计师。

---

## 环境要求

- **Node.js >= 18**（推荐 20 LTS）
- **npm >= 9**

检查版本：
```bash
node -v
npm -v
```

---

## 快速开始

### 1. 安装依赖

```bash
cd E:\Agent\agent1\portfolio
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

默认端口为 **5173**。如果端口被占用，Vite 会自动递增（5174、5175…），终端会提示实际地址。

打开浏览器访问终端显示的地址即可预览。

### 3. 生产构建

```bash
npm run build
```

产物输出到 `dist/` 目录。

### 4. 预览生产构建

```bash
npm run preview
```

---

## 已知问题与解决方案

### 问题：esbuild 报 `EPERM` 权限错误

**现象：** 运行 `npm run dev` 或 `npm run build` 时报错 `spawn EPERM`。

**原因：** Windows 上某些环境下 esbuild 二进制文件缺少执行权限。

**解决步骤：**

**方法一：重新安装依赖（推荐）**
```bash
# 删除 node_modules 和锁文件
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
# 重新安装
npm install
```

**方法二：手动修复 esbuild 权限**
```powershell
# 给 esbuild 二进制文件添加执行权限
$esbuildBin = "node_modules\esbuild\bin\esbuild.exe"
if (Test-Path $esbuildBin) {
  icacls $esbuildBin /grant:r ":(OI)(CI)F" /T
}
```

**方法三：指定 esbuild 可执行文件路径**

在 `vite.config.js` 中添加：
```js
export default defineConfig({
  plugins: [react()],
  esbuild: {
    executable: 'D:\\Node\\node_modules\\esbuild\\bin\\esbuild.exe',
  },
})
```
（路径替换为你的实际 esbuild 位置）

**方法四：使用 yarn 或 pnpm 替代 npm**
```bash
yarn install
yarn dev
```

---

## 项目结构

```
portfolio/
├── src/
│   ├── main.jsx              # 入口文件
│   ├── App.jsx               # 主组件（路由所有区块）
│   ├── index.css             # 全局基础样式
│   ├── styles/
│   │   ├── global.css        # CSS 变量、全局重置、动画
│   │   └── components.css    # 各组件样式
│   └── components/
│       ├── Nav.jsx           # 顶部导航
│       ├── Hero.jsx          # 全屏首页
│       ├── About.jsx         # 个人介绍 + 数据
│       ├── Skills.jsx        # 核心能力卡片
│       └── Footer.jsx        # 底部 CTA + 社交链接
├── vite.config.js
├── package.json
└── README.md
```

---

## 设计规范

| 属性       | 值                     |
| ---------- | ---------------------- |
| 背景色     | `#0a0a0c`              |
| 卡片背景   | `#141418`              |
| 强调色     | `#6366f1` (Indigo)     |
| 文字主色   | `#e4e4e7`              |
| 文字次色   | `#a1a1aa`              |
| 最大宽度   | 1700px                 |
| 字体       | 系统无衬线字体栈       |

---

## 修改内容后如何生效

1. 编辑 `src/components/` 下的任意 `.jsx` 文件
2. 保存文件
3. Vite HMR 会自动热更新，浏览器无需刷新
4. 如果 HMR 不生效，按 `Ctrl+C` 停止服务器后重新 `npm run dev`

---

## 常见问题

**Q: 页面白屏？**
→ 打开浏览器开发者工具（F12），查看 Console 是否有红色报错。通常是组件导入路径错误或语法问题。

**Q: 样式没有生效？**
→ 检查 `src/styles/global.css` 和 `src/styles/components.css` 是否被正确 import。

**Q: 动画不播放？**
→ 确保浏览器启用了硬件加速。部分安全软件可能阻止 `IntersectionObserver`。

---

## 最后

如有问题，先试 `Remove-Item node_modules -Recurse -Force; npm install`，能解决 90% 的环境问题。
