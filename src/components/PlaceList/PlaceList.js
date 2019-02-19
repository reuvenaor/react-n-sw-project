import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import PlaceItem from '../PlaceItem/PlaceItem';

const placeList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      scrollEnabled={true}
      data={props.places}           
      renderItem={(info) => (
        <PlaceItem
          placeName={info.item.name}
          placeImage={info.item.image}
          placeComments = {info.item.comments}
          onItemPressed={() => props.onItemSelected(info.item.key)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default placeList;
