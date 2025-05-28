"use client";
import React, { useState } from "react";
import { z } from "zod";
import { LoginSchema } from "@/lib/validations/auth";
import { Button, Input, Checkbox, Alert } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || json.errors?.formErrors?.join(", ") || "Gagal login");
      } else {
        setSuccess(true);
        if (!json.emailVerified) {
          setRedirectMessage("Email Anda belum diverifikasi. Silakan cek email Anda untuk verifikasi sebelum login.");
        } else if (!json.profileComplete) {
          setRedirectMessage("Profil Anda belum lengkap. Anda akan diarahkan ke halaman lengkapi profil...");
          setRedirecting(true);
          setTimeout(() => {
            router.push("/complete-profile");
          }, 2500);
        } else {
          setRedirectMessage("Login berhasil. Anda akan diarahkan ke dashboard...");
          setRedirecting(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      }
    } catch (e) {
      setApiError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (url: string) => {
    setPageLoading(true);
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Login Berhasil</h2>
        {redirectMessage && <p className="mb-4">{redirectMessage}</p>}
        {redirecting && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>Mengalihkan...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Full background gradient canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 via-yellow-50 to-white dark:from-[#18181B] dark:via-[#312E81] dark:to-[#18181B]" />
      {/* Decorative blob for desktop */}
      <div className="hidden md:block absolute left-0 top-0 h-full w-1/3 z-10 pointer-events-none">
        <svg className="absolute left-8 top-1/4 w-72 h-72 opacity-60 animate-float-slow" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="loginblob" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.3" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="180" ry="120" fill="url(#loginblob)" />
        </svg>
      </div>
      {/* Form container */}
      <div className="relative z-20 w-full max-w-md bg-white dark:bg-[#232136] rounded-2xl shadow-lg p-6 md:p-8 mx-auto flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-purple-700 dark:text-yellow-300 text-center">Masuk ke Akun</h1>
        {apiError && <Alert type="error">{apiError}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message as string} />
          <div className="relative">
            <Input label="Password" type={showPassword ? "text" : "password"} {...register("password")} error={errors.password?.message as string} />
            <button type="button" tabIndex={-1} className="absolute right-3 top-8 p-1 text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-yellow-400" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.216.41 4.563 1.125M19.07 19.07A9.969 9.969 0 0021 12c0-3-4-7-9-7-.795 0-1.568.093-2.313.267M9.88 9.88a3 3 0 104.24 4.24" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" onClick={e => {e.preventDefault(); handleNavigate('/forgot-password')}} className="ml-auto text-blue-600 underline text-sm">Lupa Password?</a>
          </div>
          <Button type="submit" loading={loading} className="w-full bg-gradient-to-tr from-purple-600 to-yellow-400 text-white text-lg shadow">
            Masuk
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Belum punya akun? <a href="#" onClick={e => {e.preventDefault(); handleNavigate('/register')}} className="text-blue-600 underline">Daftar</a>
        </div>
        <div className="mt-2 text-center text-xs">
          <a href="#" onClick={e => {e.preventDefault(); handleNavigate('/')}} className="text-purple-600 underline">Kembali ke Beranda</a>
        </div>
      </div>
      {/* Loading overlay */}
      <AnimatePresence>
        {pageLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-4 border-purple-400 border-t-yellow-300 animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 