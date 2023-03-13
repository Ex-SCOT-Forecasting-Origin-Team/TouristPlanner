export interface DayPlan {
    places: {
      origin: {
        name: string;
        lat: number;
        lng: number;
      };
      commute: {
        visitTime: number;
        leaveTime: number;
        commmuteMethod: string;
      };
      destination: {
        name: string;
        lat: number;
        lng: number;
        destinationOpen: number;
        destinationClosed: number;
      };
    }[];
  }
  