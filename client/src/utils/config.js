const hostname = window && window.location && window.location.hostname;

let backendUrl

if(hostname === 'heroku front') {
  backendUrl = 'heroku back';
} else {
  backendUrl = process.env.REACT_APP_LOCAL_BACKEND || 'http://localhost:3000';
}

export const BACKEND = `${backendUrl}`;