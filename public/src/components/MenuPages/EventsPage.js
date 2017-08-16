
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    Dimensions
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon,Avatar } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

const { height, width } = Dimensions.get('window');

import comingsoon from '../../../assets/comingsoon.png';

@observer
class EventsPage extends Component {
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
            <View  style={styles.container}>
                <MaterialToolbar title={'Event Page'}
                                 primary={'googleBlue'}/>
                <Image
                    resizeMode='stretch'
                    style={styles.image}
                    source={comingsoon}
                />
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
    image: {
        width,
        height,
        flex: 1
    },
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'flex-end',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});


module.exports = EventsPage;
