import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="h-screen w-screen">
      <nav className="h-20 border-2">header placeholder</nav>
      <div className="h-full flex flex-row  mt-10">
        <div className="hidden sm:flex flex-col h-full w-[20rem] border-2">
          menu place holder
        </div>
        <div className="h-full container mx-auto border-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
