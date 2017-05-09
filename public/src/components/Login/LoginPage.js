
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

// import Login from 'react-native-simple-login';
import Login from 'react-native-login';
import logo from '../../../assets/splash.png';
import backgroundImage from '../../../assets/loginBackground.jpg';

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

        this.renderScene.bind(this)
    }
    componentWillMount() {
        Login.tokens()
            .then(tokens =>  this.props.store.setLoginTokens(tokens))
            .catch(() => this.props.store.setLoginTokens(null));
    }

    onLogin() {
        // Login.start(config).then(tokens => {
        //     this.setState({tokens: tokens});
        // }).catch(() => this.setState({tokens: null}));
        this.props.store.navigatorReplace('MainMapPage');
    }

    onLogout() {
        Login.end();
        this.props.store.setLoginTokens(null);
    }

    render() {
        const { loginTokens } = this.props.store;
        return (
            <View style={styles.navigatorContainer}>
                <Image source={backgroundImage} style={styles.background} />
                <Navigator
                renderScene={(r, n) => this.renderScene(r,n,loginTokens)}
                navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5', alignItems: 'center'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
            </View>
        );
    }

    renderScene(route, navigator, loginTokens) {

        return loginTokens ? this.renderAppScreen(loginTokens) : this.renderLoginScreen();
    }

    renderAppScreen(loginTokens) {
        const details = Login.decodeToken(loginTokens.id_token);

        return (
            <View style={styles.container}>
                <View style={styles.profile}>
                    <Text style={styles.text}>Welcome!</Text>
                    <Text style={styles.text}>{details.name}</Text>
                    <Text style={styles.text}>{details.email}</Text>
                </View>
                <Button borderRadius={30} backgroundColor="#5cb85c" title='Logout' onPress={() => this.onLogout()} />
            </View>
        );
    }

    renderLoginScreen() {
        return (
            <View style={styles.container}>
                <Text style={{color: 'white', fontSize: 16,}}>Welcome to Travelight!</Text>
                <SocialIcon title='Sign In With Facebook' button type='facebook' onPress={() => this.onLogin()} />
                <SocialIcon title='Sign In With Google' button type='google-plus-official' onPress={() => this.onLogin()} />
            </View>
        );
    }
}
const NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        return null;
    },
    RightButton(route, navigator, index, navState) {
        return null;
    },
    Title(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: 'white', margin: 10, fontSize: 16}}>
                    מסך התחברות
                </Text>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 32,
    },
    // imageContainer: {
    //     flex: 1,
    //     // remove width and height to override fixed static size
    //     width: null,
    //     height: null,
    // },
    background: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 390,
        height: 600
    },
    navigatorContainer: {
        flex: 1,
        backgroundColor: '#FF0000'
    },
});

//     onLogin(e, email, password) {
//     console.log(email, password) // user credentials
//     }
//
//     onResetPassword(e, email) {
//         console.log(email)
//     }
//
//     render() {
//         return (
//             <Navigator
//                 renderScene={this.renderScene.bind(this)}
//                 navigationBar={
//             <Navigator.NavigationBar style={{backgroundColor: '#246dd5', alignItems: 'center'}}
//                 routeMapper={NavigationBarRouteMapper} />
//           } />
//         );
//     }
//     renderScene(route, navigator) {
//         return (
//             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//                 <TouchableHighlight
//                     onPress={this.gotoNext.bind(this)}>
//                     <Text style={{color: 'red'}}>התחבר</Text>
//                 </TouchableHighlight>
//                 <Login
//                     onLogin={this.onLogin.bind(this, email, password)}
//                     onResetPassword={this.onResetPassword.bind(this, email)}
//                 />
//             </View>
//         );
//     }
//     gotoNext() {
//         this.props.navigator.replace({
//             id: 'MainMapPage'
//         });
//     }
// }

module.exports = LoginPage;