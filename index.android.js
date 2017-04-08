
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Navigator,
    TouchableOpacity,
} from 'react-native';

import MainMapPage from './components/MainMapPage';
import SplashPage from './components/SplashPage';
import LoginPage from './components/LoginPage';
import TourDetailsPage from './components/TourDetailsPage';
var nativeImageSource = require('nativeImageSource');

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 32.080523;
const LONGITUDE = 34.780852;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}


export default class travelight extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{id: 'SplashPage', name: 'Index'}}
                renderScene={this.renderScene.bind(this)}
                configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }}/>
        );
    }

        renderScene(route, navigator) {
            var routeId = route.id;
            if (routeId === 'SplashPage') {
                return (
                    <SplashPage
                        navigator={navigator} />
                );
            }
            if (routeId === 'MainMapPage') {
                return (
                    <MainMapPage
                        navigator={navigator} />
                );
            }
            if (routeId === 'LoginPage') {
                return (
                    <LoginPage
                        navigator={navigator} />
                );
            }
            if (routeId === 'TourDetailsPage') {
                return (
                    <TourDetailsPage
                        navigator={navigator} chosenTour={route.chosenTour} />
                );
            }
            return this.noRoute(navigator);

        }
        noRoute(navigator) {
            return (
                <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => navigator.pop()}>
                        <Text style={{color: 'red', fontWeight: 'bold'}}>s index.js ss renderScene sss</Text>
                    </TouchableOpacity>
                </View>
            );
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
