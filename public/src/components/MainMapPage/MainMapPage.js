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
} from 'react-native';
import MapView from 'react-native-maps';
import TourDetailsModal from '../TourDetails/TourDetailsModal';
import { Toolbar as MaterialToolbar, Icon } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';
import barakpin from '../../../assets/barakpin.png';
import baraklogo from '../../../assets/baraklogo.png';

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

    onOpenBurger(e) {
        this.state.drawer.openDrawer();
    }

    // AFTER we close the details modal
    onModalTourDetailsClosed() {
        //this.setState({chosenTour: null});
        this.props.store.onTourPress(null);
    }

    // Go to the page contains the tour details
    goToTourDetails(e) {
        //let chosenTour = this.state.chosenTour;

        // Enable if you want the modal to close
        this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
        // this.setState({isTourModalOpen: false});
        this.props.store.setTourModalOpen(false);

        //if (chosenTour) {
        if (this.props.store.chosenTour) {
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

    componentDidMount() {
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
        this.props.store.getAvailableTours();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
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
               currRegion } = this.props.store;
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

        let navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> I'm in the Drawer!</Text>
            </View>
        );

        return (
        <DrawerLayoutAndroid
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
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    ref={ref => { this.map = ref; }}
                    onRegionChange={() => {
                        if (this.props.store.isTourModalOpen) {
                            this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
                            this.props.store.setTourModalOpen(false);
                        }
                    }}
                >

                    {this.props.store.availableTours.map(currTour => (
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

                {/*<View style={styles.buttonContainer}>*/}
                    {/*<Button*/}
                        {/*onPress={this.onOpenBurger.bind(this)}*/}
                        {/*title="hey"*/}
                    {/*/>*/}
                {/*</View>*/}

                <TourDetailsModal ref="TourDetailsModal" goToTourDetails={this.goToTourDetails.bind(this)}
                                  onModalTourDetailsClosed={this.onModalTourDetailsClosed.bind(this)}
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
