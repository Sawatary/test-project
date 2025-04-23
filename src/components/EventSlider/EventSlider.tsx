import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { EventSliderProps } from '../../types/timeline';
import './EventSlider.scss';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/navigation';

const EventSlider: React.FC<EventSliderProps> = ({ 
  events, 
  onNextPeriod, 
  onPrevPeriod,
  periodIndex,
  totalPeriods
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides] = useState(events.length);
  
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
      setCurrentSlide(1);
    }
  }, [periodIndex, events]);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.from(sliderRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, []);

  const handlePrevClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      if (swiper.isBeginning) {
        onPrevPeriod();
      } else {
        swiper.slidePrev();
      }
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      if (swiper.isEnd) {
        onNextPeriod();
      } else {
        swiper.slideNext();
      }
    }
  };

  return (
    <div className="event-slider" ref={sliderRef}>
      <div className="slider-controls">
        <div className="pagination-info">
          <div className="current-slide">
            {periodIndex + 1 < 10 ? `0${periodIndex + 1}` : periodIndex + 1}
          </div>
          <div className="slide-separator">/</div>
          <div className="total-slides">
            {totalPeriods < 10 ? `0${totalPeriods}` : totalPeriods}
          </div>
        </div>
        
        <div className="navigation-buttons">
          <button className="slider-button slider-button-prev" onClick={handlePrevClick}>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slider-button slider-button-next" onClick={handleNextClick}>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 0.75L7.75 7L1.5 13.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        speed={500}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex + 1);
        }}
        className="event-swiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 40
          }
        }}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="event-slide">
              <div className="event-year">{event.year}</div>
              <div className="event-description">{event.description}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventSlider; 