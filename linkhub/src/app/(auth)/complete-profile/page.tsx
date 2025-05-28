"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { CompleteProfileSchema } from "@/lib/validations/auth";
import { Button, Input, Alert } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<null | 'checking' | 'available' | 'taken'>(null);
  const router = useRouter();

  // Calculate max birth date (17 years ago)
  const today = new Date();
  const minAge = 17;
  const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];
  const minBirthDateStr = '1900-01-01';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: zodResolver(CompleteProfileSchema),
    mode: "onChange",
  });

  const username = watch("username");
  const birthDate = watch("birthDate");

  // Username availability check
  useEffect(() => {
    if (!username || username.length < 3) return;
    setUsernameStatus('checking');
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/public/check-username?username=${encodeURIComponent(username)}`);
      const json = await res.json();
      setUsernameStatus(json.available ? 'available' : 'taken');
    }, 800);
    return () => clearTimeout(timeout);
  }, [username]);

  // Redirect to dashboard after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  // Validate age >= 17
  const isUnderage = birthDate && new Date(birthDate) > maxBirthDate;

  // Format birthDate to DD-MM-YYYY for backend
  function formatBirthDate(dateStr: string) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  }

  const handleLogout = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || "Gagal logout");
      } else {
        router.push("/login");
      }
    } catch (e) {
      setApiError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setApiError(null);
    if (isUnderage) {
      setApiError("Anda harus berusia minimal 17 tahun untuk mendaftar.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        ...data,
        birthDate: formatBirthDate(data.birthDate),
      };
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.status === 401) {
        // Session invalid, force logout
        await handleLogout();
        return;
      }
      if (!res.ok) {
        setApiError(json.error || json.errors?.formErrors?.join(", ") || "Gagal menyimpan profil");
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setApiError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Profil Berhasil</h2>
        <p>Profil Anda berhasil dilengkapi. Anda akan diarahkan ke dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Lengkapi Profil</h1>
      {apiError && <Alert type="error">{apiError}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-live="polite">
        <div>
          <Input label="Username" {...register("username")}
            error={errors.username?.message as string}
            required
            aria-describedby="username-status"
            autoComplete="off"
          />
          {usernameStatus === 'checking' && <Alert type="loading">Mengecek ketersediaan username…</Alert>}
          {usernameStatus === 'available' && <Alert type="success">Username tersedia.</Alert>}
          {usernameStatus === 'taken' && <Alert type="error">Username sudah digunakan.</Alert>}
        </div>
        <div>
          <Input label="Nama Lengkap" {...register("fullName")}
            error={errors.fullName?.message as string}
            required
            autoComplete="off"
          />
        </div>
        <div>
          <Input label="Tanggal Lahir" type="date" min={minBirthDateStr} max={maxBirthDateStr}
            {...register("birthDate")}
            error={errors.birthDate?.message as string}
            required
            autoComplete="off"
          />
          {isUnderage && <Alert type="error">Anda harus berusia minimal 17 tahun.</Alert>}
        </div>
        <Button type="submit" loading={loading} className="w-full" disabled={!isValid || isUnderage || loading || usernameStatus === 'taken'} aria-busy={loading} aria-disabled={loading}>
          {loading ? 'Menyimpan…' : 'Simpan Profil'}
        </Button>
      </form>
      <Button onClick={handleLogout} variant="secondary" className="w-full mt-4">Logout</Button>
      <div className="mt-6 text-xs text-gray-500 text-center">
        Data Anda aman dan hanya digunakan untuk keperluan verifikasi akun. <br />
        Dengan melanjutkan, Anda menyetujui <a href="/terms" className="underline">Syarat & Ketentuan</a> LinkHub.<br />
        <a href="/" className="text-purple-600 underline">Kembali ke Beranda</a>
      </div>
    </div>
  );
} 