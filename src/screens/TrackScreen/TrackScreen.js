import React, { Component } from 'react';
import { images } from '../../../assets/index';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import MapView, {Polyline, Marker, Callout } from 'react-native-maps';
import { connect } from 'react-redux';
import { fsbShare } from '../../store/actions/actions';
import { ShareDialog } from 'react-native-fbsdk';
const FBSDK = require('react-native-fbsdk');
const {
  ShareApi,
} = FBSDK;
import ImageGradient from 'react-native-image-gradient';
import { Dropdown } from 'react-native-material-dropdown';
import mapNight from '../../../assets/mapNight.json';


class TrackScreen extends Component {

  state = {
      placeList: []
  };

  constructor(props) {
      super(props);
      mapStyle = mapNight;
      this.placesArray = [];
      this.onSelectedPLace = this.onSelectedPLace.bind(this);
      this.goBack = this.goBack.bind(this);
      this.shareLinkWithShareDialog = this.shareLinkWithShareDialog.bind(this);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('trackBackPress', this.goBack );
  }

  goBack = () => {
      Navigation.pop('catalogueScreen');
  }


  componentDidMount() {
    BackHandler.addEventListener('trackBackPress', this.goBack );
    let data = [];
    if (this.props.track) {
      for (let place in this.props.track.places) {
        if (this.props.track.places[place]) {
          data.push({value: place});
          this.placesArray.push({
            ...this.props.track.places[place],
            image: {                            
              uri: this.props.track.places[place].image
            },
            key: place
          });
        }
      }
      this.setState({placeList: data});
    } 
  }

  onSelectedPLace = place => {
    let coords = { latitude: 40, longitude: 30 };
    for (let i in this.props.track.places) {
      if ( i == place) {
        coords = this.props.track.places[i].coords;
        this.map.animateToRegion({     // use the saved component ref and call his function - animateToRegion
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003 * (Dimensions.get('window').width / Dimensions.get('window').height)
        });
        // this.markersRef[place].opacity = 1;
      }
    }
  }

  shareLinkWithShareDialog = () => {
    this.props.onFsbShare(this.props.track.imageTrack.uri, this.props.track.imageTrack.extraInfo);
  }

  render() {
    let routeArray;
    let markerArray;
    if (this.placesArray) {
      markerArray = this.placesArray.map(place => {
        return (
          <Marker
            coordinate={place.coords}
            // title={place.name}
            key={(place.coords.latitude + place.coords.longitude).toFixed(2)}
            image={images.MARKPLACE}   
            showCallout
            // ref={ ref => this.markersRef[place] = ref }
            opacity={0.7}
            style={styles.marker}
          >
          </Marker>
        );
    });

  }
  if (this.props.track) {
    let marker;
    routeArray = this.props.track.coordinates.map(route => {
      marker = images.MARKROUTE;
      if (this.props.track.coordinates[0] === route) {
        marker = images.MARKSTART;
      } 
      if (this.props.track.coordinates[this.props.track.coordinates.length -1] === route) {
        marker = images.MARKEND;
      }
      return (
        <Marker
          coordinate={route}
          // title={place.name}
          key={(route.latitude + route.longitude).toFixed(2)}
          image={marker}    
          showCallout
          // ref={ ref => this.markersRef[place] = ref }
          opacity={0.7}
          style={styles.marker}
        >
        </Marker>
      );
    });
  }
    if(this.props.track) {
      return (
        <View
          style={styles.container}>
          <MapView
            initialRegion={{
              ...this.props.track.coordinates[0],
              latitudeDelta: 0.005,            
              longitudeDelta: 0.005 * (Dimensions.get('window').width / Dimensions.get('window').height) 
            }}
            style={styles.map}
            customMapStyle={mapStyle}
            ref={ ref => this.map = ref}
          >
            <Polyline 
              coordinates={this.props.track.coordinates}
              strokeWidth={5}
              strokeColor={'rgba(41, 69, 82, 0.6)'} />
            {markerArray}
            {routeArray}
          </MapView>
          <Callout style={styles.calloutViewSnap}>
            <View style={{flex: 1,flexDirection:'row', margin: 2, alignItems: 'center', alignContent: 'center' }}>
              <View style={{flex: 5}}>
                <Dropdown
                    label='Place name..'
                    data={this.state.placeList}
                    // ref={ ref => this.dropdown = ref}
                    onChangeText={this.onSelectedPLace} /> 
              </View>
  
              <TouchableOpacity onPress={this.shareLinkWithShareDialog} style={styles.fsIconView}>
                <Image source={images.FSBICON} style={styles.fsIcon}></Image>
              </TouchableOpacity>      
            </View>
          
            <View style={{flex: 1, margin: 2}}>             
              <ImageGradient 
                mainStyle={styles.placeImage}
                // gradientStyle={styles.placeImage}
                imageUrl={this.props.track.image.uri}
                startPosition ={{x:0,y:0}}
                rgbcsvStart={'255,255,255'}
                rgbcsvEnd={'0,0,0'}
                opacityStart={1.0}
                opacityEnd={0.0}
              >
              </ImageGradient>    
            </View> 
          </Callout>
        </View>
      );
    } else {
      return (<View></View>);
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  placeImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "transparent"
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  map: {
    width: '100%',
    height: '100%'  
  },
  markerImage: {
    width: 10,
    height: 10
  },
  marker: {
    width: 20,
    height: 20
  },
  calloutViewSnap: {
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '90%',
    height: '35%',
    bottom: 10,
    marginLeft: '25%',
    marginRight: '25%',
    backgroundColor: "transparent"
  },
  fsIcon: {
    height: '40%',
    width: '100%',
  },
  fsIconView: {
    flex:1
  }
});

mapDispatchToProps = dispatch => {
  return {
    onFsbShare: (image, name) => dispatch(fsbShare(image, name))
  }
};

export default connect(null, mapDispatchToProps)(TrackScreen);



