
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon,Avatar } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

@observer
class AboutPage extends Component {
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
                ref="AboutPage"/>
        );
    }

    renderScene(route, navigator) {
        return (
            <View  style={styles.container}>
                <MaterialToolbar title={'About'}
                                 primary={'googleBlue'}/>
                <Text style={{color: 'white', fontSize: 32,  marginTop: 60 }}>Travelight</Text>
                <Text style={{color: 'white', fontSize: 26, marginBottom: 20}}>Tour Guide In Your Pocket!</Text>
                <Text style={{color:'white', fontSize: 18, marginLeft: 2}}>
                    Our application will replace the human tour guide in a way that allows you to
                    travel freely in all the city’s tour sites using your smartphones .{"\n"}
                    {"\n"}
                    By a chosen location, you will be able to view all the tours provided by our
                    team, and travel to every site you want.{"\n"}
                    {"\n"}
                    You will be able to consume the service using any media source: videos,
                    audios, photographs, etc. accompanied by in-depth explanation which equals to
                    those that have been given by human tour guides.
                </Text>
            </View>
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
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});


module.exports = AboutPage;
