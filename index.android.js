import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Navigator,
    TouchableOpacity,
    BackAndroid,
} from 'react-native';

import MainMapPage      from './public/src/components/MainMapPage/MainMapPage';
import TourMapPage      from './public/src/components/TourDetails/TourMapPage';
import SplashPage       from './public/src/components/Login/SplashPage';
import LoginPage        from './public/src/components/Login/LoginPage';
import TourDetailsPage  from './public/src/components/TourDetails/TourDetailsPage';
import EventsPage       from './public/src/components/MenuPages/EventsPage';
import RecommendedPage  from './public/src/components/MenuPages/RecommendedPage';
import SettingsPage     from './public/src/components/MenuPages/SettingsPage';
import AboutPage        from './public/src/components/MenuPages/AboutPage';
import UserPage         from './public/src/components/MenuPages/UserPage';
import TourReviews      from './public/src/components/TourReviews/TourReviews';
import StationDetailsPage from './public/src/components/StationDetails/StationDetailsPage';
var nativeImageSource = require('nativeImageSource');

import Store from './public/src/model/store';
import { observer } from 'mobx-react/native';
import _ from 'lodash';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 32.080523;
const LONGITUDE = 34.780852;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

// function randomColor() {
//     return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }

@observer
export default class travelight extends Component {
    constructor(props) {
        super(props);

        this.handleBack.bind(this);
        this.emptyNavigator.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    handleBack() {
        if (Store.appNavigator && Store.appNavigator.getCurrentRoutes().length > 1){
            Store.navigatorPop();
            return true; //avoid closing the app
        }

        return false; //close the app
    }

    emptyNavigator() {
        if (Store.appNavigator) {
            while (Store.appNavigator.getCurrentRoutes().length != 0) {
                Store.navigatorPop();
            }
        }
    }

    render() {
        const { setAppNavigator } = Store;
        return (
            <Navigator
                initialRoute={{id: 'SplashPage', name: 'Index'}}
                renderScene={this.renderScene.bind(this)}
                ref={nav => {setAppNavigator(nav)}}
                style={{backgroundColor:'#91b6f2'}}
                configureScene={(route) => {
            if (route.configureScene) {
              return route.configureScene;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }}/>
        );
    }

        renderScene(route, navigator) {

            var routeId = route.id;
            if(!Store.appNavigator) {
                Store.appNavigator = navigator;
            }

            var contentView =
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => Store.navigatorPop()}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>s index.js ss renderScene sss</Text>
                </TouchableOpacity>
            </View>;

            if (routeId === 'SplashPage') {
                contentView = <SplashPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'MainMapPage') {
                contentView = <MainMapPage
                        navigator={Store.appNavigator}
                        store={Store} />;
            }
            if (routeId === 'TourMapPage') {
                contentView = <TourMapPage
                    navigator={Store.appNavigator}
                    tour={route.tour}
                    coords={route.coords}
                    store={Store}
                />;
            }
            if (routeId === 'LoginPage') {
                contentView = <LoginPage
                        navigator={Store.appNavigator}
                        store={Store} />;
            }
            if (routeId === 'TourDetailsPage') {
                contentView = <TourDetailsPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'StationDetailsPage') {
                contentView = <StationDetailsPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'EventsPage') {
                contentView = <EventsPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'RecommendedPage') {
                contentView = <RecommendedPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'SettingsPage') {
                contentView = <SettingsPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'AboutPage') {
                contentView = <AboutPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'UserPage') {
                contentView = <UserPage
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if(routeId === 'ReviewsPage') {
                contentView = <TourReviews
                    navigator={Store.appNavigator}
                    store={Store} />;
            }
            if (routeId === 'Exit') {
                contentView = <LoginPage
                    navigator={Store.appNavigator}
                    store={Store} />;

            }

            return contentView;
        }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});



AppRegistry.registerComponent('travelight', () => travelight);
