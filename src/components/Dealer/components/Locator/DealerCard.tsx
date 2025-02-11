import formatPhoneNumber from '../../PhoneNumberFormatter';
import Fees from './Fees';
import Schedules from './Schedules';
import './assets/styles.scss';

export default function DealerCard(props: any): any {
  const { dealer, index, selectDealer, handleActiveDealer } = props;

  const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: dealer.phone_number });

  const handleSelect = () => selectDealer({
      firstName: dealer.business_name,
      lastName: dealer.license,
      phone: formattedDealerPhoneNumber,
      company: `${dealer.business_name} - ${dealer.license}`,
      address1: dealer.premise_street,
      address2: '',
      addressFormatted: `${dealer.business_name} | ${dealer.license}<br/>${formattedDealerPhoneNumber}<br/>${dealer.premise_street}<br/>${dealer.premise_city}, ${dealer.premise_state} ${dealer.premise_zip} / United States`,
      city: dealer.premise_city,
      stateOrProvinceCode: dealer.premise_state,
      shouldSaveAddress: false,
      postalCode: dealer.premise_zip,
      localizedCountry: 'United States',
      countryCode: 'US',
      fflID: dealer.license
  });

  return (
    <div onMouseEnter={() => handleActiveDealer(dealer)} className={`dealer-card${dealer.preferred?' preferred':''} relative bg-white overflow-hidden m-2 border border-l-4 rounded-md transition-all duration-700 cursor-pointer shadow-sm hover:shadow-lg ${dealer.preferred?'border-l-preferred hover:border-preferred':'border-l-primary hover:border-primary'}`} onClick={handleSelect}>
      <div className={`absolute w-12 px-4 py-1 rounded-br-md mt-0 r-0 font-bold text-center text-lg ${dealer.preferred?'bg-preferred':'bg-primary text-white'}`}>{index + 1}</div>
      <div className='py-4 pl-16 pr-10'>
        <div className="locator-modal-dealer-content">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{dealer.business_name}</span>
            {dealer.preferred && <div className="text-preferred text-sm whitespace-nowrap block">PREFERRED<span className="hidden 2xl:contents"> DEALER</span></div>}
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
