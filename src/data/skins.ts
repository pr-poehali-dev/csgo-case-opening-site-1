export type Rarity = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'gold';

export interface Skin {
  id: string;
  name: string;
  weapon: string;
  rarity: Rarity;
  price: number;
  wear: string;
  emoji: string;
  chance: number;
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  skins: Skin[];
  color: string;
}

export const SKINS: Skin[] = [
  { id: 's1', name: 'Dragon Lore', weapon: 'AWP', rarity: 'covert', price: 4500, wear: 'FN', emoji: '🐉', chance: 0.2 },
  { id: 's2', name: 'Fire Serpent', weapon: 'AK-47', rarity: 'covert', price: 3200, wear: 'FN', emoji: '🔥', chance: 0.3 },
  { id: 's3', name: 'Fade', weapon: 'Butterfly Knife', rarity: 'gold', price: 2800, wear: 'FN', emoji: '🦋', chance: 0.1 },
  { id: 's4', name: 'Howl', weapon: 'M4A4', rarity: 'covert', price: 5000, wear: 'FN', emoji: '🐺', chance: 0.15 },
  { id: 's5', name: 'Doppler', weapon: 'Karambit', rarity: 'gold', price: 1800, wear: 'FN', emoji: '🔮', chance: 0.2 },
  { id: 's6', name: 'Asiimov', weapon: 'AWP', rarity: 'classified', price: 180, wear: 'FT', emoji: '🚀', chance: 1.2 },
  { id: 's7', name: 'Hyper Beast', weapon: 'M4A1-S', rarity: 'classified', price: 95, wear: 'FT', emoji: '👾', chance: 1.5 },
  { id: 's8', name: 'Neo-Noir', weapon: 'AWP', rarity: 'classified', price: 85, wear: 'MW', emoji: '🌆', chance: 1.8 },
  { id: 's9', name: 'Neon Rider', weapon: 'M4A1-S', rarity: 'classified', price: 75, wear: 'FN', emoji: '🏍️', chance: 2.0 },
  { id: 's10', name: 'Printstream', weapon: 'M4A1-S', rarity: 'classified', price: 120, wear: 'FN', emoji: '🖨️', chance: 1.3 },
  { id: 's11', name: 'Vulcan', weapon: 'AK-47', rarity: 'restricted', price: 45, wear: 'FN', emoji: '⚡', chance: 4.5 },
  { id: 's12', name: 'Monkey Business', weapon: 'AK-47', rarity: 'restricted', price: 35, wear: 'FT', emoji: '🐒', chance: 5.0 },
  { id: 's13', name: 'Bullet Rain', weapon: 'M4A4', rarity: 'restricted', price: 28, wear: 'FN', emoji: '🌧️', chance: 5.5 },
  { id: 's14', name: 'Poseidon', weapon: 'AK-47', rarity: 'restricted', price: 22, wear: 'FT', emoji: '🔱', chance: 6.0 },
  { id: 's15', name: 'Orion', weapon: 'AK-47', rarity: 'restricted', price: 18, wear: 'FN', emoji: '✨', chance: 6.5 },
  { id: 's16', name: 'Commuter', weapon: 'MP5-SD', rarity: 'milspec', price: 12, wear: 'FN', emoji: '🚇', chance: 15.0 },
  { id: 's17', name: 'Speedboat', weapon: 'P250', rarity: 'milspec', price: 8, wear: 'FT', emoji: '🚤', chance: 16.0 },
  { id: 's18', name: 'Weasel', weapon: 'PP-Bizon', rarity: 'milspec', price: 6, wear: 'FN', emoji: '🦦', chance: 17.0 },
  { id: 's19', name: 'Oscillator', weapon: 'FAMAS', rarity: 'milspec', price: 5, wear: 'FT', emoji: '📡', chance: 18.0 },
  { id: 's20', name: 'Teardown', weapon: 'SG 553', rarity: 'industrial', price: 3, wear: 'FN', emoji: '🔧', chance: 25.0 },
];

export const CASES: Case[] = [
  {
    id: 'c1',
    name: 'Ящик Грома',
    price: 299,
    image: 'https://cdn.poehali.dev/projects/5c9608b5-c522-4da5-989d-c2d2dd518a49/files/2f0e2369-1e48-43a5-9b64-58018ce17bd7.jpg',
    color: '#FF8C00',
    skins: SKINS.filter(s => ['s1','s2','s6','s11','s16','s17','s20'].includes(s.id)),
  },
  {
    id: 'c2',
    name: 'Кейс Дракона',
    price: 499,
    image: 'https://cdn.poehali.dev/projects/5c9608b5-c522-4da5-989d-c2d2dd518a49/files/2f0e2369-1e48-43a5-9b64-58018ce17bd7.jpg',
    color: '#EF4444',
    skins: SKINS.filter(s => ['s1','s4','s7','s12','s18','s19','s20'].includes(s.id)),
  },
  {
    id: 'c3',
    name: 'Призматик',
    price: 399,
    image: 'https://cdn.poehali.dev/projects/5c9608b5-c522-4da5-989d-c2d2dd518a49/files/2f0e2369-1e48-43a5-9b64-58018ce17bd7.jpg',
    color: '#A855F7',
    skins: SKINS.filter(s => ['s3','s5','s8','s9','s13','s14','s17'].includes(s.id)),
  },
  {
    id: 'c4',
    name: 'Неоновый Хаос',
    price: 599,
    image: 'https://cdn.poehali.dev/projects/5c9608b5-c522-4da5-989d-c2d2dd518a49/files/2f0e2369-1e48-43a5-9b64-58018ce17bd7.jpg',
    color: '#00D4FF',
    skins: SKINS.filter(s => ['s2','s4','s10','s11','s15','s16','s19'].includes(s.id)),
  },
  {
    id: 'c5',
    name: 'Золотой Резерв',
    price: 999,
    image: 'https://cdn.poehali.dev/projects/5c9608b5-c522-4da5-989d-c2d2dd518a49/files/2f0e2369-1e48-43a5-9b64-58018ce17bd7.jpg',
    color: '#FFD700',
    skins: SKINS.filter(s => ['s1','s3','s4','s5','s6','s8','s10'].includes(s.id)),
  },
  {
    id: 'c6',
    name: 'Киберпанк',
    price: 199,
    image: 'https://cdn.poehali.dev/projects/5c9608b5-c522-4da5-989d-c2d2dd518a49/files/2f0e2369-1e48-43a5-9b64-58018ce17bd7.jpg',
    color: '#22C55E',
    skins: SKINS.filter(s => ['s7','s9','s12','s13','s18','s19','s20'].includes(s.id)),
  },
];

export const RARITY_LABELS: Record<Rarity, string> = {
  consumer: 'Ширпотреб',
  industrial: 'Промышленное',
  milspec: 'Военное',
  restricted: 'Запрещённое',
  classified: 'Засекреченное',
  covert: 'Тайное',
  gold: '★ Нож',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  consumer: '#b0c3d9',
  industrial: '#5e98d9',
  milspec: '#4b69ff',
  restricted: '#8847ff',
  classified: '#d32ce6',
  covert: '#FF4444',
  gold: '#FFD700',
};
