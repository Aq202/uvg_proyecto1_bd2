import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import styles from './Places.module.css';
import InputSelect from '../InputSelect';
import Place from '../Place/Place';
import usePopUp from '../../hooks/usePopUp';
import PopUp from '../PopUp/PopUp';
import InputText from '../InputText';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';

function Places() {
  const [filters, setFilters] = useState({});
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditOpen, openEdit, closeEdit] = usePopUp();
  const [placeToEdit, setPlaceToEdit] = useState(false);
  const { callFetch: fetchLocations, result: resultGet, error: errorGet } = useFetch();
  const { callFetch: putLocation, result: resultPut, loading: loadingPut } = useFetch();
  const { callFetch: deleteLocation, result: resultDelete } = useFetch();

  const token = useToken();

  const editPlace = (id, name, address, city, country) => {
    setPlaceToEdit({
      id, name, address, city, country,
    });
  };

  const getLocations = () => {
    const { country, city } = filters;
    const paramsObj = { page: currentPage };

    if (country !== undefined && country !== '') {
      paramsObj.country = country;
    }

    if (city !== undefined && city !== '') {
      paramsObj.city = city;
    }

    const searchParams = new URLSearchParams(paramsObj);

    fetchLocations({
      uri: `${serverHost}/location?${searchParams.toString()}`,
      headers: { authorization: token },
    });
  };

  const updateLocation = () => {
    putLocation({
      uri: `${serverHost}/location/`,
      headers: { authorization: token },
      body: JSON.stringify(placeToEdit),
      method: 'PATCH',
      parse: false,
    });
  };

  const deletePlace = (placeId) => {
    deleteLocation({
      uri: `${serverHost}/location/${placeId}`,
      headers: { authorization: token },
      method: 'DELETE',
      parse: false,
    });
  };

  const refreshPlaces = () => {
    setPlaces([]);
    setFilters({});
    closeEdit();
    getLocations();
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
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    if (!placeToEdit) return;
    openEdit();
  }, [placeToEdit]);

  useEffect(() => {
    if (resultGet) {
      setPlaces(resultGet.result);
    }
  }, [resultGet]);

  useEffect(() => {
    setPlaces([]);
    getLocations();
  }, [currentPage, filters]);

  useEffect(() => {
    if (!resultPut && !resultDelete) return;
    refreshPlaces();
  }, [resultPut, resultDelete]);

  useEffect(() => {
    getLocations();
  }, []);

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

      {!errorGet && (
        <div className={styles.placesContainer}>
          {places?.map((place) => (
            <Place
              location={`${place.city}, ${place.country}`}
              name={place.name}
              address={place.address}
              editPlace={() => editPlace(
                place.id,
                place.name,
                place.address,
                place.city,
                place.country,
              )}
              deletePlace={() => deletePlace(place.id)}
            />
          ))}
        </div>
      )}

      {errorGet && <p>No se encontraron resultados</p>}

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
            title="Ciudad"
            name="city"
            value={placeToEdit.city}
            defaultValue={placeToEdit.city}
            onChange={handleFormChange}
          />
          <InputText
            title="País"
            name="country"
            value={placeToEdit.country}
            defaultValue={placeToEdit.country}
            onChange={handleFormChange}
          />
          <Button text="Actualizar" className={styles.updateButton} onClick={updateLocation} disabled={loadingPut} />
        </div>
      </PopUp>
      )}

      <Pagination
        count={resultGet?.pages ?? 0}
        siblingCount={2}
        className={styles.pagination}
        onChange={handlePageChange}
        page={currentPage + 1}
      />

    </div>
  );
}

export default Places;
