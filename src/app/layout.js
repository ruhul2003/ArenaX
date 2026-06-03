import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";



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
        <Footer />


      </body>
    </html>
  );
}
