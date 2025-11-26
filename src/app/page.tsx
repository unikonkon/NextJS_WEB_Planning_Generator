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

// Animated background particles
function ParticleField() {
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
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${p.opacity})`;
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
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - dist / 150)})`;
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
  }, []);
  
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
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <ParticleField />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Zap className="size-7 text-purple-400 relative" />
            </div>
            <span className="font-bold text-xl tracking-tight">PlannerAI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/flowchart" className="text-sm text-gray-400 hover:text-white transition-colors">
              Flowchart
            </Link>
            <Link href="/generate" className="text-sm text-gray-400 hover:text-white transition-colors">
              Discovery
            </Link>
            <Link href="/history" className="text-sm text-gray-400 hover:text-white transition-colors">
              History
            </Link>
          </div>
          
          {/* <Link href="/generate">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 text-sm font-medium">
              เริ่มต้นใช้งาน
            </Button>
          </Link> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div 
          className={`relative z-10 text-center max-w-5xl transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            {/* <Sparkles className="size-4 text-purple-400" /> */}
            <span className="text-sm text-gray-300">Powered by Gemini AI</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Plan Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Website Vision
            </span>
          </h1>
          
          {/* Subtitle with typewriter */}
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
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
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="text-gray-600">[</span>
              <span className="text-purple-400">Products</span>
              <span className="text-gray-600">]</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">AI สำหรับ</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> ทุกการวางแผน</span>
            </h2>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Flowchart Card */}
            <Link href="/flowchart" className="group">
              <div 
                className={`relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 
                  hover:border-purple-500/50 hover:bg-white/[0.08] transition-all duration-500 h-full
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '400ms' }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                      <GitBranch className="size-8 text-purple-400" />
                    </div>
                    <ChevronRight className="size-6 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Flowchart Generator
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    สร้าง Flowchart Diagram สำหรับเว็บไซต์ของคุณ เลือกประเภทเว็บ เลือก Features แล้วให้ AI สร้างแผนผังโครงสร้างแบบ Interactive
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                      <LayoutGrid className="size-3 inline mr-1.5" />
                      Feature Overview
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                      <Users className="size-3 inline mr-1.5" />
                      User Flow
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
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
                className={`relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 
                  hover:border-pink-500/50 hover:bg-white/[0.08] transition-all duration-500 h-full
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '500ms' }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                      <FileText className="size-8 text-pink-400" />
                    </div>
                    <ChevronRight className="size-6 text-gray-600 group-hover:text-pink-400 group-hover:translate-x-2 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Discovery & Planning
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    สร้างเอกสาร Discovery และแผนโปรเจคอัตโนมัติด้วย AI ครบทุกด้าน ตั้งแต่ Requirements จนถึง Risk Assessment
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                      <Layers className="size-3 inline mr-1.5" />
                      Requirements
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                      <Clock className="size-3 inline mr-1.5" />
                      Timeline
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
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
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="text-gray-600">[</span>
              <span className="text-purple-400">Features</span>
              <span className="text-gray-600">]</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ทำไมต้องใช้ PlannerAI?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                className={`p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-${feature.color}-500/30 
                  hover:bg-white/[0.05] transition-all duration-300 group
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className={`p-3 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 w-fit mb-4 
                  group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`size-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
          
          <div className="relative z-10">
            <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-8">
              <Rocket className="size-12 text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              พร้อมเริ่มวางแผนโปรเจคของคุณ?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              เริ่มต้นใช้งานฟรี ไม่ต้องสมัครสมาชิก สร้างแผนพัฒนาเว็บไซต์แบบมืออาชีพได้ทันที
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/generate">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-6 text-lg font-medium">
                  เริ่มต้นใช้งานเลย
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="size-5 text-purple-400" />
                <span className="font-bold">PlannerAI</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered website planning tool for developers and designers.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/flowchart" className="hover:text-white transition-colors">Flowchart Generator</Link></li>
                <li><Link href="/generate" className="hover:text-white transition-colors">Discovery & Planning</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/history" className="hover:text-white transition-colors">History</Link></li>
                <li><Link href="/flowchart/history" className="hover:text-white transition-colors">Flowchart History</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">Powered By</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Google Gemini AI</li>
                <li>Next.js</li>
                <li>Mermaid.js</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} PlannerAI. Built with 💜 for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
