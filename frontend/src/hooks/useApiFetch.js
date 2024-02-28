import { useState } from 'react';

function useApiFetch() {
  const refreshAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGRhNDM0MWIzMzk4YTBmODBjMWJjMyIsIm5hbWUiOiJQYWJsbyIsImVtYWlsIjoicGFibG9AZ21haWwuY29tIiwicGhvbmUiOiI1NTAwNDIzMyIsImlhdCI6MTcwOTAyNDMxOX0.Rql9zFZrTvBBgzTYxk56WFPpNUqLFEkXRUYOwXEt8Zs';
  const [refreshedToken, setRefreshedToken] = useState(null);

  const apiFetch = async ({
    uri, method = 'GET', body, headers, signal, autoRefreshAccessToken = true,
  }) => {
    let reply = await fetch(uri, {
      method,
      body,
      headers,
      signal,
      credentials: 'include',
    });

    if (!reply.ok) {
      if (reply.status === 401 && autoRefreshAccessToken) {
        // token expirado, refrescando
        const newToken = await refreshAccessToken();

        // cambiar estado de nuevo token
        setRefreshedToken(newToken);

        // repetir la solicitud
        reply = await fetch(uri, {
          method,
          body,
          headers: {
            ...headers,
            authorization: newToken,
          },
          signal,
          credentials: 'include',
        });

        if (!reply.ok) throw reply;
        return reply; // proceso exitoso con nuevo token
      }

      throw reply; // Si no es un error 'unauthorized'
    }
    return reply; // retorno exitoso
  };
  return { apiFetch, refreshedToken };
}

export default useApiFetch;
