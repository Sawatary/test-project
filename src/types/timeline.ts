export interface TimelineEvent {
  id: number;
  year: number;
  description: string;
}

export interface TimelinePoint {
  id: number;
  startYear: number;
  endYear: number;
  label: string;
  events: TimelineEvent[];
}

export interface TimelineData {
  points: TimelinePoint[];
}

export interface TimelineProps {}

export interface CircleTimelineProps {
  points: TimelinePoint[];
  activePointIndex: number;
  onPointClick: (index: number) => void;
}

export interface YearsDisplayProps {
  startYear: number;
  endYear: number;
}

export interface EventSliderProps {
  events: TimelineEvent[];
  onNextPeriod: () => void;
  onPrevPeriod: () => void;
  periodIndex: number;
  totalPeriods: number;
} 