import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    TouchableOpacity,
    Dimensions,
    AppRegistry,
    Alert,
    Button,
    BackAndroid,
} from 'react-native';
import MapView from 'react-native-maps';
import StationModel from '../StationDetails/StationModel';
import RankModal from './RankModal';
import { Toolbar as MaterialToolbar, Icon } from 'react-native-material-design';
var nativeImageSource = require('nativeImageSource');

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 32.080523;
const LONGITUDE = 34.780852;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import {observer} from 'mobx-react/native';

const images = [
    require('../../../assets/stations/station_1.png'),
    require('../../../assets/stations/station_2.png'),
    require('../../../assets/stations/station_3.png'),
    require('../../../assets/stations/station_4.png'),
    require('../../../assets/stations/station_5.png'),
    require('../../../assets/stations/station_6.png'),
    require('../../../assets/stations/station_7.png'),
    require('../../../assets/stations/station_8.png'),
    require('../../../assets/stations/station_9.png'),
    require('../../../assets/stations/station_10.png'),
    require('../../../assets/stations/station_11.png'),
    require('../../../assets/stations/station_12.png'),
    require('../../../assets/stations/station_13.png'),
    require('../../../assets/stations/station_14.png'),
    require('../../../assets/stations/station_15.png'),
    require('../../../assets/stations/station_16.png'),
];



@observer
class TourMapPage extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object
    };

    // here we get all the tours in the current city
    constructor(props) {
        super(props);
        this.getLocation = this.getLocation.bind(this);

        this._handleBackPress = this._handleBackPress.bind(this);


        // Alert.alert(this.state.coords.length.toString());
        // var tour = this.props.tour;
        //
        // var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + tour.coordinate.latitude.toString() + ","
        //                                                                          + tour.coordinate.longitude.toString()
        //                                                                          + "&waypoints=";
        //
        // var arrCoords = [];
        //
        // tour.stations.forEach((station) => arrCoords.push({
        //     latitude:station.coordinate.latitude,
        //     longitude:station.coordinate.longitude
        // }));
        //
        // url += arrCoords[1].latitude.toString() + "," + arrCoords[1].longitude.toString();
        //
        // for (var i=2; i<(arrCoords.length-1); i++) {
        //     url += "|" + arrCoords[i].latitude.toString() + "," + arrCoords[i].longitude.toString();
        // }
        //
        // url += "&destination=" + arrCoords[arrCoords.length-1].latitude.toString() + "," + arrCoords[arrCoords.length-1].longitude.toString();
        //
        // url += "&key=AIzaSyAz94Lzcc_GhVXZdH8wDiqf61nKXJwEOJc&mode=walking";
        //
        // fetch(url)
        //     .then(response => response.json())
        //     .then(responseJson => {
        //         // Alert.alert(responseJson.toString());
        //         if (responseJson.routes.length) {
        //             this.setState({
        //                 coords: this.decode(responseJson.routes[0].overview_polyline.points) // definition below
        //             });
        //         }
        //     }).catch(e => {console.warn(e)});

        // this.state = {
        //     region: {
        //         latitude: LATITUDE,
        //         longitude: LONGITUDE,
        //         latitudeDelta: LATITUDE_DELTA,
        //         longitudeDelta: LONGITUDE_DELTA
        //     },
        //     tour: this.props.tour,
        //     coords: this.props.coords,
        // };
    }

    _handleBackPress() {
        Alert.alert(
            'Alert Title',
            'Sure you wanna stop tour?',
            [
                {text: 'Yes', onPress: () => this.props.store.navigatorReplace("MainMapPage")},
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        );

        return true;
    }

    // decode(encoded) {
    //     if (!encoded) {
    //         return [];
    //     }
    //     var poly = [];
    //     var index = 0, len = encoded.length;
    //     var lat = 0, lng = 0;
    //
    //     while (index < len) {
    //         var b, shift = 0, result = 0;
    //
    //         do {
    //             b = encoded.charCodeAt(index++) - 63;
    //             result = result | ((b & 0x1f) << shift);
    //             shift += 5;
    //         } while (b >= 0x20);
    //
    //         var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
    //         lat += dlat;
    //
    //         shift = 0;
    //         result = 0;
    //
    //         do {
    //             b = encoded.charCodeAt(index++) - 63;
    //             result = result | ((b & 0x1f) << shift);
    //             shift += 5;
    //         } while (b >= 0x20);
    //
    //         var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
    //         lng += dlng;
    //
    //         var p = {
    //             latitude: lat / 1e5,
    //             longitude: lng / 1e5,
    //         };
    //         poly.push(p);
    //     }
    //     return poly;
    // }

    onStationModalClosed() {
        this.props.store.onStationPress(null);
    }

    // onRankModalClosed() {
    //     // this.refs.TourMapNav.refs.RankModal.closeModal();
    //     // this.props.store.onRankIconPress(null);
    // }

    onStationPress(e,currStation) {
        this.props.store.onStationPress(e);
    }

    onRankIconPress(e, tourKeyForRanking) {
        this.props.store.onRankIconPress(e);
    }

    // Jump to current location
    _findMe(){
        if(this.props.store.currRegion) {
            this.map.animateToRegion(this.props.store.currRegion);
        }
        else {
            this.getLocation();
        }
    }

    paintCloseMarker() {
        // Alert.alert(this.props.store.position.latitude.toString() + " " + this.props.store.position.longitude.toString());
        //
        // var minDistance;
        // this.props.store.tourStations.forEach((station) => {
        //     if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        //         return;
        //     }
        //     if (product.category !== lastCategory) {
        //         rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
        //     }
        //     rows.push(<ProductRow product={product} key={product.name} />);
        //     lastCategory = product.category;
        // });

    }

    calculateDistance(pointA, pointB) {

        const lat1 = pointA.latitude;
        const lon1 = pointA.longitude;

        const lat2 = pointB.latitude;
        const lon2 = pointB.longitude;

        const R = 6371e3; // earth radius in meters
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
            ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance; // in meters
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            ({coords}) => {
                const {latitude, longitude} = coords;
                this.props.store.setLocation(latitude,longitude,0.005,0.001);
                this.paintCloseMarker();
                // this.props.store.setRegion(latitude,longitude,0.005,0.001);
                // this.props.store.setCurrRegion(latitude,longitude,0.005,0.001);
                // this.props.store.setPosition(latitude,longitude);
                // this.setState({
                //     position: {
                //         latitude,
                //         longitude,
                //     },
                //     region: {
                //         latitude,
                //         longitude,
                //         latitudeDelta: 0.005,
                //         longitudeDelta: 0.001,
                //     },
                //     currRegion: {
                //         latitude,
                //         longitude,//     }
                //         latitudeDelta: 0.005,
                //         longitudeDelta: 0.001,

                // })
            },
            (error) => {},
            {enableHighAccuracy: true}
        );

        this.watchID = navigator.geolocation.watchPosition(
            ({coords}) => {
                // const {lat, long} = coords
                // this.setState({
                //     position: {
                //         lat,
                //         long
                //     }
                // })
                const {latitude, longitude} = coords;
                this.props.store.watchPosition(latitude,longitude,0.005,0.001);
                this.paintCloseMarker();
                // this.setState({
                //     position: {
                //         latitude,
                //         longitude
                //     },
                //     currRegion: {
                //         latitude,
                //         longitude,
                //         latitudeDelta: 0.005,
                //         longitudeDelta: 0.001,
                //     }
                // })
            });

    }

    componentWillMount() {
        this.getLocation();
    }

    componentDidMount() {

        setTimeout(() => {
            // this.map.animateToRegion(this.props.store.currRegion, 1);
            this.map.fitToElements(true);
        }, 200);

        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        this.props.store.onTourPress(null);
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);

    }

    increment() {
        Alert.alert(this.counter.toString());
        // Alert.alert(this.props.toString());
        Alert.alert(this.props.store.counter.toString());
        this.props.store.setCounter(this.props.store.counter+1);
        // this.setState({
        //     counter: this.state.counter + 1
        // });
    }

    render() {
        const {onStationPress} = this.props.store;
        const NavigationBarRouteMapper = {
            LeftButton(route, navigator, index, navState) {
                Alert.alert("left button");
                return (
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
                                      onPress={() => this._handleBackPress()}>
                        <Icon name="keyboard-backspace" color="#FFFFFF" style={{ margin: 3,}} />
                    </TouchableOpacity>
                );
            },
            RightButton(route, navigator, index, navState) {
                return null;
            },
            Title(route, navigator, index, navState) {
                return null;
            }
        };
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                ref="TourMapNav"
            />
        );
    }

    renderScene(route, navigator) {


        const { height: windowHeight } = Dimensions.get('window');
        const varTop = windowHeight - 125;
        const hitSlop = {
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
        };
        bbStyle = function(vheight) {
            return {
                position: 'absolute',
                top: vheight,
                left: 10,
                right: 10,
                backgroundColor: 'transparent',
                alignItems: 'flex-end',
            }
        };

        const { currRegion,
                chosenTour,
                startTourPosition,
                tourStations,
                counter} = this.props.store;


        const firstIndex = tourStations[0].key;

        const mapNight = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#263c3f"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6b9a76"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ];

        const actions = [
        //     {
        //     icon: 'warning',
        //     badge: { value: counter, animate: true },
        //     onPress: () => this.props.store.setCounter(counter+1),
        // },
            {
            icon: 'star',
            onPress: () => this.props.store.onRankIconPress(this.props.store.chosenTour.key),
        }];

        return (
            <View style={styles.container}>
                <MaterialToolbar title={chosenTour.name}
                                 primary={'googleBlue'}
                                 icon="keyboard-backspace"
                                 onIconPress={() => this._handleBackPress()}
                                 // onIconPress={() => navigator.parentNavigator.replace({id: "MainMapPage"})}
                                 actions={actions}
                />
                <View style={bbStyle(varTop)}>
                    <TouchableOpacity
                        hitSlop = {hitSlop}
                        activeOpacity={1}
                        style={styles.mapButton}
                        onPress={ () => this._findMe() }
                    >

                        <Icon name="my-location" />
                    </TouchableOpacity>
                </View>


                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={startTourPosition}
                    customMapStyle={new Date().getHours() >= 17 || new Date().getHours() <= 8  ? mapNight : null}
                    toolbarEnabled={false}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    ref={ref => { this.map = ref; }}
                    onRegionChange={() => {
                        if (this.props.store.isStationModelOpen) {
                            this.refs.TourMapNav.refs.StationModel.closeModal();
                            this.props.store.setStationModalOpen(false);
                            this.onStationModalClosed();
                        }
                    }}
                >

                    <MapView.Polyline
                        coordinates={this.props.coords}
                        strokeWidth={3}
                        strokeColor="rgba(0, 150, 136, 0.9)"
                        geodesic={false}
                    />

                    {tourStations.map(currStation => (
                        <MapView.Marker
                            key={currStation.key}
                            coordinate={currStation.coordinate}
                            image={images[currStation.key - 1]}
                            onPress={this.onStationPress.bind(this,currStation)}
                        />
                    ))}
                </MapView>

                <StationModel ref="StationModel" store={this.props.store}
                              onStationModalClosed={() => this.onStationModalClosed.bind(this)}
                              chosenStation={this.props.store.chosenStation ? this.props.store.chosenStation : null}/>

                <RankModal ref="RankModal" store={this.props.store}
                              // onRankModalClosed={() => this.onRankModalClosed.bind(this)}
                           tourKeyForRanking={this.props.store.tourKeyForRanking ? this.props.store.tourKeyForRanking : null}/>
            </View>
        );
    }
}

TourMapPage.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject,
        // justifyContent: 'flex-end',
        // alignItems: 'center',
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: -1,
    },
    mapButton: {
        width: 60,
        height: 60,
        borderRadius: 85/2,
        backgroundColor: 'rgba(252, 253, 253, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 8,
        shadowOpacity: 0.12,
        opacity: .9,
        zIndex: 10,
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        // flexDirection: 'row',
        // marginVertical: 20,
        backgroundColor: 'transparent',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});



module.exports = TourMapPage;