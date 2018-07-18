import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onPictureSubmit}) => {
  return (
    <div>
      <p className='f3 white'>
        {'This Magic Engine will detect faces in your pictures. Give it a try!'}
      </p>
      <div className='center'>
        <div className='form center pa4 br3 shadow-5 carbon-bg'>
          <input className='f4 pa2 w-70 center' type='text' onChange={ onInputChange } />
          <button
            className='w-30 f4 link ph3 pv2 dib white grow pointer bg-light-purple'
            onClick={ onPictureSubmit }>
            Detect
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;