import { useEffect, useRef, useState } from "react";
import shipImg from "../assets/ship.png";
import bulletImg from "../assets/bullet.png";
import "../styles/ShipAnimation.css";

const shipMarks = [0, 50, 25, 100, 75, 0]; // movement sequence

export default function ShipAnimation({ logoRef }) {
  const shipRef = useRef(null);
  const [bullets, setBullets] = useState([]);

  const animationStarted = useRef(false);

  useEffect(() => {
    if (animationStarted.current || !logoRef.current) return;
    animationStarted.current = true;

    const mainLogo = logoRef.current;
    if (!mainLogo) return;
    let currentIndex = 0;
    const logoWidth = mainLogo.offsetWidth;

    const fireBullet = (leftOffsetPx) => {
      setBullets((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), left: leftOffsetPx }
      ]);
    };

    const moveShip = () => {
      if (!shipRef.current || !logoRef.current) return;

      const startPercent = shipMarks[currentIndex];
      const endPercent = shipMarks[(currentIndex + 1) % shipMarks.length];
      const distance = Math.abs(endPercent - startPercent);
      const duration = 1000; // 1 second per segment
      const startTime = performance.now();
      const direction = endPercent > startPercent ? 1 : -1;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newPercent = startPercent + direction * distance * progress;
        const newLeftPx = (newPercent / 100) * (logoWidth - 60); // 60 is your ship width
        shipRef.current.style.left = `${newLeftPx}px`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          fireBullet(newLeftPx + 25); // center of 60px ship
          currentIndex = (currentIndex + 1) % shipMarks.length;
          moveShip();
        }
      };

      requestAnimationFrame(step);
    };

    moveShip();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, top: (b.top || 400) - 10 }))
          .filter((b) => b.top > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="logo-animation-container">
      <div className="ship" ref={shipRef}>
        <img id="shipSize" src={shipImg} alt="Ship" width={100} height={100} />
      </div>

      {bullets.map((bullet) => (
        <img
          key={bullet.id}
          src={bulletImg}
          alt="Bullet"
          className="bullet"
          style={{
            left: `${bullet.left}px`,
            top: `${bullet.top || 400}px`
          }}
        />
      ))}
    </div>
  );
};