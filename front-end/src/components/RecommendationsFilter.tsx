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
    <div className="relative h-7  min-h-7  px-2 flex relative justify-center items-center rounded-lg transition-colors duration-200 ease-out bg-neutral-100 font-medium  capitalize hover:bg-neutral-200">
      <Link to={link}>
        <h1 className="text-nowrap text-sm">{title}</h1>
      </Link>
    </div>
  );
}
