/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    ToolbarAndroid,
} from 'react-native';
import MapView from 'react-native-maps';

// import X from 'components/X';


import barakpin from '../assets/barakpin.png';
import baraklogo from '../assets/baraklogo.png';
var nativeImageSource = require('nativeImageSource');

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 32.080523;
const LONGITUDE = 34.780852;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}


class MainMapPage extends Component {
    static title = '<ToolbarAndroid>';
    static description = 'Examples of using the Android toolbar.';

    state = {
        actionText: 'Example app with toolbar component',
        toolbarSwitch: false,
        colorProps: {
            titleColor: '#3b5998',
            subtitleColor: '#6a7180',
        },
    };

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
        };
    }

    // onMapPress(e) {
    //     this.setState({
    //         markers: [
    //             ...this.state.markers,
    //             {
    //                 coordinate: e.nativeEvent.coordinate,
    //                 key: id++,
    //                 color: randomColor(),
    //             },
    //         ],
    //     });
    // }

    onTourPress(e) {
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: e.nativeEvent.coordinate,
                    key: id++,
                    color: randomColor(),
                },
            ],
        });
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
        return (
            <View style={styles.container}>
              <ToolbarAndroid
                  logo={baraklogo}
                  title="AwesomeApp"
                  actions={[{title: 'Settings', icon: baraklogo, show: 'always'}]}
                  onActionSelected={this._onActionSelected} />


                <MapView
                  provider={this.props.provider}
                  style={styles.map}
                  initialRegion={this.state.region}
              >
                  {this.state.tours.map(marker => (
                      <MapView.Marker
                          key={marker.key}
                          coordinate={marker.coordinate}
                          image={barakpin}
                          onMarkerPress={this.gotoTourDetailsPage.bind(this)}
                      />
                  ))}
              </MapView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => this.setState({ markers: [] })}
                    style={styles.bubble}
                >
                  <Text style={{color:'blue'}}>TRAVELIGHT</Text>
                </TouchableOpacity>
              </View>
            </View>
        );
    }
    gotoTourDetailsPage() {
        this.props.navigator.push({
            id: 'TourDetailsPage',
            name: this,
        });
    }

    _onActionSelected = (position) => {
        this.setState({
            actionText: 'Selected ' + toolbarActions[position].title,
        });
    };
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
                    title
                </Text>
            </TouchableOpacity>
        );
    }
};


MainMapPage.propTypes = {
    provider: MapView.ProviderPropType,
};



var toolbarActions = [
    {title: 'Create', icon: nativeImageSource({
        android: 'ic_create_black_48dp',
        width: 96,
        height: 96
    }), show: 'always'},
    {title: 'Filter'},
    {title: 'Settings', icon: nativeImageSource({
        android: 'ic_settings_black_48dp',
        width: 96,
        height: 96
    }), show: 'always'},
];



const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
    bubble: {
        backgroundColor: 'rgba(236,160,95,0.6)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});

module.exports = MainMapPage;
