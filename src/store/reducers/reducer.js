
import {
    AUTH_SET_TOKEN,
    REMOVE_PLACE,
    SET_PLACES,
    SET_USERS_PLACES,
    SET_USERS_TRACKS,
    ADD_TRACK,
    INITIAL_TRACK
  } from "../actions/actionTypes";
  
  // state
  const initialState = {
    token: null,  
    userPlaces: [],
    usersPlaces: [],
    usersTracks: [],
    selectedPlace: null,
    trackImage: null,
    trackMarkers: [],
    trackRoutes: [],
    isTrackAdded: false
  };


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case INITIAL_TRACK: {
          return {
            ...state,
            isTrackAdded: true
          };
        };
        case AUTH_SET_TOKEN: {
          return {
            ...state,
            token: action.token
          };  
        };
        case ADD_TRACK: {
          return {
            ...state,
            trackImage: action.trackImage,
            trackMarkers: action.trackMarkers,
            trackRoutes: action.trackRoutes
          }
        }

      case SET_PLACES: {
        return {
          ...state,
          userPlaces: action.userPlaces
        };
      };
      case SET_USERS_PLACES: {
        return {
          ...state,
          usersPlaces: action.usersPlaces
        };
      };

      case REMOVE_PLACE: {
        return {
          ...state,
          userPlaces: state.userPlaces.filter(place => {
            return place.key !== action.key;
          }),
          selectedPlace: null
        };
      };

      case SET_USERS_TRACKS: {
        return {
          ...state,
          usersTracks: action.usersTracks
        };
      };
      
      default:
        return state;
    }
};

export default reducer;