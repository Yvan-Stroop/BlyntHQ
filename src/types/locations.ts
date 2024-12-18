export interface Location {
    city: string;
    state: string;
    state_abbr: string;
    lat: number;
    lng: number;
  }
  
  export interface State {
    name: string;
    abbr: string;
  }
  
  export interface SchemaLocation {
    city: string;
    state: string;
    state_abbr: string;
    businessCount: number;
  }
  
  export interface LocationData {
    states: {
      [key: string]: {
        name: string;
        cities: {
          [key: string]: {
            name: string;
          };
        };
      };
    };
    locations: Location[];
  }
  
  export type LocationCSV = Location; 