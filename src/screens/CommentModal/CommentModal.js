import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  BackHandler
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import MapView, {Callout} from 'react-native-maps';
import { connect } from 'react-redux';
import { commentUser } from '../../store/actions/actions';
import UIbutton from '../../components/UIbutton/UIbutton';
import UIinput from '../../components/UIinput/UIinput';
import ImageGradient from 'react-native-image-gradient';

class CommentModal extends Component {

  state = {
      findInput: ''
  };

  constructor(props) {
      super(props);
      this.commentPlace = this.commentPlace.bind(this);
      this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('commetBackPress', this.goBack );
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('commetBackPress', this.goBack );
  }

  goBack = () => {
      Navigation.pop('catalogueScreen');
  }

  commentPlace = () => {
    if (this.state.findInput.trim() !== '') {     
      this.props.onComment(
        this.props.place.key,
        this.props.trackName,
        this.state.findInput,
        this.props.country
      );
    }
    Navigation.pop('catalogueScreen'); 
  }

  render() {
    if (this.props.place) {
      const selectedPlace = this.props.place;
      return (
        <View
          style={ styles.container }>
          <MapView
            initialRegion={{
              ...this.props.place.coords,   
              latitudeDelta: 0.005,            
              longitudeDelta: 0.005 * (Dimensions.get('window').width / Dimensions.get('window').height) 
            }}
            style={styles.map}
            cacheEnabled={true}
            liteMode={true}
          >
            <MapView.Marker coordinate={selectedPlace.coords}/>
          </MapView>
          <Callout style={[styles.calloutViewSnap, {height: '30%'}]}>
            <View>        
              <ImageGradient 
                mainStyle={styles.placeImage}
                imageUrl={selectedPlace.image.uri}
                startPosition ={{x:0,y:0}}
                rgbcsvStart={'255,255,255'}
                rgbcsvEnd={'0,0,0'}
                opacityStart={1.0}
                opacityEnd={0.0}
              >
              </ImageGradient>           
            </View>
          </Callout>
          <Callout style={[styles.calloutViewSnap,{bottom: 10, height: '20%'}]}>   
              <View style={{flex: 1}}>
                <UIinput
                  placeholder='comment'
                  value={this.state.findInput}
                  onChangeText={findInput => this.setState({findInput})}
                  style={{margin: '2%'}}
                >
                </UIinput>
              </View>
              <View style={{flex: 1}}>
                <UIbutton onPress={this.commentPlace}>
                  Comment
                </UIbutton>
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
    flex: 1,
    width: '100%',
    height: '100%'
  },
  placeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    width: "80%",
    height: '100%'
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

mapDispatchToProps = dispatch => {
  return {
    onComment: (key, track, input, country) => dispatch(commentUser(key, track, input, country))    
  }
};

export default connect(null, mapDispatchToProps)(CommentModal);
