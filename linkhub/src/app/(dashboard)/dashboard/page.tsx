"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal logout");
      } else {
        router.push("/login");
      }
    } catch (e) {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Selamat datang di dashboard Anda!</p>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button onClick={handleLogout} loading={loading} className="w-full">Logout</Button>
      <div className="mt-6 text-xs text-gray-500 text-center">
        <a href="/" className="text-purple-600 underline">Kembali ke Beranda</a>
      </div>
    </div>
  );
} 