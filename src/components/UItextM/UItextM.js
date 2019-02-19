
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const UItextM = props => (
    <Text style={styles.text}>{props.children}</Text>
);

const styles = StyleSheet.create({
    text: {
        color: "grey",
        backgroundColor: "transparent"
    }
});

export default UItextM;