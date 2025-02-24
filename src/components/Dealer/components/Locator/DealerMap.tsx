import React from 'react';
import LocatorMap from './../LocatorMap/LocatorMap';
import { DealerMapProps } from './types';

const DealerMap: React.FC<DealerMapProps> = ({ googleMapsApiKey, dealers, selectDealer, activeDealer, handleActiveDealer, showMap, setShowMap, dealersHeight, loading, announcement, showToast, hideToast }) => {
  return (
    <div id="dealersMap" className={`absolute lg:static w-full bottom-0 lg:flex-1 transition-all duration-200 locator-modal-map`} style={{ height: showMap ? `${dealersHeight + 42}px` : "42px" }}>
      <div className="lg:hidden h-12 flex items-center justify-center font-bold bg-hover text-white cursor-pointer" onClick={() => setShowMap(!showMap)}>
        {showMap ? (
          <div className='flex'>
            {loading && (
              <div className="flex justify-center items-center mr-2">
                <img src="icons/loading-white.svg" alt="loading" className="w-5 h-5" />
              </div>
            )} 
            HIDE MAP
          </div>
        ) : ('VIEW MAP')}
      </div>
      <div className="w-full h-full locator-modal-map-wrapper">
        <div className='hidden lg:block w-3 h-full absolute bg-gradient-to-r from-gray-300 to-transparent z-20'></div>
        <LocatorMap
          apiKey={googleMapsApiKey}
          dealers={dealers}
          selectDealer={selectDealer}
          setActiveDealer={activeDealer}
          handleActiveDealer={handleActiveDealer}
          showMap={showMap}
        />
      </div>
      {announcement && showToast && (
        <div className="locator-toast-box">
          <div className="locator-toast-close">
            <a onClick={hideToast} className="white-text" href="#">X</a>
          </div>
          <div className="locator-toast-text">{announcement}</div>
        </div>
      )}
    </div>
  );
};

export default DealerMap;
