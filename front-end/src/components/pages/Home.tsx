import { useUser } from '../../context/UserContext.tsx';

export default function Home() {
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <button className=" border-2 px-4 py-1 rounded-lg" onClick={() => handleLogout()}>
        Log out
      </button>
    </div>
  );
}
