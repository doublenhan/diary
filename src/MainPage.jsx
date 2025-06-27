import React, { useState, useEffect } from 'react';
import styles from '../css/Main.module.css';
import avatar from './assets/couple.jpg';
import flower from './assets/flower.png'

const getSeasonTheme = () => {
  const month = new Date().getMonth() + 1;
  if ([1, 2, 3].includes(month)) return 'spring';
  if ([4, 5, 6].includes(month)) return 'summer';
  if ([7, 8, 9].includes(month)) return 'fall';
  return 'winter';
};

export default function MainPage({ onNavigate, onSetLoveDays }) {
  const [startDate] = useState(new Date('2018-12-09'));//yyy-mm-dd format
  const today = new Date();
  const loveDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const [seasonTheme] = useState(getSeasonTheme());

  // Pass the loveDays to the parent component
  useEffect(() => {
    onSetLoveDays(loveDays);
  }, [loveDays, onSetLoveDays]);

  return (
    <div className={`${styles.container} ${styles[seasonTheme]}`}>
      <h1 className={styles.loveTitle}>Love Journal</h1>
      <img src={avatar} alt="Couple" className={styles.avatar} />
      <p className={styles.daysTogether}>
        You and your love have been together for <b>{loveDays}</b> days.
      </p>
      <blockquote className={styles.quote}>
        “To love and be loved is to feel the sun from both sides.”
      </blockquote>
      <div className={styles.buttonGroup}>
        <button onClick={() => onNavigate('View_Entries')} className={styles.journalButton}>Xem Nhật Ký</button>
        <button onClick={() => onNavigate('add')} className={styles.journalButton}>Tạo Nhật Ký</button>
        <button onClick={() => onNavigate('album')} className={styles.journalButton}>Ảnh Kỷ Niệm</button>
        <button onClick={() => onNavigate('letter')} className={styles.journalButton}>Write a Letter</button>
      </div>
      <img src={flower} alt="Envelope" className={styles.flowerImage} />
    </div>
  );
}
