import { AsyncStorage } from "react-native";

import { AUTH_SET_TOKEN,
        SET_PLACES, 
        SET_USERS_PLACES, 
        REMOVE_PLACE, 
        SET_USERS_TRACKS,
        ADD_TRACK,
        INITIAL_TRACK } from './actionTypes';

const md5 = require('js-md5');

import * as firebase from "firebase";

const apiKey = *************************************;
const ApiKeyMap = *************************************;;
const verifyUrl = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
const signUrl = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=";
const mapsAddr = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const firebaseUrl = "https://reuvenaorproject.firebaseio.com//";
const storageBucket = 'reuvenaorproject.appspot.com';
const authDomain = 'reuvenaorproject.firebaseapp.com';
const noImgUrl = 'https://vignette.wikia.nocookie.net/superfriends/images/a/a5/No_Photo_Available.jpg';

export const app = firebase.initializeApp({
	apiKey       : apiKey,
	authDomain   : authDomain,
	databaseURL  : firebaseUrl,
	storageBucket: storageBucket,						
});
import { ShareDialog } from 'react-native-fbsdk';
const FBSDK = require('react-native-fbsdk');
const {
  ShareApi,
} = FBSDK;


export const tryAuth = (authData, authMode) => {
  return async dispatch => {
    let url = '';
    if (authMode === 'login') {
    url = verifyUrl + apiKey;
    }
    if (authMode === 'signup') {
      url = signUrl + apiKey;
    }
    try {
      const res = await fetch( url,
        {
          method: "POST",
          body: JSON.stringify({
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const parsedRes = await res.json();
      if (!parsedRes.idToken) {
        alert("Authentication failed, please try again!");
        return false;
      } else {
        // if all promise secceed dispatch authStoreToken action to save the token in redux store and AsyncStorage
        dispatch(authStoreToken(
          parsedRes.idToken, parsedRes.expiresIn, authData.email, authData.password
          ));
        }
        return true;
    } catch {
      alert('tryAuth failed');
      return false;
    }
  }
};

// save the token in asyncStorage and call here authSetToken
export const authStoreToken = (token, expiresIn, email, password) => {
  return dispatch => {
      // call here authSetToken
      dispatch(authSetToken(token));
      // change the default (3600) token expiresIn we got from firebase  
      const now = new Date();
      const expiryDate = now.getTime() + 43000 * 1000; 
      AsyncStorage.setItem("ap:auth:token", token);
      AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
      AsyncStorage.setItem("ap:auth:email", email);
      AsyncStorage.setItem("ap:auth:password", password);
  };
};


export const authGetToken = () => {
  return async (dispatch, getState) => {
    try {
      const token = await getState().reduced.token;
      if (!token) {
        const tokenFromStorage = await AsyncStorage.getItem("ap:auth:token");
        if (!tokenFromStorage) {
          return false;
        }
        const expiryDate = await AsyncStorage.getItem("ap:auth:expiryDate");
        const parsedExpiryDate = new Date(parseInt(expiryDate));
        // get now date
        const now = new Date();
        if (parsedExpiryDate > now) {
          dispatch(authSetToken(tokenFromStorage));
          return tokenFromStorage;
        } else {
            return false;
        }
      } else {
        return token;
      }
    } catch {
      return false;
    }
  }
};

// clear the AsyncStorage
export const authClearStorage = () => {
  return dispatch => {
      AsyncStorage.removeItem("ap:auth:token");
      AsyncStorage.removeItem("ap:auth:expiryDate");
      AsyncStorage.removeItem("ap:auth:email");
      AsyncStorage.removeItem("ap:auth:password");
  };
};

export const getAddress = (location) => {
	return async dispatch => {		
		let country = null;
		try {
			const response = await fetch( mapsAddr
				+ location.latitude + ','
				+ location.longitude
				+ '&key=' + ApiKeyMap );
			const responseJson = await response.json();
			for ( i in responseJson.results[0].address_components) {
				if (responseJson.results[0].address_components[i].types[0] === "country") {
						country = responseJson.results[0].address_components[i].long_name;
				}
			}
			return country;
		} catch {
			return false;
		}	
	}
};

export const getAuth = () => {
    return async dispatch => {
        try {
            const token = await dispatch(authGetToken());
            const email = await AsyncStorage.getItem("ap:auth:email");
            const password = await AsyncStorage.getItem("ap:auth:password");
            const hash = await md5(email);
            return {email: email, hash: hash, token: token, password: password};
        } 
        catch {
            return false;
        }
    };
};

export const getAddData = (location) => {
    return async dispatch => {
        try {
            const {email, hash, token, password} = await dispatch(getAuth());
            const countryName = await dispatch(getAddress(location));
            const trackName = await AsyncStorage.getItem("ap:auth:trackName");
            if (!trackName) {
                return {
                    token: token,
                    email: email, 
                    hash: hash, 
                    trackName: 'RANDOM-PLACES',
                    countryName: countryName,
                    password: password
                };
            } else {
                return {
                    token: token,
                    email: email, 
                    hash: hash, 
                    trackName: trackName,
                    countryName: countryName,
                    password: password
                };
            }
        }
        catch {
            return false;
        }
    };
};

export const addPlace = (placeName, location, image, isTrackAdded) => {
    
    return async dispatch => {
        try {
            const storageRef = app.storage().ref();
            const fileRef = storageRef.child(`newImage/${placeName}.jpg`);
            const metadata  = {contentType: 'image/jpg'};
            const database = app.database();

            const upImageRes = await fileRef.put(image, metadata);
            const url = await upImageRes.ref.getDownloadURL();
            const {token, email, hash, trackName, countryName, password} = await dispatch(getAddData(location));
            const firebaseToken = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (!isTrackAdded) {
                const trackData = {
                    name: trackName,
                    imageTrack: noImgUrl,
                    image: noImgUrl,
                    userName: hash,                     
                    extraInfo: 'no info',
                    coords: [location],
                    coordinates: [location]
                };
                const userDataRes = await database.ref(hash + "/" + trackName).set(trackData);
                const usersData = await database.ref("maps/" + countryName + "/" + trackName).set(trackData);

                await dispatch(initialTrack());
            }
            const placeData = {
                track: trackName,
                name: placeName,
                coords: location,
                image: url,
                userName: hash,
                country: countryName,
                comments: [{}]
            };
            const userData = {
                track: trackName,
                name: placeName,
                location: location,
                image: url
            };
            const placeDataRes = await database.ref('maps/' + countryName + '/' 
                 + trackName + '/places/' + placeName).set(placeData);
            const userDataRes = await database.ref(hash + "/" + trackName + "/places/" + placeName).set(userData);

            return true;
        }
        catch (error) {
            alert(error);
            return false;
        }
    };
};

export const addTrack = ( 
    extraInfo, 
    trackImage, 
    mainImage, 
    markersCoords, 
    routeCoordinates, 
    isTrackAdded ) => {
    return async dispatch => {
        try {
            const storageRef = app.storage().ref();
            const metadata  = {contentType: 'image/jpg'};
            const database = app.database();

            const fileRefTrack = storageRef.child(`newImage/${extraInfo}track.jpg`);
            const TrackRes = await fileRefTrack.put(trackImage, metadata);
            const trackURL = await TrackRes.ref.getDownloadURL();

            const fileRefMain = storageRef.child(`newImage/${extraInfo}main.jpg`);
            const mainRes = await fileRefMain.put(mainImage, metadata);
            const mainURL = await mainRes.ref.getDownloadURL();

            const { token, email, hash, trackName, countryName, password } = await dispatch(getAddData(routeCoordinates[0]));
            const firebaseToken = await firebase.auth().signInWithEmailAndPassword(email, password);
            const trackData = {
                name: trackName,
                imageTrack: trackURL,
                image: mainURL,
                userName: hash,                     
                extraInfo: extraInfo,
                coords: markersCoords,
                coordinates: routeCoordinates
            };
            if (isTrackAdded) {
                const usersDataRes = await database.ref("maps/" + countryName + "/" 
                    + trackName).update(trackData);
                const userDataRes = await database.ref(hash + "/" + trackName).update(trackData);
            } else {
                const usersDataRes = await database.ref("maps/" + countryName + "/" 
                    + trackName).set(trackData);
                const userDataRes = await database.ref(hash + "/" + trackName).set(trackData);
                await dispatch(initialTrack());
            }
            return true;
        } 
        catch (error) {
            alert("failed to add a track action" + error);
            return false;
        }
    };
};

export const getPlaces = () => {
    return async dispatch => {
        try {
            let places = [];
            const {email, hash, token, password} = await dispatch(getAuth());
            const placeRes = await fetch( firebaseUrl + '/' + hash + '.json?auth=' + token );
            const placeParsedRes = await placeRes.json();
            for (let track in placeParsedRes) {
                for (let place in placeParsedRes[track].places) {
                    if (placeParsedRes[track].places[place]) {
                        places.push({
                            ...placeParsedRes[track].places[place],
                            image: {
                                uri: placeParsedRes[track].places[place].image
                            },
                            key: place
                        });
                    }
                }
            }
            dispatch(setPlaces(places));
            return true;
        }
        catch (error) {
            return false;
        }
    };
};

export const getUseresPlaces = (trackName, countryName) => {
    return async dispatch => {
        try {
            let tracks = [];
            const authToken = await dispatch(authGetToken());
            const res = await fetch(firebaseUrl + 'maps/' + countryName + '.json' 
                + '?orderBy="$key"&startAt="' + trackName + '"' /* + '"&endAt="' + trackName + '"' */  
                + '&auth=' + authToken
            );
            const parsedRes = await res.json();
            for (let key in parsedRes) {
                tracks.push({
                    ...parsedRes[key],
                    image: {
                        uri: parsedRes[key].image
                    },
                    imageTrack: {
                        uri: parsedRes[key].imageTrack
                    },
                    key: key
                });
            }
            dispatch(setUsersTracks(tracks));
            return true;
        } catch {
            return false;
        }
    };
};


export const deletePlace = (place, country, track) => {
    return async dispatch => {
        try {
            const {email, hash, token, password} = await dispatch(getAuth());
            const deleteUsers = await fetch(firebaseUrl + "maps/"
            + country + "/" + track + "/places/"
            + place.key + ".json?auth=" + res[2],
            {
                method: "DELETE"
            });
            const deleteUser = await fetch(firebaseUrl + hash + "/" + place.track 
                + "/places/" + place.key + ".json?auth=" + token,
            {
                method: "DELETE"
            });
            const parsedDeleteUser = await deleteUser.json();
            const deleteRedux = await dispatch(removePlace(place.key));
            return parsedDeleteUser;
        } catch {
            return false;
        }
    };
};

export const commentUser = (key, track, input, country) => {
    return async dispatch => {
        try {
            const {email, hash, token, password} = await dispatch(getAuth());
            const commentData = { comment: input, userName: email };
            const commentRes = fetch(firebaseUrl + "maps/" + country + '/' + track 
                + '/places/' + key + "/comments.json?auth=" + token, 
            {
                method: "POST",
                body: JSON.stringify(commentData)
            });
            const parsedCommentRes = await commentRes.json();
            return parsedCommentRes;
        } catch (error) {
            alert("Something went wrong, commentUser");
            return false;
        }
    };
};

export const fsbShare = (image, name) => {
    return async dispatch => {
        try {     
            let shareLinkContent = {
                contentType: 'link',
                contentUrl: image,
                contentDescription: name
            };
            const canShow = await ShareDialog.canShow(shareLinkContent);
            if (canShow) {
                const result = await ShareDialog.show(shareLinkContent);
                if (result.isCancelled) {
                    return false;
                } else {
                    return result.postId;
                }
            }         
        } catch  {
            return false;
        }
    }
}


export const initialTrack = () => {
    return {
        type: INITIAL_TRACK
    };
};

export const addTrackStore = (image, markers, routes) => {
    return async dispatch => {
        try {
            dispatch(uploadTrack(image, markers, routes));
            return true;
        } catch  {
            return false;
        }
    }
}

export const uploadTrack = (image, markers, routes) => {
    return {
        type: ADD_TRACK,
        trackImage: image,
        trackMarkers: markers,
        trackRoutes: routes
    }
}

export const authSetToken = token => {
    return {
        type: AUTH_SET_TOKEN,
        token: token
    };
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};

export const setUsersTracks = usersTracks => {
    return {
        type: SET_USERS_TRACKS,
        usersTracks: usersTracks
    };
};

export const setUsersPlaces = usersPlaces => {
    return {
        type: SET_USERS_PLACES,
        usersPlaces: usersPlaces
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        userPlaces: places
    };
};


