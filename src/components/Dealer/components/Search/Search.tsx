import React from 'react';

interface SearchProps {
    location: string;
    miles: number[];
    onChangeLocation: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onHandleKeypress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onChangeRadius: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSearch: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Search: React.FC<SearchProps> = ({ location, miles, onChangeLocation, onHandleKeypress, onChangeRadius, handleSearch }) => {
    return (
        <div className='flex m-auto justify-center items-center'>
            <div className='flex group overflow-hidden my-4 rounded-full hover:shadow-lg'>
                <input
                    value={ location }
                    onChange={ onChangeLocation }
                    placeholder="zip code, city, or FFL"
                    onKeyPress={ onHandleKeypress }
                    className="px-4 py-2 border border-r-0 rounded-l-full transition duration-300 outline-0 focus:ring-0 group-hover:border-hover"
                />
                <div>
                    <select onChange={ onChangeRadius } className="h-full bg-white text-gray-500 font-bold outline-0 border-y transition duration-300 focus:ring-0 cursor-pointer hover:text-primary group-hover:border-hover">
                    { miles.map((mile: any) => (
                        <option key={ mile } value={ mile }>{ mile } MILES</option>
                    )) }
                    </select>
                </div>
                <div className="w-4 bg-white border-y transition duration-300 group-hover:border-primary"></div>
                <button className="locator-button bg-primary border border-l-0 rounded-r-full transition duration-300 outline-0 focus:ring-0 group-hover:border-hover group-hover:bg-hover" onClick={ handleSearch } disabled={ false }>
                    <img src="icons/search.svg" alt="search" className="w-6 h-6 ml-3 mr-5" />
                </button>
            </div>
        </div>
    );
};

export default Search;