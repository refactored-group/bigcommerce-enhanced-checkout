import React, { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Markers from './Markers'
import { mapConfigs } from './constants';
import { IProps } from './types';

const LocatorMap = ({ apiKey, dealers, selectDealer, setActiveDealer }: IProps) => {
  const [state, setState] = useState({
    activeMarker: null,
    activeDealer: null,
    activeDealerPhone: null,
    activeDealerPhoneFormatted: null,
    showingInfoWindow: false,
    center: mapConfigs.defaultLatLng,
    zoom: null,
  });

  const prevDealersRef = React.useRef<any[]>([]);

  return (
    <APIProvider apiKey={apiKey ?? process.env.REACT_APP_GOOGLE_MAPS_KEY}>
      <Map
        defaultCenter={mapConfigs.defaultLatLng}
        defaultZoom={4}
        gestureHandling="greedy"
        disableDefaultUI={true}
        fullscreenControl={false}
        styles={mapConfigs.styles}
      >
        <Markers
          dealers={dealers}
          prevDealersRef={prevDealersRef}
          state={state}
          setState={setState}
          selectDealer={selectDealer}
          setActiveDealer={setActiveDealer}
        />
      </Map>
    </APIProvider>
  );
};

export default LocatorMap;
