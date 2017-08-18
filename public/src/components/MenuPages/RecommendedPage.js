
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
    ScrollView
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon, Card, Divider } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';

const { height, width } = Dimensions.get('window');

import comingsoon from '../../../assets/comingsoon.png';

@observer
class RecommendedPage extends Component {
    constructor(props) {
        super(props);

        this.goToTourDetails = this.goToTourDetails.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);

    }

    goToTourDetails(tour) {
        this.props.store.navigatorOpenTourModal('TourDetailsPage', Navigator.SceneConfigs.FloatFromBottom);
    }

    _handleBackPress() {
        this.props.store.navigatorPop();
        return true;
    }

    componentDidMount() {
        this.props.store.getRecommendedTours();
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    render() {
        const { recommendedTours } = this.props.store;
        //const {appNavigator} = this.props.store;
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="RecommendedPage"/>
        );
    }

    renderScene(route, navigator) {
        const { currentUser,
                recommendedTours,
                onRecommendedTourPress
                } = this.props.store;
        return (
            <View style={styles.container}>
                <MaterialToolbar title={'Recommended for you'}
                                 primary={'googleBlue'}/>
                <Text style={styles.text}>Here are some tours we believe would be perfect for you!</Text>
                <Divider style={{ marginBottom: 2 }}/>
                <ScrollView  >
                    <View style={[styles.oneUnderOne, {paddingBottom:80}]}>
                        { recommendedTours.map((tour, index) => (
                            <TouchableOpacity key={index} onPress={() => onRecommendedTourPress(tour, Navigator.SceneConfigs.FloatFromBottom)}>
                                <Card key={index}>
                                    <Card.Media
                                        image={<Image source={{uri: tour.img}} />}
                                        overlay
                                    >
                                        <Text style={{fontSize: 30, color: 'white'}}>{tour.name}</Text>
                                    </Card.Media>
                                    <Card.Body style={styles.oneByOne}>
                                        <View style={styles.twoSides}>
                                            <View style={styles.oneByOne}>
                                                <Icon name="timer" color="#000000" style={styles.icon}/>
                                                <Text style={{fontSize: 18, color: "black"}}>
                                                    {tour.duration}
                                                </Text>
                                            </View>
                                            <Text style={{fontSize: 15, color: 'black'}}>
                                                {tour.distance} Km
                                            </Text>
                                            <Icon name='directions-walk' color="#000000" style={styles.icon} />
                                        </View>
                                    </Card.Body>
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
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
        marginTop: 60,
        fontSize: 14,
        color: 'black',
        marginLeft: 4 ,
    },
    title: {
        color: 'black',
        fontSize: 32,
        marginTop: 60,
        fontWeight:'bold',
        marginLeft: 4 ,
    },
    image: {
        width,
        height,
        flex: 1
    },
    container: {
        backgroundColor: '#FFFFFF',
        // flex: 1,
        // justifyContent: 'flex-start',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
    oneByOne: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    twoSides: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    oneUnderOne: {
        // backgroundColor: '#5592f4',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
});


module.exports = RecommendedPage;
