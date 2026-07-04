import { getDictionary } from "@/getDictionary";
import HeroClient from "@/components/HeroClient";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');
  return <HeroClient dict={dict} lang={lang as 'en' | 'ar'} />;
}
