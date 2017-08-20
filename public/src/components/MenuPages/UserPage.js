
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    BackAndroid,
    ScrollView,
    Button,
} from 'react-native';
import { Toolbar as MaterialToolbar, Avatar, Icon, Card, CheckboxGroup, Checkbox } from 'react-native-material-design';
import SideNavigation from '../Navigation/SideNavigation';
import {observer} from 'mobx-react/native';
import CardView from 'react-native-cardview';
// import Icon from 'react-native-vector-icons/Ionicons';


@observer
class UserPage extends Component {
    constructor(props) {
        super(props);

        this._handleBackPress = this._handleBackPress.bind(this);
    }

    _handleBackPress() {
        this.props.store.navigatorPop();
        return true;
    }

    componentDidMount() {
        // this.props.store.getHistoryTours();
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.store.appNavigator}
                ref="UserPage"/>
        );
    }

    renderScene(route, navigator) {
        const { currentUser,
                historyTours,
                onRecommendedTourPress
                } = this.props.store;

        return (
                <View style={styles.container}>
                    <MaterialToolbar title={'User Page'}
                                 primary={'googleBlue'}/>
                    {/*<Image style={styles.userphoto} source={{uri:currentUser.img}}/>*/}
                    <View style={styles.userphoto}>
                        <Avatar size={150} image={<Image source={{uri:currentUser.img}}/>} />
                    </View>
                    {/*<View style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>*/}
                        {/*<Avatar size={150} image={<Image source={{uri:currentUser.img}}/>} />*/}
                    {/*</View>*/}

                        <ScrollView tabLabel='Detailes'>
                            <View style={styles.userform}>
                                <Text style={{color: 'white', fontSize: 24,}}> First Name : {currentUser.firstName}</Text>
                                <Text style={{color: 'white', fontSize: 24,}}> Last Name : {currentUser.lastName}</Text>
                                <Text style={{color: 'white', fontSize: 24,}}> Email : {currentUser.email}</Text>
                            </View>

                        </ScrollView>
                        <ScrollView tabLabel='Tours History'>
                            <View style={[styles.oneUnderOne, {paddingBottom:80}]}>
                                { historyTours.map((tour, index) => (
                                    <TouchableOpacity key={index} onPress={() => onRecommendedTourPress(tour, Navigator.SceneConfigs.FloatFromBottom)}>
                                        <Card key={index}>
                                            <Card.Media
                                                image={<Image source={{uri: tour.img}} />}
                                                overlay
                                            >
                                                <Text style={{fontSize: 30, color: 'white'}}>{tour.name}</Text>
                                            </Card.Media>
                                            <Card.Body style={styles.oneByOne}>
                                                <View style={styles.twoSides}>
                                                    <View style={styles.oneByOne}>
                                                        <Icon name="timer" color="#000000" style={styles.icon}/>
                                                        <Text style={{fontSize: 18, color: "black"}}>
                                                            {tour.duration}
                                                        </Text>
                                                    </View>
                                                    <Text style={{fontSize: 15, color: 'black'}}>
                                                        {tour.distance} Km
                                                    </Text>
                                                    <Icon name='directions-walk' color="#000000" style={styles.icon} />
                                                </View>
                                            </Card.Body>
                                        </Card>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        <ScrollView tabLabel='Interests'>
                            <CardView
                                cardElevation={5}
                                cardMaxElevation={5}
                                cornerRadius={5}
                                style={[styles.bubble, { padding: 5}]}>
                                <CheckboxGroup
                                    onSelect={(values) => { console.log(`${values} are currently selected`)}}
                                    checked={[1, 3, 4]}
                                    items={[{
                                        value: 1, label: 'Sport'
                                    }, {
                                        value: 2, label: 'Art'
                                    }, {
                                        value: 3, label: 'Food'
                                    }, {
                                        value: 4, label: 'History'
                                    }, {
                                        value: 5, label: 'Night Life'
                                    }, {
                                        value: 6, label: 'Family'
                                    }]}
                                />
                            </CardView>
                        </ScrollView>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent:'center',
        // flexDirection: 'column',
        alignItems: 'center'
    },
    container2: {
        flex: 1,
        justifyContent:'center',
        // height: 500
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
    userphoto: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 55,
        height: 50
    },
    userform: {
        flex: 1,
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    img: {
        height: '110',
        width: '110'
    },
    // icon: {
    //     width: 300,
    //     height: 300,
    //     alignSelf: 'center',
    // },
    oneByOne: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    twoSides: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    oneUnderOne: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    bubble:{
        margin: 5,
        backgroundColor: 'white',
        borderRadius:10,
        height: 400
    }
});


module.exports = UserPage;
