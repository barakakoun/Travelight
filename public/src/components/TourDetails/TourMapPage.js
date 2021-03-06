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
    Vibration,
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
    require('../../../assets/stations/stationCurrent.png'),
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

        this.state = {
            tourStations: this.props.store.tourStations,
        };
    }

    _handleBackPress() {
        Alert.alert(
            'Leaving Already?',
            'Sure you wanna stop the tour?',
            [
                {text: 'Yes', onPress: () => this.props.store.navigatorReplace("MainMapPage")},
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        );

        return true;
    }

    onStationModalClosed() {
        this.props.store.onStationPress(null);
    }

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

        var tourStations = this.props.store.tourStations;
        var currPoint = this.props.store.position;
        var closestStation = tourStations[0].key;
        var minDistance = this.props.store.calculateDistance(currPoint, tourStations[0].coordinate);

        tourStations.forEach((station) => {


            if (station.isClosest) {
                station.isClosest = null;
            }

            var currDistance = this.props.store.calculateDistance(currPoint, station.coordinate);

            if (currDistance < minDistance) {
                minDistance = currDistance;
                closestStation = station.key;
            }
        });

        // TODO: Change it!
        if (minDistance <= 100) {
            tourStations[closestStation-1].isClosest = true;
        }


        this.setState({
            tourStations: tourStations
        })

    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            ({coords}) => {
                const {latitude, longitude} = coords;
                this.props.store.setLocation(latitude,longitude,0.005,0.001);
                this.paintCloseMarker();
            },
            (error) => {},
            {enableHighAccuracy: true}
        );


    }

    componentWillMount() {
        this.getLocation();
    }

    componentDidMount() {

        setTimeout(() => {
            // this.map.animateToRegion(this.props.store.currRegion, 1);
            this.map.fitToElements(true);
        }, 500);

        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);

        this.watchID = navigator.geolocation.watchPosition(
            ({coords}) => {
                const {latitude, longitude} = coords;
                this.props.store.watchPosition(latitude,longitude,0.005,0.001);
                this.paintCloseMarker();
            });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        this.props.store.onTourPress(null);
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);

    }

    increment() {
        Alert.alert(this.counter.toString());
        Alert.alert(this.props.store.counter.toString());
        this.props.store.setCounter(this.props.store.counter+1);
    }

    render() {
        const {onStationPress} = this.props.store;
        const NavigationBarRouteMapper = {
            LeftButton(route, navigator, index, navState) {
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
        const varTop = windowHeight - 100;
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

                    {this.state.tourStations.map(currStation => (
                        <MapView.Marker
                            key={currStation.key}
                            coordinate={currStation.coordinate}
                            image={currStation.isClosest ? images[16] : images[currStation.key - 1]}
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
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    map: {
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
        backgroundColor: 'transparent',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});

module.exports = TourMapPage;