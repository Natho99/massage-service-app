"use client";
import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (result.success) {
      setIsAuth(true);
      fetchAdminData();
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin');
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  const apiAction = async (action: string, payload: any) => {
    await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({ action, payload })
    });
    fetchAdminData();
  };

  const handleAddUser = () => {
    const email = prompt("User Email:");
    const password = prompt("User Password:");
    if (email && password) apiAction('ADD_USER', { email, password, points: 0 });
  };

  const handleAddTherapist = () => {
    const name = prompt("Therapist Name:");
    const price = prompt("Price (¥):");
    const emoji = prompt("Avatar Emoji (e.g. 👩‍⚕️):");
    if (name && price) {
      apiAction('ADD_THERAPIST', { 
        name, 
        price: parseInt(price), 
        old_price: parseInt(price) + 50, 
        avatar_emoji: emoji || "👤", 
        sales: 0, 
        type: "instant" 
      });
    }
  };

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#25D366] flex flex-col items-center justify-center p-6">
        <form onSubmit={handleAdminLogin} className="bg-white p-10 rounded-[48px] w-full shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black italic tracking-tighter">ADMIN PANEL</h1>
          </div>
          <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-[#25D366]" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl mb-8 outline-none border-2 border-transparent focus:border-[#25D366]" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-[#25D366] text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Login</button>
        </form>
        <button onClick={() => window.location.href = '/'} className="mt-8 text-white font-bold underline opacity-80 text-sm">Back to Home</button>
      </div>
    );
  }

  if (loading || !data) return <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex items-center justify-center font-bold text-[#25D366]">LOADING...</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F8FA] pb-10 text-left">
      <div className="p-6 bg-[#25D366] rounded-b-[40px] shadow-lg mb-6">
        <div className="flex justify-between items-center text-white mb-6">
          <h1 className="text-3xl font-black italic">DATABASE</h1>
          <button onClick={() => window.location.reload()} className="text-[10px] font-bold underline">LOGOUT</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 p-4 rounded-3xl text-white">
            <p className="text-[8px] font-bold uppercase opacity-60">Total Users</p>
            <p className="text-2xl font-black">{data.users.length}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-3xl text-white">
            <p className="text-[8px] font-bold uppercase opacity-60">Revenue</p>
            <p className="text-2xl font-black">¥{data.orders.reduce((s:any,o:any)=>s+o.price,0)}</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* User Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Access</h2>
            <button onClick={handleAddUser} className="text-[10px] bg-[#25D366] text-white px-3 py-1 rounded-full font-bold">+ Add User</button>
          </div>
          <div className="bg-white rounded-[32px] p-4 shadow-sm space-y-4">
            {data.users.map((u: any) => (
              <div key={u.email} className="flex justify-between items-center p-2 border-b last:border-0 border-gray-50 pb-4">
                <div className="truncate pr-2">
                  <p className="text-xs font-bold truncate">{u.email}</p>
                  <p className="text-[10px] text-[#25D366] font-black italic">Points: {u.points}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => {
                     const p = prompt("New points:", u.points);
                     if(p) apiAction('UPDATE_POINTS', { email: u.email, points: parseInt(p) });
                   }} className="text-[9px] font-bold text-blue-500">Edit</button>
                   <button onClick={() => confirm('Delete?') && apiAction('DELETE_USER', { email: u.email })} className="text-[9px] font-bold text-red-500">Del</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Therapist Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff</h2>
            <button onClick={handleAddTherapist} className="text-[10px] bg-[#25D366] text-white px-3 py-1 rounded-full font-bold">+ Add Staff</button>
          </div>
          <div className="bg-white rounded-[32px] p-4 shadow-sm space-y-4">
            {data.therapists.map((t: any) => (
              <div key={t.id} className="flex justify-between items-center p-2 border-b last:border-0 border-gray-50 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.avatar_emoji}</span>
                  <p className="text-xs font-bold">{t.name} (¥{t.price})</p>
                </div>
                <button onClick={() => confirm('Delete?') && apiAction('DELETE_THERAPIST', { id: t.id })} className="text-[9px] font-bold text-red-500">Remove</button>
              </div>
            ))}
          </div>
        </section>

        {/* Global Orders */}
        <section>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Active Orders</h2>
          <div className="space-y-3">
            {data.orders.map((o: any) => (
              <div key={o.id} className="bg-white p-4 rounded-[28px] shadow-sm flex justify-between items-center border border-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{o.img}</span>
                  <div>
                    <p className="text-[11px] font-bold">{o.therapist_name}</p>
                    <p className="text-[8px] text-gray-400">{o.user_email}</p>
                  </div>
                </div>
                {o.status === 'pending' && (
                  <button onClick={() => apiAction('UPDATE_ORDER_STATUS', { id: o.id, status: 'complete' })} className="bg-[#25D366] text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase">Finish</button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}