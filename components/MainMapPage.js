/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import TourDetailsModal from './TourDetailsModal';
// import TourDetailsPage from './TourDetailsPage';

// import X from 'components/X';


import barakpin from '../assets/barakpin.png';
import baraklogo from '../assets/baraklogo.png';
var nativeImageSource = require('nativeImageSource');

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 32.080523;
const LONGITUDE = 34.780852;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const drawer = this.refs.navigator && this.refs.navigator.refs.modal2;

class MainMapPage extends Component {

    // here we get all the tours in the current city
    constructor(props) {
        super(props);

        this.state = {
            tours: [
                {
                    key: 1,
                    coordinate: {
                        latitude: 32.0802627,
                        longitude: 34.7808783
                    },
                    latDel: LATITUDE_DELTA,
                    lonDel: LONGITUDE_DELTA
                },
                {
                    key: 2,
                    coordinate: {
                        latitude: 32.0745575,
                        longitude: 34.7772692
                    },
                    latDel: LATITUDE_DELTA,
                    lonDel: LONGITUDE_DELTA
                },
                {
                    key: 3,
                    coordinate: {
                        latitude: 32.0633612,
                        longitude: 34.7730913
                    },
                    latDel: LATITUDE_DELTA,
                    lonDel: LONGITUDE_DELTA
                }
            ],
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            markers: [],
            chosenTour: null,
            isOpen: false,
        };
    }


    // When we press on a map marker (which represent tour)
    onTourPress(e, chosenTour) {

        // We set the chosen tour as the clicked one
        this.setState({
            chosenTour: e,
            isOpen: false
        });

        setTimeout(() => {
            if (this.state.chosenTour != null) {
                this.setState({
                    isOpen: true
                });
            }
        }, 500);
    }


    // AFTER we close the details modal
    onModalTourDetailsClosed() {
        this.setState({chosenTour: null});
    }

    // Go to the page contains the tour details
    goToTourDetails(e) {
        var chosenTour = this.state.chosenTour;
        this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
        this.setState({isOpen: false});

        if (chosenTour != null) {
            this.props.navigator.push({
                id: 'TourDetailsPage',
                chosenTour: chosenTour
            });
        }
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                ref="MainMapNav"
                navigationBar={
                    <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                                             routeMapper={NavigationBarRouteMapper}/>
                }/>
        );
    }

    renderScene(route, navigator) {
        return (
            <View style={styles.container}>

                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={this.state.region}
                    onRegionChange={() => {
                        if (this.state.isOpen) {
                            this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
                            this.setState({isOpen: false});
                        }
                    }}
                >
                    {this.state.tours.map(currTour => (
                        <MapView.Marker
                            key={currTour.key}
                            coordinate={currTour.coordinate}
                            image={barakpin}
                            onPress={this.onTourPress.bind(this, currTour)}
                        />
                    ))}
                </MapView>

                <TourDetailsModal ref="TourDetailsModal" goToTourDetails={this.goToTourDetails.bind(this)}
                                  onModalTourDetailsClosed={this.onModalTourDetailsClosed.bind(this)}
                                  chosenTour={this.state.chosenTour}/>

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
                    Travelight
                </Text>
            </TouchableOpacity>
        );
    }
};


MainMapPage.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

module.exports = MainMapPage;
