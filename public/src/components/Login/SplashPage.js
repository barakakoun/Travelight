
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
} from 'react-native';
import { observer } from 'mobx-react/native';

import logo from '../../../assets/splash.png';

@observer
class SplashPage extends Component {
    componentWillMount() {
        const { navigatorReplace } = this.props.store;
        this.props.store.getUserFromStorage();
        setTimeout(() => {
            if(this.props.store.accessToken)
            {
                navigatorReplace('MainMapPage')
            }
            else
            {
            navigatorReplace('LoginPage');
                }
        }, 500);
    }
    render() {

        return (
            <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
                <Image source={logo} />
                {/*<Text style={{color: 'white', fontSize: 32,}}>TRAVELIGHT!!</Text> */}
            </View>
        );
    }
}

module.exports = SplashPage;
