// @ts-nocheck
import React from 'react';
import Header from './components/Header/Header';
import LocatorMap from './components/LocatorMap/LocatorMap';
import DealerCard from './components/Locator/DealerCard';
import dealers from './dealer.json';
import Search from './components/Search/Search';

interface LocatorProps {
  storeHash: any;
  showLocator: any;
  handleCancel: any;
  selectDealer: any;
  googleMapsApiKey: any;
}

interface LocatorState {
  dealers: any;
  location: any;
  radius: any;
  miles: any;
  announcement: any;
  showToast: any;
}

export default class Locator extends React.PureComponent<LocatorProps, LocatorState> {

  constructor(props: any) {
    super(props);

    this.state = {
      dealers: [],
      searched: false,
      loading: false,
      location: "",
      currentLocation: "",
      radius: 5,
      miles: [5, 10, 30, 75],
      showToast: true,
      activeDealer: null
    };

    // this.state = {
    //   dealers: dealers.dealers,
    //   location: "",
    //   currentLocation: "7005",
    //   searched: true,
    //   loading: false,
    //   miles: [5, 10, 30, 75],
    //   activeDealer: null
    // };

    this.handleSearch = this.handleSearch.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeRadius = this.onChangeRadius.bind(this);
    this.onHandleKeypress = this.onHandleKeypress.bind(this);
    this.hideToast = this.hideToast.bind(this);
    this.handleActiveDealer = this.handleActiveDealer.bind(this);
  }
  handleSearch(): void {
    const { location, radius } = this.state;

    if (location && radius) {
      this.setState({loading: true, currentLocation: location});
      fetch(`https://${process.env.REACT_APP_HOST}/store-front/api/${this.props.storeHash}/dealers?location=${location}&radius=${radius}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          dealers: data.dealers
        });
      })
      .finally(() => this.setState({searched: true, loading: false}))
      .catch(console.log);
    }
  }

  handleActiveDealer(dealer): void {
    this.setState({ activeDealer: dealer });
  }

  onChangeLocation(event: any): void {
    this.setState({ location: event.target.value });
  }

  onChangeRadius(event: any): void {
    this.setState({radius: event.target.value});
  }

  onHandleKeypress(event: any): void {
    if (event.charCode === 13) {
      this.handleSearch();
    }
  }

  hideToast(event: any): void {
    this.setState({ showToast: false });
  }

  componentDidMount() {
    this.handleSearch();
  }

  render() {
    const { handleCancel, selectDealer } = this.props;
    return (
      <div className={`flex h-screen bg-gray-50 ${this.props.showLocator?'show-locator':''}`}>
        <div className="w-1/3 flex flex-col">
          <div>
            <Header handleCancel={ handleCancel } />
            <Search location={this.state.location} miles={this.state.miles} onChangeLocation={this.onChangeLocation} onHandleKeypress={this.onHandleKeypress} onChangeRadius={this.onChangeRadius} handleSearch={this.handleSearch}/>
          </div>
          
          <div className="scrollbar flex-1 overflow-y-auto locator-modal-content">
            { !this.state.loading && this.state.dealers.map((dealer: any, index: number) => (
                <DealerCard
                  key={ `${dealer}${index}` }
                  dealer={ dealer }
                  index={ index }
                  selectDealer={ selectDealer }
                  handleActiveDealer={ this.handleActiveDealer } />
            )) }
            {this.state.searched && !this.state.loading &&
              (
                <div className="text-center">
                  <h4 className="text-sm text-gray-500">
                    {
                      this.state.dealers.length === 0 ?
                      `No dealers found for "${this.state.currentLocation}"` :
                      `${this.state.dealers.length} results found for "${this.state.currentLocation}"`
                    }
                  </h4>
                </div>
              )
            }
            {
              this.state.loading &&
              (
                <div className="flex justify-center items-center">
                  <img src="icons/loading.svg" alt="loading" className="w-10 h-10" />
                </div>
              )
            }
          </div>
        </div>
        <div className="flex-1 locator-modal-map">
          <div className="w-full h-full locator-modal-map-wrapper">
            <div className='w-3 h-full absolute bg-gradient-to-r from-gray-300 to-transparent z-20'></div>
            <LocatorMap apiKey={ this.props.googleMapsApiKey } dealers={ this.state.dealers } selectDealer={ selectDealer } setActiveDealer={ this.state.activeDealer } />
          </div>
          {
            (this.props.announcement && this.state.showToast) &&
            <div className="locator-toast-box">
              <div className="locator-toast-close">
                <a onClick={ this.hideToast } className="white-text">X</a>
              </div>
              <div className="locator-toast-text">
               { this.props.announcement }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
