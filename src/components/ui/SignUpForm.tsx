"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { isAxiosError } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    async function onSubmit(values: SignupFormData) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/auth/signup", {
                name: values.name,
                email: values.email,
                password: values.password,
            }, {
                withCredentials: true,
            });

            if (response.status === 201) {
                // Auto-login the user after signup
                try {
                    const loginResponse = await axios.post("/api/auth/login", {
                        email: values.email,
                        password: values.password,
                    }, {
                        withCredentials: true,
                    });

                    if (loginResponse.status === 200) {
                        // Redirect to onboarding after successful login
                        // @ts-expect-error - Route types will be inferred after dev server restart
                        navigate({ to: "/onboarding" });
                    }
                } catch (loginErr) {
                    // If auto-login fails, redirect to login page
                    // @ts-expect-error - Route types will be inferred after dev server restart
                    navigate({ to: "/login" });
                }
            }
        } catch (err) {
            if (isAxiosError(err)) {
                // Handle specific error responses
                if (err.response?.status === 409) {
                    setError("An account with this email already exists. Please login instead.");
                } else if (err.response?.data?.error) {
                    setError(err.response.data.error);
                } else {
                    setError("An error occurred during signup. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FEF9C3]/50 via-white to-[#FEF9C3]/30 flex items-center justify-center px-6 py-8">
            {/* Back to Home */}
            <Link
                to="/"
                className="fixed top-6 left-6 flex items-center gap-2 text-sm text-[#2C3947]/70 hover:text-[#2C3947] font-semibold transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to home
            </Link>

            {/* Signup Card */}
            <Card className="w-full max-w-md border-2 border-[#2C3947] bg-white shadow-[6px_6px_0px_0px_rgba(44,57,71,1)] rounded-2xl transition-all duration-300">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C3947] text-[#FEF9C3] border-2 border-[#2C3947] shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] transition-transform duration-300 hover:rotate-12">
                        <span className="text-2xl font-black">O</span>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-black text-[#2C3947] tracking-tight">Create your account</CardTitle>
                    <CardDescription className="text-[#2C3947]/70 font-medium text-xs sm:text-sm">
                        Get started with your OneProfile
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive font-semibold">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive font-semibold">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive font-semibold">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold py-3.5 h-11 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(44,57,71,0.4)] border-none transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-2 border-[#2C3947]/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-[#2C3947]/60 text-xs font-bold uppercase tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-11 border-2 border-[#2C3947] bg-white text-[#2C3947] hover:bg-slate-50 font-bold rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-[0.98]"
                        type="button"
                        onClick={() => {
                            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
                            window.location.href = `${backendUrl}/api/v1/auth/google`;
                        }}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign up with Google
                    </Button>

                    <p className="text-center text-sm text-[#2C3947]/70 font-semibold">
                        Already have an account?{" "}
                        {/* @ts-expect-error - Route types will be inferred after dev server restart */}
                        <Link to="/login" className="font-bold text-[#2C3947] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
