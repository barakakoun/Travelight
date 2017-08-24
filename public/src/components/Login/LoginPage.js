
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Navigator,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import { Button, SocialIcon } from 'react-native-elements'
import { observer } from 'mobx-react/native';
import Login from 'react-native-login';
import logo from '../../../assets/splash.png';
import backgroundImage from '../../../assets/loginBackground.jpg';
import FBSDK from 'react-native-fbsdk';
import  _ from 'lodash';

const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

const config = {
    url: 'https://auth.no-mad.net/auth',
    realm: 'ReactAppRealm',
    client_id: 'reactapp',
    redirect_uri: 'https://success.no-mad.net/success.html',
    appsite_uri: 'https://app.no-mad.net/app.html',
    kc_idp_hint: 'facebook',
};

@observer
class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.onLogin = this.onLogin.bind(this);
    }
    componentWillMount() {
        Login.tokens()
            .then(tokens =>  this.props.store.setLoginTokens(tokens))
            .catch(() => this.props.store.setLoginTokens(null));
    }

    onLogin() {
        this.props.store.navigatorReplace('MainMapPage');
    }

    onLogout() {
        Login.end();
        this.props.store.setLoginTokens(null);
    }

    render() {
        return (
            <Navigator
                renderScene={(r, n) => this.renderLoginScreen()}
            />
        );
    }

    renderLoginScreen() {
        return (
        <Image source={backgroundImage} style={styles.background}>
                <Text style={{color: 'white', fontSize: 40,}}>Welcome to Travelight!</Text>

                <SocialIcon title='Sign In With Facebook'
                            button type='facebook'
                            onPress={()=>{this.props.store.loginWithFacebook();}}
                />
                <SocialIcon
                    title='Sign In With Google'
                    button type='google-plus-official'
                    onPress={() => {this.props.store.loginWithGoogle();}}
                />
        </Image>
        );
    }


}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 32,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        width: null,
        height: null,
    },
    navigatorContainer: {
        flex: 1,
        backgroundColor: '#FF0000'
    },
});


module.exports = LoginPage;