import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/userContext/UserContext.tsx';

export const RedirectToOwnChannel = ({ isLoggedIn, loading }: { isLoggedIn: boolean | undefined; loading: boolean }) => {
  const {
    state: { user },
  } = useUser();

  if (loading || isLoggedIn === undefined) return null;

  if (isLoggedIn && user) return <Navigate to={`/you/@${user.youtubeHandler}`} replace={true} />;
};
