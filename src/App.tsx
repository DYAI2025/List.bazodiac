/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Globe, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Info,
  Calendar,
  Clock,
  MapPin,
  Menu,
  X,
  Plus
} from 'lucide-react';

// --- Constants & Types ---

const ELEMENTS = {
  WATER: { name: 'Wasser', color: '#38bdf8', description: 'Adaptive Wahrnehmung, zyklische Tiefe und strategische Geduld.' },
  FIRE: { name: 'Feuer', color: '#ef4444', description: 'Dynamische Inspiration, expansive Energie und transformative Präsenz.' },
  EARTH: { name: 'Erde', color: '#c08457', description: 'Stabile Struktur, nährende Substanz und verlässliche Zentrierung.' },
  METAL: { name: 'Metall', color: '#e5e7eb', description: 'Analytische Klarheit, präzise Grenzen und strukturelle Integrität.' },
  WOOD: { name: 'Holz', color: '#22c55e', description: 'Vitales Wachstum, flexible Expansion und kreative Erneuerung.' },
};

type ElementKey = keyof typeof ELEMENTS;

interface FormState {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  email: string;
}

// --- Components ---

const ElementVisualizer = ({ element, className = "", size = "full" }: { element: ElementKey, className?: string, size?: "sm" | "full" }) => {
  const config = ELEMENTS[element];
  
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}>
      {/* Ambient Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 blur-3xl opacity-10"
        style={{ backgroundColor: config.color }}
      />
      
      <svg viewBox="0 0 100 100" className={size === "sm" ? "w-8 h-8" : "w-full h-full relative z-10"}>
        <defs>
          <radialGradient id={`grad-${element}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={config.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={config.color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {element === 'WATER' && (
          <motion.path
            d="M20,50 Q35,30 50,50 T80,50"
            fill="none"
            stroke={config.color}
            strokeWidth="0.5"
            strokeLinecap="round"
            animate={{ 
              d: [
                "M20,45 Q35,25 50,45 T80,45",
                "M20,55 Q35,75 50,55 T80,55",
                "M20,45 Q35,25 50,45 T80,45"
              ],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {element === 'FIRE' && (
          <motion.g>
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={30 + Math.random() * 40}
                cy={80}
                r={0.8}
                fill={config.color}
                animate={{ 
                  y: [-10, -60],
                  opacity: [0, 1, 0],
                  scale: [1, 0.2]
                }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </motion.g>
        )}
        {element === 'EARTH' && (
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <rect x="35" y="35" width="30" height="30" fill="none" stroke={config.color} strokeWidth="0.3" opacity="0.4" />
            <motion.rect
              x="40" y="40" width="20" height="20"
              fill="none"
              stroke={config.color}
              strokeWidth="0.8"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.g>
        )}
        {element === 'METAL' && (
          <motion.g>
            <circle cx="50" cy="50" r="25" fill="none" stroke={config.color} strokeWidth="0.2" strokeDasharray="2, 4" opacity="0.3" />
            <motion.circle
              cx="50" cy="50" r="25"
              fill="none"
              stroke={config.color}
              strokeWidth="1"
              strokeDasharray="8, 92"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>
        )}
        {element === 'WOOD' && (
          <motion.g animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M50,85 L50,35" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.4" />
            <motion.path
              d="M50,65 L35,50 M50,55 L65,40"
              fill="none"
              stroke={config.color}
              strokeWidth="0.8"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
};

const Tutorial = ({ active, step, onClose, onNext }: { active: boolean, step: number, onClose: () => void, onNext: () => void }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const steps = [
    {
      targetId: 'engine',
      title: 'Cosmic Signature Pulse',
      body: 'Hier berechnet unser System Ihren Pulse. Es ist die mathematische Synthese Ihrer westlichen und östlichen Daten.',
      offset: { y: 200, x: 0 }
    },
    {
      targetId: 'visible-engine-card',
      title: 'Visible Engine',
      body: 'Wir nutzen echte NASA-Ephemeriden. Keine Schätzungen, kein Voodoo. Rein deterministische Berechnungen.',
      offset: { y: 0, x: 0 }
    },
    {
      targetId: 'onboarding',
      title: 'Waitlist & Early Access',
      body: 'Sichern Sie sich Ihren Platz. Das Onboarding ist limitiert, um Präzision und persönliche Betreuung zu garantieren.',
      offset: { y: 0, x: 0 }
    }
  ];

  useEffect(() => {
    if (active) {
      const current = steps[step];
      const el = document.getElementById(current.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setCoords({
            top: rect.top + window.scrollY + rect.height / 2,
            left: rect.left + window.scrollX + rect.width / 2
          });
        }, 500); // Wait for scroll
      }
    }
  }, [active, step]);

  if (!active) return null;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="absolute z-10 pointer-events-auto w-72 bg-cosmic-bg gold-border p-6 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          style={{
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-gold font-mono text-[9px] mb-2 uppercase tracking-widest">Tutorial Step {step + 1}/{steps.length}</div>
          <h4 className="text-sm font-bold mb-2 text-white uppercase tracking-tight">{current.title}</h4>
          <p className="text-xs text-muted leading-relaxed mb-6">{current.body}</p>
          <div className="flex justify-between items-center">
            <button onClick={onClose} className="text-[10px] font-mono text-muted hover:text-white transition-colors">SKIP</button>
            <button 
              onClick={onNext}
              className="px-6 py-2 bg-gold/10 border border-gold/30 rounded-full text-[10px] font-mono text-gold hover:bg-gold/20 transition-all font-bold"
            >
              {step === steps.length - 1 ? 'COMPLETE' : 'NEXT'}
            </button>
          </div>
          
          {/* Connector Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gold/30" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CelestialEngine = () => {
  const elementKeys = Object.keys(ELEMENTS) as ElementKey[];

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full" />
      
      {/* Orbital Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-gold/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border border-gold/20 rounded-full border-dashed"
      />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-12 border border-gold/30 rounded-full"
      />
      
      {/* Central Sigil */}
      <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-[#CF995F] to-[#D4AF37] blur-md opacity-50 rounded-full" />
        <div className="relative w-full h-full border-2 border-gold rounded-full flex items-center justify-center bg-cosmic-bg">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-12 h-12 md:w-16 md:h-16 border border-gold/40 rounded-full flex items-center justify-center"
          >
            <div className="w-1 h-1 bg-gold rounded-full" />
          </motion.div>
          {/* Subtle Geometric Lines using CSS */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-full h-px bg-gold" />
            <div className="w-full h-px bg-gold rotate-60" />
            <div className="w-full h-px bg-gold rotate-120" />
          </div>
        </div>
      </div>

      {/* Orbiting Elements */}
      {elementKeys.map((key, i) => (
        <motion.div
          key={key}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -160px)`, // Position on orbit
            }}
            className="w-6 h-6"
          >
            <ElementVisualizer element={key} size="sm" />
          </motion.div>
        </motion.div>
      ))}

      {/* Floating Data Nodes (simplified) */}
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: i }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `rotate(${deg}deg) translate(0, -120px) rotate(-${deg}deg)`
          }}
          className="w-1 h-1 bg-gold rounded-full"
        />
      ))}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    email: ''
  });
  const [element, setElement] = useState<ElementKey | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistPos, setWaitlistPos] = useState(0);

  useEffect(() => {
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleNext = () => {
    if (step === 3) {
      // Deterministic logic for element based on birth date string length/content
      const keys: ElementKey[] = ['WATER', 'FIRE', 'EARTH', 'METAL', 'WOOD'];
      const index = (form.birthDate.length + form.birthPlace.length) % keys.length;
      setElement(keys[index]);
      setStep(4);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setWaitlistPos(Math.floor(Math.random() * 200) + 350); // Position between 350 and 550
  };

  const referralCode = form.email ? form.email.split('@')[0].toUpperCase() : 'BZ2026';
  const referralLink = `https://bazodiac.space/join?ref=${referralCode}`;

  const currentElement = element ? ELEMENTS[element] : null;

  const handleTutorialNext = () => {
    if (tutorialStep < 2) {
      setTutorialStep(prev => prev + 1);
    } else {
      setIsTutorialActive(false);
      setTutorialStep(0);
    }
  };

  return (
    <div className="min-h-screen selection:bg-gold/30">
      <Tutorial 
        active={isTutorialActive} 
        step={tutorialStep} 
        onClose={() => setIsTutorialActive(false)} 
        onNext={handleTutorialNext} 
      />
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-bg/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-display font-light tracking-[0.4em] text-lg text-white">BAZODIAC</span>
          </div>

          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] text-white/50">
            <a href="#engine" className="hover:text-white transition-colors">Signal</a>
            <a href="#bento" className="hover:text-white transition-colors">Engine</a>
            <a href="#onboarding" className="hover:text-white transition-colors">Access</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:block flex items-center gap-4">
            <button 
              onClick={() => setIsTutorialActive(true)}
              className="text-[10px] font-mono text-white/40 hover:text-gold transition-colors tracking-widest uppercase mr-6"
            >
              Start Tour
            </button>
            <button 
              onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2 border border-[#D4AF37]/40 rounded-full text-[11px] uppercase tracking-widest bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all"
            >
              Join Waitlist
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cosmic-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <a href="#engine" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display tracking-widest">SIGNAL</a>
            <a href="#bento" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display tracking-widest">ENGINE</a>
            <a href="#onboarding" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display tracking-widest">ACCESS</a>
            <button 
              onClick={() => { setIsMenuOpen(false); document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-10 py-4 border border-gold/40 rounded-full text-lg font-mono gold-gradient-text"
            >
              JOIN WAITLIST
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* Hero Section */}
        <section id="engine" className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <div className="max-w-4xl w-full text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-gold font-mono text-[10px] tracking-[0.3em] mb-4 uppercase">
                Confidential Prerelease · May 2026
              </div>
              <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6 uppercase tracking-tight">
                Ihre Sterne sagen „Ja“ — <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#CF995F] via-[#F1D18A] to-[#D4AF37] font-medium">
                  Was verrät Ihr BaZi über das Timing?
                </span>
              </h1>
              <p className="max-w-md mx-auto text-white/60 text-sm leading-relaxed mb-12">
                Bazodiac berechnet Ihren Cosmic Signature Pulse aus westlicher Astrologie, chinesischem BaZi und zyklischer Element-Dynamik — transparent, auditable und nicht fatalistisch.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-[#CF995F] to-[#D4AF37] text-black font-semibold rounded-full text-[12px] uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  Signature Pulse entdecken
                </button>
                <button 
                  onClick={() => document.getElementById('bento')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto text-white font-medium text-[11px] uppercase tracking-widest border-b border-white/20 pb-1 hover:border-gold/40 transition-colors"
                >
                  Visible Engine
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 border border-black flex items-center justify-center text-[8px]">LB</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[8px]">MJ</div>
                  <div className="w-6 h-6 rounded-full bg-amber-500 border border-black flex items-center justify-center text-[8px]">SK</div>
                </div>
                <span className="text-[10px] text-white/40 tracking-wider font-mono">4.500+ SIGNATUREN VORGEMERKT</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-20 pointer-events-none">
            <CelestialEngine />
          </div>
        </section>

        {/* Bento Grid */}
        <section id="bento" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Card 1: Engine Visualization */}
            <div id="visible-engine-card" className="md:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex items-center justify-between overflow-hidden relative group hover:bg-white/[0.05] transition-all">
              <div className="z-10 max-w-md">
                <div className="text-[10px] font-mono text-gold mb-1 tracking-widest">VISIBLE ENGINE</div>
                <h3 className="text-xl font-light mb-4 text-white uppercase tracking-tight">NASA-Datenfluss × BaZi-Logik</h3>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">
                  Echtzeit-Ephemeriden und Wu-Xing-Zyklen werden zu einer dynamischen Signatur verdichtet.
                </p>
                <div className="flex gap-4 items-center">
                  {(Object.keys(ELEMENTS) as ElementKey[]).map((key) => (
                    <motion.div
                      key={key}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
                    >
                      <ElementVisualizer element={key} size="sm" className="w-8 h-8" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative w-48 h-48 hidden lg:flex items-center justify-center bg-gold/5 rounded-full blur-2xl absolute right-12 top-1/2 -translate-y-1/2" />
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <div className="absolute w-24 h-24 border border-gold/20 rounded-full animate-pulse"></div>
                <div className="absolute w-16 h-16 border border-gold/40 rounded-full"></div>
                <div className="absolute w-4 h-4 bg-gold rounded-full blur-[4px]"></div>
              </div>
            </div>

            {/* Card 2: Formula Block */}
            <div className="md:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/[0.05] transition-all">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Computed Logic</div>
              <div className="font-mono text-[13px] py-4 leading-relaxed text-white/80">
                Signal(s) = 0.375·W(s)<br/>
                + 0.375·B(s) <br/>
                + 0.250·X(s)
              </div>
              <div className="text-[10px] uppercase text-gold tracking-tighter italic">Auditable. Deterministic.</div>
            </div>

            {/* Card 3: Status / Launch Gates */}
            <div className="md:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/[0.05] transition-all">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Launch Gates</div>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono">
                  <span className="text-white/60">Algo Core</span>
                  <span className="text-green-500">Stable</span>
                </div>
                <div className="w-full h-[1px] bg-white/10"></div>
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono">
                  <span className="text-white/60">API Scale</span>
                  <span className="text-white/40">88%</span>
                </div>
                <div className="w-full h-[1px] bg-white/10"></div>
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono">
                  <span className="text-white/60">Onboarding</span>
                  <span className="text-gold">Testing</span>
                </div>
              </div>
            </div>

            {/* Card 4: Founding Member Badge */}
            <div className="md:col-span-8 bg-linear-to-br from-white/[0.06] to-transparent border border-white/10 rounded-3xl p-8 flex items-center gap-8 hover:bg-white/[0.05] transition-all">
              <div className="w-16 h-16 rounded-full border-2 border-gold/50 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-sm text-gold font-bold">B</div>
              </div>
              <div className="max-w-md">
                <h4 className="text-sm uppercase tracking-widest text-gold mb-2 font-semibold">Founding Member Privilege</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Top 500 signups erhalten lebenslangen Gründerrabatt und priorisierten Beta-Zugriff auf das geschlossene Onboarding-Gate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Five Elements Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="mb-16 text-center">
            <h2 className="text-3xl mb-4">Das Wu-Xing System</h2>
            <p className="text-muted text-sm uppercase tracking-widest font-mono">Die Fünf Dynamischen Impulse</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(ELEMENTS) as ElementKey[]).map((key) => (
              <motion.div 
                key={key}
                whileHover={{ y: -5 }}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center group transition-all hover:bg-white/[0.05]"
              >
                <div className="w-20 h-20 mb-6">
                  <ElementVisualizer element={key} className="w-full h-full" />
                </div>
                <h4 className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: ELEMENTS[key].color }}>
                  {ELEMENTS[key].name}
                </h4>
                <p className="text-[10px] text-muted leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  {ELEMENTS[key].description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Onboarding Module */}
        <section id="onboarding" className="py-24 px-6 scroll-mt-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl mb-4">Reserve Your Signature</h2>
              <p className="text-muted text-sm uppercase tracking-widest font-mono">Micro-Diagnostic Flow</p>
            </div>

            <div className="bento-card min-h-[450px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex gap-2 mb-8 items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div 
                          key={s} 
                          className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-gold' : 'bg-white/10'}`} 
                        />
                      ))}
                      <span className="text-[10px] font-mono text-muted ml-2">{step}/5</span>
                    </div>

                    {step === 1 && (
                      <div className="flex-1">
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">Step 01 / Wann begann Ihr Zyklus?</label>
                        <h3 className="text-xl mb-8 normal-case font-sans">Geben Sie Ihr Geburtsdatum ein.</h3>
                        <input 
                          type="date" 
                          value={form.birthDate}
                          onChange={(e) => setForm({...form, birthDate: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-gold/40 focus:ring-0 transition-all outline-hidden text-[#f8f9fa]"
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex-1">
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">Step 02 / Welche Uhrzeit präzisiert Ihr Timing?</label>
                        <h3 className="text-xl mb-8 normal-case font-sans">Falls bekannt, Geburtszeit angeben.</h3>
                        <input 
                          type="time" 
                          value={form.birthTime}
                          onChange={(e) => setForm({...form, birthTime: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-gold/40 focus:ring-0 transition-all outline-hidden text-[#f8f9fa]"
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="flex-1">
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">Step 03 / Welcher Ort verankert Ihre Signatur?</label>
                        <h3 className="text-xl mb-8 normal-case font-sans">Geburtsort für die geographische Matrix.</h3>
                        <input 
                          type="text" 
                          placeholder="z.B. Berlin, Deutschland"
                          value={form.birthPlace}
                          onChange={(e) => setForm({...form, birthPlace: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-gold/40 focus:ring-0 transition-all outline-hidden text-[#f8f9fa]"
                        />
                      </div>
                    )}

                    {step === 4 && currentElement && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex-1"
                      >
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">Step 04 / Erste Micro-Insight</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div 
                            className="p-6 rounded-2xl border"
                            style={{ borderColor: `${currentElement.color}40`, backgroundColor: `${currentElement.color}05` }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: currentElement.color, color: currentElement.color }}>
                                PROVISIONELLE ANALYSE
                              </span>
                            </div>
                            <h3 className="text-2xl mb-2 normal-case font-sans font-bold" style={{ color: currentElement.color }}>
                              {currentElement.name}
                            </h3>
                            <p className="text-muted leading-relaxed text-sm">
                              “Ihre Signatur deutet auf <span className="text-white/90">{currentElement.description}</span> hin. Das finale Timing-Profil wird im Beta-Rollout präzise berechnet.”
                            </p>
                          </div>
                          
                          <div className="bg-white/5 border border-white/10 rounded-2xl h-full min-h-[150px]">
                            <ElementVisualizer element={element!} className="h-full w-full" />
                          </div>
                        </div>
                        <p className="mt-6 text-[10px] font-mono text-muted text-center italic">
                          Preview-Logik — finale Berechnung erfolgt im geschlossenen Beta-System.
                        </p>
                      </motion.div>
                    )}

                    {step === 5 && (
                      <div className="flex-1">
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">Final Step / Reservierung abschließen</label>
                        <h3 className="text-xl mb-2 normal-case font-sans">Geben Sie Ihre E-Mail an, um die Signatur zu verankern.</h3>
                        <p className="text-muted text-sm mb-8">Wir informieren Sie, sobald Ihr Onboarding-Gate geöffnet ist.</p>
                        <form onSubmit={handleSubmit}>
                          <input 
                            required
                            type="email" 
                            placeholder="mail@beispiel.com"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-gold/40 focus:ring-0 transition-all outline-hidden text-[#f8f9fa] mb-4"
                          />
                          <button 
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gold text-cosmic-bg font-bold tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl"
                          >
                            SIGNATUR RESERVIEREN
                          </button>
                        </form>
                      </div>
                    )}

                    <div className="mt-12 flex justify-between">
                      {step > 1 && (
                        <button 
                          onClick={() => setStep(prev => prev - 1)}
                          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-xs font-mono tracking-widest"
                        >
                          <ChevronLeft size={16} /> ZURÜCK
                        </button>
                      )}
                      {step < 5 && (
                        <button 
                          onClick={handleNext}
                          disabled={step === 1 && !form.birthDate || step === 3 && !form.birthPlace}
                          className="ml-auto flex items-center gap-2 gold-gradient-text hover:brightness-125 transition-all text-xs font-mono tracking-widest disabled:opacity-30"
                        >
                          WEITER <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl gold-gradient-text mb-2">✓ SIGNAL RESERVED</h2>
                    <p className="text-muted text-sm font-mono tracking-widest uppercase mb-12">Transmission Stable</p>

                    <div className="grid grid-cols-2 gap-4 mb-12">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-muted mb-1 font-mono">POSITION</span>
                        <span className="text-2xl font-display font-bold">#{waitlistPos}</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-muted mb-1 font-mono">STATUS</span>
                        <span className="text-xs font-display font-bold text-gold uppercase">Founding Member</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-left">
                      <p className="text-xs font-mono text-muted tracking-widest uppercase">Referral Link</p>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono truncate overflow-hidden">
                          {referralLink}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(referralLink);
                            const btn = document.getElementById('copy-btn');
                            if (btn) {
                              btn.innerText = 'COPIED!';
                              setTimeout(() => { if (btn) btn.innerText = ''; }, 2000);
                            }
                          }}
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <Copy size={16} />
                          <span id="copy-btn" className="text-[10px] font-mono text-gold transition-all"></span>
                        </button>
                        <button 
                          onClick={() => {
                            const text = `Ich habe gerade meine Cosmic Signature bei Bazodiac reserviert. Platz #${waitlistPos} gesichert. Join the sync: ${referralLink} #Bazodiac #CosmicSignature`;
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                      <h4 className="text-xs font-mono tracking-[0.2em] mb-4 text-muted uppercase">Rewards Track</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg opacity-50">
                          <span className="text-xs">3 Referrals</span>
                          <span className="text-[10px] font-mono text-gold">SKIP THE QUEUE</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg opacity-50">
                          <span className="text-xs">10 Referrals</span>
                          <span className="text-[10px] font-mono text-gold">1 YEAR PRO</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-8 opacity-60">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-display font-bold">4.5k+</span>
                  <span className="text-[8px] font-mono tracking-widest uppercase mt-1">Users Sync</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-display font-bold">500</span>
                  <span className="text-[8px] font-mono tracking-widest uppercase mt-1">Weekly Access</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 bg-linear-to-b from-transparent to-black/40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bento-card border-gold/10">
              <p className="text-lg italic text-white/80 mb-6 leading-relaxed">
                “Endlich fühlt sich Astrologie nicht wie Content-Recycling an, sondern wie ein strukturiertes Reflexionsmodell.”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-xs text-gold">
                  LP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lena</h4>
                  <p className="text-[10px] text-muted font-mono tracking-widest">UX DESIGNER · BERLIN</p>
                </div>
              </div>
            </div>
            <div className="bento-card border-gold/10">
              <p className="text-lg italic text-white/80 mb-6 leading-relaxed">
                “Die Formel-Transparenz war der Punkt, an dem ich aufgehört habe, es als Esoterik-App zu sehen.”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-xs text-gold">
                  MS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Marc</h4>
                  <p className="text-[10px] text-muted font-mono tracking-widest">STRATEGY CONSULTANT · MÜNCHEN</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authenticity Section */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl mb-12">Warum der Zugang limitiert ist</h2>
            <p className="text-muted mb-16 text-lg leading-relaxed">
              Wir lassen wöchentlich nur 500 neue Nutzer zu, um die Präzision der API-Berechnungen, die Serverstabilität und die Qualität des Onboardings für jeden Einzelnen zu garantieren.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap size={24} className="text-gold" />
                </div>
                <h4 className="font-bold">API-Rechenlast</h4>
                <p className="text-xs text-muted">Komplexe Echtzeitberechnungen werden schrittweise skaliert.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Cpu size={24} className="text-gold" />
                </div>
                <h4 className="font-bold">Qualitätssicherung</h4>
                <p className="text-xs text-muted">Early Adopter Feedback fließt direkt in die Beta ein.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe size={24} className="text-gold" />
                </div>
                <h4 className="font-bold">Support-Kapazität</h4>
                <p className="text-xs text-muted">Persönliches Onboarding ist bewusst limitiert.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 bg-black/50 overflow-hidden relative">
          <div className="max-w-3xl mx-auto z-10 relative">
            <h2 className="text-3xl mb-16 text-center">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Ist Bazodiac eine klassische Astrologie-App?",
                  a: "Nein. Bazodiac behandelt symbolische Systeme als analytische Reflexionsmodelle, nicht als deterministische Schicksalsansprüche."
                },
                {
                  q: "Was passiert mit meinen Geburtsdaten?",
                  a: "Ihre Daten werden ausschließlich zur Vorbereitung Ihrer persönlichen Signal-Vorschau verwendet. Wir verfolgen eine strikte Privacy-First-Policy."
                },
                {
                  q: "Warum ist der Zugang limitiert?",
                  a: "API-Präzision, phasenweiser Rollout und ein individuelles Onboarding-Erlebnis stehen für uns vor schnellem Wachstum."
                },
                {
                  q: "Was bringt mir eine Empfehlung?",
                  a: "Empfehlungen verbessern Ihre Wartelistenposition und schalten exklusive Prerelease-Vorteile frei."
                },
                {
                  q: "Wann startet der Early Access?",
                  a: "Der kontrollierte Beta-Rollout beginnt in 30 Tagen (Juni 2026), basierend auf der Stabilität unserer Launch-Gates."
                }
              ].map((item, i) => (
                <div key={i} className="bento-card bg-white/[0.02] border-white/[0.05]">
                  <h4 className="text-sm font-bold text-white mb-3 normal-case tracking-normal">{item.q}</h4>
                  <p className="text-xs text-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span>System: Online</span>
            </div>
            <span>NASA-Ephemerides Sync: Active</span>
            <span>Latency: 24ms</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <span>Built for thinkers, not believers.</span>
            <span className="text-white/60">© 2026 Bazodiac Intelligence</span>
          </div>
        </div>
      </footer>

      {/* Mobile Floating CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <button 
          onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-4 bg-linear-to-br from-[#CF995F] to-[#D4AF37] text-cosmic-bg rounded-xl font-bold tracking-widest text-xs shadow-2xl flex items-center justify-center gap-2"
        >
          JOIN WAITLIST <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
