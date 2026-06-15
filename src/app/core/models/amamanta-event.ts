export interface AmamantaEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  description: string;
  speaker?: string;
  requiresRegistration?: boolean;
  workshopId?: string;
  isActive: boolean;
}
