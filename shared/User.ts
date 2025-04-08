export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  events: string[]; // Array of event IDs the user has participated in
}
