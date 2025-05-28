"use client";
import Link from "next/link";
import { Button } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Tumbuh ";
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

const testimonials = [
  {
    name: "Rina, Content Creator",
    text: "LinkHub bikin portofolio aku makin profesional dan mudah diakses brand! Animasi dan tampilannya keren banget.",
  },
  {
    name: "Andi, Brand Manager",
    text: "Dengan analitik real-time LinkHub, tim kami bisa memantau dan evaluasi performa campaign influencer secara instan dan akurat. Sangat membantu pengambilan keputusan!",
  },
  {
    name: "Sari, Freelancer",
    text: "Satu link untuk semua! Klien jadi gampang cek semua karya dan kontak saya.",
  },
];

export default function Home() {
  const [pageLoading, setPageLoading] = React.useState(false);
  const pathname = usePathname();
  const handleNavigate = (url: string) => {
    if (pathname === url) return;
    setPageLoading(true);
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  return (
    <>
      <Head>
        <title>LinkHub | Platform Link in Bio Modern</title>
        <meta name="description" content={APP_DESC} />
      </Head>
      <main className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-purple-50 via-yellow-50 to-white dark:from-[#18181B] dark:via-[#312E81] dark:to-[#18181B] relative overflow-x-hidden">
        {/* Floating shapes background */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute left-[-60px] top-20 w-40 h-40 bg-purple-200 rounded-full blur-2xl opacity-40"
            animate={{ y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-40px] top-60 w-32 h-32 bg-yellow-200 rounded-full blur-2xl opacity-30"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 bottom-[-60px] w-48 h-48 bg-purple-100 rounded-full blur-2xl opacity-30"
            animate={{ x: [0, 40, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Hero Section */}
        <section className="w-full max-w-7xl flex flex-col items-center justify-center pt-28 pb-16 px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-tr from-purple-600 to-yellow-400 bg-clip-text text-transparent mb-6 drop-shadow-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            >
              {APP_NAME}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              {APP_DESC}
            </motion.p>
            <motion.div
              className="flex flex-col md:flex-row gap-6 items-center justify-center mb-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
              }}
            >
              <motion.div whileHover={{ scale: 1.09 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300 }}>
                <button
                  onClick={() => handleNavigate("/register")}
                  className="w-56 text-lg py-4 bg-gradient-to-tr from-purple-600 to-yellow-400 shadow-xl rounded-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                >
                  Daftar Gratis
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.09 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300 }}>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="w-56 text-lg py-4 border border-purple-200 dark:border-yellow-300 rounded-xl font-semibold text-purple-700 dark:text-yellow-300 bg-white dark:bg-[#232136] focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                >
                  Masuk
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
          {/* Animated Illustration */}
          <motion.div
            className="mt-14 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          >
            <svg width="420" height="180" viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.rect x="40" y="50" width="340" height="80" rx="28" fill="#F3F0FF" stroke="#A78BFA" strokeWidth="3"
                animate={{
                  y: [50, 45, 50],
                  boxShadow: ["0 0 0 0 #A78BFA", "0 8px 32px 0 #A78BFA33", "0 0 0 0 #A78BFA"],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.circle cx="90" cy="90" r="24" fill="#C4B5FD"
                animate={{ cy: [90, 80, 90] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
              />
              <motion.circle cx="330" cy="90" r="24" fill="#FDE68A"
                animate={{ cy: [90, 100, 90] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
              />
              <motion.rect x="170" y="70" width="100" height="40" rx="14" fill="#A78BFA" opacity="0.2" />
            </svg>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl mx-auto py-16 px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-700 dark:text-yellow-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Fitur Unggulan
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="flex items-start gap-6 p-8 bg-white dark:bg-[#232136] rounded-2xl shadow-lg hover:shadow-2xl transition group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 32px 0 #A78BFA33" }}
              >
                <div className="flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-yellow-300">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-200 text-base">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full max-w-5xl mx-auto py-16 px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-700 dark:text-yellow-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Testimoni Pengguna
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-white dark:bg-[#232136] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center group hover:shadow-2xl transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                whileHover={{ scale: 1.06 }}
              >
                <p className="text-gray-700 dark:text-gray-200 mb-3 text-base italic">“{t.text}”</p>
                <div className="font-semibold text-purple-700 dark:text-yellow-300 mt-2">{t.name}</div>
              </motion.div>
            ))}
    </div>
        </section>

        {/* Animated Info Section (bottom) */}
        <section className="w-full flex flex-col items-center justify-center py-10">
          <motion.div
            className="flex items-center gap-3 bg-white/80 dark:bg-[#232136]/80 px-6 py-4 rounded-xl shadow-lg border border-purple-100 dark:border-yellow-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <svg className="w-8 h-8 text-purple-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <span className="text-gray-700 dark:text-gray-200 text-base md:text-lg text-center block max-w-xs md:max-w-none font-semibold">
              LinkHub selalu responsif, interaktif, dan siap pakai di semua perangkat. Coba sekarang dan rasakan kemudahannya!
            </span>
            <span className="ml-2 px-3 py-1 rounded-full bg-gradient-to-tr from-purple-600 to-yellow-400 text-white text-xs font-bold shadow">100% Gratis</span>
          </motion.div>
        </section>
      </main>
      <AnimatePresence>
        {pageLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-4 border-purple-400 border-t-yellow-300 animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
