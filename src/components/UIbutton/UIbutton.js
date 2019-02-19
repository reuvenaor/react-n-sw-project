
import React from 'react';
import { TouchableOpacity,
        TouchableNativeFeedback,
        Platform,
        Text,
        View, 
        StyleSheet } from 'react-native';

const UIbutton = props => {
    const buttonContent = (
        <View style={[
            {...props.style},
            styles.button, 
            props.disabled ? styles.disabled : null
        ]}>
            <Text style={[
                {fontSize: props.fontSize || 18, textAlign: 'center'},
                props.disabled ? styles.disabledText : null
            ]}>
                {props.children}
            </Text>
        </View>     
    );
    if (props.disabled) {   
        return buttonContent;         
    }
    
    if (Platform.OS === 'android' ) {
        return (
            <TouchableNativeFeedback onPress={props.onPress} >
                {buttonContent}
            </TouchableNativeFeedback>
        );
    } else {
        return (
            <TouchableOpacity onPress={props.onPress}>
                {buttonContent}
            </TouchableOpacity>
        );
    }
};


const styles = StyleSheet.create({
    button: {
        backgroundColor: "rgba(200, 200, 200, 0.7)",
        justifyContent: 'center',
        flexDirection: "row",
        padding: 5,
        margin: 5,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "black",
        elevation: 2
    },
    disabled: {
      backgroundColor: "#eee",
      borderColor: "#aaa"
    },
    disabledText: {
      color: "#aaa"
    }
});

export default UIbutton;
