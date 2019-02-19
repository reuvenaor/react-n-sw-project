import { images } from '../../../assets/index';
import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, BackHandler, ImageBackground } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import PlaceList from '../../components/PlaceList/PlaceList';
import UIbutton from '../../components/UIbutton/UIbutton';
import UIinput from '../../components/UIinput/UIinput';
import UItextM from '../../components/UItextM/UItextM';
import TrackList from '../../components/TrackList/TrackList';
import { getUseresPlaces } from '../../store/actions/actions';


class CatalogueScreen extends Component {

    state = {
        placesLoaded: false,
        findInput: '',
        showUsersPlaces: false,
        countryName: 'Israel'
    }
    
    constructor(props) {
        super(props);
        this.pushMapScreen = this.pushMapScreen.bind(this);
        this.selectedTrackHandler = this.selectedTrackHandler.bind(this);
        this.selectedPlaceHandler = this.selectedPlaceHandler.bind(this);
        this.onSelectedCountry = this.onSelectedCountry.bind(this);
        this.findUsersPlaces = this.findUsersPlaces.bind(this);
        this.pushUserScreen = this.pushUserScreen.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('catalogueBackPress', this.pushMapScreen );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('catalogueBackPress', this.pushMapScreen );
    }

    pushMapScreen = () => {
        Navigation.popTo('mapScreen');
    }
    
    selectedPlaceHandler = (selPlace, trackName) => {
        Navigation.push('commentModal', {
            component: {
              name: 'traking.CommentModal',
              passProps : {
                place: selPlace,
                trackName: trackName, 
                country: this.state.countryName
              }
            }
        });   
    }

    selectedTrackHandler = key => {
        selTrack = this.props.usersTracks.find(track => {
                return track.key === key
        });            
        Navigation.push('trackScreen', {
            component: {
              name: 'traking.TrackScreen',
              passProps : {
                track : selTrack
              }
            }
        });     
    }
    
    
    findUsersPlaces = () => {
        const findTrack = this.state.findInput;
        this.props.onFindPlaces(findTrack, this.state.countryName);
        this.setState({	showUsersPlaces: true});
    }

    onSelectedCountry = (country) => {
        alert(country);
        this.setState(prevState => {
            return {
              ...prevState,
              countryName : country
            };
        });
    }

    pushUserScreen = () => {
        Navigation.push('userScreen', {
            component: {
              name: 'traking.UserScreen',
            }
        });
    }

    render () {
        let data = [
          {
            value: 'Israel',
          }, {
            value: 'Cyprus',
          }, {
            value: 'Jordan',
          }, {
            value: 'United States'
          }
        ];
        let usersTracks = null;

        if (this.props.usersTracks) {
            usersTracks = (                
                <TrackList
                    tracks={this.props.usersTracks}
                    onItemSelected={this.selectedTrackHandler}
                    onPlaceSelected={this.selectedPlaceHandler} />
            );
        }
        return (
            <ImageBackground 
                source={images.CLIFF} 
                style={styles.background}
                resizeMethod={'resize'} 
            >
                <ScrollView style={styles.container}>
                    <UIbutton
                        onPress={this.pushUserScreen}
                        color={'#eee'}
                    > My Places
                    </UIbutton>
                    <View style={[styles.bubbles/* , {backgroundColor: "#eee"} */]}> 
                        <UItextM> Find places </UItextM>
                        <View style={styles.bubbles}>                    
                            <UIinput
                                placeholder='Find track by name'
                                style={{width: '98%'}}
                                value={this.state.findInput}
                                onChangeText={findInput => this.setState({findInput})} />
                            <Dropdown
                                label='Country name..'
                                data={data}
                                onChangeText={this.onSelectedCountry} />
                            <UIbutton
                                onPress={this.findUsersPlaces}
                                color={'#eee'}
                            >
                                Find
                            </UIbutton>
                            <UIbutton
                                onPress={this.pushMapScreen}
                                color={'#eee'}
                            >
                                Back
                            </UIbutton>
                        </View>          
                        {usersTracks}
                    </View>
                </ScrollView>
            </ImageBackground>

		);
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        marginTop: '10%',
    },  
    bubbles: {
        flex: 1,
        height: '100%',
        padding: 5,
        margin: 5,
        borderRadius: 5,
        borderWidth: 0,
        borderColor: "black",
        borderRadius: 5,
        elevation: 4,
    },
    background: {
        flex: 1,
        width: '100%'
    },
})


const mapStateToProps = state => {
    return {
        usersPlaces: state.reduced.usersPlaces,
        usersTracks: state.reduced.usersTracks
    };
};

mapDispatchToProps = dispatch => {
    return {
        onFindPlaces: (trackName, countryName) => dispatch(getUseresPlaces(trackName, countryName))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(CatalogueScreen);