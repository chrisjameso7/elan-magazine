// Layout-review photography only; these are not images from published reporting.
export const previewMedia = {
  live: {
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    alt: 'A performer raising one hand through stage smoke and lights',
    position: 'center 52%',
  },
  screen: {
    url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    alt: 'A film clapperboard held in front of an outdoor set',
    position: 'center',
  },
  music: {
    url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    alt: 'A microphone against stage lighting',
    position: 'center',
  },
  decks: {
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    alt: 'A hand above DJ decks illuminated with purple light',
    position: 'center',
  },
  cinema: {
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
    alt: 'Rows of seats inside a cinema auditorium',
    position: 'center',
  },
  guitar: {
    url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1',
    alt: 'A musician playing a guitar',
    position: 'center',
  },
} as const;
export type PreviewPhoto = (typeof previewMedia)[keyof typeof previewMedia];
