import { motion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

interface SmartButtonProps {
  isValid: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const SmartButton = ({ isValid, isLoading, isSuccess, onClick, disabled }: SmartButtonProps) => {
  const getButtonClasses = () => {
    if (!isValid && !isLoading) {
      return 'bg-slate-500/30 text-white/40 cursor-not-allowed grayscale';
    }
    if (isSuccess) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gradient-to-r from-[#8fc5c9] to-[#7ab5ba] text-[#3d4177] hover:from-[#7ab5ba] hover:to-[#6ba5aa]';
  };

  const getShadowClasses = () => {
    if (!isValid || disabled) return '';
    return 'shadow-[0_0_30px_rgba(143,197,201,0.6)]';
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || !isValid}
      whileTap={isValid ? { scale: 0.96 } : { x: [-5, 5, -5, 5, 0] }}
      whileHover={isValid ? { y: -2 } : {}}
      animate={{
        scale: isValid && !isLoading ? [1, 1.02, 1] : 1,
      }}
      transition={{
        scale: {
          repeat: isValid && !isLoading ? Infinity : 0,
          duration: 2,
          ease: 'easeInOut',
        }
      }}
      className={`relative w-full py-5 px-6 rounded-[1.5rem] text-lg font-bold uppercase tracking-wide transition-all focus:outline-none focus:ring-4 focus:ring-cyan-400/50 mt-6 overflow-hidden ${getButtonClasses()} ${getShadowClasses()}`}
    >
      {isValid && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'linear',
            repeatDelay: 0.5,
          }}
        />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={20} />
          </motion.div>
        )}
        {isSuccess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <Check size={24} />
          </motion.div>
        )}
        {isLoading ? 'Обробка...' : isSuccess ? 'Успішно!' : 'ОТРИМАТИ РОЗРАХУНОК'}
      </span>

      {isValid && !disabled && !isLoading && (
        <motion.div
          className="absolute right-6 top-1/2 -translate-y-1/2"
          animate={{
            x: [0, 5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};
