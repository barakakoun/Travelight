
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

import MainMapPage from './components/MainMapPage';
import SplashPage from './components/SplashPage';
import LoginPage from './components/LoginPage';
import TourDetailsPage from './components/TourDetailsPage';
import EventsPage from './components/menu_pages/EventsPage';
import RecommendedPage from './components/menu_pages/RecommendedPage';
import SettingsPage from './components/menu_pages/SettingsPage';
import AboutPage from './components/menu_pages/AboutPage';
import UserPage from './components/menu_pages/UserPage';
var nativeImageSource = require('nativeImageSource');

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


export default class travelight extends Component {
    constructor(props) {
        super(props)
        this.nav= null;

        this.handleBack = (() => {
            if (this.nav && this.nav.getCurrentRoutes().length > 1){
                this.nav.pop();
                return true; //avoid closing the app
            }

            return false; //close the app
        }).bind(this) //don't forget bind this, you will remenber anyway.
    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    render() {
        return (
            <Navigator
                initialRoute={{id: 'SplashPage', name: 'Index'}}
                renderScene={this.renderScene.bind(this)}
                ref={navigator => {this.nav = navigator}}
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

            var contentView = <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => navigator.pop()}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>s index.js ss renderScene sss</Text>
                </TouchableOpacity>
            </View>;


            if (routeId === 'SplashPage') {
                contentView = <SplashPage
                    navigator={navigator} />;
            }
            if (routeId === 'MainMapPage') {
                contentView = <MainMapPage
                        navigator={navigator} />;
            }
            if (routeId === 'LoginPage') {
                contentView = <LoginPage
                        navigator={navigator} />;
            }
            if (routeId === 'TourDetailsPage') {
                contentView = <TourDetailsPage
                    navigator={navigator} chosenTour={route.chosenTour} />;
            }
            if (routeId === 'EventsPage') {
                contentView = <EventsPage
                    navigator={navigator} />;
            }
            if (routeId === 'RecommendedPage') {
                contentView = <RecommendedPage
                    navigator={navigator} />;
            }
            if (routeId === 'SettingsPage') {
                contentView = <SettingsPage
                    navigator={navigator} />;
            }
            if (routeId === 'AboutPage') {
                contentView = <AboutPage
                    navigator={navigator} />;
            }
            if (routeId === 'UserPage') {
                contentView = <UserPage
                    navigator={navigator} />;
            }
            if (routeId === 'Exit') {
                BackAndroid.exitApp();
            }



            return contentView;

            // return this.noRoute(navigator);

        }
        // noRoute(navigator) {
        //     return (
        //         <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        //             <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        //                               onPress={() => navigator.pop()}>
        //                 <Text style={{color: 'red', fontWeight: 'bold'}}>s index.js ss renderScene sss</Text>
        //             </TouchableOpacity>
        //         </View>
        //     );
        // }
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
