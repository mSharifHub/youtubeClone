export default function CommentLoading() {
  return (
    <div className="flex flex-row items-center   h-20  w-[100vw] max-w-[500px]  gap-2 ">
      <div className="min-10 min-w-10 h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-opacity-pulse" />
      <div className="w-full h-full flex flex-col justify-center gap-2">
        <div className="w-1/2 h-4 bg-neutral-200  dark:bg-neutral-700 animate-opacity-pulse rounded-md" />
        <div className="w-full h-4 bg-neutral-200  dark:bg-neutral-700 animate-opacity-pulse rounded-md" />
      </div>
    </div>
  );
}
