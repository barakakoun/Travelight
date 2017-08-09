/**
 * Created by galna21 on 04/08/2017.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    TouchableOpacity,
    BackAndroid,
    Button,
    Image,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { Toolbar as MaterialToolbar, Icon, Avatar, Divider, Card } from 'react-native-material-design';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { observable } from 'mobx';
import {observer} from 'mobx-react/native';
import Stars from 'react-native-stars-rating';
import _ from 'lodash';

const { width } = Dimensions.get('window');

@observer
class TourReviews extends Component {
    constructor(props) {
        super(props);
        this.exitPage = this.exitPage.bind(this);
    }

    exitPage() {
        // this.props.store.resetChosenTour();
        this.props.store.appNavigator.pop()
    }

    componentDidMount() {
        this.props.store.getTourReviews();
        BackAndroid.addEventListener('hardwareBackPress', this.exitPage);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.exitPage);
        // if(!this.isStartTour) {
        //     this.exitPage();
        // }
    }

    render() {
        const {tourReviews} = this.props.store;
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
        const { chosenTour,
                tourReviews } = this.props.store;
        return (
            <ScrollView style={{ backgroundColor: '#FFFFFF'}}>
                <Text style={{ color: 'black', fontSize: 32,  marginTop: 60, fontWeight: 'bold', marginLeft: 4,}}>{chosenTour.name}</Text>
                <View style={styles.oneByOne}>
                    <Text style={{marginTop: 10, marginRight: 2, fontSize: 20, marginLeft: 4,}}>
                        {chosenTour.rating}
                    </Text>
                    <Stars
                        isActive={false}
                        rateMax={5}
                        isHalfStarEnabled={true}
                        rate={chosenTour.rating}
                        size={40}
                    />
                    <Text style={{marginTop: 10, fontSize: 14, marginLeft: 4,}}>
                        { tourReviews.length } reviews
                    </Text>
                </View>
                <View style={styles.oneUnderOne}>
                    { tourReviews.map((review, index) => (
                        <Card key={index}>
                            <Card.Body style={styles.oneByOne}>
                                <View style={styles.oneByOne}>
                                    <Avatar size={50} image={<Image
                                        source={{uri: review.userImg}}/>}/>
                                    <View style={styles.oneUnderOne}>
                                        <Text style={{marginLeft: 2, marginTop: 10, marginRight: 3, fontSize: 14}}>
                                            {review.firstName + ' ' + review.lastName}
                                        </Text>
                                        <View style={{marginTop: 2}}>
                                            <Stars
                                                isActive={false}
                                                rateMax={5}
                                                isHalfStarEnabled={true}
                                                rate={review.rank}
                                                size={10}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <Text>
                                    {review.reviewText}
                                </Text>
                            </Card.Body>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        );
    }
}

const NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
                              onPress={() => navigator.parentNavigator.pop()}>
                <Icon name="keyboard-backspace" color="#FFFFFF" style={{ margin: 10,}} />
            </TouchableOpacity>
        );
    },
    RightButton(route, navigator, index, navState) {
        return null;
    },
    Title(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: 'white', margin: 10, fontSize: 20}}>
                    Tour Reviews
                </Text>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#3B5998",
        color: "white",
    },
    wrapper: {
        marginTop: 60,
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    image: {
        marginTop: 60,
        width,
        flex: 1
    },
    oneByOne: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    twoSides: {
        // backgroundColor: '#5592f4',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    oneUnderOne: {
       // backgroundColor: '#5592f4',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    icon: {
        marginRight: 10,
        marginLeft: 10
    }
});

module.exports = TourReviews;
