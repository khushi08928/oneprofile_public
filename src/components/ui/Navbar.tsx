"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Menu, Users, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-950/5 bg-white/65 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C3947] text-[#FEF9C3] font-black transition-transform group-hover:scale-105">
                            <span className="text-lg">O</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-800">OneProfile</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to={"/profiles" as any}
                            className="flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-[#2C3947]"
                        >
                            <Users className="h-4 w-4" />
                            All Profiles
                        </Link>

                        {/* @ts-expect-error - Route types will be inferred after dev server restart */}
                        <Link to="/login">
                            <Button
                                variant="default"
                                className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold rounded-xl transition-all duration-200"
                            >
                                Log in
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link
                                    to={"/profiles" as any}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-bold text-slate-700 transition-colors hover:text-[#2C3947] hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Users className="h-5 w-5" />
                                    All Profiles
                                </Link>

                                {/* @ts-expect-error - Route types will be inferred after dev server restart */}
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button
                                        variant="default"
                                        className="w-full bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold rounded-xl transition-all duration-200"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
