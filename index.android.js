/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ToolbarAndroid
} from 'react-native';
import MapView from 'react-native-maps';

import barakpin from './assets/barakpin.png';
import baraklogo from './assets/baraklogo.png';
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


export default class travelight extends Component {
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
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [],
        };
    }

    onMapPress(e) {
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
                  onPress={(e) => this.onMapPress(e)}
              >
                  {this.state.markers.map(marker => (
                      <MapView.Marker
                          key={marker.key}
                          coordinate={marker.coordinate}
                          image={barakpin}
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

    _onActionSelected = (position) => {
        this.setState({
            actionText: 'Selected ' + toolbarActions[position].title,
        });
    };
}


travelight.propTypes = {
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






// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//     },
//     map: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

AppRegistry.registerComponent('travelight', () => travelight);
