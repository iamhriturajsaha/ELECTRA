export interface TimelineStep {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  status: 'upcoming' | 'current' | 'completed';
  actions?: { label: string; url: string }[];
}
