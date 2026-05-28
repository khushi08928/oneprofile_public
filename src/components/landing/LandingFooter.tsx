import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[#212B36] bg-[#2C3947] pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-[#FEF9C3]/75">
            <div className="container mx-auto max-w-6xl">
                {/* Columns Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Logo & Slogan Column */}
                    <div className="col-span-2 space-y-4">
                        <div className="flex items-center space-x-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF9C3] text-[#2C3947] shadow-md">
                                <span className="text-lg font-black tracking-tight">O</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">
                                OneProfile
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200/80 max-w-xs leading-relaxed font-semibold">
                            Create a stunning, fully-customizable personal landing page to share all your creations, portfolios, and links in one link.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/khushi08928"
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-lg bg-[#212B36] border border-[#43556B]/30 hover:bg-[#43556B] flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-sm"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://x.com/khushi_084"
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-lg bg-[#212B36] border border-[#43556B]/30 hover:bg-[#43556B] flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-sm"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/khushichawla0/"
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-lg bg-[#212B36] border border-[#43556B]/30 hover:bg-[#43556B] flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-sm"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FEF9C3] mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
                            <li>
                                <a href="/#features" className="text-slate-200/80 hover:text-white transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="/#how-it-works" className="text-slate-200/80 hover:text-white transition-colors">
                                    How it Works
                                </a>
                            </li>

                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FEF9C3] mb-4">
                            Community
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-200/60">
                            <li>Open Source</li>
                            <li>Contributors</li>
                            <li>Discord Server</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FEF9C3] mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-200/60">
                            <li>Privacy Policy</li>
                            <li>Terms of Use</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="border-t border-[#212B36] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-300 font-semibold">
                    <p>© {currentYear} OneProfile. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> for the modern creator.
                    </p>
                </div>
            </div>
        </footer>
    );
}
