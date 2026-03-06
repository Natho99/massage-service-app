"use client";
import React, { useState, useEffect } from 'react';
import ResultModal from './ResultModal';

const TOOLS = [
  { title: "网红二维码", desc: "流行爆款模板", badge: null, img: "/a.png", cost: 10 },
  { title: "自定义美化", desc: "自由配色样式", badge: null, img: "/b.png", cost: 5 },
  { title: "创意二维码", desc: "艺术融合视觉", badge: "HOT", img: "/c.png", cost: 20 },
  { title: "个性二维码", desc: "独特参数化风格", badge: null, img: "/d.png", cost: 15 },
  { title: "AI 二维码", desc: "人工智能生成", badge: "BETA", img: "/e.png", cost: 50 },
  { title: "AI 艺术字", desc: "文字创意重绘", badge: "推荐", img: "/f.png", cost: 50 },
  { title: "艺术二维码", desc: "精选设计", badge: null, img: "/g.png", cost: 20 },
  { title: "AI 生成器", desc: "更多AI工具", badge: null, img: "/h.png", cost: 40 },
  { title: "收款码合并", desc: "多码合一工具", badge: null, img: "/i.png", cost: 0 },
  { title: "二维码解析", desc: "解码与提取", badge: null, img: "/j.png", cost: 0 },
];

export default function BeautifyTab() {
  const [processing, setProcessing] = useState(false);
  const [activeTool, setActiveTool] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  // Sync points with local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserPoints(user.points || 0);
  }, [processing]);

  const handleToolClick = async (tool: any) => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return alert("请先登录以使用创作工具");
    
    const user = JSON.parse(savedUser);
    if (user.points < tool.cost) return alert("余额不足，请先充值");

    if (!confirm(`确认消耗 ${tool.cost} 点数使用 ${tool.title}?`)) return;

    setProcessing(true);
    setActiveTool(tool);

    try {
      const res = await fetch('/api/beautify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, toolTitle: tool.title, cost: tool.cost })
      });
      const data = await res.json();

      if (data.success) {
        // Update local storage and state balance
        const updatedUser = { ...user, points: data.newPoints };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserPoints(data.newPoints);
        
        // Simulate Generation Delay (2 seconds)
        setTimeout(() => {
          setProcessing(false);
          setShowResult(true);
        }, 2000);
      } else {
        alert(data.message);
        setProcessing(false);
      }
    } catch (err) {
      setProcessing(false);
      alert("生成请求失败");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 overflow-x-hidden">
      <header className="p-8 pt-12 bg-white rounded-b-[40px] shadow-sm mb-6 sticky top-0 z-20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold italic tracking-tighter">创作工具</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium italic">不仅好用，更是设计</p>
          </div>
          <div className="bg-[#1C1C1E] text-[#FFD600] px-4 py-2 rounded-2xl text-[10px] font-black italic shadow-lg flex flex-col items-center">
            <span className="opacity-50 text-[7px] uppercase tracking-tighter mb-0.5">My Points</span>
            {userPoints}
          </div>
        </div>
      </header>

      <div className="px-5 grid grid-cols-2 gap-4">
        {TOOLS.map((tool, i) => (
          <div 
            key={i} 
            onClick={() => !processing && handleToolClick(tool)}
            className="group bg-white rounded-[32px] p-4 shadow-sm relative border border-white active:scale-95 transition-all cursor-pointer hover:border-[#25D366]/30 overflow-hidden"
          >
            {tool.badge && (
              <span className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-2xl rounded-tr-[32px] z-10 ${tool.badge === 'HOT' || tool.badge === '推荐' ? 'bg-[#FF5C00]' : 'bg-[#7000FF]'}`}>
                {tool.badge}
              </span>
            )}
            
            <div className="aspect-square rounded-2xl bg-[#F8FAFB] mb-3 overflow-hidden shadow-inner flex items-center justify-center relative">
              <img src={tool.img} alt={tool.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              
              {/* Progress Loading Overlay */}
              {processing && activeTool?.title === tool.title && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                  <span className="text-white text-[8px] font-bold tracking-widest uppercase animate-pulse">Processing</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[14px] tracking-tight">{tool.title}</h3>
              {tool.cost > 0 && (
                <span className="text-[10px] font-black italic text-[#25D366]">P:{tool.cost}</span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate font-medium">{tool.desc}</p>
          </div>
        ))}
      </div>

      {showResult && (
        <ResultModal 
          tool={activeTool} 
          onClose={() => setShowResult(false)} 
        />
      )}
    </div>
  );
}