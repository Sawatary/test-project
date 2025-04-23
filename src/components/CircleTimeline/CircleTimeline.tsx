import React, { useEffect, useRef, useState } from "react";
import { CircleTimelineProps } from "../../types/timeline";
import "./CircleTimeline.scss";
import gsap from "gsap";
import { animateCirclePoints } from "../../utils/animations";

const CircleTimeline: React.FC<CircleTimelineProps> = ({
  points,
  activePointIndex,
  onPointClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlePointsRef = useRef<(HTMLElement | null)[]>([]);
  const [circleRadius, setCircleRadius] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const { width } = container.getBoundingClientRect();
      const radius = width * 0.47;
      setCircleRadius(radius);
      circlePointsRef.current = new Array(points.length).fill(null);
    }
  }, [points.length]);

  useEffect(() => {
    if (containerRef.current && circleRadius > 0) {
      const container = containerRef.current;
      const { width } = container.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = width / 2;
      circlePointsRef.current.forEach((point, index) => {
        if (point) {
          const angleOffset =
            (index - activePointIndex) * ((2 * Math.PI) / points.length);
          const angle = -Math.PI / 2 + angleOffset;
          const x = centerX + circleRadius * Math.cos(angle);
          const y = centerY + circleRadius * Math.sin(angle);
          gsap.to(point, {
            left: `${x}px`,
            top: `${y}px`,
            duration: 1,
            ease: "power2.inOut",
          });
          if (index === activePointIndex) {
            point.classList.add("active");
          } else {
            point.classList.remove("active");
          }
          const labelElement = point.querySelector(
            ".point-label"
          ) as HTMLElement;
          if (labelElement) {
            let labelPosition = {};
            if (angle >= (-Math.PI * 4) / 4 && angle < -Math.PI / 4) {
              labelPosition = {
                top: "-50px",
                left: "50%",
                transform: "translateX(-50%)",
              };
            } else if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
              labelPosition = {
                top: "50%",
                left: "45px",
                transform: "translateY(-50%)",
              };
            } else if (angle >= Math.PI / 4 && angle < (Math.PI * 3) / 4) {
              labelPosition = {
                top: "50px",
                left: "50%",
                transform: "translateX(-50%)",
              };
            } else {
              labelPosition = {
                top: "50%",
                right: "45px",
                left: "auto",
                transform: "translateY(-50%)",
              };
            }
            Object.entries(labelPosition).forEach(([key, value]) => {
              labelElement.style[key as any] = value as string;
            });
          }
        }
      });
    }
  }, [activePointIndex, circleRadius, points.length]);

  const handlePointClick = (index: number) => {
    if (index !== activePointIndex) {
      onPointClick(index);
    }
  };

  const setPointRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      circlePointsRef.current[index] = el;
    }
  };

  return (
    <div className="circle-timeline" ref={containerRef}>
      <div className="circle-container">
        <div className="outer-circle"></div>
        {points.map((point, index) => (
          <div
            key={point.id}
            ref={(el) => setPointRef(el, index)}
            className={`circle-point ${
              index === activePointIndex ? "active" : ""
            }`}
            onClick={() => handlePointClick(index)}
          >
            <div className="point-number">{index + 1}</div>
            <div className="point-label">{point.label}</div>
          </div>
        ))}
        <div className="circle-center"></div>
      </div>
    </div>
  );
};

export default CircleTimeline;
