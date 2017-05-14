
import React, { Component } from 'react';
import {
    View,
    Text,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
} from 'react-native';
import {observer} from 'mobx-react/native';

@observer
class UserPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {appNavigator} = this.props.store;
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={appNavigator}
                navigationBar={
                    <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                                             routeMapper={NavigationBarRouteMapper} />
                } />
        );
    }

    renderScene(route, navigator) {
        return (
            <View  style={styles.container}>
                <Text style={{color: 'white', fontSize: 32,}}>User Page</Text>
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
        justifyContent: 'center',
        margin: 32,
    },
});


module.exports = UserPage;
