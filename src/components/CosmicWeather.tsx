import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Activity, Globe, Wind } from 'lucide-react';

interface WeatherEvent {
  type: 'FLR' | 'CME' | 'GST' | 'SEP';
  id: string;
  intensity: string;
  time: string;
}

const EVENT_CONFIG = {
  FLR: { icon: Zap, color: '#ef4444', label: 'Solar Flare' },
  CME: { icon: Wind, color: '#f59e0b', label: 'Coronal Mass Ejection' },
  GST: { icon: Globe, color: '#3b82f6', label: 'Geomagnetic Storm' },
  SEP: { icon: Activity, color: '#8b5cf6', label: 'Solar Particle Event' },
};

interface WeatherEventCardProps {
  event: WeatherEvent;
  key?: React.Key;
}

const WeatherEventCard = ({ event }: WeatherEventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Config = EVENT_CONFIG[event.type] || EVENT_CONFIG.FLR;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-between min-w-[100px] relative overflow-hidden group"
    >
      {/* Animated Phenomenon Symbol */}
      <div className="relative w-8 h-8 mb-2 flex items-center justify-center">
        <Config.icon size={16} className="relative z-10" style={{ color: Config.color }} />
        
        {/* Background Animation based on type */}
        {event.type === 'FLR' && (
          <div className="absolute inset-0">
            <motion.div 
              animate={{ 
                scale: [1, 3, 1], 
                opacity: [0, 0.3, 0],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: Config.color, filter: 'blur(6px)' }}
            />
            {isHovered && [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${i * 90}deg)` }}
              >
                <motion.div 
                  className="w-[1px] h-3 bg-red-500"
                  animate={{ y: [0, -10], opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ backgroundColor: Config.color }}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {event.type === 'CME' && (
          <motion.div 
            animate={{ 
              scale: [0.3, 2.5], 
              opacity: [0.8, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[0.5px] rounded-full"
            style={{ borderColor: Config.color }}
          />
        )}

        {event.type === 'GST' && (
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [0.9, 1.2, 0.9],
              borderRadius: ["40%", "50%", "40%"]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-6px] border border-gold/10"
            style={{ borderTopColor: Config.color, borderRightColor: Config.color }}
          />
        )}
      </div>

      <div className="text-center">
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">{Config.label}</div>
        <div className="text-[11px] font-bold text-white leading-none mt-1">{event.intensity}</div>
        <div className="text-[8px] font-mono text-gold/60 mt-1">{event.time} UTC</div>
      </div>

      {/* Intensity Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gold/20 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1 }}
          className="h-full"
          style={{ backgroundColor: Config.color }}
        />
      </div>
    </motion.div>
  );
};

export const CosmicWeather = () => {
  const [events, setEvents] = useState<WeatherEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCosmicWeather = async () => {
      try {
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Fetch flares, cmes, and gst in parallel
        const [flrRes, cmeRes, gstRes] = await Promise.all([
          fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${lastWeek}&api_key=DEMO_KEY`),
          fetch(`https://api.nasa.gov/DONKI/CME?startDate=${lastWeek}&api_key=DEMO_KEY`),
          fetch(`https://api.nasa.gov/DONKI/GST?startDate=${lastWeek}&api_key=DEMO_KEY`)
        ]);

        const [flrs, cmes, gsts] = await Promise.all([flrRes.json(), cmeRes.json(), gstRes.json()]);
        
        const combined: WeatherEvent[] = [
          ...(Array.isArray(flrs) ? flrs.slice(0, 1).map((item: any) => ({
            type: 'FLR' as const,
            id: item.flrID,
            intensity: item.classType,
            time: new Date(item.beginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })) : []),
          ...(Array.isArray(cmes) ? cmes.slice(0, 1).map((item: any) => ({
            type: 'CME' as const,
            id: item.activityID,
            intensity: 'Active',
            time: new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })) : []),
          ...(Array.isArray(gsts) ? gsts.slice(0, 1).map((item: any) => ({
            type: 'GST' as const,
            id: item.gstID,
            intensity: item.allKpIndex?.[0]?.kpRating || 'G1',
            time: new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })) : [])
        ];

        setEvents(combined.sort((a, b) => b.time.localeCompare(a.time)));
      } catch (error) {
        console.error('Failed to fetch NASA data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCosmicWeather();
    const interval = setInterval(fetchCosmicWeather, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-12 h-12 rounded-lg bg-white/5 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <AnimatePresence>
        {events.map((event) => (
          <WeatherEventCard key={event.id} event={event} />
        ))}
      </AnimatePresence>
    </div>
  );
};
