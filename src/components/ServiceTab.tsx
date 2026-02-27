"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// High-fidelity therapist data based on source images
const RECOMMENDATIONS = [
  { name: "flourishing", sales: 270, img: "🌸" },
  { name: "Left Girl", sales: 257, img: "👩‍⚕️" },
  { name: "Rose", sales: 254, img: "🌹" },
];

export default function ServiceTab() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real therapists from Supabase on mount
  useEffect(() => {
    async function getTherapists() {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('sales', { ascending: false });
      
      if (!error) setTherapists(data);
      setLoading(false);
    }
    getTherapists();
  }, []);

  // Handle the order logic
  const handlePlaceOrder = async (therapist: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    const { error } = await supabase.from('orders').insert([
      { 
        user_id: user.id, 
        therapist_id: therapist.id, 
        total_price: therapist.price,
        status: 'pending' 
      }
    ]);

    if (error) {
      alert("Order failed: " + error.message);
    } else {
      alert(`Order for ${therapist.name} placed successfully!`);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 text-left">
      {/* 1. Header & Search Area */}
      <div className="p-6 bg-gradient-to-b from-[#25D366] to-[#F7F8FA] pb-12 rounded-b-[40px] shadow-sm">
        <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase mb-4">豪享到家</h1>
        <div className="bg-white rounded-full px-5 py-3 flex items-center gap-2 shadow-lg">
          <span className="text-gray-400">🔍</span>
          <input className="text-sm outline-none w-full bg-transparent font-medium" placeholder="请输入理疗师姓名..." />
        </div>
      </div>

      {/* 2. Recommendation Horizontal Scroll */}
      <div className="px-4 -mt-6">
        <h3 className="text-[10px] font-black text-gray-400 mb-3 ml-2 italic uppercase tracking-widest">
          Recommend a physical therapist
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {RECOMMENDATIONS.map((item, i) => (
            <div key={i} className="bg-white min-w-[120px] p-4 rounded-[28px] shadow-sm border border-white text-center active:scale-95 transition-transform">
              <div className="w-16 h-16 bg-[#F2FFF9] rounded-[20px] mx-auto mb-3 flex items-center justify-center text-3xl shadow-inner">
                {item.img}
              </div>
              <p className="font-bold text-[12px] text-gray-800 truncate">{item.name}</p>
              <p className="text-[9px] text-gray-400 mt-0.5 font-bold uppercase">Sales {item.sales}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Detailed List from Database */}
      <div className="px-4 space-y-4 mt-2">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs italic">Loading therapists...</div>
        ) : (
          therapists.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-[32px] shadow-sm flex gap-4 border border-white active:scale-98 transition-all">
              <div className="w-24 h-24 bg-[#F2FFF9] rounded-[26px] flex items-center justify-center text-4xl shadow-inner">
                {t.avatar_emoji}
              </div>
              <div className="flex-1 py-1">
                <h3 className="font-bold text-[15px] text-gray-800 underline decoration-[#25D366]/30 underline-offset-4">
                  {t.name}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 font-medium italic">Single quantity {t.sales}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-red-500 font-black text-lg italic">¥{t.price}</span>
                    <span className="text-gray-300 text-[10px] line-through font-bold">¥{t.old_price}</span>
                  </div>
                  <button 
                    onClick={() => handlePlaceOrder(t)}
                    className="bg-[#25D366] text-white text-[10px] px-5 py-2 rounded-full font-bold shadow-md shadow-green-100 uppercase transition-all active:scale-90"
                  >
                    Place order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}