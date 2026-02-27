"use client";
import { useState } from 'react';

export default function GenerateForm() {
  const [content, setContent] = useState('');

  return (
    <div className="max-w-md mx-auto bg-[#F7F8FA] min-h-screen p-4 pb-32 text-left">
      <header className="flex items-center gap-4 py-6 px-4">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl font-bold transition-all active:scale-90">←</button>
        <h1 className="font-extrabold text-lg italic uppercase tracking-tighter">二维码生成</h1>
      </header>

      <div className="bg-white rounded-[40px] p-8 shadow-sm mb-6 border border-white">
        <p className="text-xs font-black text-[#25D366] mb-4 border-l-4 border-[#25D366] pl-2 uppercase tracking-widest">当前背景预览</p>
        <div className="aspect-square bg-[#F8FAFB] rounded-[32px] flex items-center justify-center border-dashed border-2 border-gray-100 shadow-inner">
           <span className="text-gray-300 text-sm font-bold italic">Template Preview</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-white">
        <p className="font-bold text-sm mb-4 italic">设置二维码内容</p>
        <textarea 
          className="w-full h-44 bg-[#F8FAFB] rounded-3xl p-5 text-sm outline-none border-2 border-transparent focus:border-[#25D366] transition-all font-medium resize-none"
          placeholder="在此输入二维码内容，或点击扫码提取..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="w-full bg-[#25D366] text-white py-5 rounded-3xl mt-8 font-black shadow-xl shadow-green-200 uppercase tracking-widest italic transition-all active:scale-95">
          开始美化
        </button>
      </div>
    </div>
  );
}