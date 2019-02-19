
import { images } from '../../../assets/index';
import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, BackHandler, ImageBackground } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import PlaceList from '../../components/PlaceList/PlaceList';
import UIbutton from '../../components/UIbutton/UIbutton';
import UItextM from '../../components/UItextM/UItextM';

import { getPlaces } from '../../store/actions/actions';

class UserScreen extends Component {

    state ={
        showPlaces: false
    }

    constructor(props) {
        super(props);
        this.itemSelectedHandler = this.itemSelectedHandler.bind(this);
        this.showUserPlaces = this.showUserPlaces.bind(this);
        this.popScreen = this.popScreen.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('userBackPress', this.popScreen );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('userBackPress', this.popScreen );
    }

     async showUserPlaces() {
         try {
            const res = await this.props.getUserPlaces();
            if (res) {
                this.setState({showPlaces: true});
            }
         } catch {}
    }

    popScreen = () => {
        Navigation.pop('catalogueScreen');
    }

    itemSelectedHandler = key => {
        const selPlace = this.props.userPlaces.find(place => {
                return place.key === key
        });

        Navigation.push('placeScreen', {
            component: {
              name: 'traking.PlaceScreen',
              passProps : {
                place : selPlace,
                country: selPlace.country,
                track: selPlace.track
              }
            }
        });     
    }

    render() {
        content = null;
        if (this.state.showPlaces) {
            content = (
                <View style={styles.bubbles}>
                    <PlaceList
                        places={this.props.userPlaces}
                        onItemSelected={this.itemSelectedHandler} />
                </View>
            );
        }
        return (
            <ImageBackground 
                source={images.HILLS} 
                resizeMethod={'resize'}
                style={styles.background}
            >
                <ScrollView style={styles.container}>
                    <UItextM style={{marginTop: '10%'}}> My Places </UItextM>
                    <UIbutton
                        onPress={this.showUserPlaces}
                        color={'#eee'}
                        style={{marginTop: '10%'}}
                    > Show places
                    </UIbutton>
                    {content}
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'transparent',
        zIndex: 2
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
        zIndex: 3
        // backgroundColor: 'transparent'
    },
    background: {
        flex: 1,
        width: '100%',
        zIndex: 1
    },
});

const mapStateToProps = state => {
    return {
        userPlaces: state.reduced.userPlaces
    };
};

mapDispatchToProps = dispatch => {
    return {
        getUserPlaces: () => dispatch(getPlaces())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);