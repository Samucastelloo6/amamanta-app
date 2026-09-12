export type EventMode = 'presential' | 'online';

export const eventOnlinePlatforms = ['zoom', 'meet', 'teams', 'other'] as const;

export type EventOnlinePlatform = (typeof eventOnlinePlatforms)[number];

const EVENT_ONLINE_PLATFORM_LABELS: Record<EventOnlinePlatform, string> = {
  zoom: 'Zoom',
  meet: 'Google Meet',
  teams: 'Microsoft Teams',
  other: 'Reunión online',
};

export function getEventPlatformLabel(
  platform: EventOnlinePlatform | undefined,
): string {
  return platform ? EVENT_ONLINE_PLATFORM_LABELS[platform] : 'Reunión online';
}

export interface AmamantaEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;

  mode: EventMode;

  location: string;
  googleMapsUrl: string;

  onlinePlatform?: EventOnlinePlatform;
  onlineUrl: string;
  onlineCode: string;

  description: string;
  requiresRegistration?: boolean;
  isActive: boolean;
}

export type CreateEventRequest = Omit<AmamantaEvent, 'id'>;

export type UpdateEventRequest = Partial<CreateEventRequest>;
