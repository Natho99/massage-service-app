"use client";
import React, { useEffect, useState } from 'react';

export default function OrderTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // filter state: 'all' | 'pending' | 'complete'
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('all');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Fetch orders for this user from our JSON API
      fetch(`/api/orders?email=${parsedUser.email}`)
        .then(res => res.json())
        .then(data => {
          // Sort by newest first
          const sorted = data.sort((a: any, b: any) => b.id.localeCompare(a.id));
          setOrders(sorted);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Filter logic based on the status in db.json
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
      <div className="w-6 h-6 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-[#F7F8FA] pb-24">
      {/* 1. Dynamic Header Filters */}
      <header className="bg-white p-4 border-b flex justify-around text-xs font-bold text-gray-400 uppercase tracking-widest shadow-sm sticky top-0 z-10">
        {['all', 'pending', 'complete'].map((type) => (
          <button 
            key={type}
            onClick={() => setFilter(type as any)}
            className={`pb-1 transition-all capitalize ${
              filter === type ? 'text-[#25D366] border-b-2 border-[#25D366]' : 'hover:text-gray-600'
            }`}
          >
            {type === 'all' ? '全部' : type === 'pending' ? '进行中' : '已完成'}
          </button>
        ))}
      </header>
      
      {!user ? (
        <div className="flex flex-col items-center justify-center p-10 text-center mt-20">
          <div className="w-40 h-40 bg-white rounded-[40px] mb-8 flex items-center justify-center shadow-sm opacity-10 text-6xl italic">📋</div>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed px-6 font-medium italic">请登录后查看订单</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-[#25D366] text-white px-12 py-4 rounded-[24px] font-black text-xs shadow-xl active:scale-95 transition-transform"
          >
            立即登录
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-20 text-center text-gray-400 font-medium italic animate-in slide-in-from-bottom-4">
          <div className="text-4xl mb-4 opacity-20">📦</div>
          暂无相关订单
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-[32px] shadow-sm flex flex-col gap-4 border border-white animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4">
                {/* Image Box */}
                <div className="w-16 h-16 bg-[#F2FFF9] rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  {order.img}
                </div>
                
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[15px] text-gray-800">{order.therapist_name}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                      order.status === 'complete' ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-[#25D366]'
                    }`}>
                      {order.status === 'complete' ? '已完成' : '预约中'}
                    </span>
                  </div>
                  
                  {/* Appointment Time - The New Enhanced Part */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {order.appointment_time && order.appointment_time !== 'Instant' ? (
                        <span className="text-orange-500 font-bold italic">
                          📅 预约时间: {order.appointment_time}
                        </span>
                      ) : (
                        `🕒 下单日期: ${order.date}`
                      )}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-red-500 font-black text-sm italic">¥{order.price}</p>
                    {order.status === 'pending' && (
                       <button className="text-[9px] text-[#25D366] font-bold border border-[#25D366]/30 px-3 py-1 rounded-full active:bg-[#25D366] active:text-white transition-colors">
                         联系理疗师
                       </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}