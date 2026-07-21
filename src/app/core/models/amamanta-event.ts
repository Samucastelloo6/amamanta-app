export interface AmamantaEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  location: string;
  googleMapsUrl: string;
  description: string;
  requiresRegistration?: boolean;
  isActive: boolean;
}
