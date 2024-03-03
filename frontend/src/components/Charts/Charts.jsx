import React from 'react';
import styles from './Charts.module.css';

function Charts() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>
        <p className={styles.title}>Dashboard</p>
      </div>
      <iframe
        title="dashboard"
        style={{
          background: '#F1F5F4',
          border: 'none',
          borderRadius: '2px',
          boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
          width: '100%',
          height: '160vh',
          overflow: 'visible',
        }}
        src="https://charts.mongodb.com/charts-project-0-iaphq/embed/dashboards?id=26679249-5e20-4228-8a57-acda8dffe230&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
      />
    </div>
  );
}

export default Charts;
