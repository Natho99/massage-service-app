"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MineTab() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error) setProfile(data);
    }
    setLoading(false);
  }

  const handleTopUp = async () => {
    if (!user) return alert("Please log in first!");

    // Simulate a top-up of 100 points
    const { error } = await supabase
      .from('profiles')
      .update({ points: (profile?.points || 0) + 100 })
      .eq('id', user.id);

    if (error) alert("Top up failed");
    else fetchProfile(); // Refresh balance
  };

  if (!user && !loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-400 mb-4 italic">Please log in to view assets.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-24 text-left">
      <header className="py-4 text-center font-bold">个人中心</header>
      
      {/* Profile Section */}
      <div className="mx-4 bg-white rounded-[32px] p-6 shadow-sm mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-4 border-[#F7F8FA] overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-black" /><div className="w-2 h-2 bg-black" />
                <div className="w-2 h-2 bg-black" /><div className="w-2 h-2 bg-black" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black italic">美化大师</h2>
            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* AI Points Card */}
        <div className="bg-[#1C1C1E] rounded-[24px] p-5 text-white flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[#FFD600] text-[10px] font-bold mb-1 italic">⚡ AI 创作点数</p>
            <p className="text-2xl font-black italic text-[#FFD600]">
              {loading ? "..." : (profile?.points || 0)}
            </p>
            <p className="text-[9px] text-gray-400 mt-1">用于生成 AI 二维码及艺术字</p>
          </div>
          <button 
            onClick={handleTopUp}
            className="bg-[#FFE48F] text-[#5C4000] px-5 py-2 rounded-full text-xs font-bold active:scale-95 transition-transform shadow-md shadow-yellow-900/20"
          >
            立即获取
          </button>
        </div>
      </div>

      {/* Management Grid */}
      <div className="mx-4 bg-white rounded-[32px] p-6 shadow-sm mb-4">
        <h3 className="font-bold mb-6 text-sm text-gray-400 uppercase tracking-widest">创作管理</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📱</div>
            <span className="text-[10px] font-bold text-gray-600">活码管理</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-xl">🌐</div>
            <span className="text-[10px] font-bold text-gray-600">域名管理</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-xl">⭐</div>
            <span className="text-[10px] font-bold text-gray-600">我的收藏</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-xl">📝</div>
            <span className="text-[10px] font-bold text-gray-600">点数记录</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
        className="w-full text-gray-400 text-xs underline mt-4"
      >
        退出登录
      </button>
    </div>
  );
}