import { useState, useRef } from 'react';
import { CASES, SKINS, Skin, RARITY_LABELS, RARITY_COLORS } from '@/data/skins';
import Icon from '@/components/ui/icon';

interface CasesPageProps {
  balance: number;
  onSpend: (amount: number) => void;
  onAddSkin: (skin: Skin) => void;
}

function rollSkin(caseSkins: Skin[]): Skin {
  const totalChance = caseSkins.reduce((sum, s) => sum + s.chance, 0);
  let rand = Math.random() * totalChance;
  for (const skin of caseSkins) {
    rand -= skin.chance;
    if (rand <= 0) return skin;
  }
  return caseSkins[caseSkins.length - 1];
}

function buildReel(winner: Skin, pool: Skin[]): Skin[] {
  const items: Skin[] = [];
  for (let i = 0; i < 40; i++) items.push(pool[Math.floor(Math.random() * pool.length)]);
  items[32] = winner;
  return items;
}

export default function CasesPage({ balance, onSpend, onAddSkin }: CasesPageProps) {
  const [selectedCase, setSelectedCase] = useState(CASES[0]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Skin | null>(null);
  const [reelItems, setReelItems] = useState<Skin[]>([]);
  const [reelOffset, setReelOffset] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const reelRef = useRef<HTMLDivElement>(null);

  const canOpen = balance >= selectedCase.price && !spinning;

  const openCase = () => {
    if (!canOpen) return;
    onSpend(selectedCase.price);

    const won = rollSkin(selectedCase.skins);
    const items = buildReel(won, selectedCase.skins);
    setReelItems(items);
    setWinner(null);
    setShowWinner(false);
    setSpinning(true);

    const itemWidth = 120 + 8;
    const targetIndex = 32;
    const offset = targetIndex * itemWidth - (window.innerWidth / 2 - itemWidth / 2) + Math.random() * 60 - 30;
    setReelOffset(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReelOffset(offset);
      });
    });

    setTimeout(() => {
      setWinner(won);
      setShowWinner(true);
      setSpinning(false);
      onAddSkin(won);
    }, 6500);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-rajdhani font-black text-4xl text-white mb-8">
          КЕЙСЫ <span className="text-orange-400">CS2</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case selector */}
          <div className="lg:col-span-1">
            <h2 className="text-gray-400 text-sm font-exo uppercase tracking-wider mb-3">Выбери кейс</h2>
            <div className="space-y-2">
              {CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCase(c); setWinner(null); setShowWinner(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                    ${selectedCase.id === c.id ? 'border-orange-500/60 bg-orange-500/10' : 'border-white/5 glass-card hover:border-white/15'}`}
                >
                  <div
                    className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ boxShadow: `0 0 12px ${c.color}55` }}
                  >
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-rajdhani font-bold text-white">{c.name}</div>
                    <div className="text-sm text-gray-400 font-exo">{c.skins.length} скинов</div>
                  </div>
                  <div className="text-right">
                    <div className="font-rajdhani font-bold" style={{ color: c.color }}>
                      ₽{c.price.toLocaleString('ru-RU')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Opening area */}
          <div className="lg:col-span-2">
            {/* Selected case */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden animate-float"
                  style={{ boxShadow: `0 0 30px ${selectedCase.color}66` }}
                >
                  <img src={selectedCase.image} alt={selectedCase.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-rajdhani font-black text-3xl text-white">{selectedCase.name}</h2>
                  <p className="text-gray-400 font-exo text-sm">{selectedCase.skins.length} возможных дропов</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-gray-400 text-sm font-exo">Стоимость</div>
                  <div className="font-rajdhani font-black text-3xl" style={{ color: selectedCase.color }}>
                    ₽{selectedCase.price.toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>

              {/* Reel */}
              <div className="relative mb-6 reel-container rounded-xl overflow-hidden bg-black/30 border border-white/5" style={{ height: 144 }}>
                {/* Center marker */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 z-20 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, #FF8C00, transparent)' }} />
                <div className="absolute inset-0 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(90deg, #0d1117 0%, transparent 25%, transparent 75%, #0d1117 100%)' }} />

                {reelItems.length > 0 ? (
                  <div
                    ref={reelRef}
                    className="flex absolute top-0 left-0"
                    style={{
                      transform: `translateX(-${reelOffset}px)`,
                      transition: spinning ? 'transform 6s cubic-bezier(0.05, 0.8, 0.3, 1)' : 'none',
                      gap: '8px',
                      padding: '8px',
                    }}
                  >
                    {reelItems.map((skin, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-[120px] h-[128px] rounded-lg border flex flex-col items-center justify-center"
                        style={{
                          borderColor: RARITY_COLORS[skin.rarity] + '66',
                          background: RARITY_COLORS[skin.rarity] + '11',
                        }}
                      >
                        <div className="text-4xl mb-1">{skin.emoji}</div>
                        <div className="text-xs text-white font-medium text-center px-1 truncate w-full text-center">{skin.weapon}</div>
                        <div className="text-xs text-gray-400 text-center px-1 truncate w-full text-center">{skin.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2 animate-float">📦</div>
                      <div className="text-gray-500 font-exo text-sm">Нажми "Открыть" чтобы начать</div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={openCase}
                disabled={!canOpen}
                className={`w-full py-4 rounded-xl font-rajdhani font-black text-2xl tracking-wider transition-all duration-200
                  ${canOpen
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black hover:scale-[1.02] active:scale-[0.98] animate-upgrade-glow'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
              >
                {spinning ? '...' : balance < selectedCase.price ? 'НЕДОСТАТОЧНО СРЕДСТВ' : `ОТКРЫТЬ ЗА ₽${selectedCase.price.toLocaleString('ru-RU')}`}
              </button>
            </div>

            {/* Winner reveal */}
            {showWinner && winner && (
              <div className="glass-card rounded-2xl border p-6 text-center animate-winner-reveal"
                style={{ borderColor: RARITY_COLORS[winner.rarity] + '66' }}>
                <div className="text-xs uppercase tracking-widest font-exo mb-2" style={{ color: RARITY_COLORS[winner.rarity] }}>
                  🎉 Выпало!
                </div>
                <div className="text-8xl mb-4 animate-float">{winner.emoji}</div>
                <div className="font-rajdhani font-black text-3xl text-white">{winner.weapon}</div>
                <div className="text-gray-400 font-exo mb-1">| {winner.name} — {winner.wear}</div>
                <div className="text-xs font-exo mb-3" style={{ color: RARITY_COLORS[winner.rarity] }}>
                  {RARITY_LABELS[winner.rarity]}
                </div>
                <div className="font-rajdhani font-black text-4xl" style={{ color: RARITY_COLORS[winner.rarity] }}>
                  ₽{winner.price.toLocaleString('ru-RU')}
                </div>
                <div className="mt-4 text-gray-500 text-sm font-exo">Скин добавлен в инвентарь</div>
              </div>
            )}

            {/* Contents */}
            <div className="mt-6">
              <h3 className="font-rajdhani font-bold text-lg text-white mb-3">Содержимое кейса</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {selectedCase.skins.map(skin => (
                  <div
                    key={skin.id}
                    className="rounded-lg border p-2 text-center transition-all hover:scale-105"
                    style={{ borderColor: RARITY_COLORS[skin.rarity] + '44', background: RARITY_COLORS[skin.rarity] + '0d' }}
                  >
                    <div className="text-2xl mb-1">{skin.emoji}</div>
                    <div className="text-xs text-white font-medium truncate">{skin.weapon}</div>
                    <div className="text-xs text-gray-500 truncate">{skin.name}</div>
                    <div className="text-xs font-bold mt-1" style={{ color: RARITY_COLORS[skin.rarity] }}>
                      ₽{skin.price.toLocaleString('ru-RU')}
                    </div>
                    <div className="text-xs text-gray-600">{skin.chance}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
