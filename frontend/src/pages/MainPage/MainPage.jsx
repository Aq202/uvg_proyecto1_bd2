import React from 'react';
import styles from './MainPage.module.css';
import NavBar from '../../components/NavBar/NavBar';
import toggleNavBar from '../../hooks/toggleNavBar';
import BottomWave from '../../components/BottomWave';
import UserTrips from '../../components/UserTrips';
import FindTrips from '../../components/FindTrips';

function MainPage() {
  const [currentSection, switchSection] = toggleNavBar();
  return (
    <div className={styles.mainPageContainer}>
      <NavBar handleNavBar={switchSection} />

      <div className={styles.bannerContainer}>
        <div className={styles.imageWrapper} />
        <BottomWave className={styles.bottomWave} />
      </div>

      <div className={styles.pageContent}>
        {currentSection === 'userTrips' && <UserTrips />}
        {currentSection === 'findTrips' && <FindTrips />}
      </div>
    </div>
  );
}

export default MainPage;
