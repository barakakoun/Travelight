
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
import { Toolbar as MaterialToolbar, Icon,Avatar } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

@observer
class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawer: null
        };
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
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="EventPage"/>
        );
    }

    renderScene(route, navigator) {
        return (
            <DrawerLayoutAndroid
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => <SideNavigation store={this.props.store} navigator={navigator}
             onChangeScene={this.PushToNavigator.bind(this)}/>}
                ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
            <View  style={styles.container}>
                <MaterialToolbar title={'User Page'}
                                 primary={'googleBlue'}
                                 icon="menu"
                                 onIconPress={this.onOpenBurger.bind(this)}/>
                <Text style={{color: 'white', fontSize: 32,}}>Events Page</Text>
            </View>
            </DrawerLayoutAndroid>
        );
    }
}

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
                              onPress={() => navigator.parentNavigator.pop()}>
                <Text style={{color: 'white', margin: 10,}}>
                    left button
                </Text>
            </TouchableOpacity>
        );
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
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});


module.exports = EventsPage;
