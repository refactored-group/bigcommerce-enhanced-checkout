import React, { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Markers from './Markers'
import { mapConfigs } from './constants';
import { LocatorMapProps } from './types';
import formatPhoneNumber from '../../PhoneNumberFormatter'

const LocatorMap = ({ apiKey, dealers, selectDealer, setActiveDealer, activeDealer, showMap }: LocatorMapProps) => {
  const [state, setState] = useState({
    activeMarker: null,
    activeDealer: '',
    activeDealerPhone: '',
    activeDealerPhoneFormatted: '',
    showingInfoWindow: false,
    center: mapConfigs.defaultLatLng,
    zoom: null,
  });

  useEffect(() => {
    if (activeDealer && (!state.activeDealer || state.activeDealer !== activeDealer)) {
      const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: activeDealer.phone_number });
      setState({
        ...state,
        activeDealer: activeDealer,
        activeDealerPhone: activeDealer.phone_number,
        activeDealerPhoneFormatted: formattedDealerPhoneNumber,
        showingInfoWindow: true
      });
    }
  }, [activeDealer]);

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
          showMap={showMap}
        />
      </Map>
    </APIProvider>
  );
};

export default LocatorMap;
