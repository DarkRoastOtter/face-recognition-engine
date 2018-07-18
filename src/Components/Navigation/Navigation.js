import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if(isSignedIn) {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p
          onClick={() => onRouteChange('signOut')}
          className='f3 link dim white underline pa3 pointer'>Sign Out</p>
        </nav>
      );
    } else {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p
          onClick={() => onRouteChange('signIn')}
          className='f3 link dim white underline pa3 pointer'>Sign In</p>
          <p
          onClick={() => onRouteChange('register')}
          className='f3 link dim white underline pa3 pointer'>Register</p>
        </nav>
      );
    }
}

export default Navigation;

// Was giving errors because JSX needs as single parent element (the <nav>), as a result, this caused an error. The fix was we only needed a single <nav> element, what we really wanted was the <p> tag links.