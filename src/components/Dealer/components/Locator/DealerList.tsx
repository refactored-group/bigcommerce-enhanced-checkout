import React from 'react';
import DealerCard from './DealerCard';
import { DealerListProps } from './types';

const DealerList: React.FC<DealerListProps> = ({ dealersRef, dealers, loading, searched, currentLocation, activeDealer, handleActiveDealer, selectDealer }) => {
  return (
    <div ref={dealersRef} className="scrollbar flex-1 overflow-y-auto snap-y locator-modal-content mb-12 lg:mb-0">
      {!loading && dealers.map((dealer, index) => (
        <DealerCard
          key={`${dealer}${index}`}
          dealer={dealer}
          index={index}
          setActiveDealer={activeDealer}
          handleActiveDealer={handleActiveDealer}
          selectDealer={selectDealer}
        />
      ))}
      {searched && !loading && (
        <div className="text-center mb-4">
          <h4 className="text-sm text-gray-500">
            {dealers.length === 0 ? `No dealers found for "${currentLocation}"` : `${dealers.length} results found for "${currentLocation}"`}
          </h4>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center">
          <img src="icons/loading.svg" alt="loading" className="w-10 h-10" />
        </div>
      )}
    </div>
  );
};

export default DealerList;
