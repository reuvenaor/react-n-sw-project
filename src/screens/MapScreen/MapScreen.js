import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Image, AsyncStorage, BackHandler } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {connect } from 'react-redux';
import { addTrackStore } from "../../store/actions/actions";

import mapBrown from '../../../assets/mapBrown.json';
import mapNight from '../../../assets/mapNight.json';
import mapRetro from '../../../assets/mapRetro.json';

import { images } from '../../../assets/index';

md5 = require('js-md5');

import MapView, {          
  Marker, 
  AnimatedRegion, 
  Polyline, 
  PROVIDER_GOOGLE, 
  Callout,
} from 'react-native-maps';  

import haversine from "haversine";

import UIbutton  from '../../components/UIbutton/UIbutton';
import UIinput from '../../components/UIinput/UIinput';
import UItextL from '../../components/UItextL/UItextL';

const LATITUDE = 32.9137015;
const LONGITUDE = 35.2771061;
const LATITUDE_DELTA = 0.005;


class MapScreen extends Component {

  state = {
    /* location for Track, Poli, Track Mraker */
    latitude: LATITUDE,
    longitude: LONGITUDE,
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: {},
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE
    }),
    /* location for Marker Places */          
    focusedLocation: {
      latitude: LATITUDE,      
      longitude: LONGITUDE,    
      latitudeDelta: LATITUDE_DELTA,            
      longitudeDelta: LATITUDE_DELTA  * (Dimensions.get('window').width / Dimensions.get('window').height)         
    },
    locationChosen: false,
    markerArray: [],
    markersCoords: [],
    tracked: true,
    isTrackNamed: false,
    trackName: ''

  }

  constructor(props) {
    super(props);  
    mapStyle = mapNight;
    this.startTrack = this.startTrack.bind(this);
    this.pushSharePlaceScreen = this.pushSharePlaceScreen.bind(this);
    this.setTrackName = this.setTrackName.bind(this);
    this.pickLocationHandler = this.pickLocationHandler.bind(this);
    this.shareTrack = this.shareTrack.bind(this);
    this.stopTrack = this.stopTrack.bind(this);
    this.pushCatalogueScreen = this.pushCatalogueScreen.bind(this);
    this.pushUserScreen = this.pushUserScreen.bind(this);
    this.goBack = this.goBack.bind(this);
    }

  componentWillMount() {
    BackHandler.addEventListener('mapBackPress', () => true );
    navigator.geolocation.getCurrentPosition(
      position => {},
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000
      }
    );
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('mapBackPress', () => true );
    this.stopTrack();
  }

  goBack = () => {
    Navigation.popTo('authScreen');
  }

  startTrack = () => {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        if (Platform.OS === "android") {
          if (this.marker && this.state.tracked) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
          distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    alert('Tracking location start');
  }
  
  stopTrack = () => {
    navigator.geolocation.clearWatch(this.watchID);
    this.setState( prevState => {
      return {
        ...prevState,
        tracked: prevState.tracked === true ? false : true
      };
    });
    alert('Tracking location stop');
    this.shareTrack();
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA  * (Dimensions.get('window').width / Dimensions.get('window').height)
  });

//////////////////////////// Marker Place ///////////////////////////////////////// 

  pushSharePlaceScreen = (coords) => {
    Navigation.push('sharePlaceScreen', {
      component: {
        name: 'traking.SharePlaceScreen',
        passProps : {
          selectedLocation : coords.nativeEvent.coordinate,
          trackName: this.state.trackName
        }
      }
    });
  }

  // MARKPLACE
  // event.nativeEvent.coordinate to get longitude and latitude
  pickLocationHandler = event => {
    // the coordinate we got from onPress
    const coords = event.nativeEvent.coordinate;
    // Center the map due to marker mark
    this.map.animateToRegion({     
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: this.state.focusedLocation.latitudeDelta,
        longitudeDelta: this.state.focusedLocation.longitudeDelta
    });

    // save new coordinates in the state - focusedLocation
    this.setState( prevState => {
      return {
        ...prevState,
        focusedLocation: {
          ...prevState.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        markersCoords: prevState.markersCoords.concat(/* {name: '123', markersCoords:  */coords/* } */),
        locationChosen: true,
        markerArray: prevState.markerArray.concat((
          <MapView.Marker
            coordinate={coords} 
            title={'Pic & Share'}
            key={(coords.latitude + coords.longitude).toFixed(2)}
            onPress={this.pushSharePlaceScreen}
            image={images.MARKPLACE}   
          />
        ))
      };
    });
  }

  ///////////////////////////////////////////////////////////////////////////////

  shareTrack = () => {
    // 'takeSnapshot' takes a config object with the
    // following options
    let image;
    const snapshot = this.map.takeSnapshot({
      width: 300,      // optional, when omitted the view-width is used
      height: 300,     // optional, when omitted the view-height is used
      format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
      quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
      result: 'base64'   // result types: 'file', 'base64' (default: 'file')
    });
    snapshot
    .then(uri => {
      this.props.onAddTrack(uri, this.state.markersCoords, this.state.routeCoordinates);
    })
    .then(() => {
      Navigation.push('shareTrackScreen', {
        component: {
          name: 'traking.ShareTrackScreen',
        }
      });     
    });
  };

  pushCatalogueScreen = () => {
    Navigation.push('catalogueScreen', {
      component: {
        name: 'traking.CatalogueScreen',
      }
    }); 
  }

  setTrackName = () => {
    if (!this.state.isTrackNamed) {
      if(this.state.trackName.trim() !== '') {         
        AsyncStorage.setItem("ap:auth:trackName", this.state.trackName);
        this.setState({isTrackNamed: true});
        this.startTrack(); 
      }
    }
  };

  updateInputState = (val) => {
    this.setState({trackName: val});
  }

  pushUserScreen = () => {
    Navigation.push('userScreen', {
      component: {
        name: 'traking.UserScreen',
      }
    });
  }

  render() {
      let nameTrack = null;
      if (!this.state.isTrackNamed) {
        nameTrack = <Callout style={styles.calloutViewSnap}>
                          <View style={styles.calloutViewShare}>
                            <View style={styles.viewSnapItems}> 
                              <UIinput 
                                placeholder='Track name..'
                                style={styles.input}
                                value={this.state.trackName}
                                onChangeText={val => this.updateInputState(val)}
                                valid={true}
                                touched={true}/>
                            </View>
                            <View style={styles.viewSnapItems}>
                              <UIbutton onPress={this.setTrackName}>
                                Start
                              </UIbutton>
                            </View>
                          </View>
                      </Callout>    
      } else {
        nameTrack = <Callout style={styles.calloutTrackName}>
                      <UItextL style={styles.trackName}>
                        {this.state.trackName}
                      </UItextL>
                    </Callout>
      }
      return (
        <View style={styles.container}>
          <MapView provider={PROVIDER_GOOGLE}
            showUserLocation
            followUserLocation
            loadingEnabled
            mapType={'hybrid'} //   "standard","satellite","hybrid","terrain"
            showsCompass={true}
            customMapStyle={mapStyle}
            region={this.getMapRegion()}              
            onPress={this.pickLocationHandler} 
            style={styles.map}
            ref={ ref => this.map = ref } 
          >
            {this.state.markerArray}

            <Polyline
              coordinates={this.state.routeCoordinates}
              strokeWidth={5}
              strokeColor={'rgba(255, 200, 90, 0.7)'}
              />
            <Marker.Animated 
              ref = { marker => this.marker = marker}
              coordinate={this.state.coordinate}
              image={images.MARKSTART} />
          </MapView>
          
          <Callout style={styles.calloutView}>
            <UIbutton
              style={styles.buttons}
              onPress={this.startTrack}
            > 
              <UItextL>Start</UItextL>
            </UIbutton>
            <UIbutton
              style={styles.buttons}
              onPress={this.stopTrack}
            > 
              <UItextL>Stop</UItextL>
            </UIbutton>
            <UIbutton
              style={styles.buttons}
            >
              <UItextL>{parseFloat(this.state.distanceTravelled).toFixed(2)} km</UItextL>
            </UIbutton>
            <View style={{flex: 1}}></View>
            <UIbutton
              style={styles.buttons}
              onPress={this.shareTrack}
            > 
              <UItextL>Share</UItextL>
            </UIbutton>
            <UIbutton
              style={styles.buttons}
              onPress={this.pushCatalogueScreen}
            >  
              <UItextL>Places</UItextL>
            </UIbutton>
          </Callout>

            {nameTrack} 
            
        </View>
      );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',   
    alignItems: 'center',           
    alignContent: 'space-between',

  },
  map: {
    width: '100%',
    height: '100%'
  },
  buttons: {
    flex:1,
    width: '100%',
  },
  imageView: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black"
  },
  calloutView: {
    flex: 1,
    alignSelf:  'flex-start',
    alignContent: 'center',
    justifyContent: 'center',   
    alignItems: 'center', 
    height: '40%',
    borderRadius: 10,
    width: "20%",
    marginLeft: "3%",
    marginTop: '10%',
    backgroundColor: "transparent"
  },
  calloutViewSnap: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  calloutTrackName: {
    width: '30%',
    height: '10%',
    alignSelf: 'center',
    marginTop: '10%',
    marginLeft: '35%',
    marginRight: '35%',
  },
  calloutViewShare: {
    justifyContent: 'center',   
    alignItems: 'stretch',           
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: '10%',
    width: '80%',
    height: '20%'
  },
  viewSnapItems: {
    flex: 1
  },
  input: {
    backgroundColor: "#eee",
    borderColor: "#bbb",
    width: '98%'
  },
  trackName: {
    color: 'rgba(200,200,200,0.7)',
    textShadowColor: 'black',
    textShadowOffset : {
      width: 3,
      height: 3,
    },
    textShadowRadius: 5
  }
});

const mapDispatchToProps = dispatch => {
  return {
      onAddTrack: (image, markers, routes) => dispatch(addTrackStore(image, markers, routes)),
  };
}

export default connect(null, mapDispatchToProps)(MapScreen); 
