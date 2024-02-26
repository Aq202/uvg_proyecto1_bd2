import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import styles from './FindTrips.module.css';
import InputSelect from '../InputSelect';
import Trip from '../Trip';

function FindTrips() {
  const [filters, setFilters] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [trips, setTrips] = useState([
    {
      location: 'Hola', originName: 'Hola', originAddress: 'HOla', destinationName: 'Hola', destinationAddress: 'Hola', driver: 'Hola', passengers: 3, time: 'asdf',
    },
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    setTrips([]);
    setCurrentPage(page - 1);
  };

  return (
    <div className={styles.mainContainer}>

      <div className={styles.headerSection}>

        <p className={styles.title}>Encontrar viajes</p>

        <div className={styles.filtersContainer}>

          <div className={styles.filterContainer}>
            <InputSelect
              options={[{ value: 'direccion1', title: 'País 1' }, { value: 'direccion2', title: 'País 2' }]}
              name="country"
              onChange={handleFilterChange}
              placeholder="País"
              value={filters?.country}
            />
          </div>

          <div className={styles.filterContainer}>
            <InputSelect
              options={[{ value: 'direccion1', title: 'Ciudad 1' }, { value: 'direccion2', title: 'Ciudad 2' }]}
              name="city"
              onChange={handleFilterChange}
              placeholder="Ciudad"
              value={filters?.city}
            />
          </div>

          <div className={styles.filterContainer}>
            <InputSelect
              options={[{ value: 'driver', title: 'Soy el conductor' }, { value: 'passenger', title: 'Soy pasajero' }, { value: '', title: 'Cualquiera' }]}
              name="role"
              onChange={handleFilterChange}
              placeholder="Soy..."
              value={filters?.role}
            />
          </div>
        </div>
      </div>

      <div className={styles.tripsContainer}>
        {trips.map((trip) => (
          <Trip
            location={trip.location}
            originName={trip.originName}
            originAddress={trip.originAddress}
            destinationName={trip.destinationName}
            destinationAddress={trip.destinationAddress}
            driver={trip.driver}
            passengers={trip.passengers}
            time={trip.time}
          />
        ))}
      </div>

      <Pagination
        count={0}
        siblingCount={2}
        className={styles.pagination}
        onChange={handlePageChange}
        page={currentPage + 1}
      />

    </div>
  );
}

export default FindTrips;
