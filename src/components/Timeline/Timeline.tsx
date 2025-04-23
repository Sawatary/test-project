import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Timeline.scss";
import { TimelinePoint, TimelineProps } from "../../types/timeline";
import CircleTimeline from "../CircleTimeline";
import YearsDisplay from "../YearsDisplay";
import EventSlider from "../EventSlider";
import { timelineData } from "../../data/timelineData";
import { fadeInFromBottom } from "../../utils/animations";

const Timeline: React.FC<TimelineProps> = () => {
  const [activePointIndex, setActivePointIndex] = useState(0);
  const activePoint: TimelinePoint = timelineData.points[activePointIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const yearsDisplayRef = useRef<HTMLDivElement>(null);
  const prevActivePointRef = useRef(activePointIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      fadeInFromBottom(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (
      prevActivePointRef.current !== activePointIndex &&
      yearsDisplayRef.current
    ) {
      const yearsElement =
        yearsDisplayRef.current.querySelector(".years-display");
      const startYear = yearsDisplayRef.current.querySelector(".start-year");
      const endYear = yearsDisplayRef.current.querySelector(".end-year");
      
      if (yearsElement && startYear && endYear) {
        gsap.to([startYear, endYear], {
          y: 20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "power2.in",
          onComplete: () => {
            gsap.fromTo(
              [startYear, endYear],
              { y: -30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.15,
                ease: "power3.out",
              }
            );
          },
        });
      }
      prevActivePointRef.current = activePointIndex;
    }
  }, [activePointIndex]);

  const handlePointClick = (index: number) => {
    if (index !== activePointIndex) {
      setActivePointIndex(index);
    }
  };

  const goToNextPeriod = () => {
    const nextIndex = (activePointIndex + 1) % timelineData.points.length;
    setActivePointIndex(nextIndex);
  };

  const goToPrevPeriod = () => {
    const prevIndex = (activePointIndex - 1 + timelineData.points.length) % timelineData.points.length;
    setActivePointIndex(prevIndex);
  };

  return (
    <div className="timeline-block" ref={containerRef}>
      <div className="background-plus"></div>
      
      <div className="timeline-header">
        <div className="timeline-title">
          Исторические <br /> даты
        </div>
        <div className="timeline-content">
          <div className="circle-container-wrapper">
            {!isMobile && (
              <CircleTimeline 
                points={timelineData.points} 
                activePointIndex={activePointIndex} 
                onPointClick={handlePointClick} 
              />
            )}
            <div className="years-display-wrapper" ref={yearsDisplayRef}>
              <YearsDisplay
                startYear={activePoint.startYear}
                endYear={activePoint.endYear}
              />
            </div>
          </div>
        </div>
      </div>
      <EventSlider 
        events={activePoint.events} 
        onNextPeriod={goToNextPeriod}
        onPrevPeriod={goToPrevPeriod}
        periodIndex={activePointIndex}
        totalPeriods={timelineData.points.length}
      />
    </div>
  );
};

export default Timeline; 