"use client";

import React, { useEffect, useRef } from "react";

interface Drawable {
  move(): void;
  draw(): void;
}

const HolidayAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class Santa implements Drawable {
      private x: number;
      private y: number;
      private speed: number;
      private sleighWidth: number;
      private sleighHeight: number;
      private santaSize: number;
      private reindeerCount: number;
      private wiggle: number;
      private wiggleSpeed: number;
      private isVisible: boolean;
      private movePattern: number;
      private verticalSpeed: number;
      private nextAppearance: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 4;
        this.sleighWidth = 120;
        this.sleighHeight = 60;
        this.santaSize = 40;
        this.reindeerCount = 3;
        this.wiggle = 0;
        this.wiggleSpeed = 0.1;
        this.isVisible = false;
        this.movePattern = 0;
        this.verticalSpeed = -2;
        this.nextAppearance = this.getRandomDelay();
      }

      private getRandomDelay(): number {
        return Date.now() + Math.random() * 10000 + 5000; // 5-15초 사이
      }

      private resetPosition(): void {
        const canvas = canvasRef.current;
        if (canvas) {
          this.x = -200;
          this.y = canvas.height * 0.7; // 화면 아래쪽에서 시작
          this.movePattern = Math.floor(Math.random() * 3); // 랜덤 패턴 선택
          this.verticalSpeed = -2;
          switch (this.movePattern) {
            case 0: // 대각선 위로
              this.verticalSpeed = -2;
              break;
            case 1: // 직선
              this.y = canvas.height * 0.2;
              this.verticalSpeed = 0;
              break;
            case 2: // 대각선 아래로
              this.y = canvas.height * 0.2;
              this.verticalSpeed = 1;
              break;
          }
        }
      }

      move(): void {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (!this.isVisible && Date.now() > this.nextAppearance) {
          this.isVisible = true;
          this.resetPosition();
        }

        if (this.isVisible) {
          this.x += this.speed;
          this.y += this.verticalSpeed;
          this.wiggle += this.wiggleSpeed;

          // 화면 경계 체크
          if (this.y < canvas.height * 0.1) {
            this.verticalSpeed = Math.abs(this.verticalSpeed) * 0.5; // 위쪽 경계
          } else if (this.y > canvas.height * 0.8) {
            this.verticalSpeed = -Math.abs(this.verticalSpeed) * 0.5; // 아래쪽 경계
          }

          // 화면을 벗어나면 다시 숨김 상태로 전환
          if (this.x > canvas.width + 200) {
            this.isVisible = false;
            this.nextAppearance = this.getRandomDelay();
          }
        }
      }
      draw(): void {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!this.isVisible || !ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.wiggle) * 5);

        // 순록 그리기
        const reindeerSpacing = 50;
        for (let i = 0; i < this.reindeerCount; i++) {
          const reindeerX = i * reindeerSpacing;
          const reindeerY = Math.sin(this.wiggle + i * 0.5) * 3;

          ctx.save();
          ctx.translate(reindeerX, reindeerY);

          // 순록 다리
          ctx.fillStyle = "#8B4513";
          const legSpacing = 15;
          [-1, 1].forEach((side) => {
            ctx.beginPath();
            ctx.roundRect(5, side * 5, 4, 20, 2);
            ctx.roundRect(15, side * 5, 4, 20, 2);
            ctx.fill();
          });

          // 순록 몸체
          ctx.fillStyle = "#8B4513";
          ctx.beginPath();
          ctx.ellipse(15, -10, 25, 15, 0, 0, Math.PI * 2);
          ctx.fill();

          // 순록 머리
          ctx.beginPath();
          ctx.ellipse(35, -20, 15, 12, -0.3, 0, Math.PI * 2);
          ctx.fill();

          // 순록 눈
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(38, -22, 2, 0, Math.PI * 2);
          ctx.fill();

          // 모든 순록의 빛나는 코
          const noseColor = ["#FF0000", "#FF5555", "#FF0000"][i];
          ctx.fillStyle = noseColor;
          ctx.beginPath();
          ctx.arc(45, -20, 6, 0, Math.PI * 2);
          ctx.fill();

          // 빛나는 효과
          const gradient = ctx.createRadialGradient(45, -20, 0, 45, -20, 10);
          gradient.addColorStop(0, `rgba(255, 150, 150, ${0.6 - i * 0.1})`);
          gradient.addColorStop(1, "rgba(255, 150, 150, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(45, -20, 10, 0, Math.PI * 2);
          ctx.fill();

          // 뿔
          const antlerPoints = [
            [25, -28],
            [30, -40],
            [35, -35],
            [40, -42],
            [33, -28],
          ];
          ctx.strokeStyle = "#8B4513";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(antlerPoints[0][0], antlerPoints[0][1]);
          antlerPoints
            .slice(1)
            .forEach((point) => ctx.lineTo(point[0], point[1]));
          ctx.stroke();

          // 고삐
          if (i < this.reindeerCount - 1) {
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(30, -15);
            ctx.lineTo(reindeerSpacing + 5, -15);
            ctx.stroke();
          }

          ctx.restore();
        }

        const sleighX = this.reindeerCount * reindeerSpacing;

        // 썰매 그리기
        ctx.save();
        ctx.translate(sleighX, 0);

        // 썰매 날
        ctx.fillStyle = "#C0C0C0";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(10, 10, 140, 10);
        ctx.lineTo(140, 5);
        ctx.quadraticCurveTo(10, 5, 0, -5);
        ctx.fill();

        // 썰매 본체
        ctx.fillStyle = "#8B0000";
        const sleighPath = new Path2D();
        sleighPath.moveTo(10, -20);
        sleighPath.lineTo(130, -20);
        sleighPath.quadraticCurveTo(140, -20, 140, -10);
        sleighPath.lineTo(140, 5);
        sleighPath.lineTo(0, 5);
        sleighPath.lineTo(0, -10);
        sleighPath.quadraticCurveTo(0, -20, 10, -20);
        ctx.fill(sleighPath);

        // 썰매 장식
        const decorPattern = [20, 50, 80, 110];
        decorPattern.forEach((x) => {
          // 골드 장식
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(x, -15, 5, 0, Math.PI * 2);
          ctx.fill();

          // 빛나는 효과
          const gradient = ctx.createRadialGradient(x, -15, 0, x, -15, 8);
          gradient.addColorStop(0, "rgba(255, 215, 0, 0.5)");
          gradient.addColorStop(1, "rgba(255, 215, 0, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, -15, 8, 0, Math.PI * 2);
          ctx.fill();
        });

        // 선물 더미
        for (let i = 0; i < 3; i++) {
          const giftX = 30 + i * 35;
          const giftSize = 25 - i * 5;

          ctx.fillStyle = ["#FF0000", "#00FF00", "#0000FF"][i];
          ctx.fillRect(giftX, -20 - giftSize, giftSize, giftSize);

          // 리본
          ctx.fillStyle = "#FFD700";
          ctx.fillRect(giftX + giftSize / 2 - 2, -20 - giftSize, 4, giftSize);
          ctx.fillRect(giftX, -20 - giftSize / 2 - 2, giftSize, 4);
        }

        // 산타 그리기
        // 산타 다리
        ctx.fillStyle = "#000000";
        ctx.fillRect(105, -35, 8, 15);
        ctx.fillRect(118, -35, 8, 15);

        // 산타 몸체
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.roundRect(100, -70, 30, 40, 5);
        ctx.fill();

        // 산타 벨트
        ctx.fillStyle = "#000000";
        ctx.fillRect(98, -45, 34, 5);
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(115, -42.5, 3, 0, Math.PI * 2);
        ctx.fill();

        // 산타 얼굴
        ctx.fillStyle = "#FFE4C4";
        ctx.beginPath();
        ctx.arc(115, -75, 12, 0, Math.PI * 2);
        ctx.fill();

        // 산타 눈
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(111, -77, 2, 0, Math.PI * 2);
        ctx.arc(119, -77, 2, 0, Math.PI * 2);
        ctx.fill();

        // 산타 수염
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(115, -70, 8, 6, 0, 0, Math.PI);
        ctx.fill();

        // 산타 모자
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(100, -85);
        ctx.quadraticCurveTo(115, -100, 130, -85);
        ctx.fill();

        // 모자 테두리
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(100, -87, 30, 4);

        // 모자 폼폼
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(128, -87, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
      }
    }

    class Snowflake implements Drawable {
      private x: number;
      private y: number;
      private size: number;
      private speedX: number;
      private speedY: number;
      public isVisible: boolean;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1 + 1;
        this.isVisible = true;
      }

      move(): void {
        this.x += this.speedX;
        this.y += this.speedY;

        if (canvas) {
          if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
          }
          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
        }
      }

      draw(): void {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!this.isVisible || !ctx) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    }

    class Gift implements Drawable {
      private x: number;
      private y: number;
      private size: number;
      private speedY: number;
      private rotation: number;
      private rotationSpeed: number;
      private boxColor: string;
      private ribbonColor: string;
      private readonly colors: string[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 30;
        this.speedY = Math.random() * 2 + 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.colors = [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FFBE0B",
          "#FF006E",
        ];
        this.boxColor =
          this.colors[Math.floor(Math.random() * this.colors.length)];
        do {
          this.ribbonColor =
            this.colors[Math.floor(Math.random() * this.colors.length)];
        } while (this.ribbonColor === this.boxColor);
      }

      move(): void {
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (canvas && this.y > canvas.height + this.size) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
          this.boxColor =
            this.colors[Math.floor(Math.random() * this.colors.length)];
          do {
            this.ribbonColor =
              this.colors[Math.floor(Math.random() * this.colors.length)];
          } while (this.ribbonColor === this.boxColor);
        }
      }

      draw(): void {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const boxSize = this.size;
        const ribbonWidth = boxSize * 0.2;

        // 선물 상자
        ctx.fillStyle = this.boxColor;
        ctx.beginPath();
        ctx.roundRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize, 5);
        ctx.fill();

        // 수직 리본
        ctx.fillStyle = this.ribbonColor;
        ctx.fillRect(-ribbonWidth / 2, -boxSize / 2, ribbonWidth, boxSize);

        // 수평 리본
        ctx.fillRect(-boxSize / 2, -ribbonWidth / 2, boxSize, ribbonWidth);

        // 리본 매듭
        const bowSize = ribbonWidth * 1.5;

        // 왼쪽 고리
        ctx.beginPath();
        ctx.ellipse(
          -ribbonWidth / 2,
          -ribbonWidth / 2,
          bowSize,
          bowSize / 2,
          Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 오른쪽 고리
        ctx.beginPath();
        ctx.ellipse(
          ribbonWidth / 2,
          -ribbonWidth / 2,
          bowSize,
          bowSize / 2,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 중앙 매듭
        ctx.beginPath();
        ctx.ellipse(
          0,
          -ribbonWidth / 2,
          ribbonWidth / 2,
          ribbonWidth / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      }
    }

    const santa = new Santa();
    const snowflakes: Snowflake[] = Array(100)
      .fill(null)
      .map(
        () =>
          new Snowflake(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
      );

    const gifts: Gift[] = Array(5)
      .fill(null)
      .map(
        () =>
          new Gift(Math.random() * canvas.width, Math.random() * canvas.height)
      );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((snowflake) => {
        snowflake.move();
        snowflake.draw();
      });

      gifts.forEach((gift) => {
        gift.move();
        gift.draw();
      });

      santa.move();
      santa.draw();

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

export default HolidayAnimation;
