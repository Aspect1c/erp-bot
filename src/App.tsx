import { useState, useEffect, useRef } from 'react';
import { Ship, Plane, Truck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FloatingLabelInput } from './components/FloatingLabelInput';
import { SmartButton } from './components/SmartButton';
import { ProgressBar } from './components/ProgressBar';
import { playClick, playSuccessChime, playSwoosh } from './utils/audio';

const tg = (window as any).Telegram?.WebApp;

type DeliveryMode = 'sea' | 'air' | 'land';

interface ValidationErrors {
  country_from?: string;
  country_to?: string;
  item_name?: string;
  weight?: string;
  volume?: string;
  item_link?: string;
  price?: string;
}

function App() {
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const [selectedMode, setSelectedMode] = useState<DeliveryMode>('land');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [backgroundHue, setBackgroundHue] = useState(0);
  const [formData, setFormData] = useState({
    country_from: 'CN',
    country_to: 'UA',
    item_name: '',
    weight: '',
    volume: '',
    item_link: '',
    price: '',
  });

  const countries = [
    { code: 'CN', flag: '🇨🇳', name: 'Китай (China)' },
    { code: 'TR', flag: '🇹🇷', name: 'Туреччина (Turkey)' },
    { code: 'PL', flag: '🇵🇱', name: 'Польща (Poland)' },
    { code: 'US', flag: '🇺🇸', name: 'США (USA)' },
    { code: 'UA', flag: '🇺🇦', name: 'Україна (Ukraine)' },
  ];

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundHue((prev) => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const isFormValid =
    formData.item_name.trim().length > 0 &&
    formData.weight.trim().length > 0 &&
    parseFloat(formData.weight) > 0 &&
    formData.volume.trim().length > 0 &&
    parseFloat(formData.volume) > 0 &&
    formData.price.trim().length > 0 &&
    parseFloat(formData.price) > 0 &&
    formData.item_link.trim().length > 0;

    const calculateProgress = (): number => {
    const fields = ['item_name', 'weight', 'volume', 'item_link', 'price'];
    const completedFields = fields.filter(field => {
      const value = formData[field as keyof typeof formData];
      if (field === 'weight' || field === 'volume' || field === 'price') {
        return value.trim().length > 0 && parseFloat(value) > 0;
      }
      return value.trim().length > 0;
    });
    return (completedFields.length / fields.length) * 100;
  };

  const prevIsFormValid = useRef(isFormValid);
  const prevProgress = useRef(calculateProgress());

  useEffect(() => {
    const currentProgress = calculateProgress();

    if (currentProgress === 100 && prevProgress.current < 100) {
      triggerHaptic('success');
      playSuccessChime();
    } else if (currentProgress > prevProgress.current && currentProgress < 100) {
      triggerHaptic('light');
    }

    prevProgress.current = currentProgress;
  }, [formData]);

  useEffect(() => {
    if (!prevIsFormValid.current && isFormValid) {
      triggerHaptic('medium');
    }
    prevIsFormValid.current = isFormValid;
  }, [isFormValid]);

  

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#8fc5c9', '#ffffff', '#a0d5d9', '#7ab5ba']
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning' = 'light') => {
    if (tg && tg.HapticFeedback) {
      if (['error', 'success', 'warning'].includes(type)) {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    }
  };

  const validateNumericInput = (value: string): string => {
    let sanitized = value.replace(/[^\d.,]/g, '');
    sanitized = sanitized.replace(',', '.');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    return sanitized;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.item_name.trim()) {
      newErrors.item_name = 'Назва товару обов\'язкова';
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Вага обов\'язкова';
    } else if (parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Вага повинна бути > 0';
    }
    if (!formData.volume.trim()) {
      newErrors.volume = 'Об\'єм обов\'язковий';
    } else if (parseFloat(formData.volume) <= 0) {
      newErrors.volume = 'Об\'єм повинен бути > 0';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Вартість обов\'язкова';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Вартість повинна бути > 0';
    }
    if (!formData.item_link.trim()) {
      newErrors.item_link = 'Посилання на товар обов\'язкове';
    }

    setErrors(newErrors);

    Object.keys(formData).forEach(key => {
      setTouchedFields(prev => new Set(prev).add(key));
    });

    if (Object.keys(newErrors).length > 0) {
      triggerHaptic('error');
      setTimeout(() => {
        firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    triggerHaptic('success');
    playSwoosh();

    setTimeout(() => {
      setIsSuccess(true);
      triggerHaptic('success');
      triggerConfetti();

      setTimeout(() => {
        if (tg) {
          const payload = { mode: selectedMode, ...formData };
          tg.sendData(JSON.stringify(payload));
          tg.close();
        } else {
          alert('Дані відправлено!');
          setIsLoading(false);
          setIsSuccess(false);
        }
      }, 1000);
    }, 800);
  };

  const handleInputChange = (field: string, value: string) => {
    if (['weight', 'volume', 'price'].includes(field)) {
      value = validateNumericInput(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field as keyof ValidationErrors];
        return updated;
      });
    }

    if (!touchedFields.has(field)) {
      setTouchedFields(prev => new Set(prev).add(field));
    }
  };

  const handleModeChange = (mode: DeliveryMode) => {
    setSelectedMode(mode);
    triggerHaptic('light');
    playClick();
  };

  const handleSelectChange = (field: string, value: string) => {
    handleInputChange(field, value);
    triggerHaptic('light');
  };

  const getSelectClasses = (field: string) => {
    const isError = errors[field as keyof ValidationErrors];
    const isFocused = focusedField === field;

    let classes = 'w-full py-4 px-6 rounded-[1.5rem] text-white placeholder-gray-300 text-base focus:outline-none transition-all duration-300 ';

    if (isError) {
      classes += 'bg-white/5 backdrop-blur-md border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] ';
    } else if (isFocused) {
      classes += 'bg-white/5 backdrop-blur-md border-2 border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_20px_rgba(143,197,201,0.5)] ';
    } else {
      classes += 'bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 ';
    }

    return classes;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const buttonGroupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0,
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 15, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const errorKeys = Object.keys(errors);
  const firstErrorField = errorKeys.length > 0 ? errorKeys[0] : null;

  const baseHue = 255;
  const dynamicHue = baseHue + Math.sin(backgroundHue * Math.PI / 180) * 10;

  return (
    <>
      <ProgressBar progress={calculateProgress()} mode={selectedMode} />

      <motion.div
        className="min-h-[100dvh] flex items-start justify-center p-4 sm:p-6 overflow-y-auto pb-20 relative"
        animate={{
          background: `linear-gradient(135deg, hsl(${dynamicHue}, 35%, 42%) 0%, hsl(${dynamicHue + 5}, 38%, 50%) 100%)`
        }}
        transition={{ duration: 30, ease: 'linear' }}
        style={{ backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }}
        />

        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
          animate={{
            background: [
              'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
              'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)'
            ],
            backgroundPosition: ['-200% 0', '200% 0']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <motion.div
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
  className="relative w-full max-w-2xl bg-[#3d4177]/80 backdrop-blur-xl rounded-[2.5rem] p-5 sm:p-8 shadow-2xl my-6"
>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="mb-6 flex justify-center"
  >
    <img
      src="public/logo.png"
      className="w-48 sm:w-56 h-auto shimmer-image"
      alt="Logo"
    />
  </motion.div>

  <motion.div
    variants={itemVariants}
    className="mb-6"
  >
    <motion.div
      variants={buttonGroupVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-2 sm:gap-3"
    >

            
              <motion.button
                variants={buttonVariants}
                onClick={() => handleModeChange('sea')}
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                className={`py-3 sm:py-4 px-2 sm:px-4 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all disabled:opacity-50 touch-target ${
                  selectedMode === 'sea'
                    ? 'bg-white text-[#3d4177] shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    : 'bg-white/10 text-white/60 backdrop-blur-md hover:bg-white/15'
                }`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <Ship size={18} />
                <span className="leading-tight">Морська<br className="sm:hidden"/>доставка</span>
              </motion.button>
              <motion.button
                variants={buttonVariants}
                onClick={() => handleModeChange('air')}
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                className={`py-3 sm:py-4 px-2 sm:px-4 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all disabled:opacity-50 touch-target ${
                  selectedMode === 'air'
                    ? 'bg-white text-[#3d4177] shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    : 'bg-white/10 text-white/60 backdrop-blur-md hover:bg-white/15'
                }`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <Plane size={18} />
                <span className="leading-tight">Авіа<br className="sm:hidden"/>доставка</span>
              </motion.button>
              <motion.button
                variants={buttonVariants}
                onClick={() => handleModeChange('land')}
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                className={`py-3 sm:py-4 px-2 sm:px-4 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all disabled:opacity-50 touch-target ${
                  selectedMode === 'land'
                    ? 'bg-white text-[#3d4177] shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    : 'bg-white/10 text-white/60 backdrop-blur-md hover:bg-white/15'
                }`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <Truck size={18} />
                <span className="leading-tight">Авто<br className="sm:hidden"/>доставка</span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.div
                layout
                ref={firstErrorField === 'country_from' ? firstErrorRef : null}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: errors.country_from ? [0, -10, 10, -10, 10, 0] : 0
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: { type: 'spring', stiffness: 300, damping: 24 },
                  x: { duration: 0.5 }
                }}
              >
                <label className="text-white/70 text-sm mb-2 block">Країна відправлення</label>
                <select
                  value={formData.country_from}
                  onChange={(e) => handleSelectChange('country_from', e.target.value)}
                  onFocus={() => setFocusedField('country_from')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  className={`${getSelectClasses('country_from')} appearance-none cursor-pointer disabled:opacity-50`}
                  style={{ minHeight: '44px' }}
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
                <AnimatePresence mode="wait">
                  {errors.country_from && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-red-400 text-xs overflow-hidden"
                    >
                      <AlertCircle size={14} />
                      {errors.country_from}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                layout
                ref={firstErrorField === 'country_to' ? firstErrorRef : null}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: errors.country_to ? [0, -10, 10, -10, 10, 0] : 0
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: { type: 'spring', stiffness: 300, damping: 24 },
                  x: { duration: 0.5 }
                }}
              >
                <label className="text-white/70 text-sm mb-2 block">Країна отримання</label>
                <select
                  value={formData.country_to}
                  onChange={(e) => handleSelectChange('country_to', e.target.value)}
                  onFocus={() => setFocusedField('country_to')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  className={`${getSelectClasses('country_to')} appearance-none cursor-pointer disabled:opacity-50`}
                  style={{ minHeight: '44px' }}
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
                <AnimatePresence mode="wait">
                  {errors.country_to && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-red-400 text-xs overflow-hidden"
                    >
                      <AlertCircle size={14} />
                      {errors.country_to}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <FloatingLabelInput
              ref={firstErrorField === 'item_name' ? firstErrorRef : null}
              label="Назва товару"
              value={formData.item_name}
              onChange={(value) => handleInputChange('item_name', value)}
              onFocus={() => setFocusedField('item_name')}
              onBlur={() => setFocusedField(null)}
              error={errors.item_name}
              disabled={isLoading}
              placeholder="Введіть назву товару"
              enterKeyHint="next"
              isFirstError={firstErrorField === 'item_name'}
            />

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloatingLabelInput
                ref={firstErrorField === 'weight' ? firstErrorRef : null}
                label="Вага"
                value={formData.weight}
                onChange={(value) => handleInputChange('weight', value)}
                onFocus={() => setFocusedField('weight')}
                onBlur={() => setFocusedField(null)}
                error={errors.weight}
                disabled={isLoading}
                inputMode="decimal"
                unit="кг"
                enterKeyHint="next"
                isFirstError={firstErrorField === 'weight'}
              />

              <FloatingLabelInput
                ref={firstErrorField === 'volume' ? firstErrorRef : null}
                label="Об'єм"
                value={formData.volume}
                onChange={(value) => handleInputChange('volume', value)}
                onFocus={() => setFocusedField('volume')}
                onBlur={() => setFocusedField(null)}
                error={errors.volume}
                disabled={isLoading}
                inputMode="decimal"
                unit="м³"
                enterKeyHint="next"
                isFirstError={firstErrorField === 'volume'}
              />
            </motion.div>

            <FloatingLabelInput
              ref={firstErrorField === 'item_link' ? firstErrorRef : null}
              label="Посилання на товар"
              value={formData.item_link}
              onChange={(value) => handleInputChange('item_link', value)}
              onFocus={() => setFocusedField('item_link')}
              onBlur={() => setFocusedField(null)}
              error={errors.item_link}
              disabled={isLoading}
              placeholder="https://..."
              enterKeyHint="next"
              isFirstError={firstErrorField === 'item_link'}
            />

            <FloatingLabelInput
              ref={firstErrorField === 'price' ? firstErrorRef : null}
              label="Вартість товару"
              value={formData.price}
              onChange={(value) => handleInputChange('price', value)}
              onFocus={() => setFocusedField('price')}
              onBlur={() => setFocusedField(null)}
              error={errors.price}
              disabled={isLoading}
              inputMode="decimal"
              unit="USD"
              enterKeyHint="done"
              isFirstError={firstErrorField === 'price'}
            />

            <motion.div variants={itemVariants}>
              <SmartButton
                isValid={isFormValid}
                isLoading={isLoading}
                isSuccess={isSuccess}
                onClick={handleSubmit}
                disabled={isLoading || isSuccess}
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-center text-white/60 text-xs sm:text-sm mt-4 leading-relaxed"
            >
              Відправляючи форму, ви погоджуєтеся на обробку персональних<br className="hidden sm:block"/>
              даних відповідно нашої <span className="underline cursor-pointer hover:text-white/80 transition-colors">політики конфіденційності</span>.
            </motion.p>
          </motion.form>
        </motion.div>
      </motion.div>
    </>
  );
}

export default App;
