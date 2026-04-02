import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onDeposit: () => void;
  totalOpened: number;
  totalDropped: number;
}

const LIVE_DROPS = [
  { user: 'Dragon_K1ller', skin: 'AWP | Dragon Lore', emoji: '🐉', price: 4500, rarity: 'covert', time: '2с' },
  { user: 'Pro_Player99', skin: 'Karambit | Doppler', emoji: '🔮', price: 1800, rarity: 'gold', time: '8с' },
  { user: 'xX_Shadow_Xx', skin: 'AK-47 | Vulcan', emoji: '⚡', price: 45, rarity: 'restricted', time: '15с' },
  { user: 'NightSniper', skin: 'M4A4 | Howl', emoji: '🐺', price: 5000, rarity: 'covert', time: '21с' },
  { user: 'cs2_god', skin: 'AWP | Asiimov', emoji: '🚀', price: 180, rarity: 'classified', time: '34с' },
  { user: 'FragMaster', skin: 'Butterfly | Fade', emoji: '🦋', price: 2800, rarity: 'gold', time: '1мин' },
];

const RARITY_COLORS: Record<string, string> = {
  consumer: '#b0c3d9', industrial: '#5e98d9', milspec: '#4b69ff',
  restricted: '#8847ff', classified: '#d32ce6', covert: '#FF4444', gold: '#FFD700',
};

export default function HomePage({ onNavigate, onDeposit, totalOpened, totalDropped }: HomePageProps) {
  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-orange-300 font-exo">Онлайн: 4,128 игроков</span>
            </div>

            <h1 className="font-rajdhani font-black text-6xl md:text-8xl text-white leading-none mb-4">
              ОТКРЫВАЙ<br />
              <span className="shimmer-text">CS2 КЕЙСЫ</span>
            </h1>
            <p className="text-gray-400 text-lg font-exo mb-8 max-w-xl mx-auto">
              Получай редкие скины, делай контракты и апгрейды оружия. Настоящие шансы, честный дроп.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate('cases')}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 font-rajdhani tracking-wider hover:scale-105 active:scale-95"
              >
                <Icon name="Package" size={20} />
                ОТКРЫТЬ КЕЙС
              </button>
              <button
                onClick={onDeposit}
                className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 font-rajdhani tracking-wider"
              >
                <Icon name="Wallet" size={20} />
                ПОПОЛНИТЬ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Кейсов открыто', value: (totalOpened + 248391).toLocaleString('ru-RU'), icon: 'Package', color: 'text-orange-400' },
            { label: 'Дропов выдано', value: (totalDropped + 893241).toLocaleString('ru-RU'), icon: 'Gift', color: 'text-purple-400' },
            { label: 'Игроков онлайн', value: '4,128', icon: 'Users', color: 'text-cyan-400' },
            { label: 'Самый дорогой дроп', value: '₽85,000', icon: 'Crown', color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-4 border border-white/5">
              <Icon name={stat.icon} size={20} className={`${stat.color} mb-2`} />
              <div className={`font-rajdhani font-bold text-2xl ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs font-exo mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Feed */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="font-rajdhani font-bold text-2xl text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          ПОСЛЕДНИЕ ДРОПЫ
        </h2>
        <div className="space-y-2">
          {LIVE_DROPS.map((drop, i) => (
            <div
              key={i}
              className="flex items-center gap-3 glass-card rounded-lg px-4 py-2.5 border border-white/5 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-2xl">{drop.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-gray-400 text-sm font-exo">{drop.user}</span>
                <span className="text-gray-600 text-sm mx-2">получил</span>
                <span className="font-medium text-sm" style={{ color: RARITY_COLORS[drop.rarity] }}>
                  {drop.skin}
                </span>
              </div>
              <div className="text-right">
                <div className="font-rajdhani font-bold text-white text-sm">₽{drop.price.toLocaleString('ru-RU')}</div>
                <div className="text-gray-600 text-xs">{drop.time} назад</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: 'ScrollText', title: 'Контракты', color: '#00D4FF',
              desc: 'Обменяй 10 скинов одной редкости на 1 скин следующего уровня',
              action: 'contracts', btn: 'Контракты'
            },
            {
              icon: 'TrendingUp', title: 'Апгрейды', color: '#A855F7',
              desc: 'Рискни своим скином — и получи более редкий с шансом до 75%',
              action: 'upgrades', btn: 'Апгрейды'
            },
            {
              icon: 'Bitcoin', title: 'Крипто оплата', color: '#FFD700',
              desc: 'Принимаем BTC, ETH, USDT и другие криптовалюты',
              action: 'deposit', btn: 'Пополнить'
            },
          ].map(f => (
            <div
              key={f.title}
              className="glass-card rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
              >
                <Icon name={f.icon} size={22} style={{ color: f.color }} />
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm font-exo mb-4">{f.desc}</p>
              <button
                onClick={() => onNavigate(f.action)}
                className="text-sm font-medium transition-colors font-exo"
                style={{ color: f.color }}
              >
                {f.btn} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
