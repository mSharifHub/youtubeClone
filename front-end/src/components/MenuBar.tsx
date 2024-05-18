import MenuComponent from './reusable_components/menu_bar/MenuComponent.tsx';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

// importing the path for the customs icons
import shortsIconPath from '../assets/menu_bar_icons/youtube-shorts.png';
import homeIconPath from '../assets/menu_bar_icons/home.png';
import subscriptionIconPath from '../assets/menu_bar_icons/subscription.png';
import yourChannelPath from '../assets/menu_bar_icons/channel.png';
import historyIconPath from '../assets/menu_bar_icons/history.png';
import playListPath from '../assets/menu_bar_icons/playlist.png';
import watchLaterPath from '../assets/menu_bar_icons/watch-later.png';
import thumbsUpIconPath from '../assets/menu_bar_icons/thumbs-up.png';
import allSubscriptionIconPath from '../assets/navigation_icons/all_subscriptions.png';
import trendingIconPath from '../assets/navigation_icons/trending.png';
import shoppingIconPath from '../assets/navigation_icons/bag.png';
import musicIconPath from '../assets/navigation_icons/music_list.png';
import moviesIconPath from '../assets/navigation_icons/movies.png';
import liveIconPath from '../assets/navigation_icons/live.png';
import gamingIconPath from '../assets/navigation_icons/gaming.png';
import newsIconPath from '../assets/navigation_icons/news.png';
import sportsIconPath from '../assets/navigation_icons/sports.png';
import coursesIconPath from '../assets/navigation_icons/courses.png';
import fashionBeautyIconPath from '../assets/navigation_icons/fashion_beauty.png';
import podcastIconPath from '../assets/navigation_icons/podcast.png';
import playableIconPath from '../assets/navigation_icons/playable.png';

export default function MenuBar() {
  return (
    <div className="hidden sm:block h-full w-[15rem] overflow-y-auto scroll-smooth">
      <div className=" max-h-screen grid grid-cols-1 grid-rows-[0.25fr_0.5fr_0.25fr_1fr_0.25fr_0.25fr_0.25fr]">
        {/* row-1  Home Shorts Subscriptions */}
        <div className="flex flex-col space-y-4 border-b-2 pt-2 pb-2">
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
        {/* row-2 You */}
        <div className="flex flex-col space-y-4 border-b-2 pt-2 pb-2">
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
        <div className="flex flex-col space-y-4 border-b-2 pt-2 pb-2">
          <h1 className="text-md text-black font-medium capitalize px-2">
            subscriptions
          </h1>
          <MenuComponent
            customIconSrc={allSubscriptionIconPath}
            title="all subscriptions"
            link="#"
          />
        </div>
        {/* row-4 Explore */}
        <div className="flex flex-col space-y-4 border-b-2 pt-2 pb-2">
          <h1 className="text-md text-black font-medium capitalize px-2">
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
            title="fashion beauty"
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
        {/* row-5 More From Youtube */}
      </div>
    </div>
  );
}
