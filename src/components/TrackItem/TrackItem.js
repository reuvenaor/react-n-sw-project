import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PlaceList from '../PlaceList/PlaceList';

class TrackItem extends Component {

  constructor(props) {
    super(props);  
    this.selectedPlaceHandler = this.selectedPlaceHandler.bind(this);
   }

  selectedPlaceHandler = key => {
    const trackName = this.props.trackName;
    let placesArray = [];
    if (this.props.places) {
      for (let k in this.props.places) {
        if (this.props.places[k]) {
          placesArray.push({
            ...this.props.places[k],
            image: {                           
              uri: this.props.places[k].image
            },
            key: k 
          });
        }
      };
    }
    selPlace = placesArray.find(place => {
            return place.key === key
    });
    this.props.onPlaceSelect(selPlace, trackName);            
  } 

  render() {
    let places = null;
    let placesArray = [];
    if (this.props.places) {
      for (let key in this.props.places) {
        if (this.props.places[key]) {
          placesArray.push({
            ...this.props.places[key],
            image: {                            
              uri: this.props.places[key].image
            },
            key: key
          });
        }
      };
      
      places = (
        <View>
          <Text> Places </Text>
          <PlaceList 
            places={placesArray}
            onItemSelected={this.selectedPlaceHandler}
          />
        </View>
      );
    };
    return (
      <View style={styles.bubbles}>
        <TouchableOpacity onPress={this.props.onItemPressed}>
          <View style={styles.PlaceItem}>
            <Image resizeMode='cover' 
              source={this.props.trackImage}
              style={styles.placeImage} />
            <Text>{this.props.trackName}</Text>
          </View>
        </TouchableOpacity> 

        {places} 
      </View>
  )
}};

const styles = StyleSheet.create({
  PlaceItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    elevation: 1
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
      borderBottomWidth: 1,
      borderBottomColor: "black",
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowRadius: 2,
      shadowOpacity: 0.5,

  }
});

export default TrackItem;
