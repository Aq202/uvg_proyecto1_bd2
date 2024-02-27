import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import styles from './Places.module.css';
import InputSelect from '../InputSelect';
import Place from '../Place/Place';
import usePopUp from '../../hooks/usePopUp';
import PopUp from '../PopUp/PopUp';
import InputText from '../InputText';

function Places() {
  const [filters, setFilters] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditOpen, openEdit, closeEdit] = usePopUp();
  const [placeToEdit, setPlaceToEdit] = useState(false);
  const [places, setPlaces] = useState([
    {
      location: 'Hola', name: 'Hola', address: 'HOla',
    },
    {
      location: 'Hola', name: 'Hola', address: 'HOla',
    },
  ]);

  const editPlace = (name, address, location) => {
    setPlaceToEdit({ name, address, location });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPlaceToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    setPlaces([]);
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    if (!placeToEdit) return;
    openEdit();
  }, [placeToEdit]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>

        <p className={styles.title}>Lugares</p>

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

        </div>
      </div>

      <div className={styles.placesContainer}>
        {places.map((place) => (
          <Place
            location={place.location}
            name={place.name}
            address={place.address}
            editPlace={() => editPlace(place.name, place.location, place.address)}
          />
        ))}
      </div>

      {isEditOpen && (
      <PopUp close={closeEdit} closeWithBackground>
        <div className={styles.editPlace}>
          <h2 className={styles.editPlaceTitle}>Detalles de lugar</h2>
          <InputText
            title="Nombre"
            name="name"
            value={placeToEdit.name}
            defaultValue={placeToEdit.name}
            onChange={handleFormChange}
          />
          <InputText
            title="Dirección"
            name="address"
            value={placeToEdit.address}
            defaultValue={placeToEdit.address}
            onChange={handleFormChange}
          />
          <InputText
            title="Ubicación"
            name="location"
            value={placeToEdit.location}
            defaultValue={placeToEdit.location}
            onChange={handleFormChange}
          />
        </div>
      </PopUp>
      )}

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

export default Places;
