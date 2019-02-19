import React from 'react';
import UIinput  from '../UIinput/UIinput';

const placeInput = props => (
  <UIinput
    placeholder="Place Name"
    value={props.placeData.value}
    valid={props.placeData.valid}
    touched={props.placeData.touched}

    onChangeText={props.onChangeText}
  />
);


export default placeInput;
