import React, { useEffect, useState } from 'react';
import "../css/FloatingHearts.css";


const HEARTS = ['💖', '💗', '❤️', '💘', '💞'];

export default function FloatingHearts({ interval = 500, maxHearts = 50 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        icon: HEARTS[Math.floor(Math.random() * HEARTS.length)],
        left: Math.random() * 90,
        duration: 5 + Math.random() * 5,
        size: 16 + Math.random() * 24,
        drift: Math.random() > 0.5 ? 'left' : 'right',
        exploded: false
      };

      setHearts((prev) => [...prev.slice(-maxHearts), newHeart]);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, maxHearts]);

  const handleExplosion = (id) => {
    setHearts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, exploded: true } : h))
    );

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 200); // 
  };

  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className={`falling-heart ${h.drift} ${h.exploded ? 'explode' : ''}`}
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`
          }}
          onAnimationEnd={() => handleExplosion(h.id)}
        >
          {h.exploded ? '💥' : h.icon}
        </span>
      ))}
    </>
  );
}
