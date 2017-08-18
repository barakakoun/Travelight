
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    Button,
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon, Avatar } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

@observer
class UserPage extends Component {
    constructor(props) {
        super(props);

        this._handleBackPress = this._handleBackPress.bind(this);
    }

    _handleBackPress() {
        this.props.store.navigatorPop();
        return true;
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="UserPage"/>
        );
    }

    renderScene(route, navigator) {
        const { currentUser } = this.props.store;

        return (
                <View style={styles.container}>
                    <MaterialToolbar title={'User Page'}
                                 primary={'googleBlue'}/>
                    <View style={styles.userphoto}>
                        <Avatar size={150} image={<Image source={{uri:currentUser.img}}/>} />
                    </View>
                    <View style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                        <Avatar size={150} image={<Image source={{uri:currentUser.img}}/>} />
                    </View>
                    <View style={styles.userform}>
                        <Text style={{color: 'white', fontSize: 24,}}> First Name : {currentUser.firstName}</Text>
                        <Text style={{color: 'white', fontSize: 24,}}> Last Name : {currentUser.lastName}</Text>
                        <Text style={{color: 'white', fontSize: 24,}}> Email : {currentUser.email}</Text>
                    </View>

                </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent:'center',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
    userphoto: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
    userform: {
        flex: 1,
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    img: {
        height: '110',
        width: '110'
    }
});


module.exports = UserPage;
