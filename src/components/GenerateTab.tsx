"use client";
import React from 'react';

export default function GenerateTab() {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="py-4 text-center bg-white border-b border-gray-50 mb-4">
        <h1 className="text-lg font-bold">二维码生成</h1>
      </header>

      {/* Universal Live Code Banner */}
      <div className="mx-4 bg-gradient-to-br from-[#4E89FF] to-[#3B66FF] rounded-[32px] p-6 text-white card-shadow relative overflow-hidden mb-6">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 tracking-tight">万能活码</h2>
          <p className="text-[11px] opacity-80 leading-relaxed max-w-[200px]">
            一个码包含文字、图片、视频、文件、导航等所有内容
          </p>
        </div>
        <div className="absolute right-[-15px] bottom-[-15px] w-28 h-28 bg-white/10 rounded-full flex items-center justify-center rotate-12">
          <div className="w-14 h-14 border-2 border-white/20 rounded-2xl" />
        </div>
      </div>

      <div className="px-4 space-y-8">
        <CategorySection title="微信营销 & 裂变">
          <GenItem title="永久微信群" desc="永不过期的群码" icon="👥" color="bg-green-50" />
          <GenItem title="动态好友码" desc="随时切换微信号" icon="💬" color="bg-green-50" />
          <GenItem title="循环群码" desc="多群自动轮询" icon="🔄" color="bg-cyan-50" />
          <GenItem title="循环好友码" desc="多号分流引流" icon="🔀" color="bg-cyan-50" />
        </CategorySection>

        <CategorySection title="文件 & 多媒体">
          <GenItem title="图片活码" desc="支持多图轮播" icon="🖼️" color="bg-purple-50" />
          <GenItem title="视频活码" desc="本地上传/链接" icon="🎥" color="bg-indigo-50" />
          <GenItem title="音频活码" desc="语音/音乐分享" icon="🎙️" color="bg-red-50" />
          <GenItem title="文件活码" desc="PDF/Word/Excel" icon="📄" color="bg-orange-50" />
        </CategorySection>
      </div>
    </div>
  );
}

function CategorySection({ title, children }: any) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-bold text-[#333] mb-4 px-2 text-sm">
        <span className="w-1 h-4 bg-[#3B66FF] rounded-full" /> {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function GenItem({ title, desc, icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-[28px] card-shadow flex items-center gap-3 border border-white active:scale-95 transition-all">
      <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center text-xl`}>{icon}</div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-bold text-[13px] truncate">{title}</p>
        <p className="text-[9px] text-gray-400 truncate mt-0.5">{desc}</p>
      </div>
    </div>
  );
}