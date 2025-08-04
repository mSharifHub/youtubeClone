export default function SpinningCircle({ style = '' }: { style?: string }) {
  return (
    <div className="flex w-full p-4 justify-center items-center  ">
      <div
        className={` ${style.trim() !== '' ? style : 'min-h-9 min-w-9  h-9 w-9 border-2 '} rounded-full animate-spin  duration-75 border-neutral-300 border-t-white dark:border-slate-700 dark:border-t-black`}
      />
    </div>
  );
}
