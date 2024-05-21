import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ToolTip } from './helpers/ToolTip.tsx';
import RecommendationsFilter from './reusable_components/RecommendationsFilter.tsx';

export default function Suggestions() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipText, setToolTipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const dummyData = [
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
    { title: 'dummyData', link: '#' },
  ].map((item, index) => ({ ...item, index }));

  const toolTipMouseEnter = useCallback((event, text = null) => {
    const target = event.currentTarget;
    const toolTipText = text || target.innerText.trim();
    const rect = event.target.getBoundingClientRect();

    if (!toolTipText || !rect) {
      setShowTooltip(false);
      return;
    }

    setTooltipPosition({ top: rect.top + 30, left: rect.left + 30 });
    setToolTipText(toolTipText);
    setShowTooltip(true);
  }, []);

  const toolTipMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleScroll = useCallback(() => {
    const div = scrollRef.current;
    if (!div) return;

    if (div.scrollLeft > 0) {
      setIsStart(false);
    } else {
      setIsStart(true);
    }

    if (div.scrollWidth - div.scrollLeft === div.clientWidth) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  }, []);

  useEffect(() => {
    const div = scrollRef.current;
    if (!div) return;
    div.addEventListener('scroll', handleScroll);
    return () => {
      div.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <ToolTip
        text={toolTipText}
        visible={showTooltip}
        position={tooltipPosition}
      />

      <section className="h-12 w-full flex justify-start items-center">
        {/* all block */}

        <div
          onMouseEnter={(e) => toolTipMouseEnter(e)}
          onMouseLeave={toolTipMouseLeave}
          className={`bg-black text-white w-10 h-7 min-h-7 ${isStart ? 'flex' : 'hidden'} relative   justify-center items-center capitalize rounded-lg mr-4 cursor-pointer`}
        >
          all
        </div>

        {/* holds the scroll and relative to fade div*/}
        <div className="relative w-full h-full overflow-hidden">
          {/* fading effect*/}
          <div
            className={` ${isStart ? 'hidden' : null}  absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-[rgba(255,255,255,0.5)]  to-transparent pointer-events-none z-10`}
          />
          {/* scroll area */}
          <div
            ref={scrollRef}
            className="h-full  flex justify-start items-center space-x-4 overflow-x-auto scroll-smooth whitespace-nowrap no-scrollbar "
          >
            {dummyData.map((item) => (
              <div
                onMouseEnter={(e) => toolTipMouseEnter(e, item.title)}
                onMouseLeave={toolTipMouseLeave}
                key={item.index}
              >
                <RecommendationsFilter title={item.title} link={item.link} />
              </div>
            ))}
          </div>

          {/* fading effect*/}
          <div
            className={` ${isEnd ? 'hidden' : null}  absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-[rgba(255,255,255,0.5)] to-transparent pointer-events-none z-10`}
          />
        </div>

        {/* right arrow */}
        <div
          className={`h-8 w-10 ${isEnd ? 'hidden' : 'flex'} justify-center items-center`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </section>
    </>
  );
}
