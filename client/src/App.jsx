import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Parse token from URL query params
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('zepcut-token', tokenFromUrl); // Save token
      setToken(tokenFromUrl);

      // Clean the URL so token is not visible in address bar
      params.delete('token');
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      // Check if token already saved
      const savedToken = localStorage.getItem('zepcut-token');
      if (savedToken) setToken(savedToken);
    }
  }, []);

  return (
    <>
      <h2>Zep-Cut</h2>
      {!token ? (
        <a href="http://localhost:5000/api/auth/google">
          <button>Sign in with Google</button>
        </a>
      ) : (
        <p>You are successfully logged in!</p>
      )}
    </>
  );
}

export default App;
