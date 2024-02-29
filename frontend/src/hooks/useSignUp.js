import { useEffect } from 'react';
import { serverHost } from '../config';
import useFetch from './useFetch';
import consts from '../helpers/consts';

function useSignUp() {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  useEffect(() => {
    if (!result?.id) return;
    sessionStorage.setItem(consts.firstAccessKey, '');
  }, [result]);

  const signup = async ({
    name, email, phone, password,
  }) => {
    const uri = `${serverHost}/user`;
    const body = JSON.stringify({
      name, email, phone, password,
    });
    callFetch({
      uri, method: 'POST', body,
    });
  };

  return {
    signup, success: result, error, loading,
  };
}
export default useSignUp;
