import React, { Component } from "react";
import { View, Image, StyleSheet } from "react-native";
import ImagePicker from 'react-native-image-picker';
import UIbutton from '../../components/UIbutton/UIbutton';

class PickImage extends Component {
  state = {
    pickedImage: null 
  }

  pickImageHandler = () => {
    ImagePicker.showImagePicker({title: "Pick an Image", noData: false}, response => {
      if (response.didCancel) {
        console.log("User cancelled!");
      } else if (response.error) {
        console.log("Error", response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          pickedImage: { uri: response.uri }
        })
        this.props.onImagePicked({uri: response.uri, base64: response.data});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Image source={this.state.pickedImage} style={styles.previewImage} />
        </View>
        <View style={styles.button}>
        <UIbutton
          onPress={this.pickImageHandler}
          color={'#eee'} 
        > Pick Image
        </UIbutton>          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center"
    },
    placeholder: {
      borderWidth: 1,
      borderColor: "black",
      backgroundColor: "#eee",
      width: "80%",
      height: 150,
      margin: '2%'
    },
    button: {
      margin: '2%'
    },
    previewImage: {
      width: "100%",
      height: "100%"
    }
  });

export default PickImage;
