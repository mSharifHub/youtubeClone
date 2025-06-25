import React, { useMemo } from 'react';

interface UseAvatarProps {
  imagerUrl?: string;
  userName: string;
}

export const UserAvatar: React.FC<UseAvatarProps> = ({ imagerUrl, userName }) => {

  const [imageError, setImageError] = React.useState<boolean>(false);

  const { r, g, b } = useMemo(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  }, []);

  const userInitial: string = userName.charAt(1).toUpperCase();

  if (imagerUrl && imagerUrl.trim() !== '' && !imageError) {
    return (
      <img
        src={imagerUrl}
        alt={userName}
        className=" min-h-12 min-w-12 h-12 w-12 flex justify-center items-center object-cover rounded-full "
        loading="lazy"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className={`min-h-12 min-w-12 h-12 w-12 flex justify-center items-center  capitalize rounded-full `} style={{ backgroundColor: `rgb(${r},${g},${b})` }}>
      {userInitial}
    </div>
  );
};
