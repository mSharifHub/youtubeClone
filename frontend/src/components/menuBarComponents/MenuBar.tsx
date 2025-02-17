import MenuComponent from './MenuComponent.tsx';
// importing the path for the customs icons
import shortsIconPath from '../../assets/menu_bar_icons/shorts.png';
import homeIconPath from '../../assets/menu_bar_icons/home.png';
import subscriptionIconPath from '../../assets/menu_bar_icons/subscription.png';
import yourChannelPath from '../../assets/menu_bar_icons/channel.png';
import historyIconPath from '../../assets/menu_bar_icons/history.png';
import playListPath from '../../assets/menu_bar_icons/playlist.png';
import watchLaterPath from '../../assets/menu_bar_icons/watch-later.png';
import thumbsUpIconPath from '../../assets/menu_bar_icons/thumbs-up.png';
import allSubscriptionIconPath from '../../assets/menu_bar_icons/all_subscriptions.png';
import trendingIconPath from '../../assets/menu_bar_icons/trending.png';
import shoppingIconPath from '../../assets/menu_bar_icons/bag.png';
import musicIconPath from '../../assets/menu_bar_icons/music_list.png';
import moviesIconPath from '../../assets/menu_bar_icons/movies.png';
import liveIconPath from '../../assets/menu_bar_icons/live.png';
import gamingIconPath from '../../assets/menu_bar_icons/gaming.png';
import newsIconPath from '../../assets/menu_bar_icons/news.png';
import sportsIconPath from '../../assets/menu_bar_icons/sports.png';
import coursesIconPath from '../../assets/menu_bar_icons/courses.png';
import fashionBeautyIconPath from '../../assets/menu_bar_icons/fashion_beauty.png';
import podcastIconPath from '../../assets/menu_bar_icons/podcast.png';
import playableIconPath from '../../assets/menu_bar_icons/playable.png';
import settingsIconPath from '../../assets/menu_bar_icons/settings.png';
import reportIconPath from '../../assets/menu_bar_icons/report.png';
import helpIconPatch from '../../assets/menu_bar_icons/help.png';
import sendFeedBackPath from '../../assets/menu_bar_icons/feedback.png';
import youIcon from '../../assets/menu_bar_icons/youIcon.png';
import chevronRight from '../../assets/menu_bar_icons/chevronRight.png';
import { useUser } from '../../userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { LoginComponent } from '../LoginComponent.tsx';
import { useMenuBar } from './menuBarContext/MenuBarContext.ts';
import { useToolTip } from '../hooks/useToolTip.ts';
import { ToolTip } from '../helpers/ToolTip.tsx';
import { useEffect, useRef } from 'react';

export default function MenuBar() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();
  const {
    state: { toggler },
  } = useMenuBar();

  const { showTooltip, toolTipText, tooltipPosition, mouseEnter, mouseLeave } =
    useToolTip();

  const aboutArr = ['about', 'copyright', 'git repository', 'linkedin'];

  const homeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toggler && homeMenuRef.current) {
      homeMenuRef.current.focus();
    }
  }, [toggler]);

  return (
    <div
      className={`min-h-fit ${toggler ? 'w-28 ' : 'w-72'} my-2 hidden md:grid grid-cols-1 grid-flow-row auto-rows-min space-y-4 overflow-y-auto scroll-smooth ${toggler && 'no-scrollbar'} overflow-hidden `}
    >
      {/* row-1*/}

      <section
        className={` flex flex-col space-y-3  ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'} `}
      >
        <MenuComponent
          customIconSrc={homeIconPath}
          title="Home"
          link="/"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          homeMenuRef={homeMenuRef}
          tabIndex={0}
        />
        <MenuComponent
          title="Shorts"
          customIconSrc={shortsIconPath}
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          title="Subscriptions"
          customIconSrc={subscriptionIconPath}
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
      </section>
      {isLoggedIn ? (
        <>
          {/* row-2*/}
          <section
            className={` flex flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem]  ' : 'w-16'}`}
          >
            {/* you should stay visible on toggle */}

            <MenuComponent
              customIconSrc={toggler ? youIcon : chevronRight}
              title="You"
              reverse={true}
              link="#"
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />

            <MenuComponent
              customIconSrc={yourChannelPath}
              title="Your channel"
              link="#"
              hidden={toggler}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />
            <MenuComponent
              customIconSrc={historyIconPath}
              title="History"
              link="#"
              hidden={toggler}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />
            <MenuComponent
              customIconSrc={playListPath}
              title="Playlist"
              link="#"
              hidden={toggler}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />
            <MenuComponent
              customIconSrc={watchLaterPath}
              title="Watch later"
              link="#"
              hidden={toggler}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />
            <MenuComponent
              customIconSrc={thumbsUpIconPath}
              title="Liked videos"
              link="#"
              hidden={toggler}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />
          </section>
          {/* row-3*/}
          <section
            className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4  flex-initial w-[12rem] ' : 'w-16'}`}
          >
            <h1 className="capitalize mx-4">subscriptions</h1>
            <MenuComponent
              customIconSrc={allSubscriptionIconPath}
              title="Subscriptions"
              link="#"
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />
          </section>
        </>
      ) : (
        <>
          {/* login component */}
          <section
            className={` ${toggler ? 'hidden' : 'flex'}  justify-center items-start flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem]' : 'w-16'}`}
          >
            <h3 className=" flex flex-initial w-[80%]   text-sm text-start">
              Sign in to like videos, comment, and subscribe.
            </h3>
            <LoginComponent redirectGoogleAuth={redirectGoogleAuth} />
          </section>
        </>
      )}

      {/* row-4 Explore */}
      <section
        className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'}`}
      >
        <h1 className="capitalize mx-4">explore</h1>
        <MenuComponent
          customIconSrc={trendingIconPath}
          title="Trending"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={shoppingIconPath}
          title="Shopping"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={musicIconPath}
          title="Music"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={moviesIconPath}
          title="Movies"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={liveIconPath}
          title="Live"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={gamingIconPath}
          title="Gaming"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={newsIconPath}
          title="News"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={sportsIconPath}
          title="Sports"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={coursesIconPath}
          title="Courses"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={fashionBeautyIconPath}
          title="Fashion"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={podcastIconPath}
          title="Podcast"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={playableIconPath}
          title="Playables"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
      </section>
      {/* row-5 */}
      <section
        className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'}`}
      >
        <MenuComponent
          customIconSrc={settingsIconPath}
          title="Settings"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={reportIconPath}
          title="Report"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={helpIconPatch}
          title="Help"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <MenuComponent
          customIconSrc={sendFeedBackPath}
          title="Feedback"
          link="#"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
      </section>
      {/* row-6 */}
      <section
        className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'flex-initial w-[12rem] ' : 'w-16'}`}
      >
        <div className="capitalize mx-4 text-nowrap space-y-2">
          <h1 className="text-md">developer information</h1>
          <ul className="space-y-2">
            {aboutArr.map((item, index) => (
              <li className="cursor-pointer text-sm " key={`key-${index}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ToolTip
        visible={showTooltip}
        text={toolTipText}
        position={tooltipPosition}
      />
    </div>
  );
}
