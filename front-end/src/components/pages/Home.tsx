import React from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';

export const Home: React.FC = () => {
  const {
    state: { isLoggedIn },
  } = useUser();
  return (
    <>
      <div className="h-full flex justify-center">
        {!isLoggedIn && <NotLoggedInBanner />}
      </div>
    </>
  );
};
