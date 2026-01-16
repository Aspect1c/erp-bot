import { useState } from 'react';
import { Ship, Plane, Truck } from 'lucide-react';

type DeliveryMode = 'sea' | 'air' | 'truck';

function App() {
  const [selectedMode, setSelectedMode] = useState<DeliveryMode>('truck');
  const [formData, setFormData] = useState({
    countryFrom: 'CN',
    countryTo: 'UA',
    itemName: '',
    weight: '',
    volume: '',
    reference: '',
    price: '',
  });

  const countries = [
    { code: 'CN', flag: '🇨🇳', name: 'Китай (China)' },
    { code: 'TR', flag: '🇹🇷', name: 'Туреччина (Turkey)' },
    { code: 'PL', flag: '🇵🇱', name: 'Польща (Poland)' },
    { code: 'US', flag: '🇺🇸', name: 'США (USA)' },
    { code: 'UA', flag: '🇺🇦', name: 'Україна (Ukraine)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { mode: selectedMode, ...formData });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #4a4e8c 0%, #5a5f9f 100%)' }}>
      <div className="w-full max-w-2xl bg-[#3d4177] rounded-[2.5rem] p-8 shadow-2xl">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setSelectedMode('sea')}
            className={`py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              selectedMode === 'sea' ? 'bg-white text-[#3d4177]' : 'bg-white/10 text-white/60'
            }`}
          >
            <Ship size={20} />
            <span>Морська<br/>доставка</span>
          </button>
          <button
            onClick={() => setSelectedMode('air')}
            className={`py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              selectedMode === 'air' ? 'bg-white text-[#3d4177]' : 'bg-white/10 text-white/60'
            }`}
          >
            <Plane size={20} />
            <span>Авіа<br/>доставка</span>
          </button>
          <button
            onClick={() => setSelectedMode('truck')}
            className={`py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              selectedMode === 'truck' ? 'bg-[#8fc5c9] text-[#3d4177]' : 'bg-white/10 text-white/60'
            }`}
          >
            <Truck size={20} />
            <span>Авто<br/>доставка</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Країна відправлення</label>
              <select
                value={formData.countryFrom}
                onChange={(e) => handleInputChange('countryFrom', e.target.value)}
                className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9] appearance-none cursor-pointer"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Країна отримання</label>
              <select
                value={formData.countryTo}
                onChange={(e) => handleInputChange('countryTo', e.target.value)}
                className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9] appearance-none cursor-pointer"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="text"
            placeholder="Введіть назву товару"
            value={formData.itemName}
            onChange={(e) => handleInputChange('itemName', e.target.value)}
            className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9]"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Вага, кг"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9]"
            />
            <input
              type="text"
              placeholder="Об'єм, м3"
              value={formData.volume}
              onChange={(e) => handleInputChange('volume', e.target.value)}
              className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9]"
            />
          </div>

          <input
            type="text"
            placeholder="Посилання на товар"
            value={formData.reference}
            onChange={(e) => handleInputChange('reference', e.target.value)}
            className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9]"
          />

          <input
            type="number"
            placeholder="Вартість товару USD"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="w-full py-4 px-6 rounded-[1.5rem] bg-white/95 text-gray-600 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#8fc5c9]"
          />

          <button
            type="submit"
            className="w-full py-5 px-6 rounded-[1.5rem] bg-[#8fc5c9] text-[#3d4177] text-lg font-bold uppercase tracking-wide hover:bg-[#7ab5ba] transition-colors focus:outline-none focus:ring-4 focus:ring-[#8fc5c9]/50 mt-6"
          >
            ОТРИМАТИ РОЗРАХУНОК
          </button>

          <p className="text-center text-white/70 text-sm mt-6 leading-relaxed">
            Відправляючи форму, ви погоджуєтеся на обробку персональних<br/>
            даних відповідно нашої <span className="underline cursor-pointer">політики конфіденційності</span>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
