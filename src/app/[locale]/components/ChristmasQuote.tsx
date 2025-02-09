"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Quote {
  text: string;
  author: string;
}

const ChristmasQuote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const t = useTranslations("quotes");

  useEffect(() => {
    // Get total number of quotes from translations
    const quotesCount = 10; // Assuming we have 10 quotes in the messages
    const randomIndex = Math.floor(Math.random() * quotesCount);

    setQuote({
      text: t(`${randomIndex}.text`),
      author: t(`${randomIndex}.author`),
    });
  }, [t]);

  return (
    <div className="text-center max-w-2xl mx-auto px-4 py-6 bg-white/5 backdrop-blur-sm rounded-xl">
      {quote && (
        <>
          <p className="text-xl md:text-2xl italic text-white/90 mb-2">
            "{quote.text}"
          </p>
          <p className="text-sm md:text-base text-white/70">- {quote.author}</p>
        </>
      )}
    </div>
  );
};

export default ChristmasQuote;
