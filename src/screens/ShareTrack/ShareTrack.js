import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import MapView, {Polyline, Marker } from 'react-native-maps';
import { Navigation } from 'react-native-navigation';
import {connect } from 'react-redux';
import { addTrack } from "../../store/actions/actions";

import UIbutton  from '../../components/UIbutton/UIbutton';
import UItextM from "../../components/UItextM/UItextM";
import UItextL from "../../components/UItextL/UItextL";
import PickImage from "../../components/PickImage/PickImage";
import PlaceInput from "../../components/PlaceInput/PlaceInput";
import mapNight from '../../../assets/mapNight.json';

import validate from "../../utility/validate";

class ShareTrackScreen extends Component {

    constructor(props) {
        super(props);  
        mapStyle = mapNight;
        this.focusedLocation = this.focusedLocation.bind(this);
        this.trackAddedHandler = this.trackAddedHandler.bind(this);
        this.imagePickedHandler = this.imagePickedHandler.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    state = {
        controls: {
            extraTxt: {
              value: "",
              valid: false,
              touched: false,
              validationRules: {
                notEmpty: true
              }
            }
        },
        isHidden: 'hidden',
        image: {
            value: null,
            valid: false
        },
    };

    componentDidMount() {
        BackHandler.addEventListener('shareTrackBackPress', this.goBack );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('shareTrackBackPress', this.goBack );
    }

    goBack = () => {
        Navigation.pop('mapScreen');
    }

    focusedLocation = () => {
        if (this.props.coordinates[0]) {
            return {
                latitude: this.props.coordinates[0].latitude,      
                longitude: this.props.coordinates[0].longitude,      
                latitudeDelta: 0.005,            
                longitudeDelta: 0.005 * (Dimensions.get('window').width / Dimensions.get('window').height)   
            }
        }
    }
    

    extraTxtChangedHandler = val => {
        this.setState(prevState => {
            return {
              controls: {
                ...prevState.controls,
                extraTxt: {
                  ...prevState.controls.extraTxt,
                  value: val,
                  valid: validate(val, prevState.controls.extraTxt.validationRules),
                  touched: true
                }
              }
            };
        });
    };

    async trackAddedHandler() {
        const trackImg = this.props.imageUri;
        const mainImg = this.state.image.value;
        if (this.state.controls.extraTxt.value.trim() !== '') {
            try {
                const trackBlob = await Blob.build(trackImg, { type : 'image/jpg;BASE64'});
                const mainBlob = await Blob.build(mainImg.base64, { type : 'image/jpg;BASE64'});
                const res = await this.props.onAddTrack(     
                    this.state.controls.extraTxt.value, 
                    trackBlob,
                    mainBlob,
                    this.props.markersCoords,
                    this.props.coordinates,
                    this.props.isTrackAdded
                );
                await trackBlob.close();
                await mainBlob.close();
                if (res) {
                    Navigation.pop('mapScreen');
                }
            } catch (error) {
                alert(error);
            }

        }
    };

    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
              ...prevState.controls,
              image: {
                  value: image,
                  valid: true
              }
            };
        });
    };

    render () {
        let markerArray;
        let coordinatesArray;
        if (Array.isArray(this.props.markersCoords)) {
            markerArray = this.props.markersCoords.map(mark => {
                return (
                    <MapView.Marker
                    coordinate={mark}

                    key={(mark.latitude + mark.longitude).toFixed(2)}
                    image={null}  
                  />
                );
            });
        }
        if (Array.isArray(this.props.coordinates)) {
            coordinatesArray = (<Polyline coordinates={this.props.coordinates} strokeWidth={3} />);
        }


        return (
            <View style={styles.container}>
                <UItextM>
                    <UItextL>Share a Track</UItextL>
                </UItextM>
                <MapView
                    region={this.focusedLocation()}
                    style={styles.map}
                    cacheEnabled={true}
                    liteMode={true}
                    customMapStyle={mapStyle}
                >  
                    {coordinatesArray}
                    {markerArray}  
                </MapView>

                <PickImage 
                    style={styles.previewImage}
                    onImagePicked={this.imagePickedHandler}/>

                <PlaceInput
                    style={styles.input}
                    placeData={this.state.controls.extraTxt}
                    onChangeText={this.extraTxtChangedHandler}/>

                <UIbutton
                    onPress={this.trackAddedHandler}
                    color={'#eee'}
                    disabled={
                        !this.state.controls.extraTxt.valid ||
                        !this.state.location.valid ||
                        !this.state.image.valid
                    }
                > Share the Track
                </UIbutton>
            </View>        
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      height: '100%'
    },
    placeholder: {
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: "#eee",
      width: "80%",
      height: "10%"
    },
    previewImage: {
      flex: 6,
      width: "100%",
      height: "100%"
    },
    map: {
        width: '100%',
        flex: 6
    },
    input: {
        flex:1,
        height: '10%'
    }
});

const mapStateToProps = state => {
    return {
        coordinates: state.reduced.trackRoutes,
        imageUri: state.reduced.trackImage,
        markersCoords: state.reduced.trackMarkers,
        isTrackAdded: state.reduced.isTrackAdded,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddTrack: (extraInfo, trackImage, mainImage, coords, coordinate, country, isTrackAdded) => dispatch(addTrack(extraInfo, trackImage, mainImage, coords, coordinate, country, isTrackAdded))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareTrackScreen);