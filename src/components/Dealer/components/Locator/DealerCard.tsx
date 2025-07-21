import { useRef, useEffect } from 'react';
import formatPhoneNumber from '../../PhoneNumberFormatter';
import Fees from './Fees';
import Schedules from './Schedules';
import './assets/styles.scss';
import { DealerCardProps } from './types';

export default function DealerCard(props: DealerCardProps): JSX.Element {
  const { dealer, index, handleActiveDealer, setActiveDealer } = props;
  let isActive = dealer === setActiveDealer;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      });
    }
  }, [isActive]);

  const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: dealer.phone_number });

  return (
    <div 
      ref={cardRef}
      onClick={() => handleActiveDealer(dealer)} 
      className={`dealer-card${dealer.preferred?' preferred':''} scroll-mt-8 snap-center relative bg-white overflow-hidden m-6 border rounded-md transition-all duration-700 cursor-pointer hover:shadow-lg ${isActive?`active shadow-lg border-${dealer.preferred?'secondary':'primary'}`:'shadow-sm'}`}
    >
      <div className={`absolute w-12 px-4 py-1 rounded-br-md mt-0 r-0 font-bold text-center text-lg text-white ${dealer.preferred?'bg-secondary':'bg-primary'}`}>{index + 1}</div>
      <div className='py-4 pl-16 pr-10'>
        <div className="locator-modal-dealer-content">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{dealer.business_name}</span>
            {dealer.preferred && <div className="px-1 py-0.5 bg-preferred-light border rounded text-preferred border-preferred text-xs whitespace-nowrap inline-block ml-2">Preferred <span className='hidden sm:inline'>Dealer</span></div>}
          </div>
          <div className="text-gray-500 mt-1">{`${dealer.premise_street}, ${dealer.premise_city}, ${dealer.premise_state} ${dealer.premise_zip}`}</div>
          <a href={`tel:${dealer.phone_number}`} className="text-blue-500 mt-1">{formattedDealerPhoneNumber}</a>
          <Fees fees={dealer.fees} />
          <Schedules schedules={dealer.schedules} />
        </div>
      </div>
    </div>
  )
}
