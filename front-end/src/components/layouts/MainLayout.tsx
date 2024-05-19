import { Outlet } from 'react-router-dom';
import NavigationBar from '../Navigation.tsx';
import MenuBar from '../MenuBar.tsx';
import ScrollContainerHorizontal from '../reusable_components/helpers_components/ScrollContainerHorizontal.tsx';
import RecommendationsFilters from '../RecommendationsFilters.tsx';

export default function MainLayout() {
  return (
    <div className=" h-screen w-screen flex flex-col  px-4 py-4">
      <NavigationBar />
      <main className="h-full w-full  flex flex-row  overflow-hidden">
        <MenuBar />
        <div className=" flex flex-col flex-grow w-full overflow-hidden ">
          {/* Scroll-x  MLL suggestions container */}
          <section className="relative ">
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <ScrollContainerHorizontal>
              <RecommendationsFilters />
            </ScrollContainerHorizontal>
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </section>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
