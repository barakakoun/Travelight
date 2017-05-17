
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
class EventsPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //const {appNavigator} = this.props.store;
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                navigationBar={
                    <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                                             routeMapper={NavigationBarRouteMapper} />
                } />
        );
    }

    renderScene(route, navigator) {
        return (
            <View  style={styles.container}>
                <Text style={{color: 'white', fontSize: 32,}}>Events Page</Text>
            </View>
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
        margin: 32,
    },
});


module.exports = EventsPage;