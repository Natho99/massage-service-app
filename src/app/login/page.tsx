"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F8FA] p-8 flex flex-col justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter text-[#1A1A1A]">欢迎回来</h1>
        <p className="text-gray-400 mt-2 font-medium italic">登录您的创作中心</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="email" placeholder="邮箱地址" 
          className="w-full p-5 rounded-[24px] bg-white shadow-sm outline-none border-2 border-transparent focus:border-[#3B66FF] transition-all"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="密码" 
          className="w-full p-5 rounded-[24px] bg-white shadow-sm outline-none border-2 border-transparent focus:border-[#3B66FF] transition-all"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-[#3B66FF] text-white p-5 rounded-[24px] font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
          立即登录
        </button>
      </form>
    </div>
  );
}