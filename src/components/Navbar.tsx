"use client";
import React from 'react';

export default function Navbar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-around py-4 px-2 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] rounded-t-[40px]">
      <NavBtn active={activeTab === 'beautify'} label="美化" icon="✨" onClick={() => setActiveTab('beautify')} />
      <NavBtn active={activeTab === 'service'} label="服务" icon="💆" onClick={() => setActiveTab('service')} />
      <NavBtn active={activeTab === 'orders'} label="订单" icon="📋" onClick={() => setActiveTab('orders')} />
      <NavBtn active={activeTab === 'mine'} label="我的" icon="👤" onClick={() => setActiveTab('mine')} />
    </nav>
  );
}

function NavBtn({ active, label, icon, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-[#3B66FF]' : 'text-gray-300'}`}>
      <span className={`text-2xl transition-all duration-300 ${active ? 'scale-125 drop-shadow-md' : 'opacity-40 grayscale'}`}>{icon}</span>
      <span className={`text-[10px] font-black tracking-widest ${active ? 'opacity-100' : 'opacity-60 uppercase'}`}>{label}</span>
    </button>
  );
}