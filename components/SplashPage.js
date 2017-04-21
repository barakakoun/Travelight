
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
} from 'react-native';

import logo from '../assets/splash.png';

class SplashPage extends Component {
    componentWillMount() {
        var navigator = this.props.navigator;
        setTimeout(() => {
            navigator.replace({
                id: 'LoginPage'
            });
        }, 500);
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
                <Image source={logo} />
                <Text style={{color: 'white', fontSize: 32,}}>TRAVELIGHT!!</Text>
            </View>
        );
    }
}

module.exports = SplashPage;
