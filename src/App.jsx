import React, { useState } from 'react';
import MainPage from './MainPage';
import LoveJournalApp from './LoveJournalApp';
import ViewJournalFromCloudinary from './ViewJournalFromCloudinary';
import FloatingHearts from './FloatingHearts';

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [loveDaysValue, setLoveDaysValue] = useState(0);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSetLoveDays = (days) => {
    setLoveDaysValue(days);
  };

  return (
    <div>
      <FloatingHearts count={20} />
      {currentPage === 'main' &&
        <MainPage
          onNavigate={handleNavigate}
          onSetLoveDays={handleSetLoveDays}
        />
      }

      {currentPage === 'add' &&
        <LoveJournalApp
          loveDays={loveDaysValue}
          onBack={() => setCurrentPage('main')}
        />
      }
      {currentPage === 'View_Entries' &&
        <ViewJournalFromCloudinary
          loveDays={loveDaysValue}
          onBack={() => setCurrentPage('main')}
        />
      }
      {currentPage === 'album' &&
        <LoveJournalApp
          loveDays={loveDaysValue}
          onBack={() => setCurrentPage('main')}
        />
      }
      {currentPage === 'letter' &&
        <LoveJournalApp
          loveDays={loveDaysValue}
          onBack={() => setCurrentPage('main')}
        />
      }
    </div>
  );
}