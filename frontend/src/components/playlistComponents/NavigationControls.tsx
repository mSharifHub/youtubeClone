import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NavigationControls {
  viewAll: boolean;
  currentIndex: number;
  onViewAllToggle: () => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  className?: string;
  viewAllText?: {
    expanded: string;
    collapsed: string;
  };
}

export const NavigationControls: React.FC<NavigationControls> = ({
  viewAll,
  currentIndex,
  onViewAllToggle,
  onScrollLeft,
  onScrollRight,
  className = '',
  viewAllText = { expanded: 'view less', collapsed: 'view all' },
}) => {

  return (
    <div className={`flex flex-row justify-end gap-4 items-center px-3 mb-4 ${className}`}>
      <div
        onClick={onViewAllToggle}
        className="border-[1px] flex items-center justify-center rounded-full h-12 w-28 capitalize cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100"
      >
        {!viewAll ? viewAllText.collapsed : viewAllText.expanded}
      </div>
      <button
        disabled={viewAll || currentIndex === 0}
        onClick={onScrollLeft}
        className={`border-[1px] rounded-full min-h-10 min-w-10 h-10 w-10 flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100 ${viewAll && 'opacity-50 cursor-not-allowed'}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        disabled={viewAll}
        onClick={onScrollRight}
        className={`border-[1px] rounded-full min-h-10 min-w-10 h-10 w-10 flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100 ${viewAll && 'opacity-50 cursor-not-allowed'}`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};
