import gsap from 'gsap';

export const fadeInFromTop = (element: HTMLElement, duration: number = 0.8) => {
  gsap.from(element, {
    opacity: 0,
    y: -20,
    duration,
    ease: "power3.out",
  });
};

export const fadeInFromBottom = (element: HTMLElement, duration: number = 0.8) => {
  gsap.from(element, {
    opacity: 0,
    y: 20,
    duration,
    ease: "power3.out",
  });
};

export const animateYearsChange = (
  startYearElement: HTMLElement, 
  endYearElement: HTMLElement
) => {
  gsap.to([startYearElement, endYearElement], {
    y: 20,
    opacity: 0,
    duration: 0.3,
    stagger: 0.1,
    ease: "power2.in",
    onComplete: () => {
      gsap.fromTo(
        [startYearElement, endYearElement],
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
};

export const animateCirclePoints = (
  point: HTMLElement,
  x: number,
  y: number,
  duration: number = 1
) => {
  gsap.to(point, {
    left: `${x}px`,
    top: `${y}px`,
    duration,
    ease: "power2.inOut",
  });
}; 