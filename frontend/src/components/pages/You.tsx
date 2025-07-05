import { UserProfileCard } from '../userComponent/UserProfileCard.tsx';

export default function You() {
  return (
    <div className="h-screen flex flex-col justify-start items-start p-8 gap-12">
      <UserProfileCard />
      <div> History</div>
      <div>Playists</div>
      <div>WatchLater</div>
      <div>likedVideos</div>
    </div>
  );
}
