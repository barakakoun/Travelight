
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
} from 'react-native';
import { observer, inject } from 'mobx-react/native';

import logo from '../../../assets/splash.png';

@observer
class SplashPage extends Component {
    componentWillMount() {
        const { appNavigator,
                navigatorReplace } = this.props.store;
        setTimeout(() => {
            navigatorReplace('LoginPage');
        }, 1000);
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
