/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Plus,
  ExternalLink
} from 'lucide-react';
import { CosmicWeather } from './components/CosmicWeather';

// --- Constants & Types ---

type Language = 'de' | 'en';

const ELEMENT_CONFIG = {
  WATER: { color: '#38bdf8' },
  FIRE: { color: '#ef4444' },
  EARTH: { color: '#c08457' },
  METAL: { color: '#e5e7eb' },
  WOOD: { color: '#22c55e' },
};

type ElementKey = keyof typeof ELEMENT_CONFIG;
const elementKeys = Object.keys(ELEMENT_CONFIG) as ElementKey[];

const translations = {
  de: {
    nav: {
      signal: 'Signal',
      engine: 'Engine',
      access: 'Access',
      faq: 'FAQ',
      tour: 'Start Tour',
      join: 'Warteliste'
    },
    hero: {
      confidential: 'Vertraulicher Prerelease · Mai 2026',
      headline_1: 'Ihre Sterne sagen „Ja“ —',
      headline_2: 'Was verrät Ihr BaZi über das Timing?',
      subheadline: 'Bazodiac berechnet Ihren Cosmic Signature Pulse aus westlicher Astrologie, chinesischem BaZi und zyklischer Element-Dynamik — transparent, auditable und nicht fatalistisch.',
      cta_primary: 'Signature Pulse entdecken',
      cta_secondary: 'Visible Engine',
      signatures: '4.500+ SIGNATUREN VORGEMERKT'
    },
    bento: {
      engine_title: 'VISIBLE ENGINE',
      engine_subtitle: 'NASA-Datenfluss × BaZi-Logik',
      engine_desc: 'Echtzeit-Ephemeriden und Wu-Xing-Zyklen werden zu einer dynamischen Signatur verdichtet.',
      logic_title: 'Computed Logic',
      logic_footer: 'Auditable. Deterministisch.',
      gates_title: 'Launch Gates',
      privilege_title: 'Founding Member Privilege',
      privilege_desc: 'Top 500 signups erhalten lebenslangen Gründerrabatt und priorisierten Beta-Zugriff auf das geschlossene Onboarding-Gate.'
    },
    elements: {
      title: 'Das Wu-Xing System',
      subtitle: 'Die Fünf Dynamischen Impulse',
      WATER: { name: 'Wasser', description: 'Adaptive Wahrnehmung, zyklische Tiefe und strategische Geduld.' },
      FIRE: { name: 'Feuer', description: 'Dynamische Inspiration, expansive Energie und transformative Präsenz.' },
      EARTH: { name: 'Erde', description: 'Stabile Struktur, nährende Substanz und verlässliche Zentrierung.' },
      METAL: { name: 'Metall', description: 'Analytische Klarheit, präzise Grenzen und strukturelle Integrität.' },
      WOOD: { name: 'Holz', description: 'Vitales Wachstum, flexible Expansion und kreative Erneuerung.' },
    },
    onboarding: {
      title: 'Reservieren Sie Ihre Signatur',
      subtitle: 'Fusion Flow',
      step1_label: 'Step 01 / Wann hast du das Licht der Welt erblickt?',
      step1_title: 'Geben Sie Ihr Geburtsdatum ein.',
      step2_label: 'Step 02 / Welche Uhrzeit präzisiert Ihr Timing?',
      step2_title: 'Falls bekannt, Geburtszeit angeben.',
      step3_label: 'Step 03 / Welcher Ort verankert Ihre Signatur?',
      step3_title: 'Geburtsort für die geographische Matrix.',
      step3_placeholder: 'z.B. Berlin, Deutschland',
      step4_label: 'Step 04 / Erste Micro-Insight',
      step4_badge: 'PROV. ANALYSE',
      step4_desc: '“Ihre Signatur deutet auf {element} hin.”',
      step4_detail: 'Das finale Timing-Profil wird im Beta-Rollout präzise berechnet.',
      step4_footer: 'Preview-Logik — finale Berechnung erfolgt im geschlossenen Beta-System.',
      step5_label: 'Final Step / Reservierung abschließen',
      step5_title: 'Geben Sie Ihre E-Mail an, um die Signatur zu verankern.',
      step5_desc: 'Wir informieren Sie, sobald Ihr Onboarding-Gate geöffnet ist.',
      step5_placeholder: 'mail@beispiel.com',
      step5_cta: 'SIGNATUR RESERVIEREN',
      back: 'ZURÜCK',
      next: 'WEITER'
    },
    success: {
      reserved: 'SIGNAL RESERVIERT',
      stable: 'Übertragung Stabil',
      position: 'POSITION',
      status: 'STATUS',
      referral_title: 'Referral Link',
      copied: 'KOPIERT!',
      founding: 'Founding Member',
      rewards: 'Rewards Track',
      rewards_3: '3 Referrals',
      rewards_3_desc: 'SKIP THE QUEUE',
      rewards_10: '10 Referrals',
      rewards_10_desc: '1 YEAR PRO',
      users_sync: 'Users Sync',
      weekly_access: 'Weekly Access'
    },
    testimonials: {
      lena: '“Endlich fühlt sich Astrologie nicht wie Content-Recycling an, sondern wie ein strukturiertes Reflexionsmodell.”',
      marc: '“Die Formel-Transparenz war der Punkt, an dem ich aufgehört habe, es als Esoterik-App zu sehen.”'
    },
    authenticity: {
      title: 'Warum der Zugang limitiert ist',
      body: 'Wir lassen wöchentlich nur 500 neue Nutzer zu, um die Präzision der API-Berechnungen, die Serverstabilität und die Qualität des Onboardings für jeden Einzelnen zu garantieren.',
      api_title: 'API-Rechenlast',
      api_desc: 'Komplexe Echtzeitberechnungen werden schrittweise skaliert.',
      qa_title: 'Qualitätssicherung',
      qa_desc: 'Early Adopter Feedback fließt direkt in die Beta ein.',
      support_title: 'Support-Kapazität',
      support_desc: 'Persönliches Onboarding ist bewusst limitiert.'
    },
    faq: {
      title: 'FAQ',
      q1: "Ist Bazodiac eine klassische Astrologie-App?",
      a1: "Nein. Bazodiac behandelt symbolische Systeme als analytische Reflexionsmodelle, nicht als deterministische Schicksalsansprüche.",
      q2: "Was passiert mit meinen Geburtsdaten?",
      a2: "Ihre Daten werden ausschließlich zur Vorbereitung Ihrer persönlichen Signal-Vorschau verwendet. Wir verfolgen eine strikte Privacy-First-Policy.",
      q3: "Warum ist der Zugang limitiert?",
      a3: "API-Präzision, phasenweiser Rollout und ein individuelles Onboarding-Erlebnis stehen für uns vor schnellem Wachstum.",
      q4: "Was bringt mir eine Empfehlung?",
      a4: "Empfehlungen verbessern Ihre Wartelistenposition und schalten exklusive Prerelease-Vorteile frei.",
      q5: "Wann startet der Early Access?",
      a5: "Der kontrollierte Beta-Rollout beginnt in 30 Tagen (Juni 2026), basierend auf der Stabilität unserer Launch-Gates."
    },
    footer: {
      system_online: 'System: Online',
      nasa_sync: 'NASA-Ephemerides Sync: Aktiv',
      latency: 'Latenz: 24ms',
      thinkers: 'Built for thinkers, not believers.',
      copyright: '© 2026 Bazodiac Intelligence'
    },
    tutorial: {
      step1_title: 'Cosmic Signature Pulse',
      step1_body: 'Hier berechnet unser System Ihren Pulse. Es ist die mathematische Synthese Ihrer westlichen und östlichen Daten.',
      step2_title: 'Visible Engine',
      step2_body: 'Wir nutzen echte NASA-Ephemeriden. Keine Schätzungen, kein Voodoo. Rein deterministische Berechnungen.',
      step3_title: 'Waitlist & Early Access',
      step3_body: 'Sichern Sie sich Ihren Platz. Das Onboarding ist limitiert, um Präzision und persönliche Betreuung zu garantieren.',
      skip: 'ÜBERSPRINGEN',
      next: 'WEITER',
      complete: 'ABSCHLIESSEN',
      step_label: 'Tutorial Schritt'
    },
    mobile: {
      join: 'WARTELISTE BEITRETEN'
    }
  },
  en: {
    nav: {
      signal: 'Signal',
      engine: 'Engine',
      access: 'Access',
      faq: 'FAQ',
      tour: 'Start Tour',
      join: 'Waitlist'
    },
    hero: {
      confidential: 'Confidential Prerelease · May 2026',
      headline_1: 'Your stars say "yes" —',
      headline_2: 'What does your BaZi reveal about timing?',
      subheadline: 'Bazodiac computes your Cosmic Signature Pulse from Western astrology, Chinese BaZi, and cyclic element dynamics — transparent, auditable, and non-fatalistic.',
      cta_primary: 'Discover Signature Pulse',
      cta_secondary: 'Visible Engine',
      signatures: '4,500+ SIGNATURES PENDING'
    },
    bento: {
      engine_title: 'VISIBLE ENGINE',
      engine_subtitle: 'NASA Data Flow × BaZi Logic',
      engine_desc: 'Real-time ephemerides and Wu Xing cycles are condensed into a dynamic signature.',
      logic_title: 'Computed Logic',
      logic_footer: 'Auditable. Deterministic.',
      gates_title: 'Launch Gates',
      privilege_title: 'Founding Member Privilege',
      privilege_desc: 'Top 500 signups receive lifetime founder discounts and prioritized beta access to the closed onboarding gate.'
    },
    elements: {
      title: 'The Wu-Xing System',
      subtitle: 'The Five Dynamic Impulses',
      WATER: { name: 'Water', description: 'Adaptive perception, cyclic depth, and strategic patience.' },
      FIRE: { name: 'Fire', description: 'Dynamic inspiration, expansive energy, and transformative presence.' },
      EARTH: { name: 'Earth', description: 'Stable structure, nourishing substance, and reliable centering.' },
      METAL: { name: 'Metal', description: 'Analytical clarity, precise boundaries, and structural integrity.' },
      WOOD: { name: 'Wood', description: 'Vital growth, flexible expansion, and creative renewal.' },
    },
    onboarding: {
      title: 'Reserve Your Signature',
      subtitle: 'Fusion Flow',
      step1_label: 'Step 01 / When did your cycle begin?',
      step1_title: 'Enter your birth date.',
      step2_label: 'Step 02 / What time clarifies your timing?',
      step2_title: 'If known, enter birth time.',
      step3_label: 'Step 03 / Which place anchors your signature?',
      step3_title: 'Birthplace for the geographic matrix.',
      step3_placeholder: 'e.g. London, UK',
      step4_label: 'Step 04 / First Micro-Insight',
      step4_badge: 'PROV. ANALYSIS',
      step4_desc: '“Your signature points to {element}.”',
      step4_detail: 'The final timing profile will be calculated precisely in the beta rollout.',
      step4_footer: 'Preview logic — final calculation occurs in the closed beta system.',
      step5_label: 'Final Step / Complete Reservation',
      step5_title: 'Enter your email to anchor your signature.',
      step5_desc: 'We will inform you as soon as your onboarding gate is open.',
      step5_placeholder: 'mail@example.com',
      step5_cta: 'RESERVE SIGNATURE',
      back: 'BACK',
      next: 'NEXT'
    },
    success: {
      reserved: 'SIGNAL RESERVED',
      stable: 'Transmission Stable',
      position: 'POSITION',
      status: 'STATUS',
      referral_title: 'Referral Link',
      copied: 'COPIED!',
      founding: 'Founding Member',
      rewards: 'Rewards Track',
      rewards_3: '3 Referrals',
      rewards_3_desc: 'SKIP THE QUEUE',
      rewards_10: '10 Referrals',
      rewards_10_desc: '1 YEAR PRO',
      users_sync: 'Users Sync',
      weekly_access: 'Weekly Access'
    },
    testimonials: {
      lena: '“Finally, astrology doesn\'t feel like content recycling, but like a structured reflection model.”',
      marc: '“The formula transparency was the point where I stopped seeing it as an esoteric app.”'
    },
    authenticity: {
      title: 'Why Access is Limited',
      body: 'We only allow 500 new users per week to guarantee the precision of API calculations, server stability, and the quality of onboarding for every single person.',
      api_title: 'API Load',
      api_desc: 'Complex real-time calculations are scaled incrementally.',
      qa_title: 'Quality Assurance',
      qa_desc: 'Early adopter feedback flows directly into the beta.',
      support_title: 'Support Capacity',
      support_desc: 'Personal onboarding is intentionally limited.'
    },
    faq: {
      title: 'FAQ',
      q1: "Is Bazodiac a classical astrology app?",
      a1: "No. Bazodiac treats symbolic systems as analytical reflection models, not as deterministic fate claims.",
      q2: "What happens to my birth data?",
      a2: "Your data is exclusively used to prepare your personal signal preview. We follow a strict privacy-first policy.",
      q3: "Why is access limited?",
      a3: "API precision, phased rollout, and an individual onboarding experience are more important to us than fast growth.",
      q4: "What does a referral get me?",
      a4: "Referrals improve your waitlist position and unlock exclusive prerelease benefits.",
      q5: "When does early access start?",
      a5: "The controlled beta rollout begins in 30 days (June 2026), based on the stability of our launch gates."
    },
    footer: {
      system_online: 'System: Online',
      nasa_sync: 'NASA-Ephemerides Sync: Active',
      latency: 'Latency: 24ms',
      thinkers: 'Built for thinkers, not believers.',
      copyright: '© 2026 Bazodiac Intelligence'
    },
    tutorial: {
      step1_title: 'Cosmic Signature Pulse',
      step1_body: 'Our system calculates your pulse here. It is the mathematical synthesis of your Western and Eastern data.',
      step2_title: 'Visible Engine',
      step2_body: 'We use real NASA ephemerides. No estimates, no voodoo. Pure deterministic calculations.',
      step3_title: 'Waitlist & Early Access',
      step3_body: 'Secure your spot. Onboarding is limited to ensure precision and personal support.',
      skip: 'SKIP',
      next: 'NEXT',
      complete: 'COMPLETE',
      step_label: 'Tutorial Step'
    },
    mobile: {
      join: 'JOIN WAITLIST'
    }
  }
};

interface FormState {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  email: string;
}

interface MousePosition {
  x: number;
  y: number;
}

// --- Dynamic Background Component ---

const CosmicBackground = () => {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [springPos, setSpringPos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth mouse following
  useEffect(() => {
    const interval = setInterval(() => {
      setSpringPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.05,
        y: prev.y + (mousePos.y - prev.y) * 0.05,
      }));
    }, 16);
    return () => clearInterval(interval);
  }, [mousePos]);

  // Generate stable star properties once
  const stars = useMemo(() => {
    return [...Array(60)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#050505] overflow-hidden pointer-events-none">
      {/* Dynamic Gradients */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 bg-indigo-900/50 transition-transform duration-500"
        style={{ 
          transform: `translate(${springPos.x / 12}px, ${springPos.y / 12}px)`,
          top: '-10%',
          left: '-10%',
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 bg-gold/20 transition-transform duration-700"
        style={{ 
          transform: `translate(${springPos.x / 8}px, ${springPos.y / 8}px)`,
          bottom: '10%',
          right: '10%',
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ 
        backgroundImage: `linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)`,
        backgroundSize: '150px 150px'
      }} />

      {/* Geometry Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <pattern id="grid-pattern" width="300" height="300" patternUnits="userSpaceOnUse">
          <path d="M 300 0 L 0 0 0 300" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="150" cy="150" r="1.5" fill="#D4AF37" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        
        {/* Celestial Conic Geometry */}
        <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="1 10" opacity="0.3" />
        <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 20" opacity="0.2" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.1" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.1" />
      </svg>

      {/* Reactive Star Field */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.1 }}
          animate={{ 
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: star.duration, 
            repeat: Infinity,
            delay: star.delay
          }}
          className="absolute rounded-full bg-gold/60"
          style={{ 
            width: star.size,
            height: star.size,
            top: `${star.y}%`,
            left: `${star.x}%`,
            transform: `translate(${(springPos.x - window.innerWidth / 2) * 0.02 * (star.id % 10)}px, ${(springPos.y - window.innerHeight / 2) * 0.02 * (star.id % 10)}px)`,
            boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(212, 175, 55, 0.4)` : 'none'
          }}
        />
      ))}

      {/* Mouse Interaction Layer */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: `radial-gradient(circle 500px at ${springPos.x}px ${springPos.y}px, transparent 0%, rgba(5,5,5,0.85) 100%)`
        }}
      />
    </div>
  );
};

// --- Components ---

const ElementVisualizer = ({ element, className = "", size = "full" }: { element: ElementKey, className?: string, size?: "sm" | "full" }) => {
  const config = ELEMENT_CONFIG[element];
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
    >
      {/* Ambient Glow */}
      <motion.div 
        animate={{ 
          opacity: isHovered ? [0.15, 0.4, 0.15] : [0.05, 0.15, 0.05],
          scale: isHovered ? [1.2, 1.6, 1.2] : [1, 1.2, 1] 
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 blur-3xl opacity-10"
        style={{ backgroundColor: config.color }}
      />
      
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 100" className={size === "sm" ? "w-8 h-8" : "w-full h-full relative z-10"}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {element === 'WATER' && (
            <motion.g filter="url(#glow)">
              {[...Array(isHovered ? 4 : 3)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M15,${40 + i * 10} Q35,${20 + i * 10} 50,${40 + i * 10} T85,${40 + i * 10}`}
                  fill="none"
                  stroke={config.color}
                  strokeWidth={isHovered ? "0.6" : "0.3"}
                  strokeLinecap="round"
                  opacity={0.2 + (i * 0.15)}
                  animate={{ 
                    d: isHovered ? [
                      `M10,${40 + i * 10} Q30,${5 + i * 10} 50,${40 + i * 10} T90,${40 + i * 10}`,
                      `M10,${40 + i * 10} Q30,${75 + i * 10} 50,${40 + i * 10} T90,${40 + i * 10}`,
                      `M10,${40 + i * 10} Q30,${5 + i * 10} 50,${40 + i * 10} T90,${40 + i * 10}`
                    ] : [
                      `M15,${40 + i * 10} Q35,${30 + i * 10} 50,${40 + i * 10} T85,${40 + i * 10}`,
                      `M15,${40 + i * 10} Q35,${50 + i * 10} 50,${40 + i * 10} T85,${40 + i * 10}`,
                      `M15,${40 + i * 10} Q35,${30 + i * 10} 50,${40 + i * 10} T85,${40 + i * 10}`
                    ]
                  }}
                  transition={{ duration: isHovered ? 3 - i * 0.5 : 5 - i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </motion.g>
          )}

          {element === 'FIRE' && (
            <motion.g filter="url(#glow)">
              {[...Array(isHovered ? 16 : 8)].map((_, i) => (
                <motion.path
                  key={i}
                  d="M50,85 Q45,60 50,30 Q55,60 50,85"
                  fill={config.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 0.7, 0],
                    scale: [0.1, 1.3, 0.1],
                    x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 50],
                    y: [-5, -70]
                  }}
                  transition={{ 
                    duration: isHovered ? 1.2 : 2.5, 
                    repeat: Infinity, 
                    delay: i * 0.15,
                    ease: "easeOut"
                  }}
                  style={{ filter: `blur(${Math.random() * 2}px)` }}
                />
              ))}
            </motion.g>
          )}

          {element === 'EARTH' && (
            <motion.g animate={{ rotate: isHovered ? 90 : 0 }} transition={{ duration: 1.5, ease: "anticipate" }}>
              <rect x="25" y="25" width="50" height="50" fill="none" stroke={config.color} strokeWidth="0.1" opacity="0.2" />
              <motion.path
                d="M35,35 L65,35 L65,65 L35,65 L35,35"
                fill="none"
                stroke={config.color}
                strokeWidth={isHovered ? "1.5" : "0.8"}
                animate={{ 
                  pathLength: [0.3, 1, 0.3],
                  strokeWidth: isHovered ? [1.5, 2, 1.5] : [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <path d="M50,25 L50,75 M25,50 L75,50" stroke={config.color} strokeWidth="0.1" opacity="0.4" />
            </motion.g>
          )}

          {element === 'METAL' && (
            <motion.g>
              <circle cx="50" cy="50" r="35" fill="none" stroke={config.color} strokeWidth="0.1" opacity="0.2" />
              <motion.circle
                cx="50" cy="50" r="28"
                fill="none"
                stroke={config.color}
                strokeWidth={isHovered ? "2" : "1"}
                strokeDasharray="2, 98"
                animate={{ rotate: 360 }}
                transition={{ duration: isHovered ? 2 : 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="50" cy="50" r="22"
                fill="none"
                stroke={config.color}
                strokeWidth="0.2"
                strokeDasharray="5, 15"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <circle cx="50" cy="50" r="2" fill={config.color} />
            </motion.g>
          )}

          {element === 'WOOD' && (
            <motion.g>
              <path d="M50,90 L50,20" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.3" />
              {[1, 2, 3].map((i) => (
                <motion.path
                  key={i}
                  d={`M50,${85 - i * 20} L${50 - i * 8},${70 - i * 20} M50,${85 - i * 20} L${50 + i * 8},${70 - i * 20}`}
                  fill="none"
                  stroke={config.color}
                  strokeWidth={isHovered ? "1.2" : "0.6"}
                  strokeLinecap="round"
                  animate={{ 
                    pathLength: isHovered ? [0.6, 1, 0.6] : 1,
                    opacity: isHovered ? [0.4, 1, 0.4] : 0.6
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </motion.g>
          )}
        </svg>

        {isHovered && size !== "sm" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 text-[10px] font-mono text-white/60 tracking-widest uppercase"
          >
            {element}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Tutorial = ({ active, step, onClose, onNext, t }: { active: boolean, step: number, onClose: () => void, onNext: () => void, t: any }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const steps = [
    {
      targetId: 'engine',
      title: t('tutorial.step1_title'),
      body: t('tutorial.step1_body'),
      offset: { y: 200, x: 0 }
    },
    {
      targetId: 'visible-engine-card',
      title: t('tutorial.step2_title'),
      body: t('tutorial.step2_body'),
      offset: { y: 0, x: 0 }
    },
    {
      targetId: 'onboarding',
      title: t('tutorial.step3_title'),
      body: t('tutorial.step3_body'),
      offset: { y: 0, x: 0 }
    }
  ];

  useEffect(() => {
    if (active) {
      setShowSuccess(false);
      const current = steps[step > steps.length - 1 ? steps.length - 1 : step];
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

  const handleComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!active) return null;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <AnimatePresence mode="wait">
        <motion.div
          key={showSuccess ? 'success' : step}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="absolute z-10 pointer-events-auto w-72 bg-cosmic-bg gold-border p-6 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)] flex flex-col items-center text-center"
          style={{
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {showSuccess ? (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-gold" size={24} />
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Tutorial Complete!</h4>
            </motion.div>
          ) : (
            <>
              <div className="w-full text-left">
                <div className="text-gold font-mono text-[9px] mb-2 uppercase tracking-widest">{t('tutorial.step_label')} {step + 1}/{steps.length}</div>
                <h4 className="text-sm font-bold mb-2 text-white uppercase tracking-tight">{current.title}</h4>
                <p className="text-xs text-muted leading-relaxed mb-6">{current.body}</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <button onClick={onClose} className="text-[10px] font-mono text-muted hover:text-white transition-colors">{t('tutorial.skip')}</button>
                <button 
                  onClick={step === steps.length - 1 ? handleComplete : onNext}
                  className="px-6 py-2 bg-gold/10 border border-gold/30 rounded-full text-[10px] font-mono text-gold hover:bg-gold/20 transition-all font-bold"
                >
                  {step === steps.length - 1 ? t('tutorial.complete') : t('tutorial.next')}
                </button>
              </div>
              
              {/* Connector Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gold/30" />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CelestialEngine = () => {

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
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gold blur-3xl rounded-full" 
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#CF995F] to-[#D4AF37] blur-md opacity-50 rounded-full" />
        <div className="relative w-full h-full border-2 border-gold rounded-full flex items-center justify-center bg-cosmic-bg overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20"
            style={{ 
              backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(212, 175, 55, 0.1) 100%), 
                                repeating-conic-gradient(from 0deg, transparent 0deg 30deg, rgba(212, 175, 55, 0.05) 31deg 32deg)`
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-12 h-12 md:w-16 md:h-16 border border-gold/40 rounded-full flex items-center justify-center z-10"
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
            duration: 25 + i * 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -${180 + i * 20}px)`, // Spread orbits
            }}
            className="group pointer-events-auto"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gold/5 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
              <ElementVisualizer element={key} size="sm" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" />
            </div>
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
  const [lang, setLang] = useState<Language>('de');
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

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[lang];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

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

  const currentElement = element ? ELEMENT_CONFIG[element] : null;

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
      <CosmicBackground />
      <Tutorial 
        active={isTutorialActive} 
        step={tutorialStep} 
        onClose={() => setIsTutorialActive(false)} 
        onNext={handleTutorialNext} 
        t={t}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-bg/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-display font-light tracking-[0.4em] text-lg text-white">BAZODIAC</span>
          </div>

          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] text-white/50">
            <a href="#engine" className="hover:text-white transition-colors">{t('nav.signal')}</a>
            <a href="#bento" className="hover:text-white transition-colors">{t('nav.engine')}</a>
            <a href="#onboarding" className="hover:text-white transition-colors">{t('nav.access')}</a>
            <a href="#faq" className="hover:text-white transition-colors">{t('nav.faq')}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 bg-white/5 mr-4 scale-90">
              <button 
                onClick={() => setLang('de')}
                className={`px-3 py-1 rounded-full text-[9px] font-mono transition-all ${lang === 'de' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
              >
                DE
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-[9px] font-mono transition-all ${lang === 'en' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <button 
              onClick={() => setIsTutorialActive(true)}
              className="text-[10px] font-mono text-white/40 hover:text-gold transition-colors tracking-widest uppercase mr-6"
            >
              {t('nav.tour')}
            </button>
            <button 
              onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2 border border-[#D4AF37]/40 rounded-full text-[11px] uppercase tracking-widest bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all"
            >
              {t('nav.join')}
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
            <div className="flex items-center gap-4 border border-white/10 rounded-full p-1 bg-white/5 mb-8">
              <button onClick={() => setLang('de')} className={`px-6 py-2 rounded-full text-xs font-mono transition-all ${lang === 'de' ? 'bg-gold text-black' : 'text-white/40'}`}>DE</button>
              <button onClick={() => setLang('en')} className={`px-6 py-2 rounded-full text-xs font-mono transition-all ${lang === 'en' ? 'bg-gold text-black' : 'text-white/40'}`}>EN</button>
            </div>
            <a href="#engine" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display tracking-widest">{t('nav.signal').toUpperCase()}</a>
            <a href="#bento" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display tracking-widest">{t('nav.engine').toUpperCase()}</a>
            <a href="#onboarding" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display tracking-widest">{t('nav.access').toUpperCase()}</a>
            <button 
              onClick={() => { setIsMenuOpen(false); document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-10 py-4 border border-gold/40 rounded-full text-lg font-mono gold-gradient-text"
            >
              {t('mobile.join')}
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
                {t('hero.confidential')}
              </div>
              <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6 uppercase tracking-tight">
                {t('hero.headline_1')} <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#CF995F] via-[#F1D18A] to-[#D4AF37] font-medium">
                  {t('hero.headline_2')}
                </span>
              </h1>
              <p className="max-w-md mx-auto text-white/60 text-sm leading-relaxed mb-12">
                {t('hero.subheadline')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-[#CF995F] to-[#D4AF37] text-black font-semibold rounded-full text-[12px] uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  {t('hero.cta_primary')}
                </button>
                <button 
                  onClick={() => document.getElementById('bento')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto text-white font-medium text-[11px] uppercase tracking-widest border-b border-white/20 pb-1 hover:border-gold/40 transition-colors"
                >
                  {t('hero.cta_secondary')}
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 border border-black flex items-center justify-center text-[8px]">LB</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[8px]">MJ</div>
                  <div className="w-6 h-6 rounded-full bg-amber-500 border border-black flex items-center justify-center text-[8px]">SK</div>
                </div>
                <span className="text-[10px] text-white/40 tracking-wider font-mono">{t('hero.signatures')}</span>
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
            <div id="visible-engine-card" className="md:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative group hover:bg-white/[0.05] transition-all">
              <div className="z-10 max-w-md">
                <a 
                  href="https://sky.bazodiac.space/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-mono text-gold mb-1 tracking-widest hover:text-white transition-colors group/link"
                >
                  {t('bento.engine_title')}
                  <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
                <h3 className="text-xl font-light mb-4 text-white uppercase tracking-tight">
                  <a href="https://sky.bazodiac.space/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors underline decoration-gold/30 underline-offset-4">
                    {lang === 'de' ? 'NASA-Datenfluss' : 'NASA Data Flow'}
                  </a> × {lang === 'de' ? 'BaZi-Logik' : 'BaZi Logic'}
                </h3>
                <p className="text-sm text-white/50 mb-2 leading-relaxed">
                  {t('bento.engine_desc')}
                </p>
                
                {/* Live NASA Weather Stream */}
                <CosmicWeather />

                <div className="flex gap-4 items-center mt-8 pt-6 border-t border-white/5">
                  {(Object.keys(ELEMENT_CONFIG) as ElementKey[]).map((key, idx) => (
                    <motion.div
                      key={key}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.95, 1.05, 0.95],
                        filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: idx * 0.5 
                      }}
                      className="relative group/element"
                    >
                      <div className="absolute -inset-2 bg-gold/5 rounded-lg opacity-0 group-hover/element:opacity-100 transition-opacity" />
                      <ElementVisualizer element={key} size="sm" className="w-8 h-8 relative z-10" />
                      <motion.div 
                        animate={{ height: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, delay: idx * 0.8 }}
                        className="absolute -right-1 top-0 w-[1px] bg-gold/20" 
                      />
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
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{t('bento.logic_title')}</div>
              <div className="font-mono text-[13px] py-4 leading-relaxed text-white/80">
                Signal(s) = 0.375·W(s)<br/>
                + 0.375·B(s) <br/>
                + 0.250·X(s)
              </div>
              <div className="text-[10px] uppercase text-gold tracking-tighter italic">{t('bento.logic_footer')}</div>
            </div>

            {/* Card 3: Status / Launch Gates */}
            <div className="md:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/[0.05] transition-all">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{t('bento.gates_title')}</div>
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
            <div className="md:col-span-8 bg-linear-to-br from-white/[0.06] to-transparent border border-white/10 rounded-3xl p-8 flex items-center gap-8 hover:bg-white/[0.05] transition-all relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none">
                {elementKeys.map((key, i) => (
                  <motion.div
                    key={key}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div 
                      className="w-4 h-4 rounded-full filter blur-[2px]" 
                      style={{ 
                        backgroundColor: ELEMENT_CONFIG[key].color,
                        transform: `translate(${80 + i * 10}px, 0)` 
                      }} 
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="w-16 h-16 rounded-full border-2 border-gold/50 flex items-center justify-center shrink-0 relative z-10">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-sm text-gold font-bold">B</div>
              </div>
              <div className="max-w-md relative z-10">
                <h4 className="text-sm uppercase tracking-widest text-gold mb-2 font-semibold">{t('bento.privilege_title')}</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {t('bento.privilege_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Five Elements Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="mb-16 text-center">
            <h2 className="text-3xl mb-4">{t('elements.title')}</h2>
            <p className="text-muted text-sm uppercase tracking-widest font-mono">{t('elements.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(ELEMENT_CONFIG) as ElementKey[]).map((key) => (
              <motion.div 
                key={key}
                whileHover={{ y: -5 }}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center group transition-all hover:bg-white/[0.05]"
              >
                <div className="w-20 h-20 mb-6">
                  <ElementVisualizer element={key} className="w-full h-full" />
                </div>
                <h4 className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: ELEMENT_CONFIG[key].color }}>
                  {t(`elements.${key}.name`)}
                </h4>
                <p className="text-[10px] text-muted leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  {t(`elements.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Onboarding Module */}
        <section id="onboarding" className="py-24 px-6 scroll-mt-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl mb-4">{t('onboarding.title')}</h2>
              <p className="text-muted text-sm uppercase tracking-widest font-mono">{t('onboarding.subtitle')}</p>
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
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">{t('onboarding.step1_label')}</label>
                        <h3 className="text-xl mb-8 normal-case font-sans">{t('onboarding.step1_title')}</h3>
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
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">{t('onboarding.step2_label')}</label>
                        <h3 className="text-xl mb-8 normal-case font-sans">{t('onboarding.step2_title')}</h3>
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
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">{t('onboarding.step3_label')}</label>
                        <h3 className="text-xl mb-8 normal-case font-sans">{t('onboarding.step3_title')}</h3>
                        <input 
                          type="text" 
                          placeholder={t('onboarding.step3_placeholder')}
                          value={form.birthPlace}
                          onChange={(e) => setForm({...form, birthPlace: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-gold/40 focus:ring-0 transition-all outline-hidden text-[#f8f9fa]"
                        />
                      </div>
                    )}

                    {step === 4 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex-1"
                      >
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">{t('onboarding.step4_label')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div 
                            className="p-6 rounded-2xl border"
                            style={{ borderColor: `${ELEMENT_CONFIG[element!].color}40`, backgroundColor: `${ELEMENT_CONFIG[element!].color}05` }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: ELEMENT_CONFIG[element!].color, color: ELEMENT_CONFIG[element!].color }}>
                                {t('onboarding.step4_badge')}
                              </span>
                            </div>
                            <h3 className="text-2xl mb-2 normal-case font-sans font-bold" style={{ color: ELEMENT_CONFIG[element!].color }}>
                              {t(`elements.${element}.name`)}
                            </h3>
                            <p className="text-muted leading-relaxed text-sm">
                              {t('onboarding.step4_desc').replace('{element}', t(`elements.${element}.name`))} <span className="text-white/90">{t('onboarding.step4_detail')}</span>
                            </p>
                          </div>
                          
                          <div className="bg-white/5 border border-white/10 rounded-2xl h-full min-h-[150px]">
                            <ElementVisualizer element={element!} className="h-full w-full" />
                          </div>
                        </div>
                        <p className="mt-6 text-[10px] font-mono text-muted text-center italic">
                          {t('onboarding.step4_footer')}
                        </p>
                      </motion.div>
                    )}

                    {step === 5 && (
                      <div className="flex-1">
                        <label className="block text-sm font-mono text-muted tracking-widest mb-4 uppercase">{t('onboarding.step5_label')}</label>
                        <h3 className="text-xl mb-2 normal-case font-sans">{t('onboarding.step5_title')}</h3>
                        <p className="text-muted text-sm mb-8">{t('onboarding.step5_desc')}</p>
                        <form onSubmit={handleSubmit}>
                          <input 
                            required
                            type="email" 
                            placeholder={t('onboarding.step5_placeholder')}
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-gold/40 focus:ring-0 transition-all outline-hidden text-[#f8f9fa] mb-4"
                          />
                          <button 
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gold text-cosmic-bg font-bold tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl"
                          >
                            {t('onboarding.step5_cta')}
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
                          <ChevronLeft size={16} /> {t('onboarding.back')}
                        </button>
                      )}
                      {step < 5 && (
                        <button 
                          onClick={handleNext}
                          disabled={step === 1 && !form.birthDate || step === 3 && !form.birthPlace}
                          className="ml-auto flex items-center gap-2 gold-gradient-text hover:brightness-125 transition-all text-xs font-mono tracking-widest disabled:opacity-30"
                        >
                          {t('onboarding.next')} <ChevronRight size={16} />
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
                    <h2 className="text-2xl gold-gradient-text mb-2">✓ {t('success.reserved')}</h2>
                    <p className="text-muted text-sm font-mono tracking-widest uppercase mb-12">{t('success.stable')}</p>

                    <div className="grid grid-cols-2 gap-4 mb-12">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-muted mb-1 font-mono">{t('success.position')}</span>
                        <span className="text-2xl font-display font-bold">#{waitlistPos}</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-muted mb-1 font-mono">{t('success.status')}</span>
                        <span className="text-xs font-display font-bold text-gold uppercase">{t('success.founding')}</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-left">
                      <p className="text-xs font-mono text-muted tracking-widest uppercase">{t('success.referral_title')}</p>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono truncate overflow-hidden">
                          {referralLink}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(referralLink);
                            const btn = document.getElementById('copy-btn');
                            if (btn) {
                              btn.innerText = t('success.copied');
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
                            const shareText = lang === 'de' 
                              ? `Ich habe gerade meine Cosmic Signature bei Bazodiac reserviert. Platz #${waitlistPos} gesichert. Join the sync: ${referralLink} #Bazodiac #CosmicSignature`
                              : `I just reserved my Cosmic Signature at Bazodiac. Secured position #${waitlistPos}. Join the sync: ${referralLink} #Bazodiac #CosmicSignature`;
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
                          }}
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                      <h4 className="text-xs font-mono tracking-[0.2em] mb-4 text-muted uppercase">{t('success.rewards')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg opacity-50">
                          <span className="text-xs">{t('success.rewards_3')}</span>
                          <span className="text-[10px] font-mono text-gold">{t('success.rewards_3_desc')}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg opacity-50">
                          <span className="text-xs">{t('success.rewards_10')}</span>
                          <span className="text-[10px] font-mono text-gold">{t('success.rewards_10_desc')}</span>
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
                  <span className="text-[8px] font-mono tracking-widest uppercase mt-1">{t('success.users_sync')}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-display font-bold">500</span>
                  <span className="text-[8px] font-mono tracking-widest uppercase mt-1">{t('success.weekly_access')}</span>
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
                {t('testimonials.lena')}
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
                {t('testimonials.marc')}
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
            <h2 className="text-3xl mb-12">{t('authenticity.title')}</h2>
            <p className="text-muted mb-16 text-lg leading-relaxed">
              {t('authenticity.body')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap size={24} className="text-gold" />
                </div>
                <h4 className="font-bold">{t('authenticity.api_title')}</h4>
                <p className="text-xs text-muted">{t('authenticity.api_desc')}</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Cpu size={24} className="text-gold" />
                </div>
                <h4 className="font-bold">{t('authenticity.qa_title')}</h4>
                <p className="text-xs text-muted">{t('authenticity.qa_desc')}</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe size={24} className="text-gold" />
                </div>
                <h4 className="font-bold">{t('authenticity.support_title')}</h4>
                <p className="text-xs text-muted">{t('authenticity.support_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 bg-black/50 overflow-hidden relative">
          <div className="max-w-3xl mx-auto z-10 relative">
            <h2 className="text-3xl mb-16 text-center">{t('faq.title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bento-card bg-white/[0.02] border-white/[0.05]">
                  <h4 className="text-sm font-bold text-white mb-3 normal-case tracking-normal">{t(`faq.q${i}`)}</h4>
                  <p className="text-xs text-muted leading-relaxed">{t(`faq.a${i}`)}</p>
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
              <span>{t('footer.system_online')}</span>
            </div>
            <span>{t('footer.nasa_sync')}</span>
            <span>{t('footer.latency')}</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <span>{t('footer.thinkers')}</span>
            <span className="text-white/60">{t('footer.copyright')}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Floating CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <button 
          onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-4 bg-linear-to-br from-[#CF995F] to-[#D4AF37] text-cosmic-bg rounded-xl font-bold tracking-widest text-xs shadow-2xl flex items-center justify-center gap-2"
        >
          {t('mobile.join')} <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
