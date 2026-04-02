import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface DepositPageProps {
  onDeposit: (amount: number) => void;
  onClose?: () => void;
}

const AMOUNTS = [100, 300, 500, 1000, 2500, 5000];

const METHODS = [
  { id: 'sbp', name: 'СБП', desc: 'Система быстрых платежей', emoji: '⚡', color: '#00ADEF', icon: 'Zap' },
  { id: 'card', name: 'Банковская карта', desc: 'Visa / Mastercard / МИР', emoji: '💳', color: '#FF8C00', icon: 'CreditCard' },
];

const BANKS_SBP = ['Сбербанк', 'Тинькофф', 'ВТБ', 'Альфа-Банк', 'Газпромбанк', 'Россельхозбанк'];

export default function DepositPage({ onDeposit, onClose }: DepositPageProps) {
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState(METHODS[0]);
  const [step, setStep] = useState<'select' | 'pay' | 'done'>('select');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [phone, setPhone] = useState('');
  const [bank, setBank] = useState(BANKS_SBP[0]);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const simulatePayment = () => {
    setStep('done');
    setTimeout(() => {
      onDeposit(finalAmount);
      setStep('select');
      setCustomAmount('');
      setCardNumber(''); setCardExpiry(''); setCardCvv(''); setCardName(''); setPhone('');
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
            <p className="text-gray-400 font-exo text-sm">Оплата картой или СБП — мгновенное зачисление</p>
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

            {/* Method */}
            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Способ оплаты</h2>
              <div className="grid grid-cols-2 gap-3">
                {METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                      ${method.id === m.id ? '' : 'border-white/5 hover:border-white/10'}`}
                    style={method.id === m.id ? { borderColor: m.color + '66', background: m.color + '11' } : {}}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="text-left">
                      <div className="font-rajdhani font-bold text-white">{m.name}</div>
                      <div className="text-gray-500 text-xs font-exo">{m.desc}</div>
                    </div>
                    {method.id === m.id && (
                      <Icon name="CheckCircle" size={16} className="ml-auto" style={{ color: m.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-exo">К зачислению</span>
                <span className="font-rajdhani font-bold text-2xl text-white">₽{finalAmount.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 font-exo mb-4">
                <Icon name="Shield" size={12} className="text-green-500" />
                Безопасная оплата · Мгновенное зачисление · Без комиссии
              </div>
              <button
                onClick={() => setStep('pay')}
                disabled={finalAmount < 50}
                className={`w-full py-4 rounded-xl font-rajdhani font-black text-xl tracking-wider transition-all
                  ${finalAmount >= 50
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black hover:scale-[1.02] hover:from-orange-500 hover:to-orange-300'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
              >
                ПЕРЕЙТИ К ОПЛАТЕ
              </button>
            </div>
          </div>
        )}

        {step === 'pay' && method.id === 'card' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💳</span>
                <div>
                  <h2 className="font-rajdhani font-bold text-2xl text-white">Оплата картой</h2>
                  <p className="text-gray-400 font-exo text-sm">К списанию: <span className="text-orange-400 font-bold">₽{finalAmount.toLocaleString('ru-RU')}</span></p>
                </div>
              </div>

              {/* Card visual */}
              <div className="rounded-2xl p-5 mb-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', border: '1px solid rgba(255,140,0,0.2)' }}>
                <div className="flex justify-between items-start mb-8">
                  <div className="text-white/40 font-rajdhani font-bold text-lg">CS2DROP</div>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-full bg-red-500/70" />
                    <div className="w-8 h-8 rounded-full bg-yellow-500/70 -ml-3" />
                  </div>
                </div>
                <div className="font-mono text-xl text-white mb-4 tracking-widest">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-white/40 text-xs font-exo">ДЕРЖАТЕЛЬ</div>
                    <div className="text-white font-exo text-sm">{cardName || 'IVAN PETROV'}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-exo">СРОК</div>
                    <div className="text-white font-exo text-sm">{cardExpiry || 'MM/YY'}</div>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-exo uppercase tracking-wider block mb-1">Номер карты</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder-gray-700 focus:outline-none focus:border-orange-500/60 tracking-widest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-exo uppercase tracking-wider block mb-1">Срок действия</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder-gray-700 focus:outline-none focus:border-orange-500/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-exo uppercase tracking-wider block mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder-gray-700 focus:outline-none focus:border-orange-500/60"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-exo uppercase tracking-wider block mb-1">Имя на карте</label>
                  <input
                    type="text"
                    placeholder="IVAN PETROV"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white font-exo text-lg placeholder-gray-700 focus:outline-none focus:border-orange-500/60 uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 font-exo mt-4 mb-5">
                <Icon name="Lock" size={12} className="text-green-500" />
                Данные карты защищены SSL-шифрованием
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white font-rajdhani font-bold transition-colors">
                  Назад
                </button>
                <button
                  onClick={simulatePayment}
                  disabled={cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3}
                  className={`flex-1 py-3 rounded-xl font-rajdhani font-bold text-black transition-all
                    ${cardNumber.length >= 19 && cardExpiry.length >= 5 && cardCvv.length >= 3
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 hover:scale-[1.02]'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                >
                  ОПЛАТИТЬ ₽{finalAmount.toLocaleString('ru-RU')}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'pay' && method.id === 'sbp' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⚡</span>
                <div>
                  <h2 className="font-rajdhani font-bold text-2xl text-white">Оплата через СБП</h2>
                  <p className="text-gray-400 font-exo text-sm">К зачислению: <span className="text-cyan-400 font-bold">₽{finalAmount.toLocaleString('ru-RU')}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-exo uppercase tracking-wider block mb-1">Номер телефона</label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white font-exo text-lg placeholder-gray-700 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-exo uppercase tracking-wider block mb-2">Банк отправителя</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BANKS_SBP.map(b => (
                      <button
                        key={b}
                        onClick={() => setBank(b)}
                        className={`py-2.5 px-3 rounded-xl border text-sm font-exo transition-all text-left
                          ${bank === b ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-400' : 'border-white/5 text-gray-400 hover:border-white/15 hover:text-white'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 font-exo mb-3 uppercase tracking-wider">Реквизиты для перевода</div>
                  <div className="space-y-2 text-sm font-exo">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Получатель</span>
                      <span className="text-white font-medium">ИП Иванов А.С.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Телефон СБП</span>
                      <span className="text-cyan-400 font-bold">+7 (999) 123-45-67</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Сумма</span>
                      <span className="text-orange-400 font-bold">₽{finalAmount.toLocaleString('ru-RU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Комментарий</span>
                      <span className="text-white font-mono text-xs">ID#{Math.floor(Math.random()*900000+100000)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-yellow-500/80 font-exo bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                  ⚠️ Обязательно укажи комментарий при переводе — без него зачисление невозможно
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white font-rajdhani font-bold transition-colors">
                  Назад
                </button>
                <button
                  onClick={simulatePayment}
                  disabled={phone.length < 10}
                  className={`flex-1 py-3 rounded-xl font-rajdhani font-bold transition-all
                    ${phone.length >= 10
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-400 text-black hover:scale-[1.02]'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                >
                  Я ОПЛАТИЛ
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center animate-winner-reveal py-12">
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