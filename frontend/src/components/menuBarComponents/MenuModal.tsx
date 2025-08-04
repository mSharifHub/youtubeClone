import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useMenuBar } from '../../contexts/menuBarContext/MenuBarContext.ts';
import MenuComponent from './MenuComponent.tsx';
import homeIconPath from '../../assets/menu_bar_icons/home.png';
import chevronRight from '../../assets/menu_bar_icons/chevronRight.png';
import yourChannelPath from '../../assets/menu_bar_icons/channel.png';
import allSubscriptionIconPath from '../../assets/menu_bar_icons/all_subscriptions.png';
import { LoginComponent } from '../authenticationComponent/LoginComponent.tsx';
import trendingIconPath from '../../assets/menu_bar_icons/trending.png';
import musicIconPath from '../../assets/menu_bar_icons/music_list.png';
import gamingIconPath from '../../assets/menu_bar_icons/gaming.png';
import newsIconPath from '../../assets/menu_bar_icons/news.png';
import sportsIconPath from '../../assets/menu_bar_icons/sports.png';
import fashionBeautyIconPath from '../../assets/menu_bar_icons/fashion_beauty.png';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import youtubeIconPath from '../../assets/navigation_icons/youtube-logo.png';

import { ToolTip } from '../../helpers/ToolTip.tsx';
import { visited } from '../../helpers/visited.ts';
import { useHandleMenuComponents } from '../hooks/useHandleMenuComponents.ts';

export const MenuModal: React.FC = () => {
  const { state, dispatch } = useMenuBar();

  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();

  const { handleMenuItemMouseEnter, handleMenuItemMouseLeave, menuItemHovered, tooltipPosition, toolTipText, showTooltip, aboutArr } = useHandleMenuComponents();

  useEffect(() => {
    const handleRemoveClass = () => {
      const reactModalContent = document.querySelector('.ReactModal__Content');
      if (reactModalContent && window.innerWidth > 1280) {
        reactModalContent.classList.remove('animate-slide-left');
      }
    };
    handleRemoveClass();

    window.addEventListener('resize', handleRemoveClass);

    return () => window.removeEventListener('resize', handleRemoveClass);
  }, []);

  return (
    <ReactModal
      isOpen={state.menu}
      onRequestClose={() => {
        dispatch({ type: 'HANDLE_MENU' });
      }}
      closeTimeoutMS={200}
      overlayClassName={`fixed inset-0  bg-neutral-950  transition duration-500 ease-in-out ${state.menu ? 'bg-opacity-50' : 'bg-opacity-0'}  z-50  `}
      style={{ content: { outline: 'none' } }}
      className={`h-screen w-56  grid-flow-row   bg-white  dark:bg-darkTheme rounded-sm shadow-lg ${state.menu ? 'animate-slide-right' : 'animate-slide-left'}`}
    >
      <div className="h-full py-5 px-4 grid grid-cols-1 auto-rows-min space-y-4 overflow-y-auto overflow-hidden scroll-smooth ">
        {/* row-1*/}
        <div className=" w-auto col-span-1 col-start-1 row-start-1 row-span-1 px-4 flex justify-start items-center space-x-2 ">
          {/* fa-bars */}
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => {
              dispatch({ type: 'HANDLE_MENU' });
            }}
            title="Menu Bar"
            className="h-[20px] w-[20px] p-2 flex justify-center items-center rounded-full  transition-transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700  cursor-pointer  "
          />

          <div onClick={() => (window.location.href = '/')} title="Youtube Home" className="flex justify-center items-center cursor-pointer">
            <img src={youtubeIconPath} alt={youtubeIconPath.split('/').pop()?.split('.')[0]} className="h-8 w-8  min-w-8" />
            <h3 className="flex justify-center items-center font-bold text-sm scale-y-[180%]">YouTube</h3>
          </div>
        </div>
        <section className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}>
          <MenuComponent
            customIconSrc={homeIconPath}
            isPath={visited}
            title="Home"
            link="/"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />
        </section>
        {isLoggedIn ? (
          <>
            {/* row-2*/}
            <section className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}>
              <div>
                <MenuComponent
                  customIconSrc={chevronRight}
                  isPath={visited}
                  title="You"
                  reverse={true}
                  link="#"
                  isOffCanvas={true}
                  onMouseEnter={handleMenuItemMouseEnter}
                  onMouseLeave={handleMenuItemMouseLeave}
                  menuItemHovered={menuItemHovered}
                />
              </div>
              <MenuComponent
                customIconSrc={yourChannelPath}
                isPath={visited}
                title="Your Channel"
                link="#"
                isOffCanvas={true}
                onMouseEnter={handleMenuItemMouseEnter}
                onMouseLeave={handleMenuItemMouseLeave}
                menuItemHovered={menuItemHovered}
              />
            </section>
            {/* row-3*/}
            <section className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}>
              <h1 className="capitalize mx-4 ">subscriptions</h1>
              <MenuComponent
                customIconSrc={allSubscriptionIconPath}
                isPath={visited}
                title="Subscriptions"
                link="#"
                isOffCanvas={true}
                onMouseEnter={handleMenuItemMouseEnter}
                onMouseLeave={handleMenuItemMouseLeave}
                menuItemHovered={menuItemHovered}
              />
            </section>
          </>
        ) : (
          <>
            {/* login component */}
            <section className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}>
              <div className="mx-4 space-y-3">
                <h3 className="flex flex-initial w-[80%]   text-sm text-start">Sign in to like videos, comment, and subscribe.</h3>
                <LoginComponent redirectGoogleAuth={redirectGoogleAuth} />
              </div>
            </section>
          </>
        )}

        {/* row-4 Explore */}
        <section className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}>
          <h1 className="capitalize mx-4">explore</h1>
          <MenuComponent
            customIconSrc={trendingIconPath}
            isPath={visited}
            title="Trending"
            link="#"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />

          <MenuComponent
            customIconSrc={musicIconPath}
            isPath={visited}
            title="Music"
            link="#"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />

          <MenuComponent
            customIconSrc={gamingIconPath}
            isPath={visited}
            title="Gaming"
            link="#"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />
          <MenuComponent
            customIconSrc={newsIconPath}
            isPath={visited}
            title="News"
            link="#"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />
          <MenuComponent
            customIconSrc={sportsIconPath}
            isPath={visited}
            title="Sports"
            link="#"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />

          <MenuComponent
            customIconSrc={fashionBeautyIconPath}
            isPath={visited}
            title="Fashion"
            link="#"
            isOffCanvas={true}
            onMouseEnter={handleMenuItemMouseEnter}
            onMouseLeave={handleMenuItemMouseLeave}
            menuItemHovered={menuItemHovered}
          />
        </section>

        {/* row-5 */}
        <section className="flex flex-col space-y-3">
          <div className="capitalize mx-4 text-nowrap space-y-2">
            <h1 className="text-md font-bold">developer information</h1>
            <ul className="space-y-2">
              {aboutArr.map((item, index) => (
                <li className="cursor-pointer text-sm " key={`key-${index}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <ToolTip visible={showTooltip} text={toolTipText} position={tooltipPosition} />
    </ReactModal>
  );
};
