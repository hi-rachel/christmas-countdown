"use client";

import React, { useState, useEffect } from "react";
import { Share2, Edit2, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const ChristmasCountdown = () => {
  const t = useTranslations("main");
  const router = useRouter();
  const locale = useLocale(); // next-intl의 useLocale 사용

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now: Date = new Date();
      const christmas: Date = new Date(now.getFullYear(), 11, 25);
      christmas.setHours(0, 0, 0, 0);

      if (now > christmas) {
        christmas.setFullYear(christmas.getFullYear() + 1);
      }

      const difference: number = christmas.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    try {
      const shareText = t("share.text", {
        name: userName || "Anonymous",
        days: timeLeft.days,
        hours: timeLeft.hours,
      });

      if (navigator.share) {
        await navigator.share({
          title: t("title"),
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t("share.copied"));
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const locales = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
    { code: "zh", label: "中文" },
  ];

  const handleLocaleChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a2980] to-[#26d0ce] overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <select
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="appearance-none bg-white/10 backdrop-blur-sm text-white px-4 py-2 pr-8 rounded-lg cursor-pointer hover:bg-white/20 transition-all"
          >
            {locales.map((loc) => (
              <option key={loc.code} value={loc.code} className="text-black">
                {loc.label}
              </option>
            ))}
          </select>
          <Globe
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            size={20}
          />
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8 w-full max-w-4xl">
          <div className="space-y-4">
            {isEditing ? (
              <form
                onSubmit={handleNameSubmit}
                className="flex gap-2 justify-center"
              >
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t("nameInput.placeholder")}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm"
                >
                  {t("nameInput.submit")}
                </button>
              </form>
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-white flex items-center justify-center gap-3">
                {userName ? t("countdown.userPrefix", { name: userName }) : ""}
                {t("title")}
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <Edit2 size={16} />
                </button>
              </h1>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <div className="text-5xl md:text-6xl font-bold text-white">
                {timeLeft.days}
              </div>
              <div className="text-lg md:text-xl text-white/80">
                {t("countdown.days")}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <div className="text-5xl md:text-6xl font-bold text-white">
                {timeLeft.hours}
              </div>
              <div className="text-lg md:text-xl text-white/80">
                {t("countdown.hours")}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <div className="text-5xl md:text-6xl font-bold text-white">
                {timeLeft.minutes}
              </div>
              <div className="text-lg md:text-xl text-white/80">
                {t("countdown.minutes")}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <div className="text-5xl md:text-6xl font-bold text-white">
                {timeLeft.seconds}
              </div>
              <div className="text-lg md:text-xl text-white/80">
                {t("countdown.seconds")}
              </div>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white font-medium transition-all"
          >
            <Share2 size={20} />
            {t("share.button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChristmasCountdown;
