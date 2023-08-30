export interface Address {
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

// export interface Dates {

// }

export interface User {
  position: number;
  username?: string;
  role?: 'petOwner' | 'petSitter';
  address?: Address;
  preference: 'dogWalking' | 'catSitting' | 'both';
  pets: string[];
  // desiredDates: Date[];
}
