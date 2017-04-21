
import React, { Component } from 'react';
import {
    View,
    Text,
    Navigator,
    TouchableOpacity,
    BackAndroid,
    DrawerLayoutAndroid,
} from 'react-native';

class TourDetailsPage extends Component {
    constructor(props) {
        super(props);
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
        // var navigationView = (
        //     <View style={{flex: 1, backgroundColor: '#fff'}}>
        //         <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
        //     </View>
        // );
        // return (
        //     <DrawerLayoutAndroid
        //         drawerWidth={300}
        //         drawerPosition={DrawerLayoutAndroid.positions.Left}
        //         renderNavigationView={() => navigationView}>
        //         <View style={{flex: 1, alignItems: 'center'}}>
        //             <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
        //             <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
        //         </View>
        //     </DrawerLayoutAndroid>
        // );
    }
    renderScene(route, navigator) {
        let tour = this.props.chosenTour;
        return (
            <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 32,}}>TOUR DETAILS: {tour.key.toString()} and {tour.coordinate.latitude.toString()}</Text>
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
                    title
                </Text>
            </TouchableOpacity>
        );
    }
};

module.exports = TourDetailsPage;
