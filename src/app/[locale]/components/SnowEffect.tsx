"use client";

import React, { useEffect, useRef } from "react";

const SnowEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Canvas 크기를 window 크기로 설정
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // 눈송이 클래스 정의
    class Snowflake {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1 + 1;
      }

      move() {
        const canvas = canvasRef.current;
        if (canvas) {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
          }
          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
        }
      }

      draw() {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fill();
        }
      }
    }

    // 눈송이 생성
    const snowflakes = Array(100)
      .fill(null)
      .map(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          return new Snowflake(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          );
        }
        return new Snowflake(0, 0);
      });

    // 애니메이션 함수
    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (ctx) {
        const canvas = canvasRef.current;
        if (canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          snowflakes.forEach((snowflake) => {
            snowflake.move();
            snowflake.draw();
          });
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

export default SnowEffect;
