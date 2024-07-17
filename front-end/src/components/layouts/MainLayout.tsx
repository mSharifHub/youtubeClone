import { Outlet } from 'react-router-dom';
import NavigationBar from '../Navigation.tsx';
import MenuBar from '../MenuBar.tsx';
import Suggestions from '../Suggestions.tsx';
import { useUser } from '../../userContext/UserContext.tsx';

export default function MainLayout() {
  const {
    state: { isLoggedIn },
  } = useUser();
  return (
    <div className=" h-screen w-screen flex flex-col  px-4 py-4">
      <NavigationBar />
      <main className="h-full w-full  flex flex-row  overflow-hidden">
        <MenuBar />
        {/* main div*/}
        <div className=" flex flex-col flex-grow w-full overflow-hidden ">
          {/* MLL suggestions container */}
          {isLoggedIn && <Suggestions />}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
