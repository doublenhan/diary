import React from 'react';
import {
  Document,
  Page,
  Image,
  Text,
  View
} from '@react-pdf/renderer';
import albumStyles from '../css/LoveAlbum.module.css';

export default function LoveAlbumPdf({ entries }) {
  return (
    <Document>
      {entries.map((entry, idx) => (
        <Page size="A4" style={albumStyles.page} key={idx}>
          <Image src={entry.url} style={albumStyles.image} />
          <View style={albumStyles.captionBox}>
            <Text style={albumStyles.caption}>{entry.caption}</Text>
            <Text style={albumStyles.date}>
              {new Date(entry.dateSelected).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          <Text style={albumStyles.watermark}>Made with Love 💖</Text>
        </Page>
      ))}
    </Document>
  );
}
