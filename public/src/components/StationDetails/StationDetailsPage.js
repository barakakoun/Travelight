
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    TouchableOpacity,
    BackAndroid,
    Button,
    Image,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon, Divider, Card } from 'react-native-material-design';
import { observable } from 'mobx';
import {observer} from 'mobx-react/native';
import Swiper from 'react-native-swiper';
const { height, width } = Dimensions.get('window');
import CardView from 'react-native-cardview';

@observer
class StationDetailsPage extends Component {
    constructor(props) {
        super(props);

        // this.exitPage = this.exitPage.bind(this);
        // this.showReviews = this.showReviews.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);
    }

    _handleBackPress() {
        this.props.store.navigatorPop();
        return true;
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    render() {
        const {chosenStation} = this.props.store;
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
        const { chosenStation } = this.props.store;
        const heightForText = height - 400;

        return (
                <View style={styles.container} >

                    <View style={{marginTop: 50}}>
                        <Text style={styles.text}>
                            {chosenStation.name}
                        </Text>
                    </View>


                    <Swiper style={styles.bubble}
                            height={280}
                            activeDot={<View style={{backgroundColor: 'white', width: 9, height: 9, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                            showsButtons={false}
                            loop
                    >
                        {
                            chosenStation.img.map((image,index) => (
                                <View style={styles.slide} key={index}>
                                    <Image
                                        key={index}
                                        resizeMode='stretch'
                                        style={styles.image}
                                        source={{uri: image.toString()}}
                                    >

                                    </Image>

                                </View>
                            ))
                        }
                    </Swiper>

                    { chosenStation.text ?
                        <CardView
                            cardElevation={5}
                            cardMaxElevation={5}
                            cornerRadius={5}
                            style={[styles.bubble, {maxHeight: heightForText, padding: 5}]}>
                            <ScrollView style={{paddingRight:10}}>
                                <Text>
                                    {chosenStation.text}
                                </Text>
                            </ScrollView>
                        </CardView> :
                        <Text>Sorry! No Information at this point...</Text>
                    }
                </View>
        );
    }
}

const NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
                              onPress={() => navigator.parentNavigator.pop()}>
                <Icon name="keyboard-backspace" color="#FFFFFF" style={{ margin: 10,}} />
            </TouchableOpacity>
        );
    },
    RightButton(route, navigator, index, navState) {
        return null;
    },
    Title(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: 'white', margin: 10, fontSize: 20}}>
                    Station Details
                </Text>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fafafa',
        alignItems:'center'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image:{
        flex: 2,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    img:{
        width,
        flex:1
    },
    name:{
        flex: 1,
        height: 60,
        justifyContent:'center',
        alignItems:'center'
    },
    text: {
        color: "black",
        fontSize: 22,
        margin: 10,
    },
    info: {
        justifyContent:'flex-start',
    },
    bubble:{
        margin: 5,
        backgroundColor: 'white',
        borderRadius:10,
        // shadowColor: '#000000',
        // shadowOffset: {
        //     width: 3,
        //     height: 3
        // },
        // shadowRadius: 3,
        // shadowOpacity: 1.0
    }
});

module.exports = StationDetailsPage;
