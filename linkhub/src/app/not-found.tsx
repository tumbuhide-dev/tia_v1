import React from "react";
import Head from "next/head";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 - Halaman Tidak Ditemukan | LinkHub</title>
        <meta name="description" content="Halaman tidak ditemukan" />
      </Head>
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold text-purple-700 dark:text-yellow-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
        <a href="/" className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">Kembali ke Beranda</a>
      </main>
    </>
  );
} 