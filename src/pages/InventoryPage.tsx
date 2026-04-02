import { useState } from 'react';
import { Skin, RARITY_LABELS, RARITY_COLORS } from '@/data/skins';
import SkinCard from '@/components/SkinCard';
import Icon from '@/components/ui/icon';

interface InventoryPageProps {
  inventory: Skin[];
  onSell: (skin: Skin) => void;
}

type SortKey = 'price' | 'rarity' | 'name';

const RARITY_ORDER = { consumer: 0, industrial: 1, milspec: 2, restricted: 3, classified: 4, covert: 5, gold: 6 };

export default function InventoryPage({ inventory, onSell }: InventoryPageProps) {
  const [sort, setSort] = useState<SortKey>('price');
  const [filter, setFilter] = useState<string>('all');
  const [selling, setSelling] = useState<string | null>(null);

  const rarities = ['all', ...Array.from(new Set(inventory.map(s => s.rarity)))];

  const sorted = [...inventory]
    .filter(s => filter === 'all' || s.rarity === filter)
    .sort((a, b) => {
      if (sort === 'price') return b.price - a.price;
      if (sort === 'rarity') return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      return a.name.localeCompare(b.name);
    });

  const totalValue = inventory.reduce((sum, s) => sum + s.price, 0);

  const handleSell = (skin: Skin) => {
    setSelling(skin.id);
    setTimeout(() => {
      onSell(skin);
      setSelling(null);
    }, 300);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-rajdhani font-black text-4xl text-white">
              ИНВЕНТАРЬ
            </h1>
            <p className="text-gray-400 font-exo text-sm mt-1">
              {inventory.length} предметов · Стоимость: <span className="text-green-400 font-bold">₽{totalValue.toLocaleString('ru-RU')}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => inventory.forEach(s => onSell(s))}
              disabled={inventory.length === 0}
              className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-all font-exo text-sm disabled:opacity-40"
            >
              <Icon name="DollarSign" size={14} />
              Продать всё (₽{totalValue.toLocaleString('ru-RU')})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            {(['price', 'rarity', 'name'] as SortKey[]).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded text-xs font-exo transition-all ${sort === s ? 'bg-orange-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                {s === 'price' ? 'По цене' : s === 'rarity' ? 'По редкости' : 'По имени'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {rarities.map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-3 py-1.5 rounded text-xs font-exo transition-all border ${
                  filter === r ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-white'}`}
                style={filter === r && r !== 'all' ? { borderColor: RARITY_COLORS[r as keyof typeof RARITY_COLORS] + '66', color: RARITY_COLORS[r as keyof typeof RARITY_COLORS] } : {}}
              >
                {r === 'all' ? 'Все' : RARITY_LABELS[r as keyof typeof RARITY_LABELS]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {inventory.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-rajdhani font-bold text-2xl text-white mb-2">Инвентарь пуст</h3>
            <p className="text-gray-500 font-exo">Открывай кейсы, чтобы получить скины!</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-exo">Нет предметов с выбранным фильтром</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {sorted.map((skin, i) => (
              <div
                key={`${skin.id}-${i}`}
                className={`transition-all duration-300 ${selling === skin.id ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
              >
                <SkinCard skin={skin} onSell={handleSell} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
