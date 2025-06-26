import { useMemo } from 'react';

export const UserAvatar = ({ userName }: { userName: string }) => {
  const { r, g, b } = useMemo(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  }, []);

  const userInitial: string = userName.charAt(1).toUpperCase();

  return (
    <div className={`min-h-12 min-w-12 h-12 w-12 flex justify-center items-center  capitalize  font-bold text-lg rounded-full `} style={{ backgroundColor: `rgb(${r},${g},${b})` }}>
      {userInitial}
    </div>
  );
};
