import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, BackHandler } from 'react-native';
import MapView, {Callout} from 'react-native-maps';
import { Navigation } from 'react-native-navigation';
import {connect } from 'react-redux';

import RNFetchBlob from 'rn-fetch-blob';

import mapNight from '../../../assets/mapNight.json';

import { addPlace } from "../../store/actions/actions";
import UIbutton  from '../../components/UIbutton/UIbutton';
import PickImage from "../../components/PickImage/PickImage";
import PlaceInput from "../../components/PlaceInput/PlaceInput";

import validate from "../../utility/validate";

const Blob = RNFetchBlob.polyfill.Blob;

// must have this !!!! beware - enforce RNFetchBlob XMLHttpRequest
// don't add it to fetch services
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class SharePlaceScreen extends Component {

    state = {
        controls: {
            placeName: {
              value: "",
              valid: false,
              touched: false,
              validationRules: {
                notEmpty: true
              }
            }
        },
        isHidden: 'hidden',
        location: {
            value: null,
            valid: false
        },
        image: {
            value: null,
            valid: false
        },
    };

    constructor(props) {
        super(props);   
        mapStyle = mapNight;
        this.placeAddedHandler = this.placeAddedHandler.bind(this);
        this.focusedLocation = () => {
            if (this.props.selectedLocation) {
                return {
                    latitude: this.props.selectedLocation.latitude,      
                    longitude: this.props.selectedLocation.longitude,      
                    latitudeDelta: 0.005,            
                    longitudeDelta: 0.005 * (Dimensions.get('window').width / Dimensions.get('window').height) 
                }
            }  
        };
        this.placeNameChangedHandler = this.placeNameChangedHandler.bind(this);
        this.imagePickedHandler = this.imagePickedHandler.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('sharePlaceBackPress', this.goBack );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('sharePlaceBackPress', this.goBack );
    }

    goBack = () => {
        Navigation.pop('mapScreen');
    }

    placeNameChangedHandler = val => {
        this.setState(prevState => {
            return {
              controls: {
                ...prevState.controls,
                placeName: {
                  ...prevState.controls.placeName,
                  value: val,
                  valid: validate(val, prevState.controls.placeName.validationRules),
                  touched: true
                }
              }
            };
        });
    };

    async placeAddedHandler() {
        const img = this.state.image.value;
        if (this.state.controls.placeName.value.trim() !== '') {
            try {
                const blob = await Blob.build(img.base64, { type : 'image/jpg;BASE64'});
                const res = await this.props.onAddPlace(     
                    this.state.controls.placeName.value, 
                    this.props.selectedLocation,
                    blob,
                    this.props.isTrackAdded,
                ); 
                await blob.close();
                if (res) {
                    Navigation.pop('mapScreen');
                }
            } catch (error) {
                alert(error);
            }
        }     
    };

    // save image to state
    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
              ...prevState,
              image: {
                  value: image,
                  valid: true
              }
            };
        });
    };

    render () {
        let marker = null;
        if (this.props.selectedLocation) {
          marker = <MapView.Marker coordinate={this.props.selectedLocation}/>
        }
        return (
        <View style={{height: '100%'}}>
            <MapView
                region={this.focusedLocation()} 
                style={styles.map}
                cacheEnabled={true}
                liteMode={true}
                customMapStyle={mapStyle}
            >
                {marker}    
            </MapView>
            <Callout style={[styles.calloutViewSnap, {height: '30%'}]}>
                <PickImage 
                    style={styles.previewImage}
                    onImagePicked={this.imagePickedHandler}/>
            </Callout>
            <Callout style={[styles.calloutViewSnap,{bottom: 10, height: '20%'}]}>
                <PlaceInput
                    placeData={this.state.controls.placeName}
                    onChangeText={this.placeNameChangedHandler}/>
                <UIbutton
                    onPress={this.placeAddedHandler}
                    color={'#eee'}
                    disabled={
                        !this.state.controls.placeName.valid ||
                        !this.state.location.valid ||
                        !this.state.image.valid
                    }
                > Share the Place
                </UIbutton>
            </Callout>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: '100%'
    },
    placeholder: {
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: "#eee",
      width: "80%",
      height: '30%'
    },
    previewImage: {
      width: "100%",
      height: "100%"
    },
    map: {
        width: '100%',
        height: '100%' 
    },
    calloutViewSnap: {
      marginTop: 10,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      width: '100%',
      height: '50%',
      backgroundColor: "transparent"
    }
});

const mapStateToProps = state => {
    return {
        isTrackAdded: state.reduced.isTrackAdded,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddPlace: (placeName, location, image, isTrackAdded) => dispatch(addPlace(placeName, location, image, isTrackAdded)) 
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);