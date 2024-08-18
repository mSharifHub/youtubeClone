import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useMenuBar } from '../menuBarContext/MenuBarContext.ts';
import MenuComponent from './MenuComponent.tsx';
import homeIconPath from '../assets/menu_bar_icons/home.png';
import shortsIconPath from '../assets/menu_bar_icons/shorts.png';
import subscriptionIconPath from '../assets/menu_bar_icons/subscription.png';
import chevronRight from '../assets/menu_bar_icons/chevronRight.png';
import yourChannelPath from '../assets/menu_bar_icons/channel.png';
import historyIconPath from '../assets/menu_bar_icons/history.png';
import playListPath from '../assets/menu_bar_icons/playlist.png';
import watchLaterPath from '../assets/menu_bar_icons/watch-later.png';
import thumbsUpIconPath from '../assets/menu_bar_icons/thumbs-up.png';
import allSubscriptionIconPath from '../assets/menu_bar_icons/all_subscriptions.png';
import { LoginComponent } from './LoginComponent.tsx';
import trendingIconPath from '../assets/menu_bar_icons/trending.png';
import shoppingIconPath from '../assets/menu_bar_icons/bag.png';
import musicIconPath from '../assets/menu_bar_icons/music_list.png';
import moviesIconPath from '../assets/menu_bar_icons/movies.png';
import liveIconPath from '../assets/menu_bar_icons/live.png';
import gamingIconPath from '../assets/menu_bar_icons/gaming.png';
import newsIconPath from '../assets/menu_bar_icons/news.png';
import sportsIconPath from '../assets/menu_bar_icons/sports.png';
import coursesIconPath from '../assets/menu_bar_icons/courses.png';
import fashionBeautyIconPath from '../assets/menu_bar_icons/fashion_beauty.png';
import podcastIconPath from '../assets/menu_bar_icons/podcast.png';
import playableIconPath from '../assets/menu_bar_icons/playable.png';
import settingsIconPath from '../assets/menu_bar_icons/settings.png';
import reportIconPath from '../assets/menu_bar_icons/report.png';
import helpIconPatch from '../assets/menu_bar_icons/help.png';
import sendFeedBackPath from '../assets/menu_bar_icons/feedback.png';
import { useUser } from '../userContext/UserContext.tsx';
import { useUserLogin } from './hooks/useUserLogin.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import youtubeIconPath from '../assets/navigation_icons/youtube-logo.png';

export const MenuModal: React.FC = () => {

  const {state, dispatch} = useMenuBar()

  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();


  const aboutArr = ['about', 'copyright', 'git repository', 'linkedin'];


  useEffect(() => {

    const handleRemoveClass = () =>{
      const reactModalContent = document.querySelector('.ReactModal__Content')

      if ( reactModalContent && window.innerWidth > 1280){
        reactModalContent.classList.remove('animate-slide-left');
        console.assert(!reactModalContent.classList.contains('animate-slide-left'), {message:"token has been removed"});
      }
    }
    handleRemoveClass()

    window.addEventListener('resize', handleRemoveClass);

    return()=> window.removeEventListener('resize', handleRemoveClass);

  }, []);



  return(
      <ReactModal
        isOpen={state.menu}
        onRequestClose={() => {
          dispatch({ type: 'HANDLE_MENU' })
        }}
        closeTimeoutMS={200}
        overlayClassName="fixed inset-0 bg-neutral-950  bg-opacity-60 z-10"
        style={{ content: { outline: 'none' } }}
        className={`h-screen w-64  grid-flow-row   bg-white  dark:bg-neutral-900 rounded-sm shadow-md ${state.menu ? 'animate-slide-right' : 'animate-slide-left'}`}>
        <div className="h-full py-5 px-4 grid grid-cols-1 auto-rows-min space-y-4 overflow-y-auto overflow-hidden scroll-smooth">
          {/* row-1*/}
          <div className=" w-auto col-span-1 col-start-1 row-start-1 row-span-1 px-4 flex justify-start items-center space-x-4 ">
            {/* fa-bars */}
            <FontAwesomeIcon
              icon={faBars}
              onClick={()=>{dispatch({ type: 'HANDLE_MENU' })}}
              title="Menu Bar"
              className="h-[20px] w-[20px] p-2 flex justify-center items-center rounded-full  transition-transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700  cursor-pointer  "
            />

            <div
              onClick={() => (window.location.href = '/')}
              title="Youtube Home"
              className="flex justify-center items-center cursor-pointer"
            >
              <img
                src={youtubeIconPath}
                alt={youtubeIconPath.split('/').pop()?.split('.')[0]}
                className="h-8 w-8  min-w-8"
              />
              <h3 className="flex justify-center items-center font-bold text-sm scale-y-[180%]">
                YouTube
              </h3>
            </div>
          </div>
          <section
            className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}
          >
            <MenuComponent customIconSrc={homeIconPath} title="home" link="/" isOffCanvas={true} />
            <MenuComponent title="shorts" customIconSrc={shortsIconPath} link="#" isOffCanvas={true} />
            <MenuComponent
              title="subscriptions"
              customIconSrc={subscriptionIconPath}
              link="#"
              isOffCanvas={true}
            />
          </section>
          {isLoggedIn ? (
            <>
              {/* row-2*/}
              <section
                className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}
              >
                <div>
                  <MenuComponent
                    customIconSrc={chevronRight}
                    title="you"
                    reverse={true}
                    link="#"
                    isOffCanvas={true}
                  />
                </div>
                <MenuComponent
                  customIconSrc={yourChannelPath}
                  title="your channel"
                  link="#"
                  isOffCanvas={true}
                />
                <MenuComponent
                  customIconSrc={historyIconPath}
                  title="history"
                  link="#"
                  isOffCanvas={true}
                />
                <MenuComponent
                  customIconSrc={playListPath}
                  title="playlist"
                  link="#"
                  isOffCanvas={true}
                />
                <MenuComponent
                  customIconSrc={watchLaterPath}
                  title="watch later"
                  link="#"
                  isOffCanvas={true}
                />
                <MenuComponent
                  customIconSrc={thumbsUpIconPath}
                  title="liked videos"
                  link="#"
                  isOffCanvas={true}
                />

              </section>
              {/* row-3*/}
              <section
                className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}
              >
                <h1 className="capitalize mx-4 ">subscriptions</h1>
                <MenuComponent
                  customIconSrc={allSubscriptionIconPath}
                  title="subscriptions"
                  link="#"
                  isOffCanvas={true}
                />
              </section>
            </>
          ) : (
            <>
              {/* login component */}
              <section
                className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}
              >
                <div className="mx-4 space-y-3">
                  <h3 className="flex flex-initial w-[80%]   text-sm text-start">
                    Sign in to like videos, comment, and subscribe.
                  </h3>
                  <LoginComponent redirectGoogleAuth={redirectGoogleAuth} />
                </div>
              </section>
            </>
          )}

          {/* row-4 Explore */}
          <section
            className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}
          >
            <h1 className="capitalize mx-4">explore</h1>
            <MenuComponent
              customIconSrc={trendingIconPath}
              title="trending"
              link="#"
              isOffCanvas={true}
            />
            <MenuComponent
              customIconSrc={shoppingIconPath}
              title="shopping"
              link="#"
              isOffCanvas={true}
            />
            <MenuComponent customIconSrc={musicIconPath} title="music" link="#" isOffCanvas={true} />
            <MenuComponent customIconSrc={moviesIconPath} title="movies" link="#" isOffCanvas={true} />
            <MenuComponent customIconSrc={liveIconPath} title="live" link="#" isOffCanvas={true} />
            <MenuComponent customIconSrc={gamingIconPath} title="gaming" link="#" isOffCanvas={true} />
            <MenuComponent customIconSrc={newsIconPath} title="news" link="#" isOffCanvas={true} />
            <MenuComponent customIconSrc={sportsIconPath} title="sports" link="#" isOffCanvas={true} />
            <MenuComponent
              customIconSrc={coursesIconPath}
              title="courses"
              link="#"
              isOffCanvas={true}
            />
            <MenuComponent
              customIconSrc={fashionBeautyIconPath}
              title="fashion"
              link="#"
              isOffCanvas={true}
            />
            <MenuComponent
              customIconSrc={podcastIconPath}
              title="podcast"
              link="#"
              isOffCanvas={true}
            />
            <MenuComponent
              customIconSrc={playableIconPath}
              title="playables"
              link="#"
              isOffCanvas={true}
            />
          </section>
          {/* row-5 */}
          <section
            className={` flex flex-col space-y-3  border-b-[0.5px] pb-4`}
          >
            <MenuComponent
              customIconSrc={settingsIconPath}
              title="settings"
              link="#"
              isOffCanvas={true}
            />
            <MenuComponent customIconSrc={reportIconPath} title="report" link="#" isOffCanvas={true} />
            <MenuComponent customIconSrc={helpIconPatch} title="help" link="#" isOffCanvas={true} />
            <MenuComponent
              customIconSrc={sendFeedBackPath}
              title="feedback"
              link="#"
              isOffCanvas={true}
            />
          </section>
          {/* row-6 */}
          <section
            className={` flex flex-col space-y-3`}
          >
            <h1 className="capitalize mx-4">developer information</h1>
            <ul className="text-sm mx-4 capitalize text-nowrap text-left space-y-2">
              {aboutArr.map((item, index) => (
                <li className=" text-sm cursor-pointer" key={`key-${index}`}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </ReactModal>

  )


};
