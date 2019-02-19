import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import TrackItem from '../TrackItem/TrackItem';

const trackList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      scrollEnabled={true}
      data={props.tracks}           
      renderItem={(info) => (
        <TrackItem
          trackName={info.item.name}
          mainImage={info.item.image}
          trackImage={info.item.imageTrack}
          userName={info.item.userName}
          extraInfo={info.item.extraInfo}
          coords={info.item.coords}
          coordinates={info.item.coordinates}
          places={info.item.places}
          onPlaceSelect={(selPlace, trackName) => props.onPlaceSelected(selPlace, trackName)}
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

export default trackList;
