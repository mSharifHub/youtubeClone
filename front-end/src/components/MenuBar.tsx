import MenuComponent from './MenuComponent.tsx';
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
import youIcon from '../assets/menu_bar_icons/youIcon.png';
import chevronRight from '../assets/menu_bar_icons/chevronRight.png';
import { useUser } from '../userContext/UserContext.tsx';
import { useUserLogin } from './hooks/useUserLogin.ts';
import { LoginComponent } from './LoginComponent.tsx';
import { useMenuBar } from '../menuBarContext/MenuBarContext.ts';

export default function MenuBar() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();
  const {
    state: { toggler },
  } = useMenuBar();

  return (
    <div
      className={`min-h-fit ${toggler ? 'w-[5%] ' : 'w-[20%] '} grid grid-cols-1  grid-flow-row auto-rows-min space-y-4 overflow-y-auto scroll-smooth ${toggler && 'no-scrollbar'} overflow-hidden`}
    >
      {/* row-1*/}
      <section
        className={` flex flex-col space-y-3  ${!toggler ? 'border-b-[0.5px] pb-[2px] ' : null}`}
      >
        <MenuComponent customIconSrc={homeIconPath} title="home" link="/" />
        <MenuComponent title="shorts" customIconSrc={shortsIconPath} link="#" />
        <MenuComponent
          title="subscriptions"
          customIconSrc={subscriptionIconPath}
          link="#"
        />
      </section>
      {isLoggedIn ? (
        <>
          {/* row-2*/}
          <section
            className={`  flex flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-[2px] ' : null}`}
          >
            {/* you should stay visible on toggler */}
            <div>
              <MenuComponent
                customIconSrc={toggler ? youIcon : chevronRight}
                title="you"
                reverse={true}
                link="#"
              />
            </div>
            <div className={`${toggler && 'hidden'}`}>
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
          </section>
          {/* row-3*/}
          <section  className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-[2px] ' : null}`}>
            <div

            >
              <h1 className="capitalize ">subscriptions</h1>
              <MenuComponent
                customIconSrc={allSubscriptionIconPath}
                title="subscriptions"
                link="#"
              />
            </div>
          </section>
        </>
      ) : (
        <LoginComponent redirectGoogleAuth={redirectGoogleAuth} />
      )}

      {/* row-4 Explore */}
      <section
        className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-[2px] ' : null}`}
      >
        <h1 className="capitalize">explore</h1>
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
        <MenuComponent customIconSrc={moviesIconPath} title="movies" link="#" />
        <MenuComponent customIconSrc={liveIconPath} title="live" link="#" />
        <MenuComponent customIconSrc={gamingIconPath} title="gaming" link="#" />
        <MenuComponent customIconSrc={newsIconPath} title="news" link="#" />
        <MenuComponent customIconSrc={sportsIconPath} title="sports" link="#" />
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
      </section>
      {/* row-5 */}
      <section
        className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-[2px] ' : null}`}
      >
        <MenuComponent
          customIconSrc={settingsIconPath}
          title="settings"
          link="#"
        />
        <MenuComponent customIconSrc={reportIconPath} title="report" link="#" />
        <MenuComponent customIconSrc={helpIconPatch} title="help" link="#" />
        <MenuComponent
          customIconSrc={sendFeedBackPath}
          title="feedback"
          link="#"
        />
      </section>
      {/* row-6 */}
      <section
        className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3`}
      >
        <h1 className="capitalize">terms of usage</h1>
      </section>
    </div>
  );
}
