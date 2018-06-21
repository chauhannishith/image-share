const hostname = window && window.location && window.location.hostname;

let backendUrl;

if(hostname === 'https://imagesharre.herokuapp.com/') {
  backendUrl = 'https://groupphotos.herokuapp.com';
} else {
  backendUrl = process.env.REACT_APP_LOCAL_BACKEND || 'http://localhost:3001';
}

export const BACKEND = `${backendUrl}`;