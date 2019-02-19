
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

// redux
import configureStore from './src/store/configureStore';

const store = configureStore();


// importing the screens 
import AuthScreen from './src/screens/AuthScreen/AuthScreen';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import CatalogueScreen from './src/screens/CatalogueScreen/CatalogueScreen';
import UserScreen from './src/screens/UserScreen/UserScreen';
import PlaceScreen from './src/screens/PlaceScreen/PlaceScreen';
import MapScreen from  './src/screens/MapScreen/MapScreen'; 
import CommentModal from './src/screens/CommentModal/CommentModal';
import ShareTrackScreen from './src/screens/ShareTrack/ShareTrack';
import TrackScreen from './src/screens/TrackScreen/TrackScreen';

// Register/ handaling screens
Navigation.registerComponentWithRedux('traking.AuthScreen', () => AuthScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.SharePlaceScreen', () => SharePlaceScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.CatalogueScreen', () => CatalogueScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.UserScreen', () => UserScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.PlaceScreen', () => PlaceScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.MapScreen', () => MapScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.CommentModal', () => CommentModal, Provider, store );
Navigation.registerComponentWithRedux('traking.ShareTrackScreen', () => ShareTrackScreen, Provider, store);
Navigation.registerComponentWithRedux('traking.TrackScreen', () => TrackScreen, Provider, store);


//  Start a App
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        options: {
          layout: {
            orientation: ['portrait']
          },
          topBar: {
            visible: false,
            drawBehind: true,
            animate: false
          },
          statusBar: {
            visible: false,
            drawBehind: true,
            animate: false
          },
          animations: {
            pop: {
              content: {
                alpha: {
                  from: 1,
                  to: 0,
                  duration: 300, 
                },
              }
            },
            push: {
              content: {
                alpha: {
                  from: 0,
                  to: 1,
                  duration: 300, 
                },
              }
            }
          }
        },
        children: [
          {
            component: {
              id: 'placeScreen',
              name: 'traking.PlaceScreen'
            }
          },
          {
            component: {
              id: 'userScreen',
              name: 'traking.UserScreen'
            }
          },
          {
            component: {
              id: 'commentModal',
              name: 'traking.CommentModal'
            }
          },
          {
            component: {
              id: 'trackScreen',
              name: 'traking.TrackScreen'
            }
          },
          {
            component: {
              id: 'catalogueScreen',
              name: 'traking.CatalogueScreen'
            }
          },
          {
            component: {
              id: 'shareTrackScreen',
              name: 'traking.ShareTrackScreen',
            }
          },
          {
            component: {
              id: 'sharePlaceScreen',
              name: 'traking.SharePlaceScreen'
            }
          },
          {
            component: {
              id: 'mapScreen',
              name: 'traking.MapScreen'
            }
          },
          {
            component: {
              id: 'authScreen',
              name: 'traking.AuthScreen'
            }
          },
        ]
      }
    }
  });
});


