
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    TouchableOpacity,
    BackAndroid,
    Button,
    Alert
} from 'react-native';
import {observer} from 'mobx-react/native'
import _ from 'lodash';

@observer
class TourDetailsPage extends Component {
    constructor(props) {
        super(props);

        this.startTour = this.startTour.bind(this);
    }

    startTour(tour) {
        console.warn(this.props.store);
        if(tour) {
            if (tour.stations) {
                let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + tour.coordinate.latitude.toString() + ","
                    + tour.coordinate.longitude.toString()
                    + "&waypoints=";

                const arrCoords = [];

                tour.stations.forEach((station) => arrCoords.push({
                    latitude: station.coordinate.latitude,
                    longitude: station.coordinate.longitude
                }));

                url += arrCoords[1].latitude.toString() + "," + arrCoords[1].longitude.toString();

                for (let i = 2; i < (arrCoords.length - 1); i++) {
                    url += "|" + arrCoords[i].latitude.toString() + "," + arrCoords[i].longitude.toString();
                }

                url += "&destination=" + arrCoords[arrCoords.length - 1].latitude.toString() + "," + arrCoords[arrCoords.length - 1].longitude.toString();

                url += "&key=AIzaSyAz94Lzcc_GhVXZdH8wDiqf61nKXJwEOJc&mode=walking";

                fetch(url)
                    .then(response => response.json())
                    .then(responseJson => {
                        // Alert.alert(responseJson.toString());
                        if (responseJson.routes.length) {

                            this.props.store.appNavigator.replace({
                                id: 'TourMapPage',
                                tour: tour,
                                coords: this.decode(responseJson.routes[0].overview_polyline.points)
                            });
                        }
                    }).catch(e => {
                    console.warn(e)
                });


                // this.props.navigator.replace({
                //     id: 'TourMapPage',
                //     tour: this.state.currTour
                // });
            }
        }
        else {
            console.warn("No tour");
        }
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

    render() {
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
        const tour = this.props.store.chosenTour;
        console.warn(tour);
        return (
            <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 32,}}>TOUR DETAILS: {tour.key.toString()} and {tour.coordinate.latitude.toString()}</Text>
                <Button onPress={() => this.startTour(tour)} title="Start Tour" style={styles.btn}/>
            </View>
        );
    }
}

const NavigationBarRouteMapper = {
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
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        color: "white",
        padding: 10
    },
});

module.exports = TourDetailsPage;
