import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import useUpdateUser from '../../hooks/useUpdateUser';
import { button, blue } from '../../styles/buttons.module.css';
import { serverHost } from '../../config';
import countries from '../../assets/countries.ts';
import InputText from '../InputText/InputText';
import InputSelect from '../InputSelect/InputSelect';
import Spinner from '../Spinner/Spinner';

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [editable, setEditable] = useState(false);
  const { callFetch: getUser, result: resultGet, error: errorGet } = useFetch();
  const [errors, setErrors] = useState({});

  const {
    updateUser, error, loading,
  } = useUpdateUser();

  const handleuserInfoChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setUserInfo((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateName = () => {
    if (userInfo?.name?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, name: 'El nombre es obligatorio.' }));
    return false;
  };
  const validateEmail = () => {
    if (userInfo?.email?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, email: 'El email es obligatorio.' }));
    return false;
  };
  const validatePhone = () => {
    if (userInfo?.phone?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, phone: 'El teléfono es obligatorio.' }));
    return false;
  };
  const validatePassword = () => {
    if (!userInfo?.password?.trim().length || userInfo?.password?.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, password: 'La contraseña es obligatoria.' }));
      return false;
    }
    if (userInfo?.repeatPassword !== userInfo?.password) {
      setErrors((lastVal) => ({ ...lastVal, password: 'Las contraseñas no coinciden.', repeatPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    if (userInfo?.password === userInfo?.repeatPassword) {
      delete errors.repeatPassword; delete errors.password;
    }
    return true;
  };
  const validateRepeatedPassword = () => {
    if (!userInfo?.repeatPassword?.trim().length || userInfo?.repeatPassword?.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, repeatPassword: 'Debes verificar tu contraseña.' }));
      return false;
    }
    if (userInfo?.repeatPassword !== userInfo?.password) {
      setErrors((lastVal) => ({ ...lastVal, password: 'Las contraseñas no coinciden.', repeatPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    if (userInfo?.repeatPassword === userInfo?.password) {
      delete errors.repeatPassword;
      delete errors.password;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editable) {
      setEditable(true);
      return;
    }
    clearErrors();
    if (!(validateEmail() && validatePassword()
      && !validateName() && !validatePhone())) return;
    updateUser({
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      password: userInfo.password,
    });
    setEditable(false);
  };

  const prefixes = countries.map((country) => ({
    value: country.prefix,
    title: `${country.prefix} (${country.name})`,
  }));

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
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <InputText
            disabled={!editable}
            title="Nombre"
            name="name"
            onChange={handleuserInfoChange}
            value={userInfo?.name}
            error={errors?.name}
            onBlur={validateName}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          <InputText
            disabled={!editable}
            title="Correo electrónico"
            name="email"
            onChange={handleuserInfoChange}
            value={userInfo?.email}
            error={errors?.email}
            onBlur={validateEmail}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          <div className={styles.phone}>
            <InputSelect
              disabled={!editable}
              title="Prefijo"
              name="prefix"
              onChange={handleuserInfoChange}
              error={errors?.prefix}
              value={userInfo?.prefix}
              onFocus={clearError}
              options={prefixes}
              placeholder="Prefix"
            />
            <InputText
              disabled={!editable}
              title="Teléfono"
              name="phone"
              onChange={handleuserInfoChange}
              value={userInfo?.phone}
              error={errors?.phone}
              onBlur={validatePhone}
              onFocus={clearError}
              style={{ maxWidth: '560px' }}
            />
          </div>
          <InputText
            disabled={!editable}
            title="Contraseña"
            name="password"
            type="password"
            onChange={handleuserInfoChange}
            value={userInfo?.password}
            error={errors?.password}
            onBlur={validatePassword}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          <InputText
            disabled={!editable}
            title="Confirmar Contraseña"
            name="repeatPassword"
            type="password"
            onChange={handleuserInfoChange}
            value={userInfo?.repeatPassword}
            error={errors?.repeatPassword}
            onBlur={validateRepeatedPassword}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          {(error || errorGet)
            && <div className={styles.errorMessage}>{error?.message ?? 'Ocurrió un error.'}</div>}
          <div className={styles.buttonWrapper}>
            {!loading
              && (<button className={`${button} ${blue}`} type="submit">Registrarse</button>)}
            {loading && <Spinner />}
          </div>
        </form>
      )}

      {errorGet && <p>Ha ocurrido un error al obtener la inuserInfoación del usuario</p>}
    </div>
  );
}

export default Profile;
