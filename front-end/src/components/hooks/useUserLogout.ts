import { useUser } from '../../userContext/UserContext.tsx';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useUserLogout = () => {
  const { dispatch } = useUser();
  const csrftoken = Cookies.get('csrftoken');
  const navigate = useNavigate();
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
      alert(response.data.message);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_USER' });
        navigate('/');
      }, 500);
    }
  };
};
