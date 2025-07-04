import MenuComponent from './MenuComponent.tsx';
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
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { LoginComponent } from '../authenticationComponent/LoginComponent.tsx';
import { useMenuBar } from '../../contexts/menuBarContext/MenuBarContext.ts';
import { useToolTip } from '../hooks/useToolTip.ts';
import { ToolTip } from '../../helpers/ToolTip.tsx';
import { visited } from '../../helpers/visited.ts';
import { useQuery } from '@apollo/client';
import { ViewerQuery } from '../../graphql/types.ts';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';

export default function MenuBar() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();
  const {
    state: { toggler },
  } = useMenuBar();

  const { loading } = useQuery<ViewerQuery>(VIEWER_QUERY, {});

  const { showTooltip, toolTipText, tooltipPosition, mouseEnter, mouseLeave } = useToolTip();

  const aboutArr = ['about', 'copyright', 'git repository', 'linkedin'];

  if (loading) return null;

  return (
    <div
      className={`min-h-fit ${toggler ? 'w-28 ' : 'w-72'} my-2 hidden md:grid grid-cols-1 grid-flow-row auto-rows-min space-y-4 overflow-y-auto scroll-smooth  no-scrollbar overflow-hidden  `}
    >
      {/* row-1*/}

      <section className={` flex flex-col space-y-3  ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'} `}>
        <MenuComponent customIconSrc={homeIconPath} isPath={visited} title="Home" link="/" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent title="Shorts" isPath={visited} customIconSrc={shortsIconPath} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent title="Subscriptions" isPath={visited} customIconSrc={subscriptionIconPath} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
      </section>

      {isLoggedIn ? (
        <>
          {/* row-2*/}
          <section className={` flex flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem]  ' : 'w-16'} `}>
            {/* you should stay visible on toggle */}

            <MenuComponent
              customIconSrc={toggler ? youIcon : chevronRight}
              title="You"
              isPath={visited}
              reverse={true}
              link="#"
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            />

            <MenuComponent customIconSrc={yourChannelPath} title="Your channel" isPath={visited} link="#" hidden={toggler} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
            <MenuComponent customIconSrc={historyIconPath} title="History" isPath={visited} link="#" hidden={toggler} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
            <MenuComponent customIconSrc={playListPath} title="Playlist" isPath={visited} link="#" hidden={toggler} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
            <MenuComponent customIconSrc={watchLaterPath} title="Watch later" isPath={visited} link="#" hidden={toggler} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
            <MenuComponent customIconSrc={thumbsUpIconPath} title="Liked videos" isPath={visited} link="#" hidden={toggler} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
          </section>
          {/* row-3*/}
          <section className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4  flex-initial w-[12rem] ' : 'w-16'}`}>
            <h1 className="capitalize mx-4">subscriptions</h1>
            <MenuComponent customIconSrc={allSubscriptionIconPath} title="Subscriptions" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
          </section>
        </>
      ) : (
        <>
          {/* login component */}
          <section
            className={` ${toggler ? 'hidden' : 'flex'}  justify-center items-start flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem]' : 'w-16'} `}
          >
            <h3 className=" flex flex-initial w-[80%]   text-sm text-start">Sign in to like videos, comment, and subscribe.</h3>
            <LoginComponent redirectGoogleAuth={redirectGoogleAuth} />
          </section>
        </>
      )}

      {/* row-4 Explore */}
      <section className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'}`}>
        <h1 className="capitalize mx-4">explore</h1>
        <MenuComponent customIconSrc={trendingIconPath} title="Trending" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={shoppingIconPath} title="Shopping" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={musicIconPath} isPath={visited} title="Music" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={moviesIconPath} title="Movies" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={liveIconPath} title="Live" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={gamingIconPath} isPath={visited} title="Gaming" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={newsIconPath} title="News" link="#" isPath={visited} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={sportsIconPath} title="Sports" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={coursesIconPath} isPath={visited} title="Courses" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={fashionBeautyIconPath} isPath={visited} title="Fashion" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={podcastIconPath} isPath={visited} title="Podcast" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={playableIconPath} isPath={visited} title="Playables" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
      </section>
      {/* row-5 */}
      <section className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'}`}>
        <MenuComponent customIconSrc={settingsIconPath} title="Settings" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={reportIconPath} title="Report" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={helpIconPatch} isPath={visited} title="Help" link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
        <MenuComponent customIconSrc={sendFeedBackPath} title="Feedback" isPath={visited} link="#" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
      </section>
      {/* row-6 */}
      <section className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'flex-initial w-[12rem] ' : 'w-16'}`}>
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
      <ToolTip visible={showTooltip} text={toolTipText} position={tooltipPosition} />
    </div>
  );
}
