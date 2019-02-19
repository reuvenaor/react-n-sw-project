import React, { Component } from 'react';
import { View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
    BackHandler
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import UIinput from '../../components/UIinput/UIinput';
import UItextL from "../../components/UItextL/UItextL";
import UItextM from '../../components/UItextM/UItextM';
import UIbutton  from '../../components/UIbutton/UIbutton';
import validate from "../../utility/validate";
import { tryAuth, authGetToken } from "../../store/actions/actions";
import { images } from '../../../assets/index';


class AuthScreen extends Component {

    state = {
        authMode: "login",  
        controls: {
            email: {
                value: '',
                valid: false,
                validationRules : {
                    isEmail: true
                },
                touched: false      
            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: '',
                valid: false,
                validationRules: {
                    equalTo: 'password'
                },
                touched: false
            }
        }
    };

    constructor(props) {
        super(props);
        this.pushScreen = this.pushScreen.bind(this);
        this.switchAuthModeHandler = this.switchAuthModeHandler.bind(this);
        this.authHandler = this.authHandler.bind(this);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('authBackPress', () => true );
    }

    componentDidMount() {
        BackHandler.addEventListener('authBackPress', () => true );
        this.props.onSignIn()
        .then( token => {
            if (token) {
                this.pushScreen();
            }
        });
    };

    // Control the signup or login change the authMode state
    switchAuthModeHandler = () => {
        this.setState(prevState => {
          return {
            authMode: prevState.authMode === "login" ? "signup" : "login"
          };
        });
    };


    // Start the tabs screen and work with the 
    authHandler = () => {
        const authData = {
            // keep the email and password
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
          };
          this.props.onTryAuth(authData, this.state.authMode)
          .then(authValid => {
            this.pushScreen();
          })
          .catch(err => console.log("Failed to fetch token!"));
    };

    pushScreen = () => {
        Navigation.push('mapScreen', {
          component: {
            name: 'traking.MapScreen',
          }
        }); 
    };

    
    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
          const equalControl = this.state.controls[key].validationRules.equalTo;
          const equalValue = this.state.controls[equalControl].value;
          connectedValue = {
            ...connectedValue,
            equalTo: equalValue
          };
        }
        if (key === "password") {
          connectedValue = {
            ...connectedValue,
            equalTo: value
          };
        }
        this.setState(prevState => {
          return {
            controls: {
              ...prevState.controls,
              confirmPassword: {
                ...prevState.controls.confirmPassword,
                valid:
                  key === "password"
                    ? validate(
                        prevState.controls.confirmPassword.value,
                        prevState.controls.confirmPassword.validationRules,
                        connectedValue
                      )
                    : prevState.controls.confirmPassword.valid
              },
              [key]: {                         
                ...prevState.controls[key],     
                value: value,
                valid: validate(
                  value,
                  prevState.controls[key].validationRules,
                  connectedValue
                ),
                touched: true
              }
            }
          };
        });
    };

    
    render() {
        // Control the view of confirmPassword input
        let confirmPasswordControl = null;

        // Control the view of confirmPassword input
        if (this.state.authMode === "signup") {
            confirmPasswordControl = (
                <UIinput
                placeholder='Confirm Password'
                style={styles.input}
                value={this.state.controls.confirmPassword.value}
                onChangeText={val =>
                  this.updateInputState("confirmPassword", val)}
                valid={this.state.controls.confirmPassword.valid}
                touched={this.state.controls.confirmPassword.touched}
                // props of TextInput to hide the text
                secureTextEntry                
                />
            );
        }
        return(
            <ImageBackground 
                source={this.state.authMode === "login" ? images.EVEREST : images.REGISTER } 
                resizeMethod={'resize'} 
                style={styles.background}
            >
            <KeyboardAvoidingView style={styles.container} behavior="padding">  

                <UItextM>
                <UItextL>Please {this.state.authMode === "login" ? "Login" : "Sign Up" }</UItextL>
                </UItextM>

                <View style={styles.inputCont}>
                    <UIinput 
                        placeholder='Email'
                        style={styles.input}
                        value={this.state.controls.email.value}
                        onChangeText={val => this.updateInputState("email", val)}
                        valid={this.state.controls.email.valid}
                        touched={this.state.controls.email.touched}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        />
                    <UIinput
                        placeholder='Password'
                        style={styles.input}
                        value={this.state.controls.password.value}
                        onChangeText={val => this.updateInputState("password", val)}
                        valid={this.state.controls.password.valid}
                        touched={this.state.controls.password.touched}
                        secureTextEntry
                        />
                    
                    {confirmPasswordControl}

                </View>
                <View style={styles.button}>
                    <UIbutton
                        onPress={this.switchAuthModeHandler}
                        color={'#eee'}
                    > Switch to {this.state.authMode === "login" ? "Sign Up" : "Login" }
                    </UIbutton>
                    <UIbutton
                        onPress={this.authHandler}
                        color={'#eee'}
                        disabled={ 
                            !this.state.controls.confirmPassword.valid && this.state.authMode === 'login' ||
                            !this.state.controls.email.valid ||
                            !this.state.controls.password.valid
                        }
                    > {this.state.authMode === "login" ? "Login" : "Sign Up" }
                    </UIbutton>
                </View>
            </KeyboardAvoidingView>
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                    
                                    
        justifyContent: 'center',   
        alignItems: 'center'        
    },
    inputCont: {
        justifyContent: 'center',   
        alignItems: 'center',        
        height: '20%',
        width: '80%'
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb",
    },
    background: {
        flex: 1,
        width: '100%'
    },
    button: {
        flexDirection: "column",
        justifyContent: "flex-start"
    },
});

const mapDispatchToProps = dispatch => {
    return {
      onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
      onSignIn: () => dispatch(authGetToken())
    };
};
  
export default connect(null, mapDispatchToProps)(AuthScreen);