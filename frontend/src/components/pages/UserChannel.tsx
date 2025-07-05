import { useUser } from '../../contexts/userContext/UserContext.tsx';

export default function UserChannel() {
  const {
    state: { user },
  } = useUser();

  return (
    <div className="h-screen flex flex-col justify-start items-center p-8 ">
      <div className=" flex flex-row border">
        {user && user.profilePicture && <img src={user.profilePicture} alt={`${user.username}-profilePicture`} className="rounded-full min-h-48 min-w-48 w-48 h-48 " />}
        <div className="border flex flex-col">
          <h1 className="font-bold text-3xl text-nowrap">
            {user && user.firstName} {user && user.lastName}
          </h1>
          <h3>{user && `@${user.youtubeHandler}`}</h3>


        </div>
      </div>
    </div>
  );
}
