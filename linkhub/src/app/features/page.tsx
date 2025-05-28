"use client";
import React from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
const APP_DESC = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Platform link-in-bio modern untuk Brand & Content Creator Indonesia.";
const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
    ),
    title: "Satu Link untuk Semua",
    desc: "Gabungkan semua sosial media, portofolio, dan promosi dalam satu link bio yang mudah diingat."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: "Analitik Real-Time",
    desc: "Pantau performa link Anda dengan statistik kunjungan, klik, dan insight audiens."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    ),
    title: "Aman & Terpercaya",
    desc: "Dibangun dengan standar keamanan tinggi, data Anda selalu terlindungi."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21l3-1.5L15 21l-.75-4M4 4h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
    ),
    title: "Kustomisasi Tanpa Batas",
    desc: "Pilih tema, warna, dan tata letak sesuai identitas brand atau personal Anda."
  },
];
export default function FeaturesPage() {
  const [pageLoading, setPageLoading] = React.useState(false);
  const handleNavigate = (url: string) => {
    setPageLoading(true);
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };
  return (
    <>
      <Head>
        <title>Fitur Unggulan | LinkHub</title>
        <meta name="description" content={APP_DESC} />
      </Head>
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 via-yellow-50 to-white dark:from-[#18181B] dark:via-[#312E81] dark:to-[#18181B]" />
        <div className="hidden md:block absolute left-0 top-0 h-full w-1/3 z-10 pointer-events-none">
          <svg className="absolute left-8 top-1/4 w-72 h-72 opacity-60 animate-float-slow" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="featuresblob" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.3" />
              </radialGradient>
            </defs>
            <ellipse cx="200" cy="200" rx="180" ry="120" fill="url(#featuresblob)" />
          </svg>
        </div>
        <div className="relative z-20 w-full max-w-3xl bg-white dark:bg-[#232136] rounded-2xl shadow-lg p-6 md:p-10 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-purple-700 dark:text-yellow-300 text-center">Fitur Unggulan</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-6 bg-white dark:bg-[#232136] rounded-xl shadow-md">
                <div className="flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-purple-700 dark:text-yellow-300">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-200 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#" onClick={e => {e.preventDefault(); handleNavigate('/')}} className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">Kembali ke Beranda</a>
        </div>
        <AnimatePresence>
          {pageLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full border-4 border-purple-400 border-t-yellow-300 animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 