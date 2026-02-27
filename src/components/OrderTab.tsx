"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrderTab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        // Direct getUser check avoids complex session destructuring errors
        const { data } = await supabase.auth.getUser();
        setIsLoggedIn(!!data?.user);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#F7F8FA]" />; // Clean loading state
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      {/* Tab Header */}
      <header className="bg-white p-4 border-b flex justify-around text-xs font-bold text-gray-400 uppercase tracking-widest shadow-sm">
        <span className="text-[#25D366] border-b-2 border-[#25D366] pb-1 cursor-pointer">All</span>
        <span className="cursor-pointer">Pending</span>
        <span className="cursor-pointer">Complete</span>
      </header>
      
      {!isLoggedIn ? (
        /* Empty State / Login Prompt */
        <div className="flex flex-col items-center justify-center p-10 text-center mt-20">
          <div className="w-40 h-40 bg-white rounded-[40px] mb-8 flex items-center justify-center shadow-sm opacity-10 text-6xl font-bold italic">
            📋
          </div>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed px-6 font-medium italic">
            No order data available. Please log in to view.
          </p>
          <button 
            onClick={() => window.location.href = '#mine'} 
            className="bg-[#25D366] text-white px-12 py-4 rounded-[24px] font-black text-xs shadow-xl active:scale-95 transition-transform uppercase tracking-widest"
          >
            Log in now
          </button>
        </div>
      ) : (
        /* Logged In State */
        <div className="p-10 text-center text-gray-400 font-medium italic">
          No orders found for this account.
        </div>
      )}
    </div>
  );
}