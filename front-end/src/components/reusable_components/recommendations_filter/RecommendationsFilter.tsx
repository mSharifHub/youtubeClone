import { Link } from 'react-router-dom';

interface RecommendationsFilterProps {
  title: string;
  link: string;
}

export default function RecommendationsFilter({
  title,
  link,
}: RecommendationsFilterProps) {
  if (title.length > 20) {
    throw new Error("Title can't be more than 20 characters long");
  }
  return (
    <div className="h-7  w-[8rem]  min-h-7 min-w-[8rem] flex justify-center items-center rounded-lg bg-neutral-200 font-medium  capitalize">
      <Link to={link}>
        <h1 className="text-nowrap text-sm">{title}</h1>
      </Link>
    </div>
  );
}
