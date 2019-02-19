import React from 'react';
import { Dimensions, Text, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;

const UItextL = props => { 
    if ( width < 400 ) { 
        return (
            <Text 
                style={[styles.smallFont, styles.mainText,{...props.style}]}>
                {props.children}
            </Text>
        );
    }
    else {
        return (
            <Text 
                style={[styles.largeFont, styles.mainText,{...props.style}]}>
                {props.children}
            </Text>
        );
    }
}
const styles = StyleSheet.create({
    mainText: {
        backgroundColor: "transparent",
        fontFamily: "VarelaRoundRegular",
        textAlign: 'center'
    },
    smallFont: {
        fontSize: 16
    },
    largeFont: {
        fontSize: 20
    }
});

export default UItextL;
