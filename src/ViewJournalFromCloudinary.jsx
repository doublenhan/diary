import React, { useState, useEffect } from 'react';
import styles from '../css/ViewJournal.module.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LoveAlbumPdf from './LoveAlbumPdf';

const EMOJIS = ["😍", "😊", "😁", "😠", "😎","😗","🌹","😚","😘","😗😙😚😘😍"]; // danh sách cảm xúc

const getSeasonTheme = () => {
  const month = new Date().getMonth() + 1;
  if ([3, 4, 5].includes(month)) return 'spring';
  if ([6, 7, 8].includes(month)) return 'summer';
  if ([9, 10, 11].includes(month)) return 'fall';
  return 'winter';
};


function MemoryTimeline({ memories }) {
  return (
    <div className={styles.timeline}>
      {memories.map((item, index) => (
        <div key={index} className={`${styles.memoryItem} ${index % 2 === 0 ? styles.left : styles.right}`}>
          <div className={styles.content}>
            <img src={item.image} alt={`memory-${index}`} />
            <p className={styles.caption}>{item.caption}</p>
            {index === 0 || item.year !== memories[index - 1].year ? (
              <div className={styles.yearLabel}>{item.year}</div>
            ) : null}
          </div>
        </div>
      ))}
      <div className={styles.verticalLine}></div>
    </div>
  );
}
// --- end MemoryTimeline ---

export default function ViewJournalFromCloudinary({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [seasonTheme] = useState(getSeasonTheme());

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const apiUrl = 'http://localhost:5000/api/cloudinary-gallery';
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('API not reachable');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('API response is not JSON:', text);
          setEntries([]);
          return;
        }
        const data = await res.json();
        setEntries(
          data
            .map(img => ({
              url: img.url || img.secure_url || '',
              caption: img.caption || '(No caption)',
              dateSelected: img.dateSelected && img.dateSelected !== '(No dateselected)'
                ? new Date(img.dateSelected)
                : null,
              emotion: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
            }))
            .filter(e => e.dateSelected !== null)
            .sort((a, b) => b.dateSelected - a.dateSelected)
        );
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(`.${styles.timelineItem}`);
    items.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [entries]);


  const memories = entries.map((entry) => ({
    image: entry.url,
    caption: entry.caption,
    year: entry.dateSelected ? entry.dateSelected.getFullYear() : '',
  }));

  return (
    <div className={`${styles.container} ${styles[seasonTheme]}`}>
      {/* Back button */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, cursor: 'pointer' }}>
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSIgZD0iTTEwLjI5NiA2Ljg4OUw0LjgzMyAxMS4xOGEuNS41IDAgMCAwIDAgLjc4Nmw1LjQ2MyA0LjI5MmEuNS41IDAgMCAwIC44MDEtLjQ4MmwtLjM1NS0xLjk1NWM1LjAxNi0xLjIwNCA3LjEwOCAxLjQ5NCA3LjkxNCAzLjIzNWMuMTE4LjI1NC42MTQuMjA1LjY0LS4wNzNjLjY0NS03LjIwMS00LjA4Mi04LjI0NC04LjU3LTcuNTY3bC4zNzEtMi4wNDZhLjUuNSAwIDAgMC0uOC0uNDgyIi8+PC9zdmc+"
          alt="Back"
          style={{ width: 50, height: 50 }}
          onClick={onBack}
        />
      </div>
      <h1 className={styles.header}>
        <span className={styles.galleryIcon}></span>
        Nhật Ký Ảnh Yêu Thương
      </h1>
      {/* PDF Download Button */}
      {/* 
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <PDFDownloadLink
          document={<LoveAlbumPdf entries={entries} />}
          fileName="Love-Journal-Album.pdf"
        >
          {({ loading }) =>
            loading ? 'Đang tạo PDF...' : '📘 Tải Photobook (PDF)'
          }
        </PDFDownloadLink>
      </div>
      */}
      {loading ? (
        <div className={styles.loading}>Đang tải ảnh...</div>
      ) : (
        <>
          <MemoryTimeline memories={memories} />
        </>
      )}
      {selectedImage && (
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>
            &times;
          </button>
          <div className={styles.modalContent}>
            <img src={selectedImage} alt="Full size" className={styles.fullImage} />
          </div>
        </div>
      )}
    </div>
  );
}
