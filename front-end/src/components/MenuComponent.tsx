import { Link } from 'react-router-dom';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

// interface props for menu bar component
interface MenuComponentProps {
  icon?: FontAwesomeIconProps['icon'];
  customIconSrc?: string;
  title: string;
  link: string;
  order?: string;
}

export default function MenuComponent({
  icon,
  customIconSrc,
  title,
  link,
  order,
}: MenuComponentProps) {
  /* this const is to change the order between the icon and title to have more control over the component UI
    this logic is needed to reverser the div flex grow between title and icon  so title and icon reversed are aligned with the
    not reversed components. This is mostly used for the menu bar You component where the title comes before the icon
  */
  const isOrderReverse = order === 'reverse';

  return (
    <Link to={link}>
      <div
        className={` w-[80%] h-10  flex flex-col xl:flex-row justify-center items-center rounded-lg transition-colors duration-100 ease-out hover:bg-neutral-100`}
      >
        <div
          className={`w-10 h-full ${isOrderReverse ? 'hidden  xl:flex xl:flex-grow justify-start' : ' flex justify-center'}  items-center  ${isOrderReverse ? 'order-last' : 'order-first'}`}
        >
          {icon && <FontAwesomeIcon icon={icon} />}
          {customIconSrc && (
            <img
              src={customIconSrc}
              alt={`${title}-icon`}
              className="h-6 w-6 min-h-4 min-w-4 dark:invert"
            />
          )}
        </div>
        <div
          className={`h-full flex ${!isOrderReverse ? 'flex-grow' : 'w-12 justify-center'}  justify-start px-4 items-center  ${isOrderReverse ? 'order-first' : 'order-last'}`}
        >
          <span className="capitalize text-nowrap  text-center text-[10px] xl:text-sm">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}
