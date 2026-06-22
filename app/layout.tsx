import type { Metadata } from "next";
import { Be_Vietnam_Pro} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Djawad GH | محترف مونتاج الفيديو",
  description: "نقدم تجربة مونتاج سينمائية تضمن أعلى معدلات الاحتفاظ بالجمهور (Retention) وتزيد من تفاعل عملائك من خلال أسلوب سرد قصصي بصري محترف.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body 
        className={`${beVietnamPro.variable} antialiased bg-background text-on-background overflow-x-hidden`}
      >
        <div className="mesh-bg"></div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
