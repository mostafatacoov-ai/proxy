import type { Metadata } from "next";
import "../globals.css";
import { getDictionary } from "@/getDictionary";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Proxy Group",
  description: "Premium post-production for extraordinary stories.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;800&family=Inter:wght@300;400;500;600;800&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="layout">
          <Navigation lang={lang as 'en' | 'ar'} dict={dict} />
          {children}
          <footer className="footer">
            <p>&copy; {new Date().getFullYear()} {dict.footer.copy}</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
