import React from 'react';
import PropTypes from 'prop-types';
import { FaLongArrowAltRight as ArrowIcon } from 'react-icons/fa';
import styles from './Trip.module.css';

function Trip({
  location,
  originName,
  originAddress,
  destinationName,
  destinationAddress,
  driver,
  passengers,
  time,
}) {
  return (
    <div className={styles.tripContainer}>
      <p className={styles.location}>{location}</p>
      <div className={styles.headerSection}>
        <div className={styles.origin}>
          <p className={styles.placeName}>{originName}</p>
          <p className={styles.placeAddress}>{originAddress}</p>
        </div>
        <ArrowIcon className={styles.arrow} />
        <div className={styles.destination}>
          <p className={styles.placeName}>{destinationName}</p>
          <p className={styles.placeAddress}>{destinationAddress}</p>
        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Conductor:</p>
          <p className={styles.infoDescription}>{driver}</p>
        </div>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Pasajeros:</p>
          <p className={styles.infoDescription}>{passengers}</p>
        </div>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Salida:</p>
          <p className={styles.infoDescription}>{time}</p>
        </div>
      </div>
    </div>
  );
}

Trip.propTypes = {
  location: PropTypes.string.isRequired,
  originName: PropTypes.string.isRequired,
  originAddress: PropTypes.string.isRequired,
  destinationName: PropTypes.string.isRequired,
  destinationAddress: PropTypes.string.isRequired,
  driver: PropTypes.string.isRequired,
  passengers: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
};

export default Trip;
