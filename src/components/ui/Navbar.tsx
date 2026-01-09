"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Users } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                            <span className="text-lg font-bold">O</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight">OneURL</span>
                    </Link>

                    {/* Navigation Links */}

                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Users className="h-4 w-4" />
                            All Profiles
                        </Link>

                        {/* @ts-expect-error - Route types will be inferred after dev server restart */}
                        <Link to="/login">
                            <Button
                                variant="default"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                            >
                                Log in
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
