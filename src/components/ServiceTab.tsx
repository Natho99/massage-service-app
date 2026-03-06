"use client";
import React, { useEffect, useState } from 'react';
import BookingModal from './BookingModal'; // Ensure you created this file in the previous step

export default function ServiceTab() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);

  useEffect(() => {
    fetch('/api/therapists')
      .then(res => res.json())
      .then(data => setTherapists(data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTherapists = therapists.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (therapist: any) => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      alert("请先登录以进行操作");
      return;
    }

    if (therapist.type === 'preorder') {
      setSelectedTherapist(therapist);
      setShowModal(true);
    } else {
      processOrder(therapist);
    }
  };

  const processOrder = async (therapist: any, date?: string, time?: string) => {
    const user = JSON.parse(localStorage.getItem('user')!);
    
    // Local balance check
    if (user.points < therapist.price) {
      alert("余额不足，请在个人中心充值");
      return;
    }

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          therapist,
          appointment: date ? `${date} ${time}` : 'Instant' 
        })
      });

      const data = await res.json();
      if (data.success) {
        // Sync points to localStorage
        const updatedUser = { ...user, points: data.newPoints };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert(date ? `✅ 预约成功: ${date} ${time}` : "✅ 下单成功！");
        setShowModal(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("提交失败，请重试");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 text-left">
      {/* Header & Search Area */}
      <div className="p-6 bg-gradient-to-b from-[#25D366] to-[#F7F8FA] pb-12 rounded-b-[40px] shadow-sm">
        <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase mb-4">豪享到家</h1>
        <div className="bg-white rounded-full px-5 py-3 flex items-center gap-2 shadow-lg">
          <span className="text-gray-400">🔍</span>
          <input 
            className="text-sm outline-none w-full bg-transparent font-medium" 
            placeholder="搜索理疗师..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List Area */}
      <div className="px-4 space-y-4 -mt-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 italic">加载中...</div>
        ) : filteredTherapists.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-[32px] shadow-sm flex gap-4 border border-white">
            <div className="w-24 h-24 bg-[#F2FFF9] rounded-[26px] flex items-center justify-center text-4xl shadow-inner">
              {t.avatar_emoji}
            </div>
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-[15px] text-gray-800">{t.name}</h3>
                {t.type === 'preorder' && (
                  <span className="bg-orange-100 text-orange-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">PREORDER</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-medium italic">销量 {t.sales}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-red-500 font-black text-lg italic">¥{t.price}</span>
                <button 
                  onClick={() => handleActionClick(t)}
                  className={`text-[10px] px-5 py-2 rounded-full font-bold shadow-md uppercase transition-all active:scale-90 ${
                    t.type === 'preorder' ? 'bg-[#1C1C1E] text-white' : 'bg-[#25D366] text-white shadow-green-100'
                  }`}
                >
                  {t.type === 'preorder' ? '立即预约' : '立即下单'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal Popup */}
      {showModal && (
        <BookingModal 
          therapist={selectedTherapist} 
          onClose={() => setShowModal(false)}
          onConfirm={(date: string, time: string) => processOrder(selectedTherapist, date, time)}
        />
      )}
    </div>
  );
}