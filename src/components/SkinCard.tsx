import { Skin, RARITY_LABELS, RARITY_COLORS } from '@/data/skins';

interface SkinCardProps {
  skin: Skin;
  compact?: boolean;
  onSell?: (skin: Skin) => void;
  selected?: boolean;
  onClick?: () => void;
}

const RARITY_BG: Record<string, string> = {
  consumer: 'bg-rarity-consumer border-gray-500/30',
  industrial: 'bg-rarity-industrial border-blue-400/30',
  milspec: 'bg-rarity-milspec border-blue-600/40',
  restricted: 'bg-rarity-restricted border-purple-600/40',
  classified: 'bg-rarity-classified border-purple-400/40',
  covert: 'bg-rarity-covert border-red-500/40',
  gold: 'bg-rarity-gold border-yellow-400/50',
};

export default function SkinCard({ skin, compact, onSell, selected, onClick }: SkinCardProps) {
  const rarityColor = RARITY_COLORS[skin.rarity];
  const bgClass = RARITY_BG[skin.rarity] || '';

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`relative rounded-lg border p-2 cursor-pointer transition-all duration-200 ${bgClass}
          ${selected ? 'ring-2 ring-orange-500 scale-105' : 'hover:scale-105 hover:brightness-110'}`}
        style={{ borderColor: selected ? '#FF8C00' : undefined }}
      >
        <div className="text-center text-3xl mb-1">{skin.emoji}</div>
        <div className="text-center text-xs font-exo font-semibold text-white truncate">{skin.weapon}</div>
        <div className="text-center text-xs text-gray-400 truncate">{skin.name}</div>
        <div className="text-center text-xs font-bold mt-1" style={{ color: rarityColor }}>
          ₽{skin.price.toLocaleString('ru-RU')}
        </div>
        {selected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">✓</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border p-4 transition-all duration-200 group ${bgClass}
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:brightness-110' : ''}
        ${selected ? 'ring-2 ring-orange-500' : ''}`}
    >
      {/* Rarity stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)` }}
      />

      <div className="text-5xl text-center mb-3 group-hover:animate-float">{skin.emoji}</div>

      <div className="space-y-1">
        <div className="text-xs font-medium" style={{ color: rarityColor }}>
          {RARITY_LABELS[skin.rarity]}
        </div>
        <div className="font-rajdhani font-bold text-white text-lg leading-tight">{skin.weapon}</div>
        <div className="text-gray-400 text-sm">| {skin.name}</div>
        <div className="text-gray-500 text-xs">{skin.wear}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-rajdhani font-bold text-lg text-white">
          ₽{skin.price.toLocaleString('ru-RU')}
        </span>
        {onSell && (
          <button
            onClick={e => { e.stopPropagation(); onSell(skin); }}
            className="text-xs bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 text-green-400 px-2 py-1 rounded transition-colors font-exo"
          >
            Продать
          </button>
        )}
      </div>
    </div>
  );
}
