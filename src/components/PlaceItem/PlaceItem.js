import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import CommentsList from '../CommentsList/CommentsList';

class PlaceItem extends Component {
  render() {
    let comments = null;
    let commentsArray = [];
    if (this.props.placeComments) {
      for (let key in this.props.placeComments) {
          commentsArray.push({
              ...this.props.placeComments[key],
              key: key
          });
      };
      comments = (
        <View>
          <Text> Comments </Text>
          <CommentsList comments={commentsArray}/>
        </View>
      );
    };
    return (
      <View style={styles.bubbles}>
        <TouchableOpacity onPress={this.props.onItemPressed}>
          <View style={styles.PlaceItem}>
            <Image resizeMode='cover' source={this.props.placeImage} style={styles.placeImage} />
            <Text>{this.props.placeName}</Text>
          </View>
        </TouchableOpacity> 
        {comments} 
      </View>
  )
}};

const styles = StyleSheet.create({
  PlaceItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  placeImage: {
      marginRight: 8,
      height: 30,
      width: 30
  },
  bubbles: {
      flex: 1,
      height: '100%',
      padding: 5,
      margin: 5,
      borderRadius: 5,
      borderBottomWidth: 0,
      borderBottomColor: "black",
      elevation: 1
  }
});

export default PlaceItem;
