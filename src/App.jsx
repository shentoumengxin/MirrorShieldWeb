import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Shield, Cpu, Terminal, FileText, Download, Upload, Zap, Activity, 
  Server, Box, Search, CheckCircle, Github, Menu, X, BookOpen, 
  ChevronRight, ArrowLeft, ExternalLink, AlertTriangle,
  Radar, Radio, Eye, BrainCircuit, Flame, Skull, Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';

// --- 博客/报告数据 ---
const BLOG_POSTS = [
  {
    id: 'report-sample-1',
    title: '🚨 重点案例：LLM 分析 Mirai 变种样本 (bd7a...da81)',
    date: '2025-02-14',
    type: 'report',
    description: 'MirrorShield 利用 DeepSeek AI 检测 Mirai 僵尸网络变种的真实案例。',
    featured: true,
    content: `
# 🛡️ 样本分析报告：bd7a...da81

> **最终判定：** 🔴 **恶意软件 (95/100)**
> **家族：** Mirai
> **状态：** ✅ 分析成功
> **标签：** Trojan.Linux.Mirai
> **类别：** 僵尸网络、DDoS、反检测

## 📝 分析摘要

该样本被鉴定为一个携带 "Killer" 模块的 **Mirai 僵尸网络变种**。它会 aggressively 扫描并清除竞争恶意软件（例如清理 /etc/.ares），通过 shell 脚本建立持久化驻留，并试图篡改系统定时任务（cron）。

---

## 🔍 关键发现（提取的取证痕迹）

### 💀 Killer 行为
检测到针对已知竞品文件的 UNLINKAT 事件（僵尸网络领地争夺）：
-  /etc/.ares
-  /usr/lib/libdlrpcld.so
-  /etc/init.d/linux_kill

### 🔄 持久化机制
捕获到 WRITE 操作创建的 shell 循环脚本，用于保持进程存活：
\`\`\`bash
#!/bin/sh
while [ 1 ]; do
  sleep 60...
\`\`\`

### ⚙️ 系统篡改
观察到 EXEC 调用试图覆盖 cron 定时任务以实现周期性执行：
\`\`\`
/1 root /.mod
\`\`\`

### 🚦 进程控制
- 检测到多个 CLONE 事件（进程克隆）
- 观测到 SIGNAL_GENERATE (sig 23) 事件

---

*本报告由 MirrorShield 基于 DeepSeek AI 自动生成。*
    `
  },
  {
    id: 'post-1',
    title: '项目开发日志：通往 eBPF 的旅程',
    date: '2025-02-10',
    type: 'md',
    description: '为什么我们在系统调用监控中选择 eBPF 而非内核模块。',
    content: `
# 为什么选择 eBPF？

传统的 Linux 安全监控往往依赖内核模块（LKM）。然而，LKM 存在显著缺陷：

1. **稳定性**：LKM 中的 bug 可能导致整个系统崩溃。
2. **兼容性**：LKM 通常需要针对不同内核版本重新编译。

## eBPF 的优势

eBPF（Extended Berkeley Packet Filter）允许我们在 Linux 内核中运行沙盒程序，而无需修改内核源码或加载模块。

\`\`\`c
// eBPF 钩子示例
SEC("tracepoint/syscalls/sys_enter_execve")
int trace_execve(struct trace_event_raw_sys_enter *ctx) {
    // ... 逻辑
}
\`\`\`

MirrorShield 利用这一特性实现了**零开销**的监控能力。
    `
  },
  {
    id: 'slides-1',
    title: 'CS315 课程项目展示幻灯片',
    date: '2024-12-20',
    type: 'pdf',
    description: '用于 CS315 课程答辩的演示文稿。',
    fileUrl: '/present.pdf'
  }
];

// --- 导航栏 ---
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: '功能特性', id: 'features' },
    { label: '系统架构', id: 'architecture' },
    { label: '交互演示', id: 'demo' },
    { label: '知识库', id: 'blog' },
    { label: '关于我们', id: 'about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-green-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollTo('hero')}>
            <Shield className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold tracking-wider text-white">Mirror<span className="text-green-500">Shield</span></span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a 
                href="https://github.com/shentoumengxin/MirrorShield" 
                target="_blank" 
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-all"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-400 hover:text-white hover:bg-green-900 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-green-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- 首屏 Hero ---
const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 mb-8 animate-pulse">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          新版本发布：MirrorShield v1.0 — 现已支持多架构分析！
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          跨架构守护 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">二进制安全</span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
          MirrorShield 是下一代 Linux 可执行文件安全分析平台。
          基于 eBPF 监控与 AI 驱动洞察，分析 x86、ARM、MIPS 和 RISC-V 二进制文件。
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => document.getElementById('blog').scrollIntoView({behavior: 'smooth'})} className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-black bg-green-500 hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <BookOpen className="w-5 h-5 mr-2" />
            阅读分析报告
          </button>
          <button onClick={() => document.getElementById('demo').scrollIntoView({behavior: 'smooth'})} className="flex items-center justify-center px-8 py-4 border border-green-500/50 text-lg font-medium rounded-md text-green-400 bg-black hover:bg-green-900/20 transition-all">
            <Terminal className="w-5 h-5 mr-2" />
            实时演示
          </button>
        </div>
      </div>
    </section>
  );
};

// --- 功能特性 ---
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-green-500/50 transition-all group">
    <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
      <Icon className="w-6 h-6 text-green-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Cpu,
      title: "多架构支持",
      description: "无缝分析 x86、ARM、MIPS、PowerPC 和 RISC-V 二进制文件。自动识别架构并选择 QEMU 模拟器。"
    },
    {
      icon: Activity,
      title: "eBPF 监控",
      description: "使用 eBPF/cBPF 实现高性能系统调用捕获。基于 per-cgroup 事件路由与分片锁，确保零丢包。"
    },
    {
      icon: Search,
      title: "AI 驱动分析",
      description: "集成 DeepSeek AI，实现自动化恶意软件行为分析、风险评分与可读性报告生成。"
    },
    {
      icon: Box,
      title: "Docker 隔离",
      description: "在隔离的 Docker 容器中安全执行。支持 100+ 并发样本与智能资源管理。"
    }
  ];

  return (
    <section id="features" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">核心能力</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            为安全研究人员与系统管理员打造，兼顾速度、精度与深度。
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
};

// --- 系统架构 ---
const Architecture = () => {
  return (
    <section id="architecture" className="py-24 bg-gray-900 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">系统架构</h2>
            <p className="text-gray-400 mb-6">
              采用模块化设计，将分析引擎（Wrapper）、REST API 服务器与浏览器扩展解耦。
              核心基于 Docker 池实现隔离，并通过 eBPF 监控器获得内核级可见性。
            </p>
            <ul className="space-y-4">
              {[
                "Wrapper：核心引擎，管理 QEMU 与 Docker 生命周期。",
                "Server：RESTful API，负责任务调度与队列管理。",
                "Guardian：浏览器扩展，实现自动检测。",
                "DeepSeek：AI 模块，进行行为解读。"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 lg:mt-0 bg-black p-8 rounded-xl border border-gray-700 font-mono text-xs sm:text-sm text-green-400 overflow-x-auto shadow-2xl">
            <pre className="whitespace-pre">
{`┌──────────────────────────────────────────────┐
│            MirrorShield 平台架构              │
├──────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │ Wrapper  │◄─►│  Server  │◄─►│ Guardian │  │
│  └──────────┘   └──────────┘   └──────────┘  │
│       │              │               │       │
│       ▼              ▼               ▼       │
│  ┌────────────────────────────────────────┐  │
│  │      Docker 池 (100+ 并发样本)          │  │
│  └────────────────────────────────────────┘  │
│       │                                      │
│       ▼                                      │
│  ┌────────────────────────────────────────┐  │
│  │   eBPF 监控器 (Ring Buffer -> Map)     │  │
│  └────────────────────────────────────────┘  │
│       │                                      │
│       ▼                                      │
│  ┌────────────────────────────────────────┐  │
│  │  智能分析 (DeepSeek AI + 分析器)        │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};


// --- 科幻仪表盘风格交互演示 ---

const WaveCanvas = ({ isActive }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const points = useRef(new Array(60).fill(50));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, w, h);

    if (isActive) {
      points.current.shift();
      points.current.push(50 + Math.random() * 40 + Math.sin(Date.now() / 150) * 20);
    } else {
      points.current.shift();
      points.current.push(50 + Math.sin(Date.now() / 500) * 5);
    }

    // 绘制波形
    ctx.beginPath();
    ctx.strokeStyle = isActive ? '#10b981' : '#065f46';
    ctx.lineWidth = 2;
    for (let i = 0; i < points.current.length; i++) {
      const x = (i / (points.current.length - 1)) * w;
      const y = h - (points.current[i] / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 绘制填充
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 95, 70, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    animationRef.current = requestAnimationFrame(draw);
  }, [isActive]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="w-full h-24 rounded border border-green-900/50 bg-black"
    />
  );
};

const StageIndicator = ({ stages, currentStage }) => (
  <div className="flex justify-between items-center mb-6 px-2">
    {stages.map((stage, idx) => {
      const isActive = idx === currentStage;
      const isDone = idx < currentStage;
      return (
        <div key={idx} className="flex flex-col items-center flex-1 relative">
          {idx < stages.length - 1 && (
            <div className={`absolute top-5 left-1/2 w-full h-0.5 ${isDone ? 'bg-green-500' : 'bg-gray-800'}`} style={{ transform: 'translateX(50%)' }} />
          )}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 ${
            isActive ? 'bg-green-900/50 border-green-400 stage-active scale-110' :
            isDone ? 'bg-green-600 border-green-500' : 'bg-gray-900 border-gray-700'
          }`}>
            {isDone ? <CheckCircle className="w-5 h-5 text-white" /> : <stage.icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-gray-600'}`} />}
          </div>
          <span className={`mt-2 text-xs font-mono ${isActive ? 'text-green-400' : isDone ? 'text-green-500' : 'text-gray-600'}`}>
            {stage.label}
          </span>
        </div>
      );
    })}
  </div>
);

const DemoTerminal = () => {
  const [logs, setLogs] = useState([
    { text: "> MirrorShield 终端就绪...", type: "info" },
    { text: "> 等待指令输入...", type: "info" }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const logEndRef = useRef(null);

  const stages = [
    { label: '初始化', icon: Server },
    { label: 'eBPF挂载', icon: Radio },
    { label: '系统调用捕获', icon: Eye },
    { label: 'AI分析', icon: BrainCircuit },
  ];

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type }]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      const container = logEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [logs]);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setShowResult(false);
    setProgress(0);
    setCurrentStage(0);
    setLogs([
      { text: "> [系统] 正在初始化 Docker 容器...", type: "info" },
      { text: "> [系统] 架构识别: ARM64 → 选择 QEMU 模拟器", type: "info" }
    ]);

    const timeline = [
      { t: 600, stage: 0, p: 12, msg: "> [容器] 镜像拉取完成 | 容器ID: mshield-8f3a", type: "info" },
      { t: 1200, stage: 1, p: 28, msg: "> [eBPF] 正在挂载 tracepoint 探针...", type: "info" },
      { t: 1800, stage: 1, p: 35, msg: "> [eBPF] sys_enter_execve ✓ | sys_enter_connect ✓", type: "success" },
      { t: 2400, stage: 1, p: 42, msg: "> [eBPF] Ring Buffer 分配: 8MB | Map 类型: HASH", type: "info" },
      { t: 3000, stage: 2, p: 55, msg: "> [捕获] OPENAT: /proc/self/exe", type: "warning" },
      { t: 3600, stage: 2, p: 62, msg: "> [捕获] EXECVE: /bin/sh -c 'curl 192.168.1.10:4444'", type: "danger" },
      { t: 4200, stage: 2, p: 70, msg: "> [捕获] CONNECT → 192.168.1.10:4444 [SYN_SENT]", type: "danger" },
      { t: 4800, stage: 2, p: 75, msg: "> [捕获] WRITE: /tmp/.X11-unix/.mod (4096 bytes)", type: "warning" },
      { t: 5400, stage: 2, p: 78, msg: "> [捕获] 检测到异常进程克隆 (CLONE × 12)", type: "warning" },
      { t: 6000, stage: 3, p: 85, msg: "> [AI] 正在向 DeepSeek 发送行为 trace...", type: "info" },
      { t: 6800, stage: 3, p: 92, msg: "> [AI] 行为模式匹配: 僵尸网络 | 持久化 | C2通信", type: "danger" },
      { t: 7500, stage: 3, p: 100, msg: "> [完成] 分析结束。风险等级: CRITICAL (95/100)", type: "critical" },
    ];

    timeline.forEach(step => {
      setTimeout(() => {
        setProgress(step.p);
        setCurrentStage(step.stage);
        addLog(step.msg, step.type);
        if (step.p === 100) {
          setIsAnalyzing(false);
          setTimeout(() => setShowResult(true), 400);
        }
      }, step.t);
    });
  };

  const logColor = (type) => {
    switch (type) {
      case 'danger': return 'text-yellow-400';
      case 'critical': return 'text-red-500 font-bold';
      case 'warning': return 'text-orange-400';
      case 'success': return 'text-green-400';
      default: return 'text-green-400';
    }
  };

  return (
    <section id="demo" className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">交互演示</h2>
          <p className="text-gray-400">体验 MirrorShield 分析引擎的实时威胁检测流程。</p>
        </div>

        {/* 阶段指示器 */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <StageIndicator stages={stages} currentStage={currentStage} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 终端窗口 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl relative">
              <div className="crt-overlay" />
              <div className="crt-scanline" />
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700 relative z-20">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-400 font-mono">root@mirrorshield:/analysis</span>
                {isAnalyzing && (
                  <span className="ml-auto text-xs text-green-400 font-mono animate-pulse">● REC</span>
                )}
              </div>
              
              <div className="p-6 font-mono text-sm h-80 overflow-y-auto flex flex-col terminal-scroll relative z-20">
                {logs.map((log, i) => (
                  <div key={i} className={`mb-1.5 ${logColor(log.type)}`}>
                    {log.text}
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="mt-2 text-green-600 font-mono text-xs">
                    {`[${'█'.repeat(Math.floor(progress / 5))}${'░'.repeat(20 - Math.floor(progress / 5))}] ${progress}%`}
                  </div>
                )}
                <div ref={logEndRef} />
                
                {!isAnalyzing && !showResult && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button 
                      onClick={simulateAnalysis}
                      className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors glow-green"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      运行分析样本
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧仪表盘 */}
          <div className="space-y-4">
            {/* 波形图 */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-mono uppercase">系统调用频率</span>
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <WaveCanvas isActive={isAnalyzing} />
            </div>

            {/* 实时统计 */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-mono uppercase">实时遥测</span>
                <Radar className="w-4 h-4 text-green-600" />
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">已捕获事件</span>
                  <span className="text-green-400">{isAnalyzing ? Math.floor(progress * 1.8 + 12) : showResult ? '187' : '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">可疑操作</span>
                  <span className={isAnalyzing && progress > 50 ? 'text-yellow-400' : showResult ? 'text-yellow-400' : 'text-gray-600'}>
                    {isAnalyzing && progress > 50 ? Math.floor((progress - 50) / 5) : showResult ? '9' : '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">网络连接</span>
                  <span className={showResult ? 'text-red-400' : 'text-gray-600'}>{showResult ? '1' : '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">容器状态</span>
                  <span className={isAnalyzing || showResult ? 'text-green-400' : 'text-gray-600'}>
                    {isAnalyzing || showResult ? 'RUNNING' : 'IDLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* 威胁评估结果面板 */}
            {showResult && (
              <div className="bg-red-950/20 border border-red-500/50 rounded-lg p-4 animate-fade-in-up glow-red">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-red-400 font-mono uppercase flex items-center">
                    <Flame className="w-3 h-3 mr-1" /> 威胁评估
                  </span>
                  <Skull className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-center mb-3">
                  <div className="text-4xl font-bold text-red-500">95</div>
                  <div className="text-xs text-red-400 font-mono">/ 100 CRITICAL</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['僵尸网络', 'C2通信', '持久化', '进程注入'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-red-900/40 border border-red-700/50 rounded text-xs text-red-300 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-red-900/50 text-xs text-red-300 font-mono">
                  <div className="flex items-center mb-1">
                    <Target className="w-3 h-3 mr-1" />
                    <span>家族: Mirai 变种</span>
                  </div>
                  <div>IP: 192.168.1.10:4444</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


// --- 知识库 / 报告中心 ---
const BlogSection = () => {
  const [activePost, setActivePost] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.pdf')) {
        const url = URL.createObjectURL(file);
        setLocalPreview({
          id: 'local',
          title: file.name,
          type: 'pdf',
          fileUrl: url,
          isLocal: true
        });
        setActivePost('local');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLocalPreview({
            id: 'local',
            title: file.name,
            type: file.name.endsWith('.pdf') ? 'pdf' : 'md',
            content: e.target.result,
            isLocal: true
          });
          setActivePost('local');
        };
        reader.readAsText(file);
      }
    }
  };

  const renderContent = () => {
    const post = activePost === 'local' ? localPreview : BLOG_POSTS.find(p => p.id === activePost);
    if (!post) return null;

    const isReport = post.type === 'report';

    return (
      <div className="animate-fade-in-up">
        <button 
          onClick={() => setActivePost(null)}
          className="mb-6 flex items-center text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回知识库
        </button>

        <div className={`rounded-xl overflow-hidden shadow-2xl border ${isReport ? 'border-red-900/60 bg-red-950/10' : 'border-gray-800 bg-gray-900/80'}`}>
          {/* 头部 */}
          <div className={`p-8 border-b ${isReport ? 'border-red-900/40 bg-black/60' : 'border-gray-800 bg-black/40'}`}>
            {isReport && (
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-bold mb-4 animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                重点威胁分析报告
              </div>
            )}
            <h2 className="text-3xl font-bold text-white mb-2">{post.title}</h2>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <span>{post.date || '本地预览'}</span>
              <span className={`px-2 py-0.5 rounded uppercase text-xs font-bold tracking-wider ${
                isReport ? 'bg-red-900/40 text-red-400 border border-red-800' : 
                post.type === 'pdf' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
              }`}>
                {post.type === 'report' ? 'THREAT REPORT' : post.type}
              </span>
            </div>
          </div>
          
          <div className="p-8 min-h-[500px] bg-black/50">
            {post.type === 'pdf' ? (
              <div className="w-full h-[800px] relative rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                 <iframe 
                   src={post.fileUrl} 
                   className="w-full h-full" 
                   title="PDF Viewer"
                 >
                   <div className="text-center p-8">
                     <p>您的浏览器不支持 PDF 预览。</p>
                     <a href={post.fileUrl} className="text-green-400 underline">下载 PDF</a>
                   </div>
                 </iframe>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className={`text-3xl font-bold mb-6 pb-2 border-b ${isReport ? 'text-red-400 border-red-900/50' : 'text-green-400 border-gray-800'}`} {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className={`text-xl font-bold mt-8 mb-2 ${isReport ? 'text-red-300' : 'text-green-300'}`} {...props} />,
                    p: ({node, ...props}) => <div className="text-gray-300 leading-7 mb-4" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? 
                      <code className={`px-1 py-0.5 rounded text-sm font-mono ${isReport ? 'bg-red-950/50 text-red-300' : 'bg-gray-800 text-green-300'}`} {...props} /> :
                      <div className={`p-4 rounded-lg overflow-x-auto border my-6 shadow-inner ${isReport ? 'bg-red-950/20 border-red-900/40' : 'bg-gray-950 border-gray-800'}`}>
                        <code className="text-gray-300 text-sm font-mono" {...props} />
                      </div>,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-4 italic text-gray-400 my-4 p-4 rounded-r ${isReport ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`} {...props} />
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="blog" className="py-24 bg-gray-900 border-t border-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">知识库</h2>
          <p className="text-gray-400">研究论文、项目文档与技术文章。</p>
        </div>

        {activePost ? renderContent() : (
          <div className="space-y-12">
            {/* 上传预览区 */}
            <div className="bg-black/40 border border-gray-800 border-dashed rounded-xl p-8 text-center hover:border-green-500/50 transition-all group">
               <div 
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                   <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">工作台预览</h3>
                <p className="text-gray-500 text-sm mb-4">上传本地 README.md 或 PDF 文件进行预览。</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".md,.txt,.pdf" 
                  onChange={handleFileUpload} 
                />
              </div>
            </div>

            {/* 文章列表 */}
            <div className="grid gap-6">
              {BLOG_POSTS.map((post) => {
                const isReport = post.type === 'report';
                return (
                  <div 
                    key={post.id}
                    onClick={() => setActivePost(post.id)}
                    className={`p-6 rounded-xl transition-all cursor-pointer group flex items-start ${
                      isReport 
                        ? 'bg-red-950/10 border border-red-500/40 hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]' 
                        : 'bg-black/40 border border-gray-800 hover:border-green-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    }`}
                  >
                    <div className="mr-6 hidden sm:block">
                       <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                         isReport 
                           ? 'bg-red-900/30 group-hover:bg-red-600' 
                           : post.type === 'pdf' 
                             ? 'bg-blue-900/20 group-hover:bg-blue-600' 
                             : 'bg-gray-800 group-hover:bg-green-600'
                       }`}>
                          {post.type === 'pdf' ? <FileText className="text-white w-6 h-6" /> : 
                           isReport ? <AlertTriangle className="text-red-400 w-6 h-6" /> : 
                           <BookOpen className="text-white w-6 h-6" />}
                       </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <h3 className={`text-xl font-bold transition-colors ${isReport ? 'text-red-400 group-hover:text-red-300' : 'text-white group-hover:text-green-400'}`}>
                           {post.title}
                         </h3>
                         <ChevronRight className={`w-5 h-5 transform group-hover:translate-x-1 transition-all ${isReport ? 'text-red-700 group-hover:text-red-400' : 'text-gray-600 group-hover:text-green-500'}`} />
                      </div>
                      <p className="text-gray-400 mb-3">{post.description}</p>
                      <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                        <span>{post.date}</span>
                        <span className={`uppercase border px-2 py-0.5 rounded ${
                          isReport 
                            ? 'border-red-800 text-red-400 bg-red-950/30' 
                            : 'border-gray-700'
                        }`}>
                          {isReport ? 'REPORT' : post.type}
                        </span>
                        {isReport && (
                          <span className="flex items-center text-red-400 animate-pulse">
                            <Flame className="w-3 h-3 mr-1" /> 重点案例
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- 关于我们 ---
const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-black border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">关于我们</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl backdrop-blur-sm">
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              本项目获得 <span className="text-green-400 font-medium">广东省大学生科技创新培育专项资金</span>（项目编号：pdjh2026c11106）资助。
            </p>
            
            <p>
              我们衷心感谢 <span className="text-white font-medium">Hugh Anderson 教授</span> 以及在新加坡国立大学举办的 "Defence Against the Dark Arts" 暑期研讨会，项目的最初构想与原型在该研讨会上诞生。
            </p>
            
            <p>
              感谢 <span className="text-white font-medium">QEMU-guardian 项目</span> 的队友们，他们为本项目奠定了坚实的基础。
            </p>
            
            <p>
              特别感谢 <span className="text-white font-medium">SUSTech Compass Lab</span> 的学长学姐们给予的宝贵指导与技术支持。
            </p>
            
            <p>
              最后，感谢 <span className="text-white font-medium">SUSTech CS315 计算机安全课程</span> 提供的平台，使我们得以完成整个系统的开发与论文撰写。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 页脚 ---
const Footer = () => (
  <footer className="bg-black py-12 border-t border-green-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <Shield className="h-6 w-6 text-green-600" />
        <span className="text-lg font-bold text-gray-300">MirrorShield</span>
      </div>
      <div className="text-gray-500 text-sm">
        &copy; 2025 MirrorShield Team. 学术许可证 (MIT)。
      </div>
    </div>
  </footer>
);

// --- 根组件 ---
const App = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      <Navigation />
      <Hero />
      <Features />
      <Architecture />
      <DemoTerminal />
      <BlogSection />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default App;
