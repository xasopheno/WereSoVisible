const BACKEND = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4599/api';

const Settings = {
  backend: BACKEND,
};

export default Settings;
