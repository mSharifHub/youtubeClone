import { Outlet, useLocation, useParams } from 'react-router-dom';
import NavigationBar from '../navigationBarComponents/Navigation.tsx';
import MenuBar from '../menuBarComponents/MenuBar.tsx';
import Suggestions from '../recommendationComponents/Suggestions.tsx';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { MenuModal } from '../menuBarComponents/MenuModal.tsx';

export default function MainLayout() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const location = useLocation();
  const { youtubeHandler } = useParams();

  const isVideoPage = location.pathname.startsWith('/watch');

  return (
    <div className=" h-screen w-screen flex flex-col  px-4 py-4">
      <NavigationBar />
      <main className="h-full w-full  flex flex-row  overflow-hidden">
        {!isVideoPage && <MenuBar />}
        <MenuModal />
        {/* main div*/}
        <div className=" flex flex-col flex-grow w-full overflow-hidden ">
          {/* MLL suggestions container */}
          {isLoggedIn && !isVideoPage && !youtubeHandler && <Suggestions />}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
