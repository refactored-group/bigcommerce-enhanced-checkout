import React from 'react';
import { useMap, InfoWindow, Marker } from '@vis.gl/react-google-maps';
import { MarkersProps, DealerProps } from './types';
import { handleSelect, onMarkerClick } from './utils';
import { mapConfigs } from './constants';

const createSvgMarker = (dealer: DealerProps) => {
  const isGoogleDefined = typeof google !== 'undefined';
  return {
    path: "m730.940002,1839.630005c-38.765991,-190.300049 -107.116028,-348.670044 -189.903015,-495.440063c-61.406982,-108.869995 -132.543976,-209.359985 -198.363983,-314.939941c-21.972015,-35.242981 -40.93399,-72.476013 -62.046997,-109.052979c-42.216003,-73.137024 -76.444,-157.934998 -74.269012,-267.932007c2.125,-107.473022 33.208008,-193.684021 78.029999,-264.172028c73.718994,-115.934998 197.201019,-210.988983 362.884003,-235.968994c135.466003,-20.423996 262.474976,14.082001 352.54303,66.748001c73.596008,43.03801 130.596008,100.526993 173.915955,168.280014c45.219971,70.716003 76.359985,154.259979 78.969971,263.231964c1.340088,55.830017 -7.799927,107.532043 -20.679932,150.41803c-13.030029,43.408997 -33.98999,79.695007 -52.640015,118.453979c-36.410034,75.658997 -82.050049,144.984009 -127.859985,214.343994c-136.437012,206.609985 -264.496033,417.310059 -320.580017,706.030029z",
    fillColor: dealer.preferred ? '#f26b20' : '#512a74',
    fillOpacity: 1,
    scale: 0.025,
    anchor: isGoogleDefined ? new google.maps.Point(730, 1839) : null,
    labelAnchor: isGoogleDefined ? new google.maps.Point(100, 100) : null,
    labelOrigin: isGoogleDefined ? new google.maps.Point(730, 730) : null
  };
};

const Markers = ({ dealers, prevDealersRef, state, setState, selectDealer, setActiveDealer, showMap }: MarkersProps) => {
  const map = useMap();
  
  const fitMapToBounds = (map: google.maps.Map, dealers: DealerProps[], prevDealersRef: React.MutableRefObject<any[]>) => {
    const bounds = new google.maps.LatLngBounds();
    dealers.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
    prevDealersRef.current = dealers;
  };

  React.useEffect(() => {
    if (map) {
      if (dealers.length === 0) {
        map.setCenter(mapConfigs.defaultLatLng);
        map.setZoom(4);
      } else {
        fitMapToBounds(map, dealers, prevDealersRef);
      }
    }
  }, [dealers, map, prevDealersRef]);

  React.useEffect(() => {
    if (map && state.activeDealer) {
      map.panTo({ lat: state.activeDealer.lat, lng: state.activeDealer.lng });
      map.setZoom(12);
    }
  }, [state.activeDealer, map]);

  React.useEffect(() => {
    if (map && state.activeDealer && showMap) {
      map.panTo({ lat: state.activeDealer.lat, lng: state.activeDealer.lng });
      map.setZoom(12);
    }
  }, [showMap]);

  return (
    <>
      {dealers.map((dealer: DealerProps, index: number) => {
        const svgMarker = createSvgMarker(dealer);
        return (
          <Marker
            position={{ lat: dealer.lat, lng: dealer.lng }}
            clickable={true}
            onClick={() => {
              onMarkerClick(dealer, map, setState);
              setActiveDealer(dealer);
            }}
            title={dealer.business_name}
            key={index}
            icon={svgMarker}
            label={{
              text: `${index + 1}`,
              color: 'white',
              className: `font-bold`,
            }}
          />
        );
      })}

      {state.showingInfoWindow && (
        <InfoWindow
          headerContent={<p className="font-bold">{state.activeDealer.business_name}</p>}
          position={{ lat: state.activeDealer.lat, lng: state.activeDealer.lng }}
          pixelOffset={[0, -38]}
          minWidth={250}
          maxWidth={280}
        >
          {state.activeDealer && (
            <div>
              <div className="text-gray-700">
                <p className="my-2">
                  <strong className="text-black">Address:</strong> {state.activeDealer.premise_street}
                </p>
                <p className="my-2">
                    <strong className="text-black">Phone:</strong> <a href={`tel:${state.activeDealerPhone}`} className="text-blue-500 mt-1 focus:outline-none focus:ring-0">{state.activeDealerPhoneFormatted}</a>
                </p>
              </div>
                <div className='h-12 flex items-center justify-center overflow-hidden'>
                  <button
                    className={`relative px-4 py-2 rounded block w-full ${state.activeDealer.preferred ? 'bg-secondary' : 'bg-primary hover:bg-hover'}`}
                    onClick={() => handleSelect(state.activeDealer, selectDealer)}>
                    <span className={`absolute inset-0 rounded ${state.activeDealer.preferred ? 'bg-secondary' : 'bg-primary hover:bg-hover'}`}></span>
                    <span className="relative z-10 font-bold text-white">SELECT</span>
                  </button>
                </div>
            </div>
          )}
        </InfoWindow>
      )}
    </>
  );
};

export default Markers;
