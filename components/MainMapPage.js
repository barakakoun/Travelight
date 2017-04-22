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
    DrawerLayoutAndroid,
    Alert,
    Button,
} from 'react-native';
import MapView from 'react-native-maps';
import TourDetailsModal from './TourDetailsModal';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';
import SideNavigation from './SideNavigation';
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

    static childContextTypes = {
        drawer: React.PropTypes.object
    };

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
            isTourModalOpen: false,
            drawer: null,
            barak: "barak",
        };
    }


    // When we press on a map marker (which represent tour)
    onTourPress(e, chosenTour) {

        // We set the chosen tour as the clicked one
        this.setState({
            chosenTour: e,
            isTourModalOpen: false
        });

        setTimeout(() => {
            if (this.state.chosenTour != null) {
                this.setState({
                    isTourModalOpen: true
                });
            }
        }, 500);
    }

    onOpenBurger(e) {
        this.state.drawer.openDrawer();
    }

    // AFTER we close the details modal
    onModalTourDetailsClosed() {
        this.setState({chosenTour: null});
    }

    // Go to the page contains the tour details
    goToTourDetails(e) {
        var chosenTour = this.state.chosenTour;

        // Enable if you want the modal to close
        this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
        this.setState({isTourModalOpen: false});

        if (chosenTour != null) {
            this.props.navigator.push({
                id: 'TourDetailsPage',
                chosenTour: chosenTour,
                configureScene: Navigator.SceneConfigs.FloatFromBottom
            });
        }
    }

    setDrawer = (drawer) => {
        this.setState({
            drawer
        });
    }

    PushToNavigator(id) {
        this.props.navigator.push({
            id: id,
            configureScene: Navigator.SceneConfigs.FloatFromBottom
        });
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                ref="MainMapNav"
                />
        );
    }

    renderScene(route, navigator) {
        var navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
            </View>
        );

        return (
        <DrawerLayoutAndroid
            drawerWidth={200}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => <SideNavigation navigator={navigator} onChangeScene={this.PushToNavigator.bind(this)}/>}
            ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
            <View style={styles.container}>




                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={this.state.region}
                    toolbarEnabled={false}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChange={() => {
                        if (this.state.isTourModalOpen) {
                            this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
                            this.setState({isTourModalOpen: false});
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
                                  chosenTour={this.state.chosenTour}/>

            </View>

        </DrawerLayoutAndroid>
        );
    }

    // render() {
    //     return (
    //         <Navigator
    //             renderScene={this.renderScene.bind(this)}
    //             navigator={this.props.navigator}
    //             ref="MainMapNav"
    //             navigationBar={
    //                 <MaterialToolbar title={'The title :)'}
    //                                  primary={'googleBlue'}
    //                                  icon="menu"
    //                                  onIconPress={this.onOpenBurger.bind(this)}/>
    //             }/>
    //     );
    // }
    //
    // renderScene(route, navigator) {
    //     var navigationView = (
    //         <View style={{flex: 1, backgroundColor: '#fff'}}>
    //             <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
    //         </View>
    //     );
    //     return (
    //         <DrawerLayoutAndroid
    //             drawerWidth={300}
    //             drawerPosition={DrawerLayoutAndroid.positions.Left}
    //             renderNavigationView={() => navigationView}
    //             ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
    //             <View style={styles.container}>
    //
    //                 <MapView
    //                     provider={this.props.provider}
    //                     style={styles.map}
    //                     initialRegion={this.state.region}
    //                     onRegionChange={() => {
    //                         if (this.state.isTourModalOpen) {
    //                             this.refs.MainMapNav.refs.TourDetailsModal.closeModal();
    //                             this.setState({isTourModalOpen: false});
    //                         }
    //                     }}
    //                 >
    //                     {this.state.tours.map(currTour => (
    //                         <MapView.Marker
    //                             key={currTour.key}
    //                             coordinate={currTour.coordinate}
    //                             image={barakpin}
    //                             onPress={this.onTourPress.bind(this, currTour)}
    //                         />
    //                     ))}
    //                 </MapView>
    //
    //                 <TourDetailsModal ref="TourDetailsModal" goToTourDetails={this.goToTourDetails.bind(this)}
    //                                   onModalTourDetailsClosed={this.onModalTourDetailsClosed.bind(this)}
    //                                   chosenTour={this.state.chosenTour}/>
    //
    //             </View>
    //
    //         </DrawerLayoutAndroid>
    //     );
    // }

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
