import "./globals.css";
import localFont from "next/font/local";



const myFont = localFont({
  src: [
    {
      path: './fonts/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Aeonik-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Aeonik-Medium.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
})

export const metadata = {
  title: "danieloitei.ro",
  description: "Portfolio of Daniel Oiteiro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
   </html>
  );
}
