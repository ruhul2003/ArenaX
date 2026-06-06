import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast'; 

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

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            success: {
              style: {
                background: '#10b981',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px 20px',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px 20px',
              },
            },
          }}
        />
      </body>
    </html>
  );
}