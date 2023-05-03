import { useRouter } from 'vue-router'

const router = useRouter()

const checkIfAuthorizationError = (err) => {
  if ('response' in err) {
    if (err.response.status === 401) {
      router.push({ name: 'EntranceView' });
    }
  }
};

export default checkIfAuthorizationError