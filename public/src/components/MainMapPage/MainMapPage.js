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
    AppRegistry,
    DrawerLayoutAndroid,
    Alert,
    Button,
    BackAndroid,
    AsyncStorage,
} from 'react-native';
import MapView from 'react-native-maps';
import TourDetailsModal from '../TourDetails/TourDetailsModal';
import { Toolbar as MaterialToolbar, Icon } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import { observer } from 'mobx-react/native';
import _ from 'lodash';

const nativeImageSource = require('nativeImageSource');

@observer
class MainMapPage extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object
    };

    // here we get all the tours in the current city
    constructor(props) {
        super(props);

        this.state = {
            drawer: null
        };
        this.getLocation = this.getLocation.bind(this);

        this._handleBackPressExit = this._handleBackPressExit.bind(this);

        this._handleBackPressInDrawer = this._handleBackPressInDrawer.bind(this);
    }

    // When we press on a map marker (which represent tour)
    onTourPress(e, chosenTour) {

        // We set the chosen tour as the clicked one
        // this.setState({
        //     chosenTour: e,
        //     isTourModalOpen: false
        // });
        // this.setState({
        //     isTourModalOpen: false
        // });
        this.props.store.onTourPress(e);
        //this.props.store.setTourModalOpen(true);


        // setTimeout(() => {
        //     if (this.props.store.chosenTour) {
        //         this.props.store.setTourModalOpen(true);
        //     }
        // }, 500);
    }

    openDrawer() {
        this.setState({
            drawerOpen: true
        });
        console.log("drawer listener added");
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPressInDrawer);
    }

    closeDrawer() {
        this.setState({
            drawerOpen: false
        });
        console.log("drawer listener removed");
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPressInDrawer);
    }

    _handleBackPressInDrawer() {
        if (this.state.drawerOpen) {
            this.closeDrawer();
            this.state.drawer.closeDrawer();
            return true;
        }
        return false;
    }

    onOpenBurger(e) {
        this.state.drawer.openDrawer();
    }

    // AFTER we close the details modal
    onModalTourDetailsClosed() {
        //this.setState({chosenTour: null});
        // this.props.store.onTourPress(null);
        this.props.store.resetChosenTour();
    }

    // Called when the user choose "more info" in the TourDetailsModal
    goToTourDetails(e) {

        // Enable if you want the modal to close
        this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
        this.props.store.setTourModalOpen(false);

        if (this.props.store.chosenTour) {
            BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPressExit);
            this.props.store.getTourStations();
            this.props.store.navigatorOpenTourModal('TourDetailsPage', Navigator.SceneConfigs.FloatFromBottom);
        }
    }

    setDrawer = (drawer) => {
        this.setState({
            drawer
        });
    };

    PushToNavigator(id) {
        this.props.store.navigatorOpenDrawer(id, Navigator.SceneConfigs.SwipeFromLeft);
    }

    // Jump to current location
    _findMe(){

        if(this.props.store.currRegion) {
            this.map.animateToRegion(this.props.store.currRegion);
        }
        else {
            this.getLocation();
        }

        // navigator.geolocation.getCurrentPosition(
        //     ({coords}) => {
        //         Alert.alert("ok");
        //         const {latitude, longitude} = coords
        //         this.setState({
        //             position: {
        //                 latitude,
        //                 longitude,
        //             },
        //             region: {
        //                 latitude,
        //                 longitude,
        //                 latitudeDelta: 0.005,
        //                 longitudeDelta: 0.001,
        //             }
        //         })
        //     },
        //     (error) => alert(JSON.stringify(error)),
        //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000}
        // )
    }

    paintCloseMarker() {
        Alert.alert(this.props.store.position.latitude.toString() + " " + this.props.store.position.longitude.toString());

        // var currPoint = this.props.store.position;
        // var closestStation = this.props.store.tourStations[3];
        // var minDistance = this.calculateDistance(currPoint, this.props.store.tourStations[0].coordinate);
        //
        // this.props.store.tourStations.forEach((station) => {
        //
        //     var currDistance = this.props.store.calculateDistance(currPoint, station.coordinate);
        //
        //     if (currDistance < minDistance) {
        //         minDistance = currDistance;
        //         closestStation = station;
        //     }
        // });
        //
        // if (minDistance <= 6) {
        //
        // }


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
            (error) => Alert.alert("Error: Are location services on?"),
            {enableHighAccuracy: true}
        );

        // this.watchID = navigator.geolocation.watchPosition(
        //     ({coords}) => {
        //         // const {lat, long} = coords
        //         // this.setState({
        //         //     position: {
        //         //         lat,
        //         //         long
        //         //     }
        //         // })
        //         const {latitude, longitude} = coords;
        //         this.props.store.watchPosition(latitude,longitude,0.005,0.001);
        //         // this.setState({
        //         //     position: {
        //         //         latitude,
        //         //         longitude
        //         //     },
        //         //     currRegion: {
        //         //         latitude,
        //         //         longitude,
        //         //         latitudeDelta: 0.005,
        //         //         longitudeDelta: 0.001,
        //         //     }
        //         // })
        //     });
    }

    componentWillMount() {
        this.getLocation();
        this.props.store.getUserData();
        this.props.store.getAvailableTours();
    }

    componentDidMount() {
        setTimeout(() => {
            // this.map.animateToRegion(this.props.store.currRegion, 1);
            this.map.fitToElements(false);
        }, 50);

        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPressExit);
        // this._findMe();



        this.watchID = navigator.geolocation.watchPosition(
            ({coords}) => {
                const {latitude, longitude} = coords;
                this.props.store.watchPosition(latitude,longitude,0.005,0.001);
            });
    }

    _handleBackPressExit() {
        Alert.alert(
            'Alert Title',
            'Sure you wanna exit?',
            [
                {text: 'Yes', onPress: () => BackAndroid.exitApp()},
                {text: 'No', onPress: () => console.log('Cancel Exit'), style: 'cancel'},
            ]
        );

        return true;
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);

        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPressExit);
    }

    render() {
        const {availableTours} = this.props.store;

        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="MainMapNav"
                />
        );
    }

    renderScene(route, navigator) {
        const {region,
               availableTours } = this.props.store;
        const { height: windowHeight } = Dimensions.get('window');
        const varTop = windowHeight - 100;
        const hitSlop = {
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
        };

        var currRegion = this.props.store.currRegion;

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

        let navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> I'm in the Drawer!</Text>
            </View>
        );

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

        return (
        <DrawerLayoutAndroid
            onDrawerOpen={this.openDrawer.bind(this)}
            onDrawerClose={this.closeDrawer.bind(this)}
            drawerWidth={200}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => <SideNavigation store={this.props.store}
            navigator={navigator} onChangeScene={this.PushToNavigator.bind(this)}/>}
            ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
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
                    customMapStyle={new Date().getHours() >= 17 || new Date().getHours() <= 8  ? mapNight : null}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    ref={ref => { this.map = ref; }}
                    onRegionChange={() => {
                        if (this.props.store.isTourModalOpen) {
                            this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
                            this.props.store.setTourModalOpen(false);
                            this.onModalTourDetailsClosed();
                        }
                    }}
                >

                    {availableTours.map(currTour => (
                        <MapView.Marker
                            key={currTour.key}
                            coordinate={currTour.coordinate}
                            // image={barakpin}
                            pinColor={"blue"}
                            onPress={this.onTourPress.bind(this, currTour)}
                        />
                    ))}
                </MapView>

                <MaterialToolbar title={'Travelight'}
                                 primary={'googleBlue'}
                                 icon="menu"
                                 onIconPress={this.onOpenBurger.bind(this)}/>

                <TourDetailsModal ref="TourDetailsModal" goToTourDetails={this.goToTourDetails.bind(this)}
                                  onModalTourDetailsClosed={() => this.onModalTourDetailsClosed.bind(this)}
                                  store={this.props.store}
                                  chosenTour={this.props.store.chosenTour ? this.props.store.chosenTour : null} />

            </View>

        </DrawerLayoutAndroid>
        );
    }
}

let NavigationBarRouteMapper = {
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

module.exports = MainMapPage;
