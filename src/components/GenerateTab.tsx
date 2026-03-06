"use client";
import React, { useState, useEffect } from 'react';

export default function GenerateTab() {
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  // Sync points with local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserPoints(user.points || 0);
  }, [loading]);

  const handleGenerate = async (item: any) => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return alert("请先登录以创建活码");
    
    const user = JSON.parse(savedUser);
    const cost = 5; // Standard cost for generation

    if (user.points < cost) return alert("余额不足，生成一个活码需要 5 点数");

    if (!confirm(`确认消耗 ${cost} 点数创建 ${item.title}?`)) return;

    setLoading(true);

    try {
      const res = await fetch('/api/beautify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, toolTitle: item.title, cost: cost })
      });
      const data = await res.json();

      if (data.success) {
        // Update local storage
        user.points = data.newPoints;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Simulate Generation
        setTimeout(() => {
          setLoading(false);
          alert(`✅ ${item.title} 创建成功！您可以前往“活码管理”查看。`);
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      alert("创建失败，请检查网络");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 bg-[#F7F8FA] min-h-screen">
      <header className="py-6 px-6 bg-white border-b border-gray-100 mb-4 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter">二维码生成</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Create Live Code</p>
        </div>
        <div className="bg-[#1C1C1E] text-[#FFD600] px-4 py-1.5 rounded-full text-[10px] font-black italic shadow-lg">
          ⚡ {userPoints}
        </div>
      </header>

      {/* Universal Live Code Banner */}
      <div 
        onClick={() => handleGenerate({title: "万能活码"})}
        className="mx-4 bg-gradient-to-br from-[#4E89FF] to-[#3B66FF] rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden mb-8 active:scale-95 transition-all cursor-pointer"
      >
        <div className="relative z-10">
          <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4">Master Code</div>
          <h2 className="text-3xl font-black mb-2 tracking-tighter italic">万能活码</h2>
          <p className="text-[11px] opacity-80 leading-relaxed max-w-[180px] font-medium">
            一个码包含文字、图片、视频、文件、导航等所有内容
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-white/10 rounded-full flex items-center justify-center rotate-12">
          <div className="w-20 h-20 border-4 border-white/20 rounded-[32px] flex items-center justify-center">
             <div className="w-8 h-8 bg-white/20 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="px-4 space-y-8">
        <CategorySection title="微信营销 & 裂变">
          <GenItem onClick={handleGenerate} title="永久微信群" desc="永不过期的群码" icon="👥" color="bg-green-50" />
          <GenItem onClick={handleGenerate} title="动态好友码" desc="随时切换微信号" icon="💬" color="bg-green-50" />
          <GenItem onClick={handleGenerate} title="循环群码" desc="多群自动轮询" icon="🔄" color="bg-cyan-50" />
          <GenItem onClick={handleGenerate} title="循环好友码" desc="多号分流引流" icon="🔀" color="bg-cyan-50" />
        </CategorySection>

        <CategorySection title="文件 & 多媒体">
          <GenItem onClick={handleGenerate} title="图片活码" desc="支持多图轮播" icon="🖼️" color="bg-purple-50" />
          <GenItem onClick={handleGenerate} title="视频活码" desc="本地上传/链接" icon="🎥" color="bg-indigo-50" />
          <GenItem onClick={handleGenerate} title="音频活码" desc="语音/音乐分享" icon="🎙️" color="bg-red-50" />
          <GenItem onClick={handleGenerate} title="文件活码" desc="PDF/Word/Excel" icon="📄" color="bg-orange-50" />
        </CategorySection>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-[40px] flex flex-col items-center shadow-2xl animate-in zoom-in-95">
            <div className="w-10 h-10 border-4 border-[#3B66FF] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-black italic">正在创建容器...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ title, children }: any) {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h3 className="flex items-center gap-2 font-black text-gray-800 mb-4 px-2 text-xs uppercase tracking-widest">
        <span className="w-1 h-3 bg-[#3B66FF] rounded-full" /> {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function GenItem({ title, desc, icon, color, onClick }: any) {
  return (
    <div 
      onClick={() => onClick({title, desc})}
      className="bg-white p-4 rounded-[32px] shadow-sm flex items-center gap-3 border border-white active:scale-95 active:bg-gray-50 transition-all cursor-pointer group"
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-bold text-[13px] truncate text-gray-800">{title}</p>
        <p className="text-[9px] text-gray-400 truncate mt-0.5 font-medium">{desc}</p>
      </div>
    </div>
  );
}