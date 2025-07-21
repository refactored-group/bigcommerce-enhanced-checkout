export interface LocatorMapProps {
  apiKey: string;
  dealers: any[];
  selectDealer: (dealer: any) => void;
  setActiveDealer: (dealer: any) => void;
  showMap: boolean;
  activeDealer: any;
}

export interface MarkersProps {
  dealers: any[];
  state: any;
  setState: any;
  selectDealer: any;
  prevDealersRef: any;
  setActiveDealer: any;
  showMap: any
}

export interface DealerProps {
  lat: number;
  lng: number;
  preferred: boolean;
  business_name: string;
  premise_street: string;
  phone_number: string;
  phone_number_formatted: string;
}
