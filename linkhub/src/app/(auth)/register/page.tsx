"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { RegisterSchema } from "@/lib/validations/auth";
import { checkPasswordStrength } from "@/lib/utils/password";
import { Button, Input, RadioGroup, Radio, Alert, Checkbox } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const password = watch("password");
  const email = watch("email");
  const role = watch("role");
  const terms = watch("terms");

  // Update password strength
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password || "", [email || ""]));
  }, [password, email]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || json.errors?.formErrors?.join(", ") || "Gagal mendaftar");
      } else {
        setSuccess(true);
        setRegisteredEmail(data.email);
      }
    } catch (e) {
      setApiError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect to login after 5 seconds if success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Akun Berhasil Dibuat</h2>
        <p className="mb-2">Silakan konfirmasi email Anda untuk mengaktifkan akun.</p>
        {registeredEmail && (
          <div className="mb-2">
            <span className="font-semibold">{registeredEmail}</span>
          </div>
        )}
        <p className="text-sm text-gray-600 mb-4">Kami telah mengirim link verifikasi ke email di atas. Cek inbox atau folder spam Anda.</p>
        <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login</a>
        <div className="mt-4 text-xs text-gray-500">Anda akan diarahkan ke halaman login dalam 5 detik...</div>
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
            <radialGradient id="regblob" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.3" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="180" ry="120" fill="url(#regblob)" />
        </svg>
      </div>
      {/* Form container */}
      <div className="relative z-20 w-full max-w-md bg-white dark:bg-[#232136] rounded-2xl shadow-lg p-6 md:p-8 mx-auto flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-purple-700 dark:text-yellow-300 text-center">Daftar Akun Baru</h1>
        {apiError && <Alert type="error">{apiError}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Pilih Tipe Akun</label>
              <RadioGroup className="flex-col gap-3">
                <Radio {...register("role")} value="brand" label="Brand" />
                <Radio {...register("role")} value="creator" label="Content Creator" />
              </RadioGroup>
              {(errors.role || roleError) && <p className="text-red-500 text-sm mt-1">{errors.role?.message as string || roleError}</p>}
              <Button
                type="button"
                className="mt-6 w-full bg-gradient-to-tr from-purple-600 to-yellow-400 text-white text-lg shadow"
                onClick={() => {
                  if (!role) {
                    setRoleError("Wajib pilih tipe akun terlebih dahulu");
                    return;
                  }
                  setRoleError(null);
                  setStep(2);
                }}
              >
                Lanjut
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <Input label="Email" type="email" {...register("email")}
                error={errors.email?.message as string} />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={errors.password?.message as string}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-8 p-1 text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-yellow-400"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.216.41 4.563 1.125M19.07 19.07A9.969 9.969 0 0021 12c0-3-4-7-9-7-.795 0-1.568.093-2.313.267M9.88 9.88a3 3 0 104.24 4.24" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Konfirmasi Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message as string}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-8 p-1 text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-yellow-400"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.216.41 4.563 1.125M19.07 19.07A9.969 9.969 0 0021 12c0-3-4-7-9-7-.795 0-1.568.093-2.313.267M9.88 9.88a3 3 0 104.24 4.24" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="text-xs text-purple-700 dark:text-yellow-300 underline mb-1"
                  onClick={() => setShowPasswordInfo((v) => !v)}
                  aria-expanded={showPasswordInfo}
                >
                  {showPasswordInfo ? "Sembunyikan info password" : "Lihat info password & tips keamanan"}
                </button>
                <AnimatePresence initial={false}>
                  {showPasswordInfo && passwordStrength && (
                    <motion.div
                      key="pwinfo"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="text-xs mt-1 p-3 rounded bg-purple-50 dark:bg-[#312E81] text-gray-700 dark:text-gray-200">
                        <span style={{ color: passwordStrength.feedback.color }}>
                          {passwordStrength.feedback.warning} ({passwordStrength.feedback.percentage}%)
                        </span>
                        <ul className="list-disc ml-4 mt-1">
                          {passwordStrength.feedback.suggestions.map((s: string) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button type="submit" loading={loading} className="flex-1 bg-gradient-to-tr from-purple-600 to-yellow-400 text-white text-lg shadow">
                  Daftar
                </Button>
              </div>
              <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-300">
                Dengan mendaftar, Anda menyetujui <a href="/terms" target="_blank" className="underline text-purple-700 dark:text-yellow-300">Syarat & Ketentuan</a>.
              </div>
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-sm">
          Sudah punya akun? <a href="/login" className="text-blue-600 underline">Masuk</a>
        </div>
        <div className="mt-2 text-center text-xs">
          <a href="/" className="text-purple-600 underline">Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
} 