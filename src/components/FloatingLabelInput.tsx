import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useState, useRef, forwardRef } from 'react';

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  inputMode?: 'text' | 'decimal' | 'numeric';
  unit?: string;
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  isFirstError?: boolean;
}

export const FloatingLabelInput = forwardRef<HTMLDivElement, FloatingLabelInputProps>(({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled,
  placeholder,
  type = 'text',
  inputMode = 'text',
  unit,
  enterKeyHint,
  isFirstError
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFloating = isFocused || value.length > 0;

  const formatNumber = (val: string): string => {
    if (!unit || unit !== 'USD') return val;
    const num = parseFloat(val.replace(/\s/g, ''));
    if (isNaN(num)) return val;
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, ' ');
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleLabelClick = () => {
    inputRef.current?.focus();
  };

  const getInputClasses = () => {
    let classes = 'w-full pt-6 pb-3 px-6 rounded-[1.5rem] text-white text-base focus:outline-none transition-all duration-300 ';

    if (error) {
      classes += 'bg-white/5 backdrop-blur-md border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] ';
    } else if (isFocused) {
      classes += 'bg-white/5 backdrop-blur-md border-2 border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_20px_rgba(143,197,201,0.5)] ';
    } else {
      classes += 'bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 ';
    }

    return classes;
  };

  const displayValue = unit === 'USD' && value && !isFocused ? formatNumber(value) : value;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        x: error && isFirstError ? [0, -10, 10, -10, 10, 0] : 0
      }}
      transition={{
        opacity: { duration: 0.3 },
        y: { type: 'spring', stiffness: 300, damping: 24 },
        x: { duration: 0.5 }
      }}
      className="relative"
    >
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={displayValue}
          onChange={(e) => onChange(e.target.value.replace(/\s/g, ''))}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          className={`${getInputClasses()} ${unit ? 'pr-16' : 'pr-6'} disabled:opacity-50 placeholder-transparent`}
          placeholder={placeholder}
        />

        <motion.label
          onClick={handleLabelClick}
          animate={{
            top: isFloating ? '0.75rem' : '50%',
            translateY: isFloating ? '0%' : '-50%',
            fontSize: isFloating ? '0.75rem' : '1rem',
            color: error ? 'rgb(248 113 113)' : isFocused ? 'rgb(143 197 201)' : 'rgba(255, 255, 255, 0.5)'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-6 pointer-events-none font-medium"
        >
          {label}
        </motion.label>

        <AnimatePresence>
          {unit && (
            <motion.span
              initial={{ opacity: 0.2, scale: 0.95 }}
              animate={{
                opacity: (isFocused || value.length > 0) ? 1 : 0.2,
                scale: (isFocused || value.length > 0) ? 1 : 0.95,
                color: (isFocused || value.length > 0) ? 'rgb(143, 197, 201)' : 'rgba(255, 255, 255, 0.3)'
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-base pointer-events-none font-medium"
            >
              {unit}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 mt-2 text-red-400 text-xs overflow-hidden"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';
