import formatPhoneNumber from './../../PhoneNumberFormatter';

export const handleSelect = (dealer: any, selectDealer: any) => {
  const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: dealer.phone_number });

  selectDealer({
    firstName: dealer.business_name,
    lastName: dealer.license,
    phone: formattedDealerPhoneNumber,
    company: `${dealer.business_name} - ${dealer.license}`,
    address1: dealer.premise_street,
    address2: '',
    addressFormatted: `${dealer.business_name} | ${dealer.license}<br/>${formattedDealerPhoneNumber}<br/>${dealer.premise_street}<br/>${dealer.premise_city}, ${dealer.premise_state} ${dealer.premise_zip} / United States`,
    city: dealer.premise_city,
    stateOrProvinceCode: dealer.premise_state,
    shouldSaveAddress: true,
    postalCode: dealer.premise_zip,
    localizedCountry: 'United States',
    countryCode: 'US',
    fflID: dealer.license,
  });
};

export const onMarkerClick = (dealer: any, map: any, setState: any) => {
  const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: dealer.phone_number });

  setState({
    activeDealer: dealer,
    activeDealerPhone: dealer.phone_number,
    activeDealerPhoneFormatted: formattedDealerPhoneNumber,
    showingInfoWindow: true,
  });

  map.panTo({ lat: dealer.lat, lng: dealer.lng });
};
