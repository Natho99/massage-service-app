"use client";
const TOOLS = [
  { title: "网红二维码", desc: "流行爆款模板", badge: null, img: "/a.png" },
  { title: "自定义美化", desc: "自由配色样式", badge: null, img: "/b.png" },
  { title: "创意二维码", desc: "艺术融合视觉", badge: "HOT", img: "/c.png" },
  { title: "个性二维码", desc: "独特参数化风格", badge: null, img: "/d.png" },
  { title: "AI 二维码", desc: "人工智能生成", badge: "BETA", img: "/e.png" },
  { title: "AI 艺术字", desc: "文字创意重绘", badge: "推荐", img: "/f.png" },
  { title: "艺术二维码", desc: "精选设计", badge: null, img: "/g.png" },
  { title: "AI 二维码", desc: "更多AI工具", badge: null, img: "/h.png" },
  { title: "收款码合并", desc: "多码合一工具", badge: null, img: "/i.png" },
  { title: "二维码解析", desc: "解码与提取", badge: null, img: "/j.png" },
];

export default function BeautifyTab() {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="p-8 pt-12 bg-white rounded-b-[40px] shadow-sm mb-6">
        <h1 className="text-3xl font-extrabold italic tracking-tighter">创作工具</h1>
        <p className="text-gray-400 text-sm mt-1 font-medium italic">不仅好用，更是设计</p>
      </header>
      <div className="px-5 grid grid-cols-2 gap-4">
        {TOOLS.map((tool, i) => (
          <div key={i} className="bg-white rounded-[32px] p-4 shadow-sm relative border border-white active:scale-95 transition-all">
            {tool.badge && (
              <span className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-2xl rounded-tr-[32px] z-10 ${tool.badge === 'HOT' || tool.badge === '推荐' ? 'bg-[#FF5C00]' : 'bg-[#7000FF]'}`}>
                {tool.badge}
              </span>
            )}
            <div className="aspect-square rounded-2xl bg-[#F8FAFB] mb-3 overflow-hidden shadow-inner flex items-center justify-center">
              <img src={tool.img} alt={tool.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-[15px] tracking-tight">{tool.title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}