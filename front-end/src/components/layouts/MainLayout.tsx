import { Outlet } from 'react-router-dom';
import NavigationBar from '../Navigation.tsx';
import MenuBar from '../MenuBar.tsx';
import ScrollContainerHorizontal from '../reusable_components/helpers_components/ScrollContainerHorizontal.tsx';
import RecommendationsFilters from '../RecommendationsFilters.tsx';

export default function MainLayout() {
  return (
    <div className=" min-h-screen min-w-screen flex flex-col  px-4 py-4 ">
      <NavigationBar />
      <main className="h-full w-full flex flex-row ">
        <MenuBar />
        <div className=" flex flex-col flex-grow  overflow-hidden ">
          {/* Scroll-x  MLL suggestions container */}
          <div className="relative ">
            {/* fading effect*/}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <ScrollContainerHorizontal>
              <RecommendationsFilters />
            </ScrollContainerHorizontal>
            {/* fading effect*/}
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
