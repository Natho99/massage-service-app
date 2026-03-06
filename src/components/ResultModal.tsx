"use client";
import React from 'react';

export default function ResultModal({ tool, onClose }: any) {
  const handleDownload = () => {
    // In a real app, this would be a blob link to the generated image
    alert("正在下载您的 " + tool.title + " 作品...");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-white w-full max-w-sm rounded-[40px] p-8 animate-in zoom-in-95 duration-300 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          ✨
        </div>
        
        <h2 className="text-2xl font-black italic tracking-tighter mb-2">生成成功!</h2>
        <p className="text-gray-400 text-sm mb-8 font-medium">您的{tool.title}已完成艺术重绘</p>

        {/* Result Preview Container */}
        <div className="aspect-square w-full bg-[#F8FAFB] rounded-[32px] mb-8 overflow-hidden shadow-inner border-4 border-white flex items-center justify-center">
          <img 
            src={tool.img} 
            alt="Result" 
            className="w-full h-full object-cover grayscale-0 scale-110"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleDownload}
            className="w-full bg-[#3B66FF] text-white py-4 rounded-[24px] font-black text-sm shadow-xl shadow-blue-200 active:scale-95 transition-all"
          >
            保存到相册
          </button>
          <button 
            onClick={onClose} 
            className="w-full py-2 text-gray-400 font-bold text-xs uppercase tracking-widest"
          >
            返回工具箱
          </button>
        </div>
      </div>
    </div>
  );
}