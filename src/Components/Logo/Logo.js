import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import Engine from './engine.png';

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 100, width: 100 }} >
        <div className="Tilt-inner">
          <img style={{paddingTop: '5px'}} src={Engine} alt='logo'/>
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;