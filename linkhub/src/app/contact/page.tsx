"use client";
import React from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "LinkHub";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@linkhub.com";
export default function ContactPage() {
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
        <title>Kontak | LinkHub</title>
        <meta name="description" content={`Hubungi tim ${APP_NAME} untuk pertanyaan, saran, atau kerjasama.`} />
      </Head>
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 via-yellow-50 to-white dark:from-[#18181B] dark:via-[#312E81] dark:to-[#18181B]" />
        <div className="hidden md:block absolute left-0 top-0 h-full w-1/3 z-10 pointer-events-none">
          <svg className="absolute left-8 top-1/4 w-72 h-72 opacity-60 animate-float-slow" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="contactblob" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.3" />
              </radialGradient>
            </defs>
            <ellipse cx="200" cy="200" rx="180" ry="120" fill="url(#contactblob)" />
          </svg>
        </div>
        <div className="relative z-20 w-full max-w-2xl bg-white dark:bg-[#232136] rounded-2xl shadow-lg p-6 md:p-10 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-purple-700 dark:text-yellow-300 text-center">Hubungi Tim LinkHub</h1>
          <p className="max-w-2xl text-center text-gray-700 dark:text-gray-200 mb-6">Kami siap membantu Anda untuk pertanyaan, saran, atau kerjasama. Jangan ragu untuk menghubungi kami kapan saja.</p>
          <div className="max-w-2xl text-center text-gray-600 dark:text-gray-300 mb-8">
            <p className="mb-2">Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-purple-600">{SUPPORT_EMAIL}</a></p>
            <p>Kami akan membalas dalam 1x24 jam pada hari kerja. Setiap pertanyaan Anda sangat berarti bagi kami.</p>
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