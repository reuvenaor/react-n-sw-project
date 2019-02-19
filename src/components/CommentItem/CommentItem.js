import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommentItem = props => (
    <View style={styles.PlaceItem}>
      <Text style={{flex: 1}}>user: {props.userName}</Text>
      <Text style={{flex: 1}}> comment: {props.comment}</Text>
    </View>
);

const styles = StyleSheet.create({
  PlaceItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "black",

  }
});

export default CommentItem;
