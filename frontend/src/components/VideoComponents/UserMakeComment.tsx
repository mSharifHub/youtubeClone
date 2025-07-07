import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../contexts/userContext/UserContext.tsx';

export const UserMakeComment = () => {
  const {
    state: { user },
  } = useUser();

  const [input, setInput] = useState<string>('');
  const [comment, setComment] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setComment(input);
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="rounded-lg p-2 w-full flex items-center gap-4 ">
        {user && user.profilePicture && (
          <div>
            <img src={user.profilePicture} alt={`${user.username}-profilePicture`} className="rounded-full min-h-8 min-w-8 w-8 h-8" />
          </div>
        )}
        <form className="flex-1">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Add a comment..."
            className="  w-full bg-transparent  border-b   border-neutral-300
        dark:border-neutral-600  focus:outline-none text-base
        placeholder-neutral-400 dark:placeholder-neutral-500"
          />
        </form>
      </div>
      <div className="flex flex-row justify-end items-center gap-20 font-bold">
        <button className="px-3 py-1.5 rounded-full bg-neutral-100 dark:dark-modal dark:hover:bg-neutral-700 hover:bg-neutral-200"> cancel</button>

        <button
          disabled={!comment}
          className={`px-3 py-1.5 rounded-full bg-neutral-100 dark:dark-modal dark:hover:bg-neutral-700 hover:bg-neutral-200 ${!comment && 'opacity-50 cursor-not-allowed'}`}
        >
          comment
        </button>
      </div>
    </div>
  );
};
