import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Cpu, Terminal, FileText, Download, Upload, Zap, Activity, 
  Server, Box, Search, CheckCircle, Github, Menu, X, BookOpen, 
  ChevronRight, ArrowLeft, ExternalLink, AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- Configuration (Blog Data) ---
// 你只需要在这里添加你的文件信息
// 确保文件真实存在于你的 public/blog 文件夹下
const BLOG_POSTS = [
  {
    id: 'report-sample-1',
    title: '🚨 Case Study: LLM Analysis of Mirai Variant (Sample bd7a...da81)',
    date: '2025-02-14',
    type: 'report', // 使用 'report' 类型，系统会自动渲染 Markdown，且标签会有区分
    description: 'A real-world example of MirrorShield detecting a Mirai botnet variant using DeepSeek AI.',
    content: `
# 🛡️ Analysis Report: Sample bd7a...da81

> **Final Prediction:** 🔴 **MALWARE (95/100)** > **Family:** Mirai  
> **Status:** ✅ Success  
> **Label:** Trojan.Linux.Mirai  
> **Categories:** Botnet, DDoS, Evasion  

## 📝 Analysis Summary

This specimen is identified as a **Mirai botnet variant** featuring a "Killer" module. It aggressively scans for and removes competing malware (e.g., cleaning \`/etc/.ares\`), establishes persistence via shell scripts, and attempts to manipulate system cron jobs.

---

## 🔍 Key Findings (Extracted Artifacts)

### 💀 Killer Behavior
Detected \`UNLINKAT\` events targeting known competitor files (Botnet territorial warfare):
- \`/etc/.ares\`
- \`/usr/lib/libdlrpcld.so\`
- \`/etc/init.d/linux_kill\`

### 🔄 Persistence
Captured WRITE operations creating a shell loop script for keep-alive:
\`\`\`bash
#!/bin/sh
while [ 1 ]; do
  sleep 60...
\`\`\`

### ⚙️ System Tampering
Observed \`EXEC\` calls attempting to overwrite cron jobs for periodic execution:
- \`*/1 * * * * root /.mod\`

### 🚦 Process Control
- Multiple \`CLONE\` events detected.
- \`SIGNAL_GENERATE\` (sig 23) events observed.

---

*Analysis generated automatically by MirrorShield utilizing DeepSeek AI.*
    `
  },
  {
    id: 'paper-1',
    title: 'MirrorShield: Cross-Architecture Linux Malware Analysis',
    date: '2025-01-15',
    type: 'pdf',
    description: 'Our core research paper detailing the lightweight emulation techniques.',
    fileUrl: '/MirrorShield_paper.pdf' // 放在 public 目录下
  },
  {
    id: 'post-1',
    title: 'Project Development Log: The Journey to eBPF',
    date: '2025-02-10',
    type: 'md',
    description: 'Why we chose eBPF over kernel modules for system call monitoring.',
    // 这是一个示例 Markdown 内容，实际部署时你可以用 fetch('/blog/post1.md') 替代
    content: `
# Why eBPF?

Traditional Linux security monitoring often relies on kernel modules (LKM). However, LKMs have significant drawbacks:

1. **Stability**: A bug in an LKM can crash the entire system.
2. **Compatibility**: LKMs often need recompilation for different kernel versions.

## The eBPF Advantage

eBPF (Extended Berkeley Packet Filter) allows us to run sandboxed programs in the Linux kernel without changing kernel source code or loading modules.

\`\`\`c
// Example eBPF hook
SEC("tracepoint/syscalls/sys_enter_execve")
int trace_execve(struct trace_event_raw_sys_enter *ctx) {
    // ... logic
}
\`\`\`

MirrorShield leverages this to achieve **zero-overhead** monitoring.
    `
  },
  {
    id: 'slides-1',
    title: 'CS315 Project Presentation Slides',
    date: '2024-12-20',
    type: 'pdf',
    description: 'The presentation slides used for the CS315 course defense.',
    fileUrl: '/CS315汇报.pdf'
  }
];

// --- Components ---

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

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
              {['Features', 'Architecture', 'Demo', 'Blog'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item}
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-green-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Features', 'Architecture', 'Demo', 'Blog'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

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
          DeepSeek AI & eBPF Powered
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Binaries</span>
          <br /> Across Any Architecture
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
          MirrorShield is a next-gen security analysis platform for Linux executables. 
          Analyze x86, ARM, MIPS, and RISC-V binaries with eBPF monitoring and AI-driven insights.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => document.getElementById('blog').scrollIntoView({behavior: 'smooth'})} className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-black bg-green-500 hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <BookOpen className="w-5 h-5 mr-2" />
            Read Analysis Reports
          </button>
          <button onClick={() => document.getElementById('demo').scrollIntoView({behavior: 'smooth'})} className="flex items-center justify-center px-8 py-4 border border-green-500/50 text-lg font-medium rounded-md text-green-400 bg-black hover:bg-green-900/20 transition-all">
            <Terminal className="w-5 h-5 mr-2" />
            Live Demo
          </button>
        </div>
      </div>
    </section>
  );
};

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
      title: "Multi-Arch Support",
      description: "Seamlessly analyze x86, ARM, MIPS, PowerPC, and RISC-V binaries. Auto-detection of architecture and QEMU emulator selection."
    },
    {
      icon: Activity,
      title: "eBPF Monitoring",
      description: "High-performance syscall capturing using eBPF/cBPF. Per-cgroup event routing with sharded locking ensures zero packet loss."
    },
    {
      icon: Search,
      title: "AI-Powered Analysis",
      description: "DeepSeek AI integration for automatic malware behavior analysis, risk scoring, and comprehensive human-readable reports."
    },
    {
      icon: Box,
      title: "Docker Isolation",
      description: "Secure execution in isolated Docker containers. Supports 100+ concurrent samples with intelligent resource management."
    }
  ];

  return (
    <section id="features" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful capabilities</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built for security researchers and system administrators who need speed, precision, and depth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
};

const Architecture = () => {
  return (
    <section id="architecture" className="py-24 bg-gray-900 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">System Architecture</h2>
            <p className="text-gray-400 mb-6">
              A modular design separating the Analysis Engine (Wrapper), REST API Server, and Browser Extension. 
              The core leverages a Docker Pool for isolation and an eBPF Monitor for kernel-level visibility.
            </p>
            <ul className="space-y-4">
              {[
                "Wrapper: Core engine handling QEMU & Docker lifecycle.",
                "Server: RESTful API managing jobs and queues.",
                "Guardian: Browser extension for auto-detection.",
                "DeepSeek: AI module for behavioral interpretation."
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
│             MirrorSheild Platform            │
├──────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │ Wrapper  │◄─►│  Server  │◄─►│ Guardian │  │
│  └──────────┘   └──────────┘   └──────────┘  │
│       │              │               │       │
│       ▼              ▼               ▼       │
│  ┌────────────────────────────────────────┐  │
│  │      Docker Pool (100+ concurrent)     │  │
│  └────────────────────────────────────────┘  │
│       │                                      │
│       ▼                                      │
│  ┌────────────────────────────────────────┐  │
│  │   eBPF Monitor (Ring Buffer -> Map)    │  │
│  └────────────────────────────────────────┘  │
│       │                                      │
│       ▼                                      │
│  ┌────────────────────────────────────────┐  │
│  │  Analysis (DeepSeek AI + Analyzers)    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

const DemoTerminal = () => {
  const [logs, setLogs] = useState([
    "> MirrorSheild shell initialized...",
    "> Waiting for input..."
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setLogs(["> Initializing Docker container...", "> Selecting QEMU arch: ARM64..."]);
    setProgress(10);

    const steps = [
      { p: 30, t: 800, msg: "> Attaching eBPF probes..." },
      { p: 50, t: 1600, msg: "> Capturing syscalls (OPENAT, EXECVE, CONNECT)..." },
      { p: 70, t: 2400, msg: "> Detected suspicious network activity: 192.168.1.10:4444" },
      { p: 85, t: 3200, msg: "> Sending trace to DeepSeek AI..." },
      { p: 100, t: 4000, msg: "> Analysis Complete. Risk Score: CRITICAL." }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        setProgress(step.p);
        setLogs(prev => [...prev, step.msg]);
        if (step.p === 100) setIsAnalyzing(false);
      }, step.t);
    });
  };

  return (
    <section id="demo" className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Interactive Demo</h2>
          <p className="text-gray-400">Experience the speed of the analysis wrapper.</p>
        </div>

        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm text-gray-400 font-mono">user@guardian:~/workspace</span>
          </div>
          
          <div className="p-6 font-mono text-sm h-80 overflow-y-auto flex flex-col">
            {logs.map((log, i) => (
              <div key={i} className={`mb-2 ${log.includes('CRITICAL') ? 'text-red-500 font-bold' : log.includes('suspicious') ? 'text-yellow-400' : 'text-green-400'}`}>
                {log}
              </div>
            ))}
            {isAnalyzing && (
              <div className="mt-4 w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            )}
            
            {!isAnalyzing && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button 
                  onClick={simulateAnalysis}
                  className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Run Analysis Sample
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Blog / Resource Hub Component ---
const BlogSection = () => {
  const [activePost, setActivePost] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle local file selection (Preview Mode)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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
      // Note: FileReader works great for text, but for local PDFs we might need URL.createObjectURL
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
        reader.readAsText(file);
      }
    }
  };

  const renderContent = () => {
    const post = activePost === 'local' ? localPreview : BLOG_POSTS.find(p => p.id === activePost);
    
    if (!post) return null;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={() => setActivePost(null)}
          className="mb-6 flex items-center text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Knowledge Base
        </button>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-gray-800 bg-black/40">
            <h2 className="text-3xl font-bold text-white mb-2">{post.title}</h2>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <span>{post.date || 'Draft Preview'}</span>
              <span className={`px-2 py-0.5 rounded uppercase text-xs font-bold tracking-wider ${post.type === 'report' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                {post.type}
              </span>
            </div>
          </div>
          
          <div className="p-8 min-h-[500px] bg-black/50">
            {post.type === 'pdf' ? (
              <div className="w-full h-[800px] relative rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                 {/* NOTE: For production, simply using an iframe to the PDF URL is usually robust. 
                    If storing in public/ folder, url is relative e.g., "/paper.pdf".
                 */}
                 <iframe 
                   src={post.fileUrl} 
                   className="w-full h-full" 
                   title="PDF Viewer"
                 >
                   <div className="text-center p-8">
                     <p>Your browser does not support PDFs.</p>
                     <a href={post.fileUrl} className="text-green-400 underline">Download PDF</a>
                   </div>
                 </iframe>
              </div>
            ) : (
              <div className="prose prose-invert prose-green max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-green-400 mb-6 pb-2 border-b border-gray-800" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-green-300 mt-8 mb-2" {...props} />,
                    p: ({node, ...props}) => <div className="text-gray-300 leading-7 mb-4" {...props} />, // Changed from p to div to allow nesting of code blocks (divs)
                    code: ({node, inline, ...props}) => 
                      inline ? 
                      <code className="bg-gray-800 text-green-300 px-1 py-0.5 rounded text-sm font-mono" {...props} /> :
                      <div className="bg-gray-950 p-4 rounded-lg overflow-x-auto border border-gray-800 my-6 shadow-inner">
                        <code className="text-gray-300 text-sm font-mono" {...props} />
                      </div>,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-400 my-4 bg-green-900/10 p-4 rounded-r" {...props} />
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Knowledge Base</h2>
          <p className="text-gray-400">Research papers, project documentation, and technical articles.</p>
        </div>

        {activePost ? renderContent() : (
          <div className="space-y-12">
            {/* 1. Upload/Preview Area */}
            <div className="bg-black/40 border border-gray-800 border-dashed rounded-xl p-8 text-center hover:border-green-500/50 transition-all group">
               <div 
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                   <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Workbench Preview</h3>
                <p className="text-gray-500 text-sm mb-4">Upload a local README.md or PDF to preview before committing.</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".md,.txt,.pdf" 
                  onChange={handleFileUpload} 
                />
              </div>
            </div>

            {/* 2. Blog List */}
            <div className="grid gap-6">
              {BLOG_POSTS.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setActivePost(post.id)}
                  className="bg-black/40 border border-gray-800 p-6 rounded-xl hover:border-green-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all cursor-pointer group flex items-start"
                >
                  <div className="mr-6 hidden sm:block">
                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${post.type === 'report' ? 'bg-red-900/20 group-hover:bg-red-600' : 'bg-gray-800 group-hover:bg-green-600'}`}>
                        {post.type === 'pdf' ? <FileText className="text-white w-6 h-6" /> : post.type === 'report' ? <AlertTriangle className="text-white w-6 h-6" /> : <BookOpen className="text-white w-6 h-6" />}
                     </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{post.title}</h3>
                       <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-gray-400 mb-3">{post.description}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                      <span>{post.date}</span>
                      <span className={`uppercase border px-2 py-0.5 rounded ${post.type === 'report' ? 'border-red-900 text-red-400' : 'border-gray-700'}`}>{post.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black py-12 border-t border-green-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <Shield className="h-6 w-6 text-green-600" />
        <span className="text-lg font-bold text-gray-300">MirrorSheild</span>
      </div>
      <div className="text-gray-500 text-sm">
        &copy; 2025 MirrorSheild Team. Academic License (MIT).
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      <Navigation />
      <Hero />
      <Features />
      <Architecture />
      <DemoTerminal />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default App;
