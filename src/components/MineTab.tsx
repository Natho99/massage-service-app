"use client";
import React, { useEffect, useState } from 'react';

type SubView = 'main' | 'livecodes' | 'domains' | 'favorites' | 'history';

export default function MineTab() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initial Fetch & Auth Check
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Fetch latest orders/history for this specific user
      fetch(`/api/orders?email=${parsedUser.email}`)
        .then(res => res.json())
        .then(data => {
          // Sort newest first
          const sorted = data.sort((a: any, b: any) => b.id.localeCompare(a.id));
          setOrders(sorted);
        })
        .catch(err => console.error("History fetch error:", err));
    }
    setLoading(false);
  }, [activeSubView]); // Refresh when user enters a sub-view

  const handleTopUp = async () => {
    if (!user) return alert("请先登录！");
    try {
      const res = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, amount: 100 }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, points: data.points };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert("充值成功！+100 点数");
      }
    } catch (err) {
      alert("充值失败，请检查网络");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Filter Logic for Points History
  const filteredHistory = orders.filter(o => 
    o.therapist_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SubHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => { setActiveSubView('main'); setSearchQuery(""); }} className="text-2xl hover:opacity-50 transition-opacity active:scale-75">←</button>
      <h2 className="text-xl font-black italic">{title}</h2>
    </div>
  );

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-3xl opacity-20">👤</div>
        <p className="text-gray-400 mb-6 italic">登录后查看个人资产</p>
        <button onClick={() => window.location.href = '/login'} className="bg-[#3B66FF] text-white px-8 py-3 rounded-full font-black text-xs uppercase shadow-xl active:scale-95 transition-all">去登录</button>
      </div>
    );
  }

  // --- 1. Live Codes Management (Functional) ---
  if (activeSubView === 'livecodes') {
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-24 text-left p-6 min-h-screen bg-[#F7F8FA]">
        <SubHeader title="活码管理" />
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 opacity-20 italic">暂无生成的活码</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-white p-4 rounded-[28px] shadow-sm flex items-center justify-between border border-white active:scale-95 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">{o.img || '📱'}</div>
                  <div>
                    <p className="font-bold text-sm truncate max-w-[120px]">{o.therapist_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Status: {o.status}</p>
                  </div>
                </div>
                <button className="text-[9px] bg-black text-white px-4 py-2 rounded-xl font-black uppercase italic tracking-widest">Config</button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- 2 & 3. Domains & Favorites (Placeholder with consistent UI) ---
  if (activeSubView === 'domains' || activeSubView === 'favorites') {
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-24 text-left p-6 min-h-screen bg-[#F7F8FA]">
        <SubHeader title={activeSubView === 'domains' ? "域名管理" : "我的收藏"} />
        <div className="bg-white p-10 rounded-[40px] text-center shadow-sm border border-white">
          <div className="text-4xl mb-4 opacity-20">{activeSubView === 'domains' ? '🌐' : '⭐'}</div>
          <p className="text-gray-400 text-xs font-medium italic">此模块正在云端配置中</p>
          <button onClick={() => setActiveSubView('main')} className="mt-6 text-[10px] text-blue-500 font-bold uppercase underline">返回</button>
        </div>
      </div>
    );
  }

  // --- 4. Points History (Fully Functional Search) ---
  if (activeSubView === 'history') {
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-24 text-left p-6 bg-[#F7F8FA] min-h-screen">
        <SubHeader title="点数明细" />
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 mb-6 shadow-sm border border-white">
          <span className="opacity-30 text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="搜索消费项目..." 
            className="bg-transparent outline-none text-xs w-full font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-xs italic">未找到匹配记录</p>
          ) : (
            filteredHistory.map((o) => (
              <div key={o.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-white animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm">{o.img}</div>
                   <div>
                    <p className="text-xs font-bold truncate max-w-[150px]">{o.therapist_name}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-medium">{o.date}</p>
                  </div>
                </div>
                <p className="text-red-500 font-black italic text-sm">-{o.price}</p>
              </div>
            ))
          )}
          {/* Welcome Credit Entry */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-400">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">🎁</div>
                <div>
                  <p className="text-xs font-bold">初始赠送/充值记录</p>
                  <p className="text-[9px] text-gray-400 font-bold">PROCESSED</p>
                </div>
             </div>
             <p className="text-green-500 font-black italic text-sm">+500</p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN PROFILE VIEW ---
  return (
    <div className="animate-in fade-in duration-500 pb-24 text-left">
      <header className="py-4 text-center font-black italic tracking-widest text-sm opacity-40 uppercase">Account Profile</header>
      
      {/* Profile Card */}
      <div className="mx-4 bg-white rounded-[40px] p-8 shadow-sm mb-4 border border-white">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#3B66FF] to-[#1C1C1E] rounded-full flex items-center justify-center border-4 border-[#F7F8FA] text-white text-3xl font-black shadow-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter">创作达人</h2>
            <p className="text-[10px] text-gray-400 mt-1 font-bold">{user?.email}</p>
          </div>
        </div>

        {/* Points Display */}
        <div className="bg-[#1C1C1E] rounded-[32px] p-6 text-white flex justify-between items-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[#FFD600] text-[9px] font-black mb-1 italic tracking-widest uppercase opacity-70">Available Points</p>
            <p className="text-3xl font-black italic text-[#FFD600]">{user?.points || 0}</p>
          </div>
          <button onClick={handleTopUp} className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black active:scale-90 transition-all z-10 shadow-lg uppercase">Top Up</button>
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Grid Menu */}
      <div className="mx-4 bg-white rounded-[40px] p-8 shadow-sm mb-4 border border-white">
        <h3 className="font-black text-[10px] text-gray-300 uppercase tracking-[0.2em] mb-8 px-2">Manage Studio</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div onClick={() => setActiveSubView('livecodes')}><ManagementItem icon="📱" label="活码" color="bg-blue-50" /></div>
          <div onClick={() => setActiveSubView('domains')}><ManagementItem icon="🌐" label="域名" color="bg-orange-50" /></div>
          <div onClick={() => setActiveSubView('favorites')}><ManagementItem icon="⭐" label="收藏" color="bg-purple-50" /></div>
          <div onClick={() => setActiveSubView('history')}><ManagementItem icon="📝" label="明细" color="bg-green-50" /></div>
        </div>
      </div>

      <button onClick={handleLogout} className="w-full text-gray-300 text-[10px] font-bold underline mt-6 uppercase tracking-widest active:text-red-400 transition-colors">Logout Account</button>
    </div>
  );
}

function ManagementItem({ icon, label, color }: { icon: string, label: string, color: string }) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group active:scale-90 transition-transform">
      <div className={`w-12 h-12 ${color} rounded-[22px] flex items-center justify-center text-xl shadow-inner`}>{icon}</div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{label}</span>
    </div>
  );
}