// "use client";
// import { useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) alert(error.message);
//     else router.push('/');
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-[#F7F8FA] p-8 flex flex-col justify-center text-left">
//       <div className="bg-white p-8 rounded-[40px] shadow-xl">
//         <h1 className="text-3xl font-black italic mb-2 tracking-tighter">Login to Master</h1>
//         <p className="text-gray-400 text-sm mb-8">Unlock AI points and order tracking</p>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <input type="email" placeholder="Email Address" className="w-full p-5 rounded-3xl bg-[#F8FAFB] outline-none border-2 border-transparent focus:border-blue-500 transition-all font-medium" onChange={(e) => setEmail(e.target.value)} />
//           <input type="password" placeholder="Password" className="w-full p-5 rounded-3xl bg-[#F8FAFB] outline-none border-2 border-transparent focus:border-blue-500 transition-all font-medium" onChange={(e) => setPassword(e.target.value)} />
//           <button className="w-full bg-[#1A1A1A] text-white p-5 rounded-3xl font-bold shadow-2xl active:scale-95 transition-transform mt-4 italic uppercase tracking-widest">Sign In Now</button>
//         </form>
//       </div>
//     </div>
//   );
// }