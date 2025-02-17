import React, { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Markers from './Markers'
import { mapConfigs } from './constants';
import { IProps } from './types';
import { useEffect } from 'react';

const LocatorMap = ({ apiKey, dealers, selectDealer, setActiveDealer, showMap, handleActiveDealer }: IProps) => {
  const [state, setState] = useState({
    activeMarker: null,
    activeDealer: null,
    activeDealerPhone: null,
    activeDealerPhoneFormatted: null,
    showingInfoWindow: false,
    center: mapConfigs.defaultLatLng,
    zoom: null,
  });

  useEffect(() => {
    if (state.activeDealer) {
      handleActiveDealer(state.activeDealer);
    }
  }, [state.activeDealer]);

  const prevDealersRef = React.useRef<any[]>([]);

  return (
    <APIProvider apiKey={apiKey}>
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
          showMap={showMap}
        />
      </Map>
    </APIProvider>
  );
};

export default LocatorMap;
