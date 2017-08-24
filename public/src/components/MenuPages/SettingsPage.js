
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
