import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { YearsDisplayProps } from '../../types/timeline';
import './YearsDisplay.scss';

const YearsDisplay: React.FC<YearsDisplayProps> = ({ startYear, endYear }) => {
  const startYearRef = useRef<HTMLDivElement>(null);
  const endYearRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<{ startValue: number, endValue: number }>({ startValue: startYear, endValue: endYear });
  const [displayStartYear, setDisplayStartYear] = useState(startYear);
  const [displayEndYear, setDisplayEndYear] = useState(endYear);
  
  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, []);

  useEffect(() => {
    if (startYearRef.current && endYearRef.current && containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      });
      
      animateCounter(counterRef.current.startValue, startYear, (value) => {
        setDisplayStartYear(Math.round(value));
      });
      
      animateCounter(counterRef.current.endValue, endYear, (value) => {
        setDisplayEndYear(Math.round(value));
      });
      
      counterRef.current = { startValue: startYear, endValue: endYear };
    }
  }, [startYear, endYear]);

  const animateCounter = (from: number, to: number, onUpdate: (value: number) => void) => {
    const difference = Math.abs(to - from);
    const duration = Math.min(1.5, Math.max(0.8, difference * 0.02));
    
    const obj = { value: from };
    
    gsap.to(obj, {
      value: to,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        onUpdate(obj.value);
      }
    });
  };

  return (
    <div className="years-display" ref={containerRef}>
      <div className="year start-year" ref={startYearRef}>
        {displayStartYear}
      </div>
      <div className="year end-year" ref={endYearRef}>
        {displayEndYear}
      </div>
    </div>
  );
};

export default YearsDisplay; 