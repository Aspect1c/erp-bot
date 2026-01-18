import { motion } from 'framer-motion';
import { Ship, Plane, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  mode?: 'sea' | 'air' | 'land';
}

export const ProgressBar = ({ progress, mode = 'land' }: ProgressBarProps) => {
  const [prevProgress, setPrevProgress] = useState(0);

  useEffect(() => {
    setPrevProgress(progress);
  }, [progress]);

  const getVehicleIcon = () => {
    switch (mode) {
      case 'sea':
        return <Ship className="text-white" size={20} />;
      case 'air':
        return <Plane className="text-white" size={20} />;
      default:
        return <Truck className="text-white" size={20} />;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative h-12 bg-gradient-to-b from-[#3d4177]/90 to-[#3d4177]/70 backdrop-blur-lg rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#8fc5c9] to-[#7ab5ba]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: 'overlay' }}>
            <defs>
              <pattern id="roadPattern" x="0" y="0" width="40" height="12" patternUnits="userSpaceOnUse">
                <rect x="0" y="5" width="20" height="2" fill="white" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#roadPattern)" />
          </svg>

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            animate={{
              left: `${Math.max(2, Math.min(progress, 96))}%`,
              y: ['-50%', 'calc(-50% - 3px)', '-50%'],
            }}
            transition={{
              left: { duration: 0.6, ease: 'easeInOut' },
              y: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
            }}
            style={{ marginLeft: '-10px' }}
          >
            <motion.div
              animate={progress === 100 ? {
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{
                duration: 0.6,
                ease: 'easeOut'
              }}
              className="bg-[#3d4177] p-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            >
              {getVehicleIcon()}
            </motion.div>
          </motion.div>

          {progress === 100 && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.span
              className="text-white text-xs font-bold tracking-wider drop-shadow-md"
              animate={{ opacity: progress > 10 && progress < 95 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};
