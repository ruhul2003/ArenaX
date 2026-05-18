import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";



export const metadata = {
  title: "ArenaX",
  description: "Enjoy Your Games with ArenaX",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="light" lang="en">
      <body className="min-h-screen flex flex-col">


        <NavBar />
        <main className="flex-grow">
          {children}
        </main>


      </body>
    </html>
  );
}
