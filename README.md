# Web Mini Games Collection
基于原生 `HTML / CSS / JavaScript` 实现的单机小游戏合集，包含迷宫、数独、贪吃蛇、烟花四个模块。  
无需后端，打开页面即可运行。
## ✨ Features
- `miigong`：迷宫关卡（3 档难度 × 每档 5 关）
- `shudu`：随机数独（完成后撒花并自动下一题）
- `snake`：经典贪吃蛇（分数 + 本地最高分）
- `yanhua`：点击屏幕随机烟花粒子特效
## 🧩 Tech Stack
- HTML5
- CSS3
- JavaScript (ES6)
- Canvas / DOM
- LocalStorage（用于贪吃蛇最高分持久化）
## 📁 Structure
```text
projectsfusi/
├─ miigong/
│  ├─ index.html
│  ├─ style.css
│  └─ script.js
├─ shudu/
│  ├─ index.html
│  ├─ style.css
│  └─ script.js
├─ snake/
│  ├─ index.html
│  ├─ style.css
│  └─ script.js
└─ yanhua/
   ├─ index.html
   ├─ style.css
   └─ script.js
🚀 Run
任选一个子目录，直接打开 index.html 即可。

推荐使用本地静态服务器（如 Live Server）运行，体验更稳定。

🎮 Controls
迷宫：方向键 / WASD
数独：键盘输入 1~9
贪吃蛇：方向键 / WASD
烟花：鼠标点击
🔍 Implementation Highlights
迷宫：DFS 生成地图，BFS 选最远终点，提升可玩性
数独：先生成合法终盘，再随机挖空生成题目
贪吃蛇：基于 tick 循环 + 坐标数组更新蛇身状态
烟花：Canvas 粒子系统（速度、重力、阻尼、寿命衰减）
渲染分工：高频动画走 Canvas，状态/输入走 DOM
📌 Notes
该项目面向前端交互与小游戏开发练习，适合作为学习作品或简历中的小型项目展示。
