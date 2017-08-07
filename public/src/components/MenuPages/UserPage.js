
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    DrawerLayoutAndroid,
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon, Avatar } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

@observer
class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawer: null
        };
    }
    openDrawer() {
        this.setState({
            drawerOpen: true
        });
        console.log("drawer listener added");
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPressInDrawer.bind(this));
    }

    closeDrawer() {
        this.setState({
            drawerOpen: false
        });
        console.log("drawer listener removed");
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPressInDrawer.bind(this));
    }

    _handleBackPressInDrawer() {
        if (this.state.drawerOpen) {
            this.closeDrawer();
            this.state.drawer.closeDrawer();
            return true;
        }
        return false;
    }
    onOpenBurger(e) {
        this.state.drawer.openDrawer();
    }

    setDrawer = (drawer) => {
        this.setState({
            drawer
        });
    };

    PushToNavigator(id) {
        this.props.store.navigatorOpenDrawer(id, Navigator.SceneConfigs.SwipeFromLeft);
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
        const { navigatorOpenDrawer } = this.props.store;

        return (
            <DrawerLayoutAndroid
                onDrawerOpen={this.openDrawer.bind(this)}
                onDrawerClose={this.closeDrawer.bind(this)}
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => <SideNavigation
                    store={this.props.store}
                    navigator={navigator}
                    onChangeScene={(id) => {navigatorOpenDrawer(id, Navigator.SceneConfigs.SwipeFromLeft)}}
                />}
                ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
                <View style={styles.container}>
                    <MaterialToolbar title={'User Page'}
                                 primary={'googleBlue'}
                                 icon="menu"
                                 onIconPress={this.onOpenBurger.bind(this)}/>
                    <View style={styles.userphoto}>
                        <Avatar size={150} image={<Image source={{uri:currentUser.img}}/>} />
                    </View>
                    <View style={styles.userform}>
                        <Text style={{color: 'white', fontSize: 24,}}> First Name : {currentUser.firstName}</Text>
                        <Text style={{color: 'white', fontSize: 24,}}> Last Name : {currentUser.lastName}</Text>
                        <Text style={{color: 'white', fontSize: 24,}}> Email : {currentUser.email}</Text>
                    </View>

                </View>

            </DrawerLayoutAndroid>
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
