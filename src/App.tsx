import './App.css';
import Locator from './components/Dealer/Locator';

const App = () => {
  const handleCancel = () => {
    if (window.parent) {
      window.parent.postMessage({ type: 'closeModal', value: true}, '*');
    }
  };

  const selectDealer = (dealer: any) => {
    if (window.parent) {
        window.parent.postMessage({ type: 'dealerUpdate', value: dealer}, '*');
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const storeHash = urlParams.get('store_hash');
  const googleMapsApiKey = urlParams.get('maps_api_key');
  const platform = urlParams.get('platform');

  if (!storeHash || !platform || platform !== 'BigCommerce') {
    return <p>Unable to load the Automatic FFL Dealers. Please review your settings or contact support.</p>
  }

  if (platform !== 'BigCommerce' && !googleMapsApiKey) {
      return <p>The Google Maps API is missing. Please check your integration settings or ensure the API is properly configured.</p>
  }

  return (
    <Locator
      showLocator={true}
      storeHash={storeHash}
      googleMapsApiKey={googleMapsApiKey}
      handleCancel={platform === 'BigCommerce' ? null : handleCancel}
      selectDealer={selectDealer}
    />
  );
};

export default App;