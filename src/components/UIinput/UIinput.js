import React from 'react';
import {TextInput, StyleSheet } from 'react-native';

const UIinput = props => (
    <TextInput 
        {...props}              
        style={[styles.input,                   
            props.style,         
            !props.valid && props.touched ? styles.invalid : null]}   
    />                         
);

const styles = StyleSheet.create({
    input: {
      flex: 1,
      width: "98%",
      borderWidth: 1,
      borderColor: "#eee",
      borderRadius: 2,
      padding: 5,
      margin: 3,
      opacity: 0.8,
      elevation: 1
    },
    invalid: {
      backgroundColor: '#f9c0c0',
      borderColor: "red"
    }
  });
  
  export default UIinput;

