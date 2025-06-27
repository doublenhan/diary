import React from "react";
import { useState, useEffect } from 'react';
import styles from '../css/App.module.css';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import axios from 'axios';

// Cloudinary config and upload helper
const CLOUD_NAME = 'dhelefhv1';
const UPLOAD_PRESET = 'love_journal_upload';

// Upload with both caption and description from nhật ký
const uploadToCloudinaryWithMeta = async (file, textContent, dateSelected) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  // Set caption, alt, and dateselected in context
  formData.append('context', `caption=${textContent}|alt=${textContent}|dateselected=${dateSelected}`);
  console.log('Uploading to Cloudinary with metadata:', {
    file: file.name,
    caption: textContent,
    dateselected: dateSelected,
    alt: textContent
  });
  const response = await axios.post(url, formData);
  return {
    url: response.data.secure_url,
    public_id: response.data.public_id
  };
};

const getSeasonTheme = () => {
  const month = new Date().getMonth() + 1;
  if ([3, 4, 5].includes(month)) return 'spring';
  if ([6, 7, 8].includes(month)) return 'summer';
  if ([9, 10, 11].includes(month)) return 'fall';
  return 'winter';
};

export default function LoveJournalApp({ loveDays, onBack }) {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ text: '', image: '', dateOnly: '', file: null });
  const [seasonTheme] = useState(getSeasonTheme());

  // Set default dateOnly to today on mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setNewEntry(entry => ({ ...entry, dateOnly: entry.dateOnly || todayStr }));
  }, []);

  const handleAddEntry = async () => {
    if (newEntry.text.trim()) {
      let imageUrl = newEntry.image;
      const entryDate = newEntry.dateOnly || new Date().toISOString().split('T')[0];
      // If a file is selected, upload it now with caption, description, and date
      if (newEntry.file) {
        try {
          console.log('Uploading image to Cloudinary...', newEntry.file);
          const uploadResult = await uploadToCloudinaryWithMeta(newEntry.file, newEntry.text, entryDate);
          console.log('Upload result:', uploadResult);
          imageUrl = uploadResult.url;
        } catch (err) {
          console.error('Upload error:', err);
        }
      }
      const now = new Date();
      setEntries([
        { ...newEntry, image: imageUrl, date: now, dateOnly: entryDate, file: undefined },
        ...entries
      ]);
      setNewEntry({ text: '', image: '', dateOnly: entryDate, file: null });
    }
  };
  

  // Remove localStorage implementation
  // Group entries by dateOnly
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = entry.dateOnly;
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {});

  return (
    <div className={`${styles.container} ${styles[seasonTheme]}`}>
      {/* Top left SVG icon */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, cursor: 'pointer' }}>
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSIgZD0iTTEwLjI5NiA2Ljg4OUw0LjgzMyAxMS4xOGEuNS41IDAgMCAwIDAgLjc4Nmw1LjQ2MyA0LjI5MmEuNS41IDAgMCAwIC44MDEtLjQ4MmwtLjM1NS0xLjk1NWM1LjAxNi0xLjIwNCA3LjEwOCAxLjQ5NCA3LjkxNCAzLjIzNWMuMTE4LjI1NC42MTQuMjA1LjY0LS4wNzNjLjY0NS03LjIwMS00LjA4Mi04LjI0NC04LjU3LTcuNTY3bC4zNzEtMi4wNDZhLjUuNSAwIDAgMC0uOC0uNDgyIi8+PC9zdmc+"
          alt="Back"
          style={{ width: 50, height: 50 }}
          onClick={onBack}
        />
      </div>
      <header className={styles.headerBox}>
        <h1 className={styles.header}>Love Journal</h1>
        <p className={styles.subheader}>
          You and your love have been together for <b>{loveDays}</b> days 💖
        </p>
      </header>
      <section className={styles.formSection}>
        <h2 className={styles.title}>Tạo nhật ký kỷ niệm</h2>
        {/* Date picker for memory date */}
        <input
          type="date"
          value={newEntry.dateOnly}
          onChange={e => setNewEntry({ ...newEntry, dateOnly: e.target.value })}
          className={styles.input}
          style={{ marginBottom: '0.75rem' }}
        />
        <textarea
          placeholder="Viết nhật ký..."
          value={newEntry.text}
          onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
          className={styles.textarea}
          required
        />
        <input
          type="text"
          placeholder="URL ảnh (nếu có)"
          value={newEntry.image}
          onChange={(e) => setNewEntry({ ...newEntry, image: e.target.value })}
          className={styles.input}
        />
        <div className={styles.fileInputWrapper}>
          {newEntry.file && (
            <img
              src={URL.createObjectURL(newEntry.file)}
              alt="preview"
              className={styles.fileInputPreview}
            />
          )}
          <label htmlFor="file-upload" className={styles.fileInputButton}>
            <span role="img" aria-label="camera" className={styles.fileInputCameraIcon}>📷</span>
            Chọn ảnh
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
            className={styles.fileInput}
            onChange={e => {
              const file = e.target.files[0];
              setNewEntry(prev => ({
                ...prev,
                file,
                image: file ? '' : prev.image
              }));
            }}
          />
        </div>
        <button onClick={handleAddEntry} className={styles.button} disabled={!newEntry.text.trim()}>
         Thêm Nhật Ký
        <span role="img" aria-label="sparkles" className={styles.buttonIcon}>✨</span>
        </button>
      </section>
      <section className={styles.entryList}>
        {Object.entries(groupedEntries).map(([date, entryList]) => (
          <div key={date} style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#be123c' }}>
              {/* Only format if date is valid */}
              {date && !isNaN(new Date(date)) ? (
                <>📅 {format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: vi })}</>
              ) : (
                <>📅 Invalid date</>
              )}
            </h3>
            {entryList.map((entry, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardContent}>
                  <p className={styles.text}>{entry.text}</p>
                  {entry.image && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={entry.image}
                        alt="memory"
                        className={styles.image}
                      />
                    </div>
                  )}
                  <small className={styles.date}>
                    {/* Only format if entry.date is valid */}
                    {entry.date && !isNaN(new Date(entry.date)) ? (
                      format(new Date(entry.date), 'HH:mm:ss')
                    ) : (
                      'Invalid time'
                    )}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
