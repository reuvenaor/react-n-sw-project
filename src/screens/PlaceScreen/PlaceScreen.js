
import {images} from '../../../assets/index';
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import MapView, { Callout } from 'react-native-maps';
import ImageGradient from 'react-native-image-gradient';
import { connect } from 'react-redux';
import { deletePlace, fsbShare } from '../../store/actions/actions';
import { ShareDialog } from 'react-native-fbsdk';
const FBSDK = require('react-native-fbsdk');
const {
  ShareApi,
} = FBSDK;
import UIbutton from '../../components/UIbutton/UIbutton';

import mapNight from '../../../assets/mapNight.json';

class Place extends Component {

constructor(props) {
  super(props);
  mapStyle = mapNight;
  this.placeDeletedHandler = this.placeDeletedHandler.bind(this);
  this.goBack = this.goBack.bind(this);
  this.shareLinkWithShareDialog = this.shareLinkWithShareDialog.bind(this);
}

  componentDidMount() {
    BackHandler.addEventListener('placeBackPress', this.goBack );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('placeBackPress', this.goBack );
  }

  goBack = () => {
    Navigation.pop('catalogueScreen');
  }

  placeDeletedHandler = () => {
    this.props.onDeletePlace(
      this.props.place,
      this.props.country,
      this.props.track 
    );
    Navigation.pop('catalogueScreen');
  }

  shareLinkWithShareDialog = () => {
    this.props.onFsbShare(this.props.place.image.uri, this.props.place.name);
  }


  render() {
    let place = {name: '', image: '', location: { latitude: 1, longitude: 1}};
    if (this.props.place) {
      place = this.props.place;
    }
    return (
      <View style={styles.container}>
        <MapView
            initialRegion={{
              ...place.location,
              latitudeDelta: 0.005,            
              longitudeDelta: 0.005 * (Dimensions.get('window').width / Dimensions.get('window').height) 
            }}
            style={styles.map}
            cacheEnabled={true}
            liteMode={true}
            customMapStyle={mapStyle}
          >
            <MapView.Marker coordinate={place.location}/>
        </MapView>
        <Callout style={styles.calloutViewSnap}>
          <View>
            <Text style={styles.placeName}>{place.name}</Text>
          </View>
          <ImageGradient 
                mainStyle={styles.placeImage}
                // gradientStyle={styles.placeImage}
                imageUrl={place.image.uri}
                startPosition ={{x:0,y:0}}
                // endPosition={{x: 1, y: 1}}
                rgbcsvStart={'0,0,0'}
                rgbcsvEnd={'0,0,0'}
                opacityStart={1.0}
                opacityEnd={0.0}
          >
            <TouchableOpacity onPress={this.shareLinkWithShareDialog} style={styles.fsIconView}>
              <Image source={images.FSBICON} style={styles.fsIcon}></Image>
            </TouchableOpacity> 
          </ImageGradient>

          <UIbutton onPress={this.placeDeletedHandler} style={styles.viewButton} >
              DELETE
          </UIbutton>

          
        </Callout>    
      </View> 
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: "transparent"
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  viewButton: {
    borderStyle: "solid",     
    borderColor: "red",
    borderWidth: 1,
    padding: 2,
    margin: 5,
    width: "50%",
    alignItems: "center",    
    alignSelf: "center"       
  },
  map: {
    width: '100%',
    height: '100%' 
  },
  calloutViewSnap: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    width: '100%',
    height: '50%',
    backgroundColor: "transparent"
  },
  fsIcon: {
    height: '100%',
    width: '100%',
  },
  fsIconView: {
    // flex:1,
    height: '7%',
    width: '14%',
    alignSelf: 'flex-end',
    marginBottom: '60%',
    marginRight: '5%'   
  }
});

mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: (key, country, track) => dispatch(deletePlace(key, country, track)),
    onFsbShare: (image, name) => dispatch(fsbShare(image, name))
  }
};

export default connect(null, mapDispatchToProps)(Place);
