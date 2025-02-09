import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

type SupportedLocale = "ko" | "en" | "ja" | "zh";

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const LocaleLayout = async ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  // 지원하지 않는 locale인 경우 404
  if (!routing.locales.includes(locale as SupportedLocale)) {
    notFound();
  }

  // 정적 렌더링을 위한 locale 설정
  setRequestLocale(locale);

  const messages = await getMessages({ locale: locale as SupportedLocale });

  return (
    <NextIntlClientProvider messages={messages}>
      <main>{children}</main>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
