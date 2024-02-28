import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import styles from './FindTrips.module.css';
import InputSelect from '../InputSelect';
import Trip from '../Trip';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';

function FindTrips() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const { callFetch: getRides, result: resultGet, error: errorGet } = useFetch();
  const [trips, setTrips] = useState([]);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGRhNDM0MWIzMzk4YTBmODBjMWJjMyIsIm5hbWUiOiJQYWJsbyIsImVtYWlsIjoicGFibG9AZ21haWwuY29tIiwicGhvbmUiOiI1NTAwNDIzMyIsImlhdCI6MTcwOTAyNDMxOX0.Rql9zFZrTvBBgzTYxk56WFPpNUqLFEkXRUYOwXEt8Zs';

  const getTrips = () => {
    const { country, city, driver } = filters;
    const paramsObj = { passenger: false };

    if (country !== undefined && country !== '') {
      paramsObj.country = country;
    }

    if (city !== undefined && city !== '') {
      paramsObj.city = city;
    }

    if (driver !== undefined && driver !== '') {
      paramsObj.driver = driver;
    }

    const searchParams = new URLSearchParams(paramsObj);
    getRides({
      uri: `${serverHost}/ride?${searchParams.toString()}`,
      headers: { authorization: token },
    });
  };

  const refreshTrips = () => {
    setTrips([]);
    setFilters({});
    getTrips();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    setTrips([]);
    setCurrentPage(page - 1);
  };

  const readDate = (fechaISO) => {
    const fecha = new Date(fechaISO);

    // Convertir a cadena con formato local usando toLocaleString para manejar la zona horaria
    const opciones = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC', // Asegura que la conversión se haga respecto a la hora UTC
    };

    // Puedes cambiar 'es' por el código de tu zona horaria local si necesitas otro idioma o formato
    const fechaHoraFormateada = fecha.toLocaleString('es', opciones);

    // Para asegurar el formato deseado, podrías hacer un ajuste manual si es necesario
    // Esto es un ejemplo y podría necesitar ajustes dependiendo del idioma o la zona horaria
    return fechaHoraFormateada.replace(/\//g, '-').replace(',', '');
  };

  useEffect(() => {
    if (resultGet) {
      setTrips(resultGet.result);
    }
  }, [resultGet]);

  useEffect(() => {
    setTrips([]);
    getTrips();
  }, [currentPage, filters]);

  useEffect(() => {
    getTrips();
  }, []);

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

      {!errorGet && (
        <div className={styles.tripsContainer}>
          {trips.map((trip) => (
            <Trip
              id={trip.id}
              location={`${trip.arrivalLocation.city}, ${trip.arrivalLocation.country}`}
              originName={trip.startLocation.name}
              originAddress={trip.startLocation.address}
              destinationName={trip.arrivalLocation.name}
              destinationAddress={trip.arrivalLocation.address}
              driver={trip.user.name}
              passengers={trip.passengers.length}
              time={readDate(trip.datetime)}
              joined={trip.isPassenger}
              callback={refreshTrips}
            />
          ))}
        </div>
      )}

      {errorGet && <p>No se encontraron resultados</p>}

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
