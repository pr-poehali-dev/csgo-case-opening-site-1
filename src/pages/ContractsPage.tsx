import { useState } from 'react';
import { Skin, RARITY_LABELS, RARITY_COLORS, SKINS, Rarity } from '@/data/skins';
import SkinCard from '@/components/SkinCard';
import Icon from '@/components/ui/icon';

interface ContractsPageProps {
  inventory: Skin[];
  onContractComplete: (removed: Skin[], received: Skin) => void;
}

const UPGRADE_MAP: Record<Rarity, Rarity | null> = {
  consumer: 'industrial',
  industrial: 'milspec',
  milspec: 'restricted',
  restricted: 'classified',
  classified: 'covert',
  covert: 'gold',
  gold: null,
};

function getRandomSkinByRarity(rarity: Rarity): Skin {
  const pool = SKINS.filter(s => s.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ContractsPage({ inventory, onContractComplete }: ContractsPageProps) {
  const [selected, setSelected] = useState<Skin[]>([]);
  const [result, setResult] = useState<Skin | null>(null);
  const [animating, setAnimating] = useState(false);

  const canAdd = selected.length < 10;
  const selectedRarity = selected.length > 0 ? selected[0].rarity : null;
  const upgradeRarity = selectedRarity ? UPGRADE_MAP[selectedRarity] : null;

  const availableInventory = inventory.filter(s => {
    if (selected.length === 0) return true;
    return s.rarity === selectedRarity && !selected.includes(s);
  });

  const toggleSkin = (skin: Skin) => {
    if (selected.includes(skin)) {
      setSelected(selected.filter(s => s !== skin));
    } else if (canAdd && (selectedRarity === null || skin.rarity === selectedRarity)) {
      setSelected([...selected, skin]);
    }
  };

  const executeContract = () => {
    if (selected.length !== 10 || !upgradeRarity) return;
    setAnimating(true);
    setTimeout(() => {
      const received = getRandomSkinByRarity(upgradeRarity);
      setResult(received);
      onContractComplete(selected, received);
      setSelected([]);
      setAnimating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-rajdhani font-black text-4xl text-white mb-2">КОНТРАКТЫ</h1>
        <p className="text-gray-400 font-exo text-sm mb-8">
          Положи 10 скинов одной редкости → получи 1 скин следующей редкости
        </p>

        {/* How it works */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {(['consumer','industrial','milspec','restricted','classified','covert'] as Rarity[]).map((r, i, arr) => (
            <div key={r} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div
                  className="w-16 h-8 rounded text-xs font-bold flex items-center justify-center font-exo"
                  style={{ background: RARITY_COLORS[r] + '22', color: RARITY_COLORS[r], border: `1px solid ${RARITY_COLORS[r]}44` }}
                >
                  {RARITY_LABELS[r].split(' ')[0]}
                </div>
              </div>
              {i < arr.length - 1 && <Icon name="ChevronRight" size={16} className="text-gray-600 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contract panel */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl border border-white/5 p-5 sticky top-24">
              <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Контракт</h2>

              {/* Slots */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array(10).fill(null).map((_, i) => {
                  const skin = selected[i];
                  return (
                    <div
                      key={i}
                      onClick={() => skin && toggleSkin(skin)}
                      className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center text-2xl cursor-pointer transition-all
                        ${skin ? 'border-orange-500/60 bg-orange-500/10 hover:bg-red-500/20' : 'border-white/10 bg-white/2'}`}
                    >
                      {skin ? skin.emoji : <span className="text-gray-700 text-sm">{i + 1}</span>}
                    </div>
                  );
                })}
              </div>

              {selectedRarity && (
                <div className="text-xs text-center font-exo mb-3">
                  <span className="text-gray-500">Редкость: </span>
                  <span style={{ color: RARITY_COLORS[selectedRarity] }}>{RARITY_LABELS[selectedRarity]}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  {upgradeRarity
                    ? <span style={{ color: RARITY_COLORS[upgradeRarity] }}>{RARITY_LABELS[upgradeRarity]}</span>
                    : <span className="text-yellow-400">Максимум!</span>}
                </div>
              )}

              <div className="text-center text-sm font-exo text-gray-500 mb-4">
                {selected.length}/10 предметов
              </div>

              <button
                onClick={executeContract}
                disabled={selected.length !== 10 || !upgradeRarity || animating}
                className={`w-full py-3 rounded-xl font-rajdhani font-bold text-lg transition-all
                  ${selected.length === 10 && upgradeRarity && !animating
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black hover:scale-[1.02]'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
              >
                {animating ? '⚡ Обрабатывается...' : 'ЗАКЛЮЧИТЬ КОНТРАКТ'}
              </button>
            </div>
          </div>

          {/* Inventory */}
          <div className="lg:col-span-2">
            {result && (
              <div
                className="rounded-2xl border p-5 text-center mb-6 animate-winner-reveal"
                style={{ borderColor: RARITY_COLORS[result.rarity] + '66', background: RARITY_COLORS[result.rarity] + '0d' }}
              >
                <div className="text-xs uppercase tracking-widest font-exo mb-2" style={{ color: RARITY_COLORS[result.rarity] }}>
                  Контракт выполнен!
                </div>
                <div className="text-6xl mb-3 animate-float">{result.emoji}</div>
                <div className="font-rajdhani font-black text-2xl text-white">{result.weapon} | {result.name}</div>
                <div className="font-rajdhani font-bold text-xl mt-1" style={{ color: RARITY_COLORS[result.rarity] }}>
                  ₽{result.price.toLocaleString('ru-RU')}
                </div>
                <button onClick={() => setResult(null)} className="mt-3 text-gray-500 hover:text-gray-300 text-sm font-exo transition-colors">
                  Закрыть
                </button>
              </div>
            )}

            <h2 className="font-rajdhani font-bold text-lg text-white mb-3">
              {inventory.length === 0 ? 'Инвентарь пуст' : `Выбери предметы (${availableInventory.length})`}
            </h2>

            {inventory.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500 font-exo">Сначала открой кейсы, чтобы получить предметы</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {inventory.map((skin, i) => {
                  const isSelected = selected.includes(skin);
                  const isDisabled = !isSelected && (!canAdd || (selectedRarity !== null && skin.rarity !== selectedRarity));
                  return (
                    <div
                      key={`${skin.id}-${i}`}
                      className={`transition-all ${isDisabled ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                      <SkinCard skin={skin} compact selected={isSelected} onClick={() => !isDisabled && toggleSkin(skin)} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
