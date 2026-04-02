import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import CasesPage from '@/pages/CasesPage';
import InventoryPage from '@/pages/InventoryPage';
import ContractsPage from '@/pages/ContractsPage';
import UpgradesPage from '@/pages/UpgradesPage';
import DepositPage from '@/pages/DepositPage';
import ProfilePage from '@/pages/ProfilePage';
import { Skin } from '@/data/skins';

export default function Index() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1500);
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [totalOpened, setTotalOpened] = useState(0);
  const [totalDropped, setTotalDropped] = useState(0);

  const handleSpend = (amount: number) => {
    setBalance(b => b - amount);
    setTotalOpened(n => n + 1);
  };

  const handleAddSkin = (skin: Skin) => {
    setInventory(inv => [...inv, skin]);
    setTotalDropped(n => n + 1);
  };

  const handleSell = (skin: Skin) => {
    setInventory(inv => {
      const idx = inv.findIndex(s => s === skin);
      if (idx === -1) return inv;
      const next = [...inv];
      next.splice(idx, 1);
      return next;
    });
    setBalance(b => b + skin.price);
  };

  const handleContractComplete = (removed: Skin[], received: Skin) => {
    setInventory(inv => {
      const next = [...inv];
      for (const r of removed) {
        const idx = next.findIndex(s => s === r);
        if (idx !== -1) next.splice(idx, 1);
      }
      next.push(received);
      return next;
    });
  };

  const handleUpgrade = (from: Skin, to: Skin | null) => {
    setInventory(inv => {
      const idx = inv.findIndex(s => s === from);
      if (idx === -1) return inv;
      const next = [...inv];
      next.splice(idx, 1);
      if (to) next.push(to);
      return next;
    });
  };

  const handleDeposit = (amount: number) => {
    setBalance(b => b + amount);
    setPage('cases');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        balance={balance}
        activePage={page}
        onNavigate={setPage}
        onDeposit={() => setPage('deposit')}
      />

      {page === 'home' && (
        <HomePage
          onNavigate={setPage}
          onDeposit={() => setPage('deposit')}
          totalOpened={totalOpened}
          totalDropped={totalDropped}
        />
      )}
      {page === 'cases' && (
        <CasesPage
          balance={balance}
          onSpend={handleSpend}
          onAddSkin={handleAddSkin}
        />
      )}
      {page === 'inventory' && (
        <InventoryPage
          inventory={inventory}
          onSell={handleSell}
        />
      )}
      {page === 'contracts' && (
        <ContractsPage
          inventory={inventory}
          onContractComplete={handleContractComplete}
        />
      )}
      {page === 'upgrades' && (
        <UpgradesPage
          inventory={inventory}
          onUpgrade={handleUpgrade}
        />
      )}
      {page === 'deposit' && (
        <DepositPage
          onDeposit={handleDeposit}
          onClose={() => setPage('home')}
        />
      )}
      {page === 'profile' && (
        <ProfilePage
          inventory={inventory}
          balance={balance}
          totalOpened={totalOpened}
          onDeposit={() => setPage('deposit')}
        />
      )}
    </div>
  );
}