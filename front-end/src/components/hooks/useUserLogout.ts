import { useUser } from '../../userContext/UserContext.tsx';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useUserLogout = () => {
  const { dispatch } = useUser();
  const csrftoken = Cookies.get('csrftoken');
  const userMetaData = Cookies.get('user-meta-data');
  return async () => {
    const response = await axios.post(
      'http://localhost:8000/api/auth/logout/',
      {},
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken,
        },
      },
    );

    if (response.data.success) {
      if (userMetaData) {
        Cookies.remove('user-meta-data');
      }
      dispatch({ type: 'CLEAR_USER' });
      window.location.href = '/';
    }
  };
};
