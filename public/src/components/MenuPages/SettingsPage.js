
import React, { Component } from 'react';
import {
    View,
    Text,
    Picker,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    DrawerLayoutAndroid,
    Dimensions
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon,Avatar } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

const { height, width } = Dimensions.get('window');

import comingsoon from '../../../assets/comingsoon.png';

@observer
class SettingsPage extends Component {
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
        //const {appNavigator} = this.props.store;
        const { selectedLanguage } = this.props.store;

        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="SettingsPage"/>
        );
    }

    renderScene(route, navigator) {
        const { navigatorOpenDrawer, selectedLanguage } = this.props.store;

        return (
            <DrawerLayoutAndroid
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => <SideNavigation
                    store={this.props.store}
                    navigator={navigator}
                    onChangeScene={(id) => {navigatorOpenDrawer(id, Navigator.SceneConfigs.SwipeFromLeft)}}
                />}
                ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
            <View  style={styles.container}>
                <MaterialToolbar title={'Settings'}
                                 primary={'googleBlue'}
                                 icon="menu"
                                 onIconPress={this.onOpenBurger.bind(this)}/>
                { selectedLanguage == "EN" ?
                    <Text style={{color: 'white', fontSize: 20, marginTop: 60}}>Choose tour language:</Text> :
                    <Text style={{color: 'white', fontSize: 20, marginTop: 60}}>בחר את שפת הסיור:</Text>
                }
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(lang) => this.props.store.changeSystemLanguage(lang)}>
                    <Picker.Item label="English" value="EN" />
                    <Picker.Item label="עברית" value="HE" />
                </Picker>
            </View>
            </DrawerLayoutAndroid>
        );
    }
}

var NavigationBarRouteMapper = {
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
                    title
                </Text>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    image: {
        width,
        height,
        flex: 1
    },
    container: {
        justifyContent: 'flex-start',
        //alignItems: 'center',
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});


module.exports = SettingsPage;
