export interface IProps {
    apiKey: string;
    dealers: any[];
    selectDealer: (dealer: any) => void;
    setActiveDealer: (dealer: any) => void;
    showMap: boolean;
    handleActiveDealer: (dealer: any) => void;
  }

export interface IMarkersProps {
    dealers: any[];
    state: any;
    setState: any;
    selectDealer: any;
    prevDealersRef: any;
    setActiveDealer: any;
    showMap: any
}