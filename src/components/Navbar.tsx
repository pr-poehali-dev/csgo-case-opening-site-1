import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  balance: number;
  activePage: string;
  onNavigate: (page: string) => void;
  onDeposit: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'cases', label: 'Кейсы', icon: 'Package' },
  { id: 'inventory', label: 'Инвентарь', icon: 'Briefcase' },
  { id: 'contracts', label: 'Контракты', icon: 'ScrollText' },
  { id: 'upgrades', label: 'Апгрейды', icon: 'TrendingUp' },
];

export default function Navbar({ balance, activePage, onNavigate, onDeposit }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
            <span className="text-black font-black text-sm font-rajdhani">CS</span>
          </div>
          <span className="font-rajdhani font-bold text-xl tracking-widest shimmer-text hidden sm:block">
            CS2DROP
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 font-exo
                ${activePage === item.id
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Balance */}
          <div className="flex items-center gap-1.5 bg-secondary/80 border border-white/10 rounded px-3 py-1.5">
            <span className="text-yellow-400 text-sm">₽</span>
            <span className="font-rajdhani font-bold text-white text-sm">{balance.toLocaleString('ru-RU')}</span>
          </div>

          {/* Deposit */}
          <button
            onClick={onDeposit}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-3 py-1.5 rounded transition-all duration-200 font-exo"
          >
            <Icon name="Plus" size={14} />
            <span className="hidden sm:block">Пополнить</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => onNavigate('profile')}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
              ${activePage === 'profile' ? 'border-orange-500' : 'border-white/20 hover:border-orange-500/60'}`}
          >
            <Icon name="User" size={14} className="text-gray-400" />
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 glass-card border-b border-white/5 py-2 animate-slide-up">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-exo transition-colors
                ${activePage === item.id ? 'text-orange-400 bg-orange-500/10' : 'text-gray-400 hover:text-white'}`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}