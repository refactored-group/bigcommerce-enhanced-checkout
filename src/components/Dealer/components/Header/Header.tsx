import React from 'react';

interface HeaderProps {
    handleCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Header: React.FC<HeaderProps> = ({ handleCancel }) => {
    return (
        <>
            <div className="flex m-4">
              { handleCancel && <button className="locator-button" onClick={ handleCancel }>
                <img src="./icons/close.svg" alt="Automatic FFL" className="w-5 mx-auto" />
              </button>}
              <img src="./logo-automaticffl.png" alt="Automatic FFL" className="w-32 mx-auto" />
            </div>
            <div className="text-center">
              <p className="font-bold text-primary">FIND YOUR DEALER</p>
              <span>Use the options below to search for a dealer near you.</span>
            </div>
        </>
    );
};

export default Header;