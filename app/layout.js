// File: app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import { AuthContextProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Student Voice",
  description: "Come Together and Share Your Voice!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <Navigation />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
