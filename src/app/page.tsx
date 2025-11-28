'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  ArrowRight, 
  Zap,
  FileText,
  Layers,
  Code2,
  Rocket,
  ChevronRight,
  Globe,
  LayoutGrid,
  Database,
  Users,
  Clock,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

// Animated background particles
function ParticleField({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
    
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = isDark ? '147, 51, 234' : '124, 58, 237';
      const opacityMultiplier = isDark ? 1 : 0.7;
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity * opacityMultiplier})`;
        ctx.fill();
      });
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${particleColor}, ${0.1 * opacityMultiplier * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />;
}

// Animated typing effect
function TypewriterText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const targetText = texts[currentTextIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, texts, currentTextIndex]);
  
  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ParticleField isDark={isDark} />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-black/30 border-white/5' : 'bg-white/70 border-gray-200'}`}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Zap className="size-7 text-purple-400 relative" />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>PlannerAI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/flowchart" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Flowchart
            </Link>
            <Link href="/generate" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Discovery
            </Link>
            <Link href="/history" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              History
            </Link>
          </div>
          
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        {/* Gradient orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse ${isDark ? 'bg-purple-600/20' : 'bg-purple-500/15'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse ${isDark ? 'bg-blue-600/20' : 'bg-blue-500/15'}`} style={{ animationDelay: '1s' }} />
        
        <div 
          className={`relative z-10 text-center max-w-5xl transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Powered by Gemini AI</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400' : 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600'}`}>
              Plan Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Website Vision
            </span>
          </h1>
          
          {/* Subtitle with typewriter */}
          <p className={`text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            สร้างแผนพัฒนาเว็บไซต์อย่างครบถ้วนด้วย AI
          </p>
          <div className="h-8 mb-12">
            <TypewriterText 
              texts={[
                'วิเคราะห์ Requirements อัตโนมัติ',
                'สร้าง Flowchart แบบ Interactive',
                'ประเมินระยะเวลาและงบประมาณ',
                'วางแผน Risk Assessment',
              ]}
              className="text-lg text-purple-400"
            />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/generate">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-8 py-6 text-lg font-medium group shadow-lg shadow-purple-500/25">
                <Rocket className="size-5 mr-2" />
                เริ่มสร้าง Discovery
                <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/flowchart">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full px-8 py-6 text-lg font-medium group shadow-lg shadow-blue-500/25">
                <GitBranch className="size-5 mr-2" />
                เริ่มสร้าง Flowchart
                <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
      </section>

      {/* Products Section */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div 
            className={`mb-16 transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className={`inline-flex items-center gap-2 text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>[</span>
              <span className="text-purple-400">Products</span>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>]</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className={isDark ? 'text-white' : 'text-gray-800'}>AI สำหรับ</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> ทุกการวางแผน</span>
            </h2>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Flowchart Card */}
            <Link href="/flowchart" className="group">
              <div 
                className={`relative p-8 rounded-3xl border transition-all duration-500 h-full
                  ${isDark 
                    ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08]' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10'
                  }
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '400ms' }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                      <GitBranch className="size-8 text-purple-400" />
                    </div>
                    <ChevronRight className={`size-6 group-hover:text-purple-400 group-hover:translate-x-2 transition-all ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Flowchart Generator
                  </h3>
                  <p className={`leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    สร้าง Flowchart Diagram สำหรับเว็บไซต์ของคุณ เลือกประเภทเว็บ เลือก Features แล้วให้ AI สร้างแผนผังโครงสร้างแบบ Interactive
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className={`px-3 py-1.5 rounded-full text-xs border ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      <LayoutGrid className="size-3 inline mr-1.5" />
                      Feature Overview
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs border ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      <Users className="size-3 inline mr-1.5" />
                      User Flow
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs border ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      <Database className="size-3 inline mr-1.5" />
                      Data Flow
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center text-purple-400 font-medium group-hover:gap-2 transition-all">
                    <span>สร้าง Flowchart</span>
                    <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              </div>
            </Link>

            {/* Discovery Card */}
            <Link href="/generate" className="group">
              <div 
                className={`relative p-8 rounded-3xl border transition-all duration-500 h-full
                  ${isDark 
                    ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10 hover:border-pink-500/50 hover:bg-white/[0.08]' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/10'
                  }
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '500ms' }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                      <FileText className="size-8 text-pink-400" />
                    </div>
                    <ChevronRight className={`size-6 group-hover:text-pink-400 group-hover:translate-x-2 transition-all ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Discovery & Planning
                  </h3>
                  <p className={`leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    สร้างเอกสาร Discovery และแผนโปรเจคอัตโนมัติด้วย AI ครบทุกด้าน ตั้งแต่ Requirements จนถึง Risk Assessment
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className={`px-3 py-1.5 rounded-full text-xs border ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      <Layers className="size-3 inline mr-1.5" />
                      Requirements
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs border ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      <Clock className="size-3 inline mr-1.5" />
                      Timeline
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs border ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      <Shield className="size-3 inline mr-1.5" />
                      Risk Analysis
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center text-pink-400 font-medium group-hover:gap-2 transition-all">
                    <span>เริ่มสร้าง Discovery</span>
                    <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`relative py-32 px-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>[</span>
              <span className="text-purple-400">Features</span>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>]</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              ทำไมต้องใช้ PlannerAI?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              เครื่องมือที่ช่วยให้การวางแผนพัฒนาเว็บไซต์เป็นเรื่องง่ายและครบถ้วน
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered',
                description: 'ใช้ Gemini AI วิเคราะห์และสร้างแผนงานอัตโนมัติ ประหยัดเวลาในการวางแผน',
                color: 'purple',
              },
              {
                icon: Layers,
                title: 'ครบทุก Features',
                description: 'รองรับทุกประเภทเว็บ ตั้งแต่ E-Commerce, Blog, Portfolio ไปจนถึง SaaS',
                color: 'blue',
              },
              {
                icon: Code2,
                title: 'Mermaid Diagram',
                description: 'สร้าง Flowchart ด้วย Mermaid.js ส่งออกเป็น SVG หรือ PNG ได้ทันที',
                color: 'green',
              },
              {
                icon: TrendingUp,
                title: 'Budget & Timeline',
                description: 'ประเมินงบประมาณและระยะเวลาพัฒนาจาก Features ที่เลือก',
                color: 'orange',
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'วิเคราะห์ความเสี่ยงและแนวทางแก้ไขปัญหาที่อาจเกิดขึ้น',
                color: 'red',
              },
              {
                icon: Globe,
                title: 'รองรับภาษาไทย',
                description: 'สลับภาษาได้ทั้ง English และไทย สำหรับทั้ง UI และเอกสารที่สร้าง',
                color: 'pink',
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`p-6 rounded-2xl border transition-all duration-300 group
                  ${isDark 
                    ? `bg-white/[0.03] border-white/5 hover:border-${feature.color}-500/30 hover:bg-white/[0.05]` 
                    : `bg-white border-gray-200 hover:border-${feature.color}-400 hover:shadow-lg`
                  }
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className={`p-3 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 w-fit mb-4 
                  group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`size-6 text-${feature.color}-400`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-purple-900/20' : 'from-purple-100/50'} to-transparent`} />
          
          <div className="relative z-10">
            <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-8">
              <Rocket className="size-12 text-purple-400" />
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              พร้อมเริ่มวางแผนโปรเจคของคุณ?
            </h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              เริ่มต้นใช้งานฟรี ไม่ต้องสมัครสมาชิก สร้างแผนพัฒนาเว็บไซต์แบบมืออาชีพได้ทันที
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/generate">
                <Button size="lg" className={`rounded-full px-8 py-6 text-lg font-medium ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'}`}>
                  เริ่มต้นใช้งานเลย
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="size-5 text-purple-400" />
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>PlannerAI</span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                AI-powered website planning tool for developers and designers.
              </p>
            </div>
            
            <div>
              <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Products</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                <li><Link href="/flowchart" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Flowchart Generator</Link></li>
                <li><Link href="/generate" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Discovery & Planning</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Resources</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                <li><Link href="/history" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>History</Link></li>
                <li><Link href="/flowchart/history" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Flowchart History</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Powered By</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                <li>Google Gemini AI</li>
                <li>Next.js</li>
                <li>Mermaid.js</li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t pt-8 text-center text-sm ${isDark ? 'border-white/5 text-gray-600' : 'border-gray-200 text-gray-500'}`}>
            <p>© {new Date().getFullYear()} PlannerAI. Built with 💜 for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
