import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Picker,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    Dimensions
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon,Avatar } from 'react-native-material-design';
import {observer} from 'mobx-react/native';

const { height, width } = Dimensions.get('window');

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
        const { selectedLanguage } = this.props.store;

        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="SettingsPage"/>
        );
    }

    renderScene(route, navigator) {
        const { selectedLanguage } = this.props.store;

        return (
            <View  style={styles.container}>
                <MaterialToolbar title={'Settings'}
                                 primary={'googleBlue'}/>

                { selectedLanguage == "en" ?
                    <Text style={{color: 'white', fontSize: 26, marginTop: 60}}>Choose tour language:</Text> :
                    <Text style={{color: 'white', fontSize: 26, marginTop: 60}}>בחר את שפת הסיור:</Text>
                }
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(lang) => this.props.store.changeSystemLanguage(lang)}>
                    <Picker.Item label="English" value="en" />
                    <Picker.Item label="עברית" value="he" />
                </Picker>

                { selectedLanguage == "en" ?
                    <Text style={{color: 'white', fontSize: 20, marginTop: 60}}>
                        Pay attention! The language is relevant only to the stations' information
                    </Text> :
                    <Text style={{color: 'white', fontSize: 20, marginTop: 60}}>
                        שים לב! השפה רלוונטית רק למידע על התחנות
                    </Text>
                }
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
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});

module.exports = SettingsPage;
