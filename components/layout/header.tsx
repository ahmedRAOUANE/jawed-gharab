"use client";

import { useState, useEffect } from "react";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-primary-container/10 flex flex-row-reverse justify-between items-center px-gutter h-20 transition-all duration-300 ${
        scrolled ? "scrolled" : ""
      }`}
      id="main-nav"
    >
      <div className="text-headline-md font-bold tracking-tighter text-primary">
        Djawad GH
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 mx-auto">
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">
          الرئيسية
        </a>
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">
          أعمالي
        </a>
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">
          خدماتي
        </a>
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">
          تواصل
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <span className="text-label-md font-label-md text-primary font-bold flex items-center gap-1">
          AR
        </span>
      </div>
    </header>
  );
};

export default Header