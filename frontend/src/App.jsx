import React, { useState } from 'react';
import { 
  Code2, 
  Zap, 
  Shield, 
  Layers, 
  Download, 
  BookOpen, 
  Terminal,
  CheckCircle2,
  Github,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('mac');

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Strong Type System",
      description: "Built-in type checking with int, float, string, bool, and any types"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Array Support",
      description: "Type-safe arrays with full support for int[], string[], and more"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Modern Control Flow",
      description: "If/else, while loops, and for-in loops with range() function"
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "String Interpolation",
      description: "Dynamic strings with {{variable}} syntax for easy formatting"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "VS Code Integration",
      description: "Full syntax highlighting and IntelliSense support"
    }
  ];

  const codeExample = `// Gravox Feature Showcase
int number = 42;
string name = "Gravox";
int[] scores = [95, 87, 92, 88];

// Control Flow
if (number > 40) {
    show("Number is greater than 40");
}

// For Loop with Range
for (i in range(1, 5)) {
    show("Iteration: {{i}}");
}

// String Interpolation
show("Welcome to {{name}}!");`;

  const installCommands = {
    mac: {
      steps: [
        "Download the Gravox DMG installer",
        "Open Gravox-1.0.0.dmg",
        "Run install.sh script",
        "Verify installation"
      ],
      command: "gravox run myprogram.gvx"
    },
    linux: {
      steps: [
        "Download the Linux executable",
        "Make it executable",
        "Move to /usr/local/bin",
        "Verify installation"
      ],
      command: "chmod +x gravox-linux && sudo mv gravox-linux /usr/local/bin/gravox"
    },
    windows: {
      steps: [
        "Download gravox-win.exe",
        "Add to system PATH",
        "Open Command Prompt",
        "Verify installation"
      ],
      command: "gravox run myprogram.gvx"
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient opacity-20"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Logo */}
          <div className="mb-8 float-animation">
            <img 
              src="/GravoxLogo.png" 
              alt="Gravox Logo" 
              className="w-32 h-32 mx-auto glow"
            />
          </div>

          {/* Title */}
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Gravox
          </h1>
          
          <p className="text-2xl text-gray-300 mb-4 font-light">
            A Modern Programming Language
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Built with C-style syntax, strong typing, and powerful features. 
            From lexer to interpreter, experience a complete language ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4 flex-wrap justify-center">
              <a 
                href="#installation"
                className="glass px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download for Mac
              </a>
              <a 
                href="#installation"
                className="glass px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download for Windows
              </a>
              <a 
                href="#installation"
                className="glass px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download for Linux
              </a>
            </div>
            <a 
              href="#features"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Learn More
            </a>
          </div>

          {/* Quick Code Preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="code-block text-left">
              <div className="text-sm text-gray-400 mb-3">Quick Example:</div>
              <code>
                <span className="keyword">int</span> <span className="function">x</span> = <span className="number">10</span>;<br/>
                <span className="function">show</span>(<span className="string">"Hello, Gravox!"</span>);
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Everything you need for modern programming
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass p-8 rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Showcase */}
      <section className="py-24 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">
            See It In Action
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Clean, readable syntax that's easy to learn
          </p>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="code-block">
                <pre className="text-sm">
                  <code>
                    <span className="comment">// Gravox Feature Showcase</span><br/>
                    <span className="type">int</span> number = <span className="number">42</span>;<br/>
                    <span className="type">string</span> name = <span className="string">"Gravox"</span>;<br/>
                    <span className="type">int[]</span> scores = [<span className="number">95</span>, <span className="number">87</span>, <span className="number">92</span>, <span className="number">88</span>];<br/>
                    <br/>
                    <span className="comment">// Control Flow</span><br/>
                    <span className="keyword">if</span> (number &gt; <span className="number">40</span>) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="function">show</span>(<span className="string">"Number is greater than 40"</span>);<br/>
                    {'}'}<br/>
                    <br/>
                    <span className="comment">// For Loop with Range</span><br/>
                    <span className="keyword">for</span> (i <span className="keyword">in</span> <span className="function">range</span>(<span className="number">1</span>, <span className="number">5</span>)) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="function">show</span>(<span className="string">"Iteration: {'{'}{'{'}</span>i<span className="string">{'}'}{'}'}"</span>);<br/>
                    {'}'}<br/>
                    <br/>
                    <span className="comment">// String Interpolation</span><br/>
                    <span className="function">show</span>(<span className="string">"Welcome to {'{'}{'{'}</span>name<span className="string">{'}'}{'}'}!"</span>);
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Type Safety
                </h3>
                <p className="text-gray-400">
                  Catch errors early with strong type checking at runtime
                </p>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Modern Syntax
                </h3>
                <p className="text-gray-400">
                  Familiar C-style syntax with modern conveniences
                </p>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Easy to Learn
                </h3>
                <p className="text-gray-400">
                  Clear documentation and intuitive language design
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">
            Complete Architecture
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            From source code to execution
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="glass p-8 rounded-2xl text-center flex-1 max-w-xs">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Code2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lexer</h3>
              <p className="text-gray-400">Tokenizes source code into meaningful symbols</p>
            </div>

            <ArrowRight className="w-8 h-8 text-purple-400 rotate-90 md:rotate-0" />

            <div className="glass p-8 rounded-2xl text-center flex-1 max-w-xs">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Parser</h3>
              <p className="text-gray-400">Builds Abstract Syntax Tree from tokens</p>
            </div>

            <ArrowRight className="w-8 h-8 text-purple-400 rotate-90 md:rotate-0" />

            <div className="glass p-8 rounded-2xl text-center flex-1 max-w-xs">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Interpreter</h3>
              <p className="text-gray-400">Executes the AST and produces output</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-24 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">
            Get Started
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Install Gravox on your platform
          </p>

          {/* Platform Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {['mac', 'linux', 'windows'].map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-8 py-3 rounded-full font-semibold capitalize transition-all ${
                  selectedPlatform === platform
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'glass hover:scale-105'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Installation Steps */}
          <div className="glass p-8 rounded-2xl mb-8">
            <h3 className="text-2xl font-bold mb-6">Installation Steps</h3>
            <ol className="space-y-4">
              {installCommands[selectedPlatform].steps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-300 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Command */}
          <div className="code-block">
            <div className="text-sm text-gray-400 mb-2">Run your first program:</div>
            <code className="text-green-400">{installCommands[selectedPlatform].command}</code>
          </div>

          {/* VS Code Extension */}
          <div className="mt-12 glass p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">VS Code Extension</h3>
            <p className="text-gray-400 mb-6">
              Get syntax highlighting and IntelliSense support
            </p>
            <div className="code-block">
              <code className="text-sm">
                <span className="comment"># Install the extension</span><br/>
                code --install-extension gravox-1.0.0.vsix
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/GravoxLogo.png" alt="Gravox" className="w-10 h-10" />
              <span className="text-xl font-bold">Gravox</span>
            </div>

            <div className="flex gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#installation" className="text-gray-400 hover:text-white transition-colors">
                Installation
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>

            <div className="text-gray-400 text-sm">
              © 2025 Gravox. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
