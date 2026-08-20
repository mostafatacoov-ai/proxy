import { getDictionary } from "@/getDictionary";
import HeroClient from "@/components/HeroClient";
import { headers } from "next/headers";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');
  
  // Detect bots on the server to prevent initial blank HTML payload
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(userAgent);

  return <HeroClient dict={dict} lang={lang as 'en' | 'ar'} isBot={isBot} />;
}
