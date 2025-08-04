import MenuComponent from './MenuComponent.tsx';
import homeIconPath from '../../assets/menu_bar_icons/home.png';
import subscriptionIconPath from '../../assets/menu_bar_icons/subscription.png';
import yourChannelPath from '../../assets/menu_bar_icons/channel.png';
import trendingIconPath from '../../assets/menu_bar_icons/trending.png';
import musicIconPath from '../../assets/menu_bar_icons/music_list.png';
import moviesIconPath from '../../assets/menu_bar_icons/movies.png';
import gamingIconPath from '../../assets/menu_bar_icons/gaming.png';
import newsIconPath from '../../assets/menu_bar_icons/news.png';
import sportsIconPath from '../../assets/menu_bar_icons/sports.png';
import fashionBeautyIconPath from '../../assets/menu_bar_icons/fashion_beauty.png';
import youIcon from '../../assets/menu_bar_icons/youIcon.png';
import chevronRight from '../../assets/menu_bar_icons/chevronRight.png';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { LoginComponent } from '../authenticationComponent/LoginComponent.tsx';
import { useMenuBar } from '../../contexts/menuBarContext/MenuBarContext.ts';

import { ToolTip } from '../../helpers/ToolTip.tsx';
import { visited } from '../../helpers/visited.ts';
import { useQuery } from '@apollo/client';
import { ViewerQuery } from '../../graphql/types.ts';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';
import { useHandleMenuComponents } from '../hooks/useHandleMenuComponents.ts';

export default function MenuBar() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const { redirectGoogleAuth } = useUserLogin();
  const {
    state: { toggler },
  } = useMenuBar();

  const { loading } = useQuery<ViewerQuery>(VIEWER_QUERY, {});

  const { handleMenuItemMouseEnter, handleMenuItemMouseLeave, menuItemHovered, tooltipPosition, toolTipText, showTooltip, aboutArr } = useHandleMenuComponents();

  if (loading) return null;

  return (
    <div
      className={`min-h-fit ${toggler ? 'w-28 ' : 'w-72'} my-2 hidden md:grid grid-cols-1 grid-flow-row auto-rows-min space-y-4 overflow-y-auto scroll-smooth  no-scrollbar overflow-hidden  `}
    >
      {/* row-1*/}

      <section className={` flex flex-col space-y-3  ${!toggler ? 'border-b-[0.5px] pb-4 flex-initial w-[12rem] ' : 'w-16'} `}>
        <MenuComponent
          customIconSrc={homeIconPath}
          isPath={visited}
          title="Home"
          link="/"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          title="Subscriptions"
          isPath={visited}
          customIconSrc={subscriptionIconPath}
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
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
              onMouseEnter={handleMenuItemMouseEnter}
              onMouseLeave={handleMenuItemMouseLeave}
              menuItemHovered={menuItemHovered}
            />

            <MenuComponent
              customIconSrc={yourChannelPath}
              title="Your channel"
              isPath={visited}
              link="#"
              hidden={toggler}
              onMouseEnter={handleMenuItemMouseEnter}
              onMouseLeave={handleMenuItemMouseLeave}
              menuItemHovered={menuItemHovered}
            />
          </section>
          {/* row-3*/}
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
        <MenuComponent
          customIconSrc={trendingIconPath}
          title="Trending"
          isPath={visited}
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          customIconSrc={musicIconPath}
          isPath={visited}
          title="Music"
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          customIconSrc={moviesIconPath}
          title="Movies"
          isPath={visited}
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          customIconSrc={gamingIconPath}
          isPath={visited}
          title="Gaming"
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          customIconSrc={newsIconPath}
          title="News"
          link="#"
          isPath={visited}
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          customIconSrc={sportsIconPath}
          title="Sports"
          isPath={visited}
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
        <MenuComponent
          customIconSrc={fashionBeautyIconPath}
          isPath={visited}
          title="Fashion"
          link="#"
          onMouseEnter={handleMenuItemMouseEnter}
          onMouseLeave={handleMenuItemMouseLeave}
          menuItemHovered={menuItemHovered}
        />
      </section>
      {/* row-5 */}

      <section className={` ${toggler ? 'hidden' : 'flex'}  flex-col space-y-3 ${!toggler ? 'flex-initial w-[12rem] ' : 'w-16'}`}>
        <div className="capitalize mx-4 text-nowrap space-y-2">
          <h1 className="text-md font-bold">developer information</h1>
          <ul className="space-y-4 text-sm">
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
