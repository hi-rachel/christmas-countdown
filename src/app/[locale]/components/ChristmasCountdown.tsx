"use client";

import React, { useState, useEffect } from "react";
import { Share2, Edit2, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// 각 언어에 맞는 시간대 매핑
const timeZoneMap: Record<string, string> = {
  ko: "Asia/Seoul", // 한국 (UTC+9)
  ja: "Asia/Tokyo", // 일본 (UTC+9)
  zh: "Asia/Shanghai", // 중국 (UTC+8)
  en: "America/New_York", // 미국 동부 (UTC-5/-4, 서머타임 고려)
};

// 안전하게 DateTimeFormatPart에서 값 추출하는 헬퍼 함수
const getPartValue = (
  parts: Intl.DateTimeFormatPart[],
  type: string
): string => {
  return parts.find((p) => p.type === type)?.value ?? "0";
};

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
  const [isDday, setIsDday] = useState(false);
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now: Date = new Date();
      const timeZone = timeZoneMap[locale] || "Asia/Seoul"; // 기본값은 한국 시간

      // 선택된 언어의 시간대 기준으로 현재 날짜 가져오기
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });

      const dateParts = formatter.formatToParts(now);
      const currentYear = parseInt(getPartValue(dateParts, "year"));
      const currentMonth = parseInt(getPartValue(dateParts, "month"));
      const currentDate = parseInt(getPartValue(dateParts, "day"));
      const currentHour = parseInt(getPartValue(dateParts, "hour"));
      const currentMinute = parseInt(getPartValue(dateParts, "minute"));
      const currentSecond = parseInt(getPartValue(dateParts, "second"));

      // 크리스마스 날짜인지 확인 (12월 25일)
      if (currentMonth === 12 && currentDate === 25) {
        setIsDday(true);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setIsDday(false);

      // 크리스마스 날짜 결정 (이미 지났으면 다음 해)
      let christmasYear = currentYear;
      if (currentMonth === 12 && currentDate > 25) {
        christmasYear = currentYear + 1;
      } else if (currentMonth > 12) {
        christmasYear = currentYear + 1;
      }

      // 해당 시간대의 특정 시간을 UTC 밀리초로 변환하는 헬퍼 함수
      const getUTCTimeForLocalTime = (
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        tz: string
      ): number => {
        // 해당 시간을 UTC로 해석 (임시)
        const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
        const utcDate = new Date(utcGuess);

        // 이 UTC 시간을 해당 시간대로 표시했을 때의 값
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const parts = formatter.formatToParts(utcDate);
        const tzYear = parseInt(getPartValue(parts, "year"));
        const tzMonth = parseInt(getPartValue(parts, "month"));
        const tzDay = parseInt(getPartValue(parts, "day"));
        const tzHour = parseInt(getPartValue(parts, "hour"));
        const tzMinute = parseInt(getPartValue(parts, "minute"));
        const tzSecond = parseInt(getPartValue(parts, "second"));

        // 해당 시간대에서 표시된 시간을 UTC로 변환
        const tzUTC = Date.UTC(
          tzYear,
          tzMonth - 1,
          tzDay,
          tzHour,
          tzMinute,
          tzSecond
        );

        // 오프셋 = 원래 UTC 추정값 - 실제 해당 시간대 시간의 UTC 값
        const offset = utcGuess - tzUTC;

        // 원하는 해당 시간대의 시간을 UTC로 변환
        return utcGuess - offset;
      };

      // 크리스마스 00:00:00을 해당 시간대 기준으로 UTC 밀리초로 계산
      const christmasUTC = getUTCTimeForLocalTime(
        christmasYear,
        12,
        25,
        0,
        0,
        0,
        timeZone
      );

      // 현재 시간을 해당 시간대 기준으로 UTC 밀리초로 계산
      const nowUTC = getUTCTimeForLocalTime(
        currentYear,
        currentMonth,
        currentDate,
        currentHour,
        currentMinute,
        currentSecond,
        timeZone
      );

      const difference: number = christmasUTC - nowUTC;

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
  }, [locale]);

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

          {isDday ? (
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-lg">
              <div className="text-6xl md:text-8xl font-bold text-white">
                {t("countdown.dday")}
              </div>
            </div>
          ) : (
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
          )}

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
