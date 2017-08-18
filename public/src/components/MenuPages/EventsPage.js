
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon,Card } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

const { height, width } = Dimensions.get('window');

import comingsoon from '../../../assets/comingsoon.png';

@observer
class EventsPage extends Component {
    constructor(props) {
        super(props);

        this._handleBackPress = this._handleBackPress.bind(this);

        this.props.store.getCityEvents();
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

    onEventPress(url) {
        this.props.store.appNavigator.push({
            id: 'EventWebView',
            url: url
        });
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
        const { cityEvents } = this.props.store;

        return (
            <ScrollView  style={styles.container}>
                <MaterialToolbar title={'Recommended for you'}
                                 primary={'googleBlue'}/>

                <Text style={styles.text}>Here are some tours we think are perfect for you</Text>
                <View style={styles.oneUnderOne}>
                    { cityEvents.map((event, index) => (
                        <TouchableOpacity key={index} onPress={() => this.onEventPress(event.url)}>
                            <Card key={index}>
                                <Card.Media
                                    image={<Image source={{uri: event.img}} />}
                                    overlay
                                >
                                    <Text style={{fontSize: 30, color: 'white'}}>{event.name}</Text>
                                </Card.Media>
                                <Card.Body style={styles.oneByOne}>
                                    <Text>
                                        {event.description}
                                    </Text>
                                </Card.Body>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
        backgroundColor: '#FFFFFF'
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});


module.exports = EventsPage;
