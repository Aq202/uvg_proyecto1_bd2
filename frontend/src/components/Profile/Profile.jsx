import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const { callFetch: getUser, result: resultGet, error: errorGet } = useFetch();

  const token = useToken();

  const getUserInfo = () => {
    getUser({
      uri: `${serverHost}/user`,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    if (resultGet) {
      setUserInfo(resultGet);
    }
  }, [resultGet]);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>
        <p className={styles.title}>Mi Perfil</p>
      </div>

      {!errorGet && resultGet && (
        <div className={styles.infoContainer}>
          {userInfo.name}
        </div>
      )}

      {errorGet && <p>Ha ocurrido un error al obtener la información del usuario</p>}
    </div>
  );
}

export default Profile;
