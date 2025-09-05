import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Book App",
  description: "read books with our ai curated in context music that enhances your reading experience.",
};

export default function RootLayout({ children }) {
  const header = (
    <header>
      <h1>Book App</h1>
      <input type="text" placeholder="Search books..." />
    </header>
  )

  const footer = (
    <footer>
      <p>made by <a href="https://github.com/biruk50">biruk50</a></p>
      <p>&copy; 2025 Book App. All rights reserved.</p>
    </footer>
  )
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {header}
        {children}
        {footer}
      </body>
    </html>
  );
}
