
import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

class TourDetailsPage extends Component {
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 32,}}>TRAVELIGHT!!</Text>
            </View>
        );
    }
}

module.exports = TourDetailsPage;
