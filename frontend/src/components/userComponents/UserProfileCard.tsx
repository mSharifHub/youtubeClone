import { useUser } from '../../contexts/userContext/UserContext.tsx';

export const UserProfileCard = () => {
  const {
    state: { user },
  } = useUser();
  return (
    <div className=" w-[80vw] max-w-[800px] flex flex-row gap-4 ">
      {user && user.profilePicture && <img src={user.profilePicture} alt={`${user.username}-profilePicture`} className="rounded-full min-h-32 min-w-32 w-32 h-32 " />}
      <div className=" flex flex-col">
        <h1 className="font-bold text-3xl text-wrap">
          {user && user.firstName} {user && user.lastName}
        </h1>
        <h3>{user && `@${user.youtubeHandler}`}</h3>
      </div>
    </div>
  );
};
