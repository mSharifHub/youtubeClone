import { Outlet } from 'react-router-dom';
import NavigationBar from '../Navigation.tsx';
import MenuBar from '../MenuBar.tsx';

export default function MainLayout() {
  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col flex-grow h-full px-4 py-4">
        <NavigationBar />
        <div className="flex flex-row flex-grow ">
          <MenuBar />
          {/*suggestion bars and main content section*/}
          <section className=" flex flex-col  flex-grow overflow-hidden">
            <div className="overflow-x-auto border-2">place holder</div>
            <div className="flex-grow overflow-auto w-full border-2">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
