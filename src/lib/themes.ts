export interface Theme {
  id: string;
  name: string;
  backgroundClass: string;
  cardClass: string;
  buttonClass: string;
  textClass: string;
  titleClass: string;
  bioClass: string;
  fontClass: string;
  previewBg: string; // Used in color picker bubbles in dashboard
  previewButtonBg: string;
  customStyle?: React.CSSProperties;
}

export const themes: Theme[] = [
  {
    id: "default",
    name: "Classic Light",
    backgroundClass: "bg-neutral-50 text-neutral-900",
    cardClass: "bg-white border border-neutral-200 shadow-sm",
    buttonClass: "bg-neutral-900 hover:bg-neutral-800 text-white rounded-full transition-all duration-200",
    textClass: "text-neutral-800",
    titleClass: "font-display text-neutral-900 font-bold",
    bioClass: "text-neutral-500",
    fontClass: "font-sans",
    previewBg: "linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)",
    previewButtonBg: "#171717",
  },
  {
    id: "minimal-dark",
    name: "Charcoal Matte",
    backgroundClass: "bg-neutral-950 text-neutral-100",
    cardClass: "bg-neutral-900 border border-neutral-800 shadow-lg",
    buttonClass: "bg-neutral-100 hover:bg-neutral-200 text-neutral-950 rounded-full transition-all duration-200",
    textClass: "text-neutral-200",
    titleClass: "font-display text-neutral-100 font-bold",
    bioClass: "text-neutral-400",
    fontClass: "font-sans",
    previewBg: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
    previewButtonBg: "#f5f5f5",
  },
  {
    id: "sunset-glow",
    name: "Sunset Mesh (Glass)",
    backgroundClass: "bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 text-white",
    cardClass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
    buttonClass: "bg-white hover:bg-white/95 text-purple-700 font-semibold rounded-full shadow-md transition-all duration-200 hover:scale-[1.02]",
    textClass: "text-white/90",
    titleClass: "font-display text-white font-extrabold tracking-tight",
    bioClass: "text-white/70",
    fontClass: "font-display",
    previewBg: "linear-gradient(135deg, #f43f5e 0%, #7c3aed 50%, #4338ca 100%)",
    previewButtonBg: "#ffffff",
  },
  {
    id: "forest-rain",
    name: "Forest Fern",
    backgroundClass: "bg-emerald-950 text-emerald-50",
    cardClass: "bg-emerald-900/40 border border-emerald-800/50 shadow-md",
    buttonClass: "bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-medium rounded-xl transition-all duration-200",
    textClass: "text-emerald-100",
    titleClass: "font-display text-emerald-300 font-bold",
    bioClass: "text-emerald-400/80",
    fontClass: "font-sans",
    previewBg: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)",
    previewButtonBg: "#34d399",
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    backgroundClass: "bg-black text-cyan-400 font-mono selection:bg-cyan-500/30",
    cardClass: "bg-zinc-950 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.15)] hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-shadow duration-300",
    buttonClass: "bg-transparent border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black font-semibold rounded-none tracking-widest transition-all duration-200",
    textClass: "text-cyan-400",
    titleClass: "font-mono text-cyan-300 font-bold uppercase tracking-wider",
    bioClass: "text-cyan-500/70",
    fontClass: "font-mono",
    previewBg: "linear-gradient(135deg, #000000 0%, #09090b 100%)",
    previewButtonBg: "transparent",
  },
  {
    id: "clay-retro",
    name: "Neo-Brutalism",
    backgroundClass: "bg-[#fef9c3] text-black",
    cardClass: "bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    buttonClass: "bg-[#60a5fa] hover:bg-[#3b82f6] text-black border-2 border-black font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-100",
    textClass: "text-black/80 font-medium",
    titleClass: "font-display text-black font-black uppercase text-2xl tracking-wide",
    bioClass: "text-black/60",
    fontClass: "font-display",
    previewBg: "linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)",
    previewButtonBg: "#60a5fa",
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    backgroundClass: "bg-[#0B1528] relative overflow-hidden text-slate-100 before:absolute before:top-[-20%] before:left-[-10%] before:w-[60%] before:h-[60%] before:rounded-full before:bg-emerald-500/20 before:blur-[100px] after:absolute after:bottom-[-20%] after:right-[-10%] after:w-[60%] after:h-[60%] after:rounded-full after:bg-cyan-500/20 after:blur-[100px]",
    cardClass: "bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 shadow-2xl rounded-2xl hover:border-cyan-500/40 transition-colors duration-300",
    buttonClass: "bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-bold rounded-2xl transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    textClass: "text-slate-300",
    titleClass: "font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 font-extrabold",
    bioClass: "text-slate-400",
    fontClass: "font-display",
    previewBg: "linear-gradient(135deg, #0B1528 0%, #1e1b4b 100%)",
    previewButtonBg: "linear-gradient(90deg, #34d399 0%, #22d3ee 100%)",
  }
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}
