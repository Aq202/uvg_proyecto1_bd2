import { serverHost } from '../config';
import useFetch from './useFetch';

function useSignUp() {
  const {
    callFetch, result, error, loading,
  } = useFetch();

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
