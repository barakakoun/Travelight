
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
import { Toolbar as MaterialToolbar, Icon, Divider } from 'react-native-material-design';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { observable } from 'mobx';
import {observer} from 'mobx-react/native';
import Swiper from 'react-native-swiper';
import Stars from 'react-native-stars-rating';
import _ from 'lodash';

const { width } = Dimensions.get('window');

@observer
class TourDetailsPage extends Component {
    @observable isStartTour = false;
    constructor(props) {
        super(props);

        this.startTour = this.startTour.bind(this);
        this.exitPage = this.exitPage.bind(this);
        this.showReviews = this.showReviews.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);
    }

    _handleBackPress() {
        this.props.store.navigatorPop();
        return true;
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);
        if(!this.isStartTour) {
            this.exitPage();
        }
    }

    exitPage() {
        this.props.store.resetChosenTour();
        //this.props.store.navigatorPop();
    }

    startTour() {
        const { chosenTour,
                tourStations } = this.props.store;
        if(chosenTour) {
            if (tourStations) {
                let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + chosenTour.coordinate.latitude.toString() + ","
                    + chosenTour.coordinate.longitude.toString()
                    + "&waypoints=";

                const arrCoords = [];

                tourStations.forEach((station) => arrCoords.push({
                    latitude: station.coordinate.latitude,
                    longitude: station.coordinate.longitude
                }));

                url += arrCoords[0].latitude.toString() + "," + arrCoords[0].longitude.toString();

                for (let i = 1; i < (arrCoords.length - 1); i++) {
                    url += "|" + arrCoords[i].latitude.toString() + "," + arrCoords[i].longitude.toString();
                }

                url += "&destination=" + arrCoords[arrCoords.length - 1].latitude.toString() + "," + arrCoords[arrCoords.length - 1].longitude.toString();

                url += "&key=AIzaSyAz94Lzcc_GhVXZdH8wDiqf61nKXJwEOJc&mode=walking";

                fetch(url)
                    .then(response => response.json())
                    .then(responseJson => {
                        // Alert.alert(responseJson.toString());
                        if (responseJson.routes.length) {
                            this.isStartTour = true;
                            this.props.store.appNavigator.pop();
                            this.props.store.appNavigator.replace({
                                id: 'TourMapPage',
                                tour: chosenTour,
                                coords: this.decode(responseJson.routes[0].overview_polyline.points)
                            });
                        }
                    }).catch(e => {
                    console.warn(e);
                });
            }
        }
        else {
            console.warn("No tour");
        }
    }

    showReviews() {
        //this.props.store.appNavigator.pop();
        this.props.store.appNavigator.push({
            id: 'ReviewsPage',
        });
    }

    decode(encoded) {
        if (!encoded) {
            return [];
        }
        const poly = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

            let dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

            let dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            const p = {
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            };
            poly.push(p);
        }
        return poly;
    }

    componentDidMount() {
        // this.props.store.getTourReviews();
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    render() {
        const {tourStations} = this.props.store;
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
        const { chosenTour,
                tourStations } = this.props.store;
        return (
            <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: '#FFFFFF'}}>
                <Swiper style={{marginTop: 60, marginBottom: 10}}
                        height={280}
                        activeDot={<View style={{backgroundColor: '#0000FF', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                        showsButtons={true}
                        nextButton={<Text style={{backgroundColor: 'transparent', fontSize: 38, color:'#0000FF'}}>›</Text>}
                        prevButton={<Text style={{backgroundColor: 'transparent', fontSize: 38, color:'#0000FF'}}>‹</Text>}
                        loop
                >
                    {
                        tourStations.map((station,index) => (
                            <View style={styles.slide} key={index}>
                                <Image
                                    key={index}
                                    resizeMode='stretch'
                                    style={styles.image}
                                    source={{uri: station.img.length ? station.img[0].toString() : "https://www.game-on.no/templates/newyork/images/no_image.png"}}
                                />
                                <Text style={{fontSize: 30, flex: 1, justifyContent: 'center'}}>
                                    {station.name}
                                </Text>
                            </View>
                        ))
                    }
                </Swiper>
                <Divider style={{ marginBottom: 10 }}/>
                <View style={styles.oneUnderOne}>
                    <Text style={{color: 'white', fontSize: 24, marginBottom: 10, paddingLeft: 2}}>
                        {chosenTour.name}
                    </Text>
                    <View style={styles.twoSides}>
                        <View style={styles.oneByOne}>
                            <Icon name="timer" color="#FFFFFF" style={styles.icon}/>
                            <Text style={{fontSize: 20, color: 'white', paddingLeft: 2 }}>
                                {chosenTour.duration}
                            </Text>
                        </View>
                        <Text style={{fontSize: 15, color: 'white'}}>
                            {chosenTour.distance} Km
                        </Text>
                        <Icon name='directions-walk' color="#FFFFFF" style={styles.icon} />

                    </View>
                    <View style={styles.twoSides}>
                        <View style={styles.oneByOne}>
                            <Text style={{marginRight: 2, color:'white', paddingLeft: 2}}>
                                {chosenTour.rating}
                            </Text>
                            <Stars
                                isActive={false}
                                rateMax={5}
                                isHalfStarEnabled={true}
                                onStarPress={(rating) => console.log(rating)}
                                rate={chosenTour.rating}
                                size={20}
                            />
                            <TouchableOpacity onPress={() => this.showReviews()}>
                                <Text style={{marginLeft: 10, color:'white'}}>
                                     { chosenTour.reviews } reviews
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {chosenTour.accessible ?
                            <Icon name="accessible" color="#FFFFFF" style={styles.icon}/> : null
                        }
                    </View>

                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
                    <ScrollView style={{height: 15, paddingLeft: 2}}>
                        <Text style={{fontSize: 15}}>
                            {chosenTour.description}
                        </Text>
                    </ScrollView>
                    <Button onPress={() => this.startTour()} title="Start Tour" style={styles.btn}/>
                </View>
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
                    Tour Details
                </Text>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#3B5998",
        color: "white",
    },
    wrapper: {
        marginTop: 60,
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    image: {
        marginTop: 60,
        width,
        flex: 1
    },
    oneByOne: {
        backgroundColor: '#5592f4',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    twoSides: {
        backgroundColor: '#5592f4',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    oneUnderOne: {
        backgroundColor: '#5592f4',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    icon: {
        marginRight: 10,
        marginLeft: 10
    }
});

module.exports = TourDetailsPage;
