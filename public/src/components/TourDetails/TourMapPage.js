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
} from 'react-native';
import MapView from 'react-native-maps';
import TourDetailsModal from './TourDetailsModal';
import { Toolbar as MaterialToolbar, Icon } from 'react-native-material-design';
var nativeImageSource = require('nativeImageSource');

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 32.080523;
const LONGITUDE = 34.780852;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import {observer} from 'mobx-react/native';

@observer
class TourMapPage extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object
    };

    // here we get all the tours in the current city
    constructor(props) {
        super(props);
        this.getLocation = this.getLocation.bind(this);

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

    // Jump to current location
    _findMe(){
        if(this.props.store.currRegion) {
            this.map.animateToRegion(this.props.store.currRegion);
        }
        else {
            this.getLocation();
        }
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            ({coords}) => {
                const {latitude, longitude} = coords;
                this.props.store.setLocation(latitude,longitude,0.005,0.001);
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
                //         longitude,
                //         latitudeDelta: 0.005,
                //         longitudeDelta: 0.001,
                //     }
                // })
            },
            (error) => alert('Error: Are location services on?'),
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

    componentDidMount() {

        this.getLocation();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }



    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                ref="TourMapNav"
                navigationBar={
                    <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                                             routeMapper={NavigationBarRouteMapper} />
                }
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

        const { currRegion } = this.props.store;

        return (
            <View style={styles.container}>

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
                    initialRegion={currRegion}
                    toolbarEnabled={false}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    ref={ref => { this.map = ref; }}
                >

                    <MapView.Polyline
                        coordinates={this.props.coords}
                        strokeWidth={1}
                    />

                    {this.props.store.chosenTour.stations.map(currStation => (
                        <MapView.Marker
                            key={currStation.key}
                            coordinate={currStation.coordinate}
                            pinColor={"green"}
                        />
                    ))}
                </MapView>
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
                    Travelight
                </Text>
            </TouchableOpacity>
        );
    }
};


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