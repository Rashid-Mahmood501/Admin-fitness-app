export interface Booking {
  id: string;
  name: string;
  time: string;
  type: 'in-person' | 'video';
  profileImage: string;
  _rawDate: string;
} 