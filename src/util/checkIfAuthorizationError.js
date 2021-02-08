import vue from '../main';

const checkIfAuthorizationError = (err) => {
  if ('response' in err) {
    if (err.response.status === 401) {
      vue.$router.push({ name: 'EntrancePage' });
    }
  }
};

export default checkIfAuthorizationError;
