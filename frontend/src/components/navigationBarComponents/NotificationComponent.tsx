import bellIconPath from '../../assets/navigation_icons/bell.png';
import videoIconPath from '../../assets/navigation_icons/add-video.png';


export const NotificationComponent = () => {
  return (
    <div className="h-8 w-8 min-w-8 flex justify-center items-center rounded-full  hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer ">
      <img src={bellIconPath} title="Alerts" alt={videoIconPath.split('/').pop()?.split('.')[0]} className="min-w-6 min-h-6 w-6 h-6 dark:invert" />
    </div>
  );
};
