"use client";

import { useEffect, useRef } from "react";
import ScrollReveal from "../providers/ScrollReveal";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      reset: () => void;
      update: () => void;
      draw: () => void;
    }[] = [];

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      x = 0;
      y = 0;
      size = 0;
      speedX = 0;
      speedY = 0;
      opacity = 0;

      constructor() {
        this.reset();
      }

      reset() {
        if (canvas) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 0.5;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.speedY = Math.random() * 0.5 - 0.25;
          this.opacity = Math.random() * 0.5 + 0.1;
        }
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (canvas) {
          if (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < 0 ||
          this.y > canvas.height
        ) {
          this.reset();
        }
        }
      }
      draw() {
        if (ctx) {
          ctx.fillStyle = `rgba(180, 197, 255, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section className="relative pt-32 pb-24 px-6 md:px-margin-desktop overflow-hidden">
      <canvas
        ref={canvasRef}
        id="particle-canvas"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Image
          className="w-full h-full object-cover"
          alt="A cinematic close-up of a high-end cinema camera lens focusing on a digital screen with a video timeline. The lighting is moody and professional, using deep blues and electric accents to match a premium dark-mode editing suite aesthetic. The atmosphere conveys technical mastery and creative precision in a modern digital agency setting."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAovmOIIClutiTLcnBek9z3YavUCJH8-F3qWIdSs3EHinQ1vqJg6JqaZ_D6p917bv9bp0OOargmHUHKiMIbBrCPFDbBufWkgs4zdtG1UJ_OB0uhdux2oekkzIc0UwekZJMnkNxVMeIaU4KQ26I70mg83TkzgV-wn7NGWemEI_kGNv37BFv-lLk8eB7GINnuANWIAwxviqnFZQ18rsq0B198Ca7gjx83xNhergXW_fWlVJpyYOn4KlV7wg8A2dHTWfP_NGTS4uC39vY"
          height={100}
          width={100}
        />
      </div>

      <div className="relative z-10 max-w-4xl">
        <ScrollReveal>
          <span className="inline-block px-4 py-1 mb-6 rounded-full glass-card text-primary font-label-md text-label-md">
            إبداع بلا حدود
          </span>

          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg mb-6 leading-tight">
            مرحباً، أنا مونيتير فيديو وأساعدك في
            <span className="text-gradient"> صناعة فيديوهات عالية الجودة</span> لوكالتك
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
            نقدم تجربة مونتاج سينمائية تضمن أعلى معدلات الاحتفاظ بالجمهور
            (Retention) وتزيد من تفاعل عملائك من خلال أسلوب سرد قصصي بصري محترف.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={"/request"} className="cursor-pointer bg-primary-container text-on-primary-container font-label-md text-label-md px-8 py-4 rounded-xl active:scale-95 hover:scale-105 transition-all shadow-lg shadow-primary-container/20">
              اطلب مشروعك الآن
            </Link>

            <button className="cursor-pointer glass-card text-on-background font-label-md text-label-md px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 hover:scale-105 active:scale-95 transition-all">
              عرض الأعمال
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}