import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface DepositPageProps {
  onDeposit: (amount: number) => void;
  onClose?: () => void;
}

const AMOUNTS = [100, 300, 500, 1000, 2500, 5000];

const CRYPTO = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', emoji: '₿', color: '#FF9500', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', emoji: 'Ξ', color: '#627EEA', address: '0x742d35Cc6634C0532925a3b8D4C9C2' },
  { id: 'usdt', name: 'Tether USDT', symbol: 'USDT', emoji: '₮', color: '#26A17B', address: 'TKm2EB9WJLP1A3D5N6jZEm2BYp' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', emoji: 'Ł', color: '#BFBBBB', address: 'LZ2sRPvkd4bHe3MDMkr8wCM7nJ' },
];

const RATES: Record<string, number> = { btc: 6200000, eth: 320000, usdt: 92, ltc: 9500 };

export default function DepositPage({ onDeposit, onClose }: DepositPageProps) {
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [crypto, setCrypto] = useState(CRYPTO[0]);
  const [step, setStep] = useState<'select' | 'pay' | 'done'>('select');
  const [copied, setCopied] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const cryptoAmount = finalAmount / RATES[crypto.id];

  const copyAddress = () => {
    navigator.clipboard.writeText(crypto.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setStep('done');
    setTimeout(() => {
      onDeposit(finalAmount);
      setStep('select');
      setCustomAmount('');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
          )}
          <div>
            <h1 className="font-rajdhani font-black text-4xl text-white">ПОПОЛНЕНИЕ</h1>
            <p className="text-gray-400 font-exo text-sm">Оплата криптовалютой — быстро и анонимно</p>
          </div>
        </div>

        {step === 'select' && (
          <div className="space-y-6 animate-fade-in">
            {/* Amount */}
            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Сумма пополнения (₽)</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {AMOUNTS.map(a => (
                  <button
                    key={a}
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                    className={`py-3 rounded-xl font-rajdhani font-bold text-lg transition-all border
                      ${amount === a && !customAmount ? 'bg-orange-500/20 border-orange-500/60 text-orange-400' : 'border-white/10 text-gray-300 hover:border-white/20 hover:text-white'}`}
                  >
                    ₽{a.toLocaleString('ru-RU')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Своя сумма..."
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white font-rajdhani text-lg placeholder-gray-600 focus:outline-none focus:border-orange-500/60"
              />
            </div>

            {/* Crypto */}
            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Способ оплаты</h2>
              <div className="grid grid-cols-2 gap-3">
                {CRYPTO.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCrypto(c)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                      ${crypto.id === c.id ? 'border-white/30 bg-white/5' : 'border-white/5 hover:border-white/10'}`}
                    style={crypto.id === c.id ? { borderColor: c.color + '66', background: c.color + '11' } : {}}
                  >
                    <span className="text-2xl font-bold" style={{ color: c.color }}>{c.emoji}</span>
                    <div className="text-left">
                      <div className="font-rajdhani font-bold text-white">{c.symbol}</div>
                      <div className="text-gray-500 text-xs font-exo">{c.name}</div>
                    </div>
                    {crypto.id === c.id && (
                      <Icon name="CheckCircle" size={16} className="ml-auto" style={{ color: c.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 font-exo">К зачислению</span>
                <span className="font-rajdhani font-bold text-2xl text-white">₽{finalAmount.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-exo text-sm">Сумма в {crypto.symbol}</span>
                <span className="font-rajdhani font-bold text-lg" style={{ color: crypto.color }}>
                  {cryptoAmount.toFixed(8)} {crypto.symbol}
                </span>
              </div>
              <div className="text-xs text-gray-600 font-exo mb-4">
                Курс: 1 {crypto.symbol} = ₽{RATES[crypto.id].toLocaleString('ru-RU')}
              </div>
              <button
                onClick={() => setStep('pay')}
                disabled={finalAmount < 50}
                className={`w-full py-4 rounded-xl font-rajdhani font-black text-xl tracking-wider transition-all
                  ${finalAmount >= 50
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black hover:scale-[1.02] hover:from-orange-500 hover:to-orange-300'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
              >
                ОПЛАТИТЬ {crypto.symbol}
              </button>
            </div>
          </div>
        )}

        {step === 'pay' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl border border-white/5 p-6 text-center">
              <div className="text-5xl mb-3" style={{ color: crypto.color }}>{crypto.emoji}</div>
              <h2 className="font-rajdhani font-bold text-2xl text-white mb-1">Переведи {crypto.symbol}</h2>
              <p className="text-gray-400 font-exo text-sm mb-6">
                Отправь точную сумму на адрес ниже
              </p>

              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <div className="text-xs text-gray-500 font-exo mb-1">СУММА К ОПЛАТЕ</div>
                <div className="font-rajdhani font-bold text-3xl" style={{ color: crypto.color }}>
                  {cryptoAmount.toFixed(8)} {crypto.symbol}
                </div>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <div className="text-xs text-gray-500 font-exo mb-2 text-left">АДРЕС {crypto.symbol}</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-gray-300 break-all font-mono">{crypto.address}</code>
                  <button
                    onClick={copyAddress}
                    className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Icon name={copied ? 'Check' : 'Copy'} size={14} className={copied ? 'text-green-400' : 'text-gray-400'} />
                  </button>
                </div>
              </div>

              <div className="text-xs text-yellow-500/80 font-exo bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 mb-6 text-left">
                ⚠️ После отправки транзакции нажми "Подтвердить оплату". Баланс будет зачислен после 1 подтверждения сети.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white font-rajdhani font-bold transition-colors">
                  Назад
                </button>
                <button
                  onClick={simulatePayment}
                  className="flex-1 py-3 rounded-xl font-rajdhani font-bold text-black transition-all hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${crypto.color}, ${crypto.color}99)` }}
                >
                  Подтвердить оплату
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center animate-winner-reveal">
            <div className="text-8xl mb-6">✅</div>
            <h2 className="font-rajdhani font-black text-4xl text-green-400 mb-2">Зачислено!</h2>
            <p className="text-gray-400 font-exo">
              ₽{finalAmount.toLocaleString('ru-RU')} добавлено на ваш баланс
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
