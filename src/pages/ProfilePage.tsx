import { Skin, RARITY_COLORS, RARITY_LABELS } from '@/data/skins';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  inventory: Skin[];
  balance: number;
  totalOpened: number;
  onDeposit: () => void;
}

export default function ProfilePage({ inventory, balance, totalOpened, onDeposit }: ProfilePageProps) {
  const totalValue = inventory.reduce((sum, s) => sum + s.price, 0);
  const bestDrop = inventory.reduce((best, s) => s.price > (best?.price ?? 0) ? s : best, null as Skin | null);

  const byRarity = inventory.reduce((acc, s) => {
    acc[s.rarity] = (acc[s.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile header */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-3xl">
              🎮
            </div>
            <div className="flex-1">
              <h1 className="font-rajdhani font-black text-3xl text-white">Игрок #7291</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-400 text-sm font-exo">Онлайн</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm font-exo">Баланс</div>
              <div className="font-rajdhani font-black text-3xl text-white">₽{balance.toLocaleString('ru-RU')}</div>
              <button
                onClick={onDeposit}
                className="mt-2 text-sm text-orange-400 hover:text-orange-300 font-exo transition-colors flex items-center gap-1 ml-auto"
              >
                <Icon name="Plus" size={12} />
                Пополнить
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Кейсов открыто', value: totalOpened, icon: 'Package', color: 'text-orange-400' },
            { label: 'Скинов в инвентаре', value: inventory.length, icon: 'Briefcase', color: 'text-cyan-400' },
            { label: 'Стоимость инвентаря', value: `₽${totalValue.toLocaleString('ru-RU')}`, icon: 'TrendingUp', color: 'text-green-400' },
            { label: 'Лучший дроп', value: bestDrop ? `₽${bestDrop.price.toLocaleString('ru-RU')}` : '—', icon: 'Crown', color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-4 border border-white/5">
              <Icon name={stat.icon} size={18} className={`${stat.color} mb-2`} />
              <div className={`font-rajdhani font-bold text-xl ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs font-exo mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Best drop */}
        {bestDrop && (
          <div className="glass-card rounded-2xl border border-white/5 p-5 mb-6">
            <h2 className="font-rajdhani font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Icon name="Crown" size={18} className="text-yellow-400" />
              Лучший дроп
            </h2>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
                style={{ background: RARITY_COLORS[bestDrop.rarity] + '22', border: `1px solid ${RARITY_COLORS[bestDrop.rarity]}44` }}
              >
                {bestDrop.emoji}
              </div>
              <div>
                <div className="font-rajdhani font-bold text-xl text-white">{bestDrop.weapon} | {bestDrop.name}</div>
                <div className="text-sm font-exo" style={{ color: RARITY_COLORS[bestDrop.rarity] }}>
                  {RARITY_LABELS[bestDrop.rarity]} · {bestDrop.wear}
                </div>
                <div className="font-rajdhani font-bold text-2xl text-white mt-1">
                  ₽{bestDrop.price.toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collection breakdown */}
        {inventory.length > 0 && (
          <div className="glass-card rounded-2xl border border-white/5 p-5">
            <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Коллекция по редкости</h2>
            <div className="space-y-2">
              {Object.entries(byRarity).sort((a,b) => b[1] - a[1]).map(([rarity, count]) => (
                <div key={rarity} className="flex items-center gap-3">
                  <div
                    className="w-24 text-xs font-exo font-medium"
                    style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }}
                  >
                    {RARITY_LABELS[rarity as keyof typeof RARITY_LABELS]}
                  </div>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(count / inventory.length) * 100}%`,
                        background: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS],
                      }}
                    />
                  </div>
                  <div className="text-gray-400 text-sm font-exo w-8 text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
