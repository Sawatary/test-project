import React, { useEffect, useRef, useState, useCallback } from "react";
import { CircleTimelineProps } from "../../types/timeline";
import "./CircleTimeline.scss";
import gsap from "gsap";
import { animateCirclePoints } from "../../utils/animations";

// Функция для троттлинга вызовов
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean = false;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const CircleTimeline: React.FC<CircleTimelineProps> = ({
  points,
  activePointIndex,
  onPointClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlePointsRef = useRef<(HTMLElement | null)[]>([]);
  const [circleRadius, setCircleRadius] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Функция для расчета радиуса и размера контейнера
  const calculateDimensions = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const { width, height } = container.getBoundingClientRect();
      setContainerSize({ width, height });

      // Используем немного меньший радиус, чтобы точки не выходили за границу
      const radius = Math.min(width, height) * 0.47;
      setCircleRadius(radius);
    }
  }, []);

  // Троттлинг функции изменения размеров для улучшения производительности
  const throttledResize = useCallback(
    throttle(() => {
      calculateDimensions();
    }, 100),
    [calculateDimensions]
  );

  useEffect(() => {
    // Инициализация массива ссылок на точки
    circlePointsRef.current = new Array(points.length).fill(null);

    // Первоначальный расчет размеров
    calculateDimensions();

    // Добавляем обработчик изменения размера окна с троттлингом
    window.addEventListener("resize", throttledResize);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("resize", throttledResize);
    };
  }, [points.length, calculateDimensions, throttledResize]);

  // Функция для позиционирования точек
  const positionPoints = useCallback(() => {
    if (!containerRef.current || circleRadius <= 0) return;

    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;

    circlePointsRef.current.forEach((point, index) => {
      if (!point) return;

      // Расчет угла для текущей точки
      const angleOffset =
        (index - activePointIndex) * ((2 * Math.PI) / points.length);
      const angle = -Math.PI / 2 + angleOffset;

      // Расчет x и y координат
      const x = centerX + circleRadius * Math.cos(angle);
      const y = centerY + circleRadius * Math.sin(angle);

      // Анимируем переход с помощью gsap
      gsap.to(point, {
        left: `${x}px`,
        top: `${y}px`,
        duration: 1,
        ease: "power2.inOut",
      });

      // Добавляем/удаляем класс active для активной точки
      if (index === activePointIndex) {
        point.classList.add("active");
      } else {
        point.classList.remove("active");
      }

      // Позиционирование метки
      const labelElement = point.querySelector(".point-label") as HTMLElement;
      if (labelElement) {
        let labelPosition = {};

        // Определяем положение метки в зависимости от угла
        if (angle >= (-Math.PI * 4) / 4 && angle < -Math.PI / 4) {
          // Сверху
          labelPosition = {
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            right: "auto",
          };
        } else if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
          // Справа
          labelPosition = {
            top: "50%",
            left: "45px",
            transform: "translateY(-50%)",
            right: "auto",
          };
        } else if (angle >= Math.PI / 4 && angle < (Math.PI * 3) / 4) {
          // Снизу
          labelPosition = {
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            right: "auto",
          };
        } else {
          // Слева
          labelPosition = {
            top: "50%",
            right: "45px",
            left: "auto",
            transform: "translateY(-50%)",
          };
        }

        // Применяем стили к метке
        Object.entries(labelPosition).forEach(([key, value]) => {
          labelElement.style[key as any] = value as string;
        });
      }
    });
  }, [activePointIndex, circleRadius, containerSize, points.length]);

  // Эффект для позиционирования точек при изменении активной точки или размера круга
  useEffect(() => {
    positionPoints();
  }, [activePointIndex, circleRadius, containerSize, positionPoints]);

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
