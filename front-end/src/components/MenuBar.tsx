import MenuComponent from './MenuComponent.tsx';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
// importing the path for the customs icons
import shortsIconPath from '../assets/menu_bar_icons/shorts.png';
import homeIconPath from '../assets/menu_bar_icons/home.png';
import subscriptionIconPath from '../assets/menu_bar_icons/subscription.png';
import yourChannelPath from '../assets/menu_bar_icons/channel.png';
import historyIconPath from '../assets/menu_bar_icons/history.png';
import playListPath from '../assets/menu_bar_icons/playlist.png';
import watchLaterPath from '../assets/menu_bar_icons/watch-later.png';
import thumbsUpIconPath from '../assets/menu_bar_icons/thumbs-up.png';
import allSubscriptionIconPath from '../assets/menu_bar_icons/all_subscriptions.png';
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
import userIconPath from '../assets/navigation_icons/user-icon.png';
import { Link } from 'react-router-dom';
import { useUser } from '../userContext/UserContext.tsx';
import { useUserLogin } from './hooks/useUserLogin.ts';

export default function MenuBar() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();

  return (
    <div className="hidden sm:block md:w-[5rem] md:min-w-[5rem] xl:w-[14rem] xl:min-w-[14rem]  h-full   lg:overflow-y-auto lg:scroll-smooth  overflow-hidden no-scrollbar lg:show-scrollbar mt-2 mr-10  ">
      <div className=" max-h-screen grid grid-cols-1 grid-rows-[0.25fr_0.5fr_0.25fr_1fr_0.25fr_0.25fr_0.25fr]">
        {/* row-1  Home Shorts Subscriptions */}
        <div className="flex flex-col  xl:border-b pb-2  space-y-10 xl:space-y-0 ">
          <MenuComponent customIconSrc={homeIconPath} title="home" link="/" />
          <MenuComponent
            title="shorts"
            customIconSrc={shortsIconPath}
            link="#"
          />
          <MenuComponent
            title="subscriptions"
            customIconSrc={subscriptionIconPath}
            link="#"
          />
        </div>
        {isLoggedIn ? (
          <>
            {/* row-2 You */}
            <div className="hidden xl:flex flex-col  border-b space-y-2 pt-2 pb-2">
              <MenuComponent
                icon={faChevronRight}
                title="you"
                order="reverse"
                link="#"
              />

              <MenuComponent
                customIconSrc={yourChannelPath}
                title="your channel"
                link="#"
              />
              <MenuComponent
                customIconSrc={historyIconPath}
                title="history"
                link="#"
              />
              <MenuComponent
                customIconSrc={playListPath}
                title="playlist"
                link="#"
              />
              <MenuComponent
                customIconSrc={watchLaterPath}
                title="watch later"
                link="#"
              />
              <MenuComponent
                customIconSrc={thumbsUpIconPath}
                title="liked videos"
                link="#"
              />
            </div>
            {/* row-3 Subscriptions */}
            <div className=" hidden xl:flex flex-col  border-b space-y-2  pt-2 pb-2">
              <h1 className=" flex  justify-start   items-center  mx-4 text-xs md:text-lg  capitalize ">
                subscriptions
              </h1>
              <MenuComponent
                customIconSrc={allSubscriptionIconPath}
                title="subscriptions"
                link="#"
              />
            </div>
          </>
        ) : (
          <>
            {/* row 2 login */}
            <div className="hidden xl:flex flex-col  border-b pt-4 pb-4">
              <div className="justify-start items-center mx-4 space-y-2">
                <h3 className="text-xs tex">
                  Sign in to like videos, comment, and subscribe.
                </h3>
                <div
                  onClick={() => redirectGoogleAuth()}
                  className="flex justify-center items-center border dark:border-neutral-700 rounded-full w-24  h-9 space-x-2  transition-colors transform duration-75 ease-out hover:bg-blue-100 dark:hover:bg-neutral-700  cursor-pointer"
                  title="Sign in with Google"
                >
                  <div className="flex justify-center items-center border border-blue-400 rounded-full ">
                    <img
                      src={userIconPath}
                      alt="user-icon"
                      className=" h-5 w-5  "
                    />
                  </div>

                  <span className="text-sm  font-semibold text-blue-400 ">
                    Sign in
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* row-4 Explore */}
        <div className="hidden xl:flex flex-col  border-b  space-y-2 pt-2 pb-2">
          <h1 className="flex  justify-start items-center mx-4 text-xs md:text-lg  capitalize">
            explore
          </h1>
          <MenuComponent
            customIconSrc={trendingIconPath}
            title="trending"
            link="#"
          />
          <MenuComponent
            customIconSrc={shoppingIconPath}
            title="shopping"
            link="#"
          />
          <MenuComponent customIconSrc={musicIconPath} title="music" link="#" />
          <MenuComponent
            customIconSrc={moviesIconPath}
            title="movies"
            link="#"
          />
          <MenuComponent customIconSrc={liveIconPath} title="live" link="#" />
          <MenuComponent
            customIconSrc={gamingIconPath}
            title="gaming"
            link="#"
          />
          <MenuComponent customIconSrc={newsIconPath} title="news" link="#" />
          <MenuComponent
            customIconSrc={sportsIconPath}
            title="sports"
            link="#"
          />
          <MenuComponent
            customIconSrc={coursesIconPath}
            title="courses"
            link="#"
          />
          <MenuComponent
            customIconSrc={fashionBeautyIconPath}
            title="fashion"
            link="#"
          />
          <MenuComponent
            customIconSrc={podcastIconPath}
            title="podcast"
            link="#"
          />
          <MenuComponent
            customIconSrc={playableIconPath}
            title="playables"
            link="#"
          />
        </div>
        {/* row-5 Settings */}
        <div className="hidden xl:flex flex-col  border-b space-y-2  pt-2 pb-2">
          <MenuComponent
            customIconSrc={settingsIconPath}
            title="settings"
            link="#"
          />
          <MenuComponent
            customIconSrc={reportIconPath}
            title="report"
            link="#"
          />
          <MenuComponent customIconSrc={helpIconPatch} title="help" link="#" />
          <MenuComponent
            customIconSrc={sendFeedBackPath}
            title="feedback"
            link="#"
          />
        </div>
        {/* row-6 Terms Of Usage*/}
        <div className="hidden xl:flex flex-col pt-2 space-y-2  pb-2">
          <section>
            <h1 className="flex justify-start items-center mx-4 text-xs md:text-lg  capitalize ">
              terms of usage
            </h1>
            <div className="mx-4">
              <ul className="mt-2">
                <li className=" flex flex-col flex-grow  justify-start items-start space-y-2 capitalize text-xs md:text-md ">
                  <Link to="#">license</Link>
                  <Link to="#">privacy</Link>
                  <Link to="#">source code</Link>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
