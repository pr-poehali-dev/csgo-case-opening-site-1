import { useState } from 'react';
import { Skin, RARITY_COLORS, RARITY_LABELS, SKINS, Rarity } from '@/data/skins';
import SkinCard from '@/components/SkinCard';
import Icon from '@/components/ui/icon';

interface UpgradesPageProps {
  inventory: Skin[];
  onUpgrade: (from: Skin, to: Skin | null) => void;
}

const UPGRADE_TARGETS: Record<Rarity, Rarity> = {
  consumer: 'industrial',
  industrial: 'milspec',
  milspec: 'restricted',
  restricted: 'classified',
  classified: 'covert',
  covert: 'gold',
  gold: 'gold',
};

function getUpgradeChance(from: Skin, to: Skin): number {
  const ratio = from.price / to.price;
  return Math.min(Math.max(ratio * 100, 5), 75);
}

export default function UpgradesPage({ inventory, onUpgrade }: UpgradesPageProps) {
  const [selected, setSelected] = useState<Skin | null>(null);
  const [target, setTarget] = useState<Skin | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; skin: Skin | null } | null>(null);
  const [angle, setAngle] = useState(0);

  const targetRarity = selected ? UPGRADE_TARGETS[selected.rarity] : null;
  const availableTargets = targetRarity ? SKINS.filter(s => s.rarity === targetRarity) : [];
  const chance = selected && target ? getUpgradeChance(selected, target) : 0;

  const executeUpgrade = () => {
    if (!selected || !target || spinning) return;
    setSpinning(true);
    setResult(null);

    const won = Math.random() * 100 < chance;
    const spins = 5 + Math.random() * 3;
    const finalAngle = won ? spins * 360 + 90 : spins * 360 + 270;
    setAngle(prev => prev + finalAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult({ success: won, skin: won ? target : null });
      onUpgrade(selected, won ? target : null);
      if (won) {
        setSelected(null);
        setTarget(null);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-rajdhani font-black text-4xl text-white mb-2">АПГРЕЙДЫ</h1>
        <p className="text-gray-400 font-exo text-sm mb-8">
          Поставь скин — выбери цель — рискни получить более редкий предмет
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upgrade arena */}
          <div className="glass-card rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-6 mb-6">
              {/* From */}
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-exo uppercase tracking-wider mb-2">Ваш скин</div>
                <div className={`rounded-xl border-2 border-dashed p-4 text-center min-h-[140px] flex flex-col items-center justify-center transition-all
                  ${selected ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10'}`}>
                  {selected ? (
                    <>
                      <div className="text-5xl mb-2">{selected.emoji}</div>
                      <div className="font-rajdhani font-bold text-white text-sm">{selected.weapon}</div>
                      <div className="text-gray-400 text-xs">| {selected.name}</div>
                      <div className="text-xs font-bold mt-1" style={{ color: RARITY_COLORS[selected.rarity] }}>
                        ₽{selected.price.toLocaleString('ru-RU')}
                      </div>
                      <button onClick={() => setSelected(null)} className="text-xs text-red-400 mt-2 hover:text-red-300">Убрать</button>
                    </>
                  ) : (
                    <div className="text-gray-600 text-sm font-exo">Выберите скин ↓</div>
                  )}
                </div>
              </div>

              {/* Roulette wheel */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24">
                  <div
                    className="w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-[3000ms] ease-out"
                    style={{
                      borderColor: chance > 50 ? '#22C55E' : chance > 25 ? '#FF8C00' : '#EF4444',
                      transform: `rotate(${angle}deg)`,
                      background: `conic-gradient(
                        ${chance > 50 ? '#22C55E' : '#22C55E'} 0% ${chance}%,
                        #EF4444 ${chance}% 100%
                      )`,
                      boxShadow: spinning ? `0 0 30px ${chance > 50 ? '#22C55E' : '#EF4444'}88` : 'none',
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                      <span className="font-rajdhani font-black text-lg" style={{ color: chance > 50 ? '#22C55E' : chance > 25 ? '#FF8C00' : '#EF4444' }}>
                        {chance.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  {/* Pointer */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '12px solid #FF8C00' }} />
                </div>
                <div className="text-xs text-gray-500 font-exo text-center">шанс</div>
              </div>

              {/* To */}
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-exo uppercase tracking-wider mb-2">Цель</div>
                <div className={`rounded-xl border-2 border-dashed p-4 text-center min-h-[140px] flex flex-col items-center justify-center transition-all
                  ${target ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10'}`}>
                  {target ? (
                    <>
                      <div className="text-5xl mb-2">{target.emoji}</div>
                      <div className="font-rajdhani font-bold text-white text-sm">{target.weapon}</div>
                      <div className="text-gray-400 text-xs">| {target.name}</div>
                      <div className="text-xs font-bold mt-1" style={{ color: RARITY_COLORS[target.rarity] }}>
                        ₽{target.price.toLocaleString('ru-RU')}
                      </div>
                      <button onClick={() => setTarget(null)} className="text-xs text-red-400 mt-2 hover:text-red-300">Убрать</button>
                    </>
                  ) : (
                    <div className="text-gray-600 text-sm font-exo">Выберите цель →</div>
                  )}
                </div>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className={`rounded-xl p-4 text-center mb-4 animate-winner-reveal border ${
                result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="text-3xl mb-1">{result.success ? '🎉' : '💔'}</div>
                <div className={`font-rajdhani font-bold text-xl ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? `Успех! Получен ${result.skin?.weapon} | ${result.skin?.name}` : 'Неудача! Скин потерян'}
                </div>
              </div>
            )}

            <button
              onClick={executeUpgrade}
              disabled={!selected || !target || spinning}
              className={`w-full py-4 rounded-xl font-rajdhani font-black text-xl tracking-wider transition-all
                ${selected && target && !spinning
                  ? 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white hover:scale-[1.02] animate-upgrade-glow'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            >
              {spinning ? '⚡ КРУТИТСЯ...' : `АПГРЕЙД (${chance.toFixed(0)}%)`}
            </button>
          </div>

          {/* Selection panels */}
          <div className="space-y-6">
            {/* Your skins */}
            <div>
              <h3 className="font-rajdhani font-bold text-lg text-white mb-3">
                Ваши скины ({inventory.length})
              </h3>
              {inventory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-exo text-sm">Инвентарь пуст</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1">
                  {inventory.map((skin, i) => (
                    <div key={`${skin.id}-${i}`} className={selected?.id === skin.id ? 'ring-2 ring-orange-500 rounded-lg' : ''}>
                      <SkinCard skin={skin} compact selected={selected?.id === skin.id} onClick={() => {
                        setSelected(selected?.id === skin.id ? null : skin);
                        setTarget(null);
                        setResult(null);
                      }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Target skins */}
            {selected && (
              <div>
                <h3 className="font-rajdhani font-bold text-lg text-white mb-2">
                  Выбери цель — <span style={{ color: RARITY_COLORS[targetRarity!] }}>{RARITY_LABELS[targetRarity!]}</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1">
                  {availableTargets.map(skin => (
                    <div key={skin.id} className={target?.id === skin.id ? 'ring-2 ring-purple-500 rounded-lg' : ''}>
                      <SkinCard skin={skin} compact selected={target?.id === skin.id} onClick={() => {
                        setTarget(target?.id === skin.id ? null : skin);
                        setResult(null);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
