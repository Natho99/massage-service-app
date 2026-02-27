"use client";
import React, { useState } from 'react';
import BeautifyTab from '@/components/BeautifyTab';
import GenerateTab from '@/components/GenerateTab';
import ServiceTab from '@/components/ServiceTab';
import OrderTab from '@/components/OrderTab';
import MineTab from '@/components/MineTab';

export default function AppContainer() {
  const [activeTab, setActiveTab] = useState('beautify');

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-x-hidden bg-[#F7F8FA]">
      
      {/* 1. Mini Program Header Controls (Top Right) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
        <div className="flex gap-1 pr-2 border-r border-gray-200">
          <div className="w-1.5 h-1.5 bg-black rounded-full opacity-30" />
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
          <div className="w-1.5 h-1.5 bg-black rounded-full opacity-30" />
        </div>
        <div className="pl-1 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Area */}
      <main className="pb-24">
        {activeTab === 'beautify' && <BeautifyTab />}
        {activeTab === 'generate' && <GenerateTab />}
        {activeTab === 'service' && <ServiceTab />}
        {activeTab === 'order' && <OrderTab />}
        {activeTab === 'mine' && <MineTab />}
      </main>

      {/* 3. Bottom Nav Bar - Updated for 5 Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-around py-3 px-1 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]">
        <NavBtn active={activeTab === 'beautify'} label="美化" icon="✨" onClick={() => setActiveTab('beautify')} />
        <NavBtn active={activeTab === 'generate'} label="生成" icon="🧩" onClick={() => setActiveTab('generate')} />
        <NavBtn active={activeTab === 'service'} label="服务" icon="💆" onClick={() => setActiveTab('service')} />
        <NavBtn active={activeTab === 'order'} label="订单" icon="📋" onClick={() => setActiveTab('order')} />
        <NavBtn active={activeTab === 'mine'} label="我的" icon="👤" onClick={() => setActiveTab('mine')} />
      </nav>
    </div>
  );
}

/**
 * Reusable Navigation Button with Active State Scaling
 *
 */
function NavBtn({ active, label, icon, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-[#3B66FF]' : 'text-gray-300'}`}
    >
      <span className={`text-xl transition-all duration-300 ${active ? 'scale-125 drop-shadow-md' : 'opacity-40 grayscale'}`}>
        {icon}
      </span>
      <span className={`text-[9px] font-bold tracking-tighter uppercase transition-opacity ${active ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
    </button>
  );
}