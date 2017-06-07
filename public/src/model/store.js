import {observable, action, computed, runInAction} from 'mobx';
import { LATITUDE_DELTA,
         LONGITUDE_DELTA,
         FACEBOOK_LOGIN,
         GOOGLE_LOGIN,
         REGULAR_LOGIN,
         STATION_LONGITUDE_DELTA,
         STATION_LATITUDE_DELTA,
        GET_FROM_SERVER,
        } from "../../../Consts/variables";
import { LOGINUSER,
         URL_TOURS_ENDPOINT } from "../../../Consts/urls";
import FBSDK from 'react-native-fbsdk';
import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import massages from "../../../Consts/messages";
import Sound from 'react-native-sound';
const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    AccessToken
} = FBSDK;
import _ from 'lodash';

class Store {
    @observable appNavigator = null;
    @observable loginTokens = null;
    @observable availableTours = [];
    @observable chosenTour = null;
    @observable chosenStation = null;
    @observable tourStations = [];
    @observable region = null;
    @observable currRegion = null;
    @observable position = null;
    @observable accessToken = null;
    @observable userName = null;
    @observable firstName = null;
    @observable lastName = null;
    @observable email = null;
    @observable userPhoto = null;
    @observable isTourModalOpen = false;
    @observable isStationModelOpen = false;
    @observable audio = null;
    @observable currentUser = {
        img: "http://www.worldofbuzz.com/wp-content/uploads/2015/04/noprofilemale.gif?x82567",
        name: "Unknown"
    };

    constructor() {
        this.setAppNavigator = this.setAppNavigator.bind(this);
        this.setLoginTokens = this.setLoginTokens.bind(this);
        this.navigatorReplace = this.navigatorReplace.bind(this);
        this.navigatorOpenTourModal = this.navigatorOpenTourModal.bind(this);
        this.navigatorOpenDrawer = this.navigatorOpenDrawer.bind(this);
        this.navigatorPop = this.navigatorPop.bind(this);
        this.onTourPress = this.onTourPress.bind(this);
        this.onStationPress = this.onStationPress.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setCurrRegion = this.setCurrRegion.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.watchPosition = this.watchPosition.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.loginWithFacebook = this.loginWithFacebook.bind(this);
        this.loginWithGoogle = this.loginWithGoogle.bind(this);
        this.getFacebookUserData = this.getFacebookUserData.bind(this);
        this.setTourModalOpen = this.setTourModalOpen.bind(this);
        this.setStationModalOpen = this.setStationModalOpen.bind(this);
        this.getUserFromStorage = this.getUserFromStorage.bind(this);
        this.mapFacebookDataToUser.bind(this);
        this.setAudio = this.setAudio.bind(this);
        this.playAudio = this.playAudio.bind(this);
        this.stopAudio = this.stopAudio.bind(this);
        this.pauseAudio = this.pauseAudio.bind(this);
        this.releaseAudio = this.releaseAudio.bind(this);
        //this.removeUserFromStorage = this.removeUserFromStorage.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
    }

    sendFacebookLoginDataToServer(){
        fetch(LOGINUSER,{method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                method: '1'
            })}).then((response) => response.json())
            .then((responseJson) => {
            console.warn("After facebook login");
            if(responseJson.message === massages.loginUserSucess)
            {
                //this.navigatorReplace('MainMapPage');
            }
            else {
                alert(responseJson.message);
            }
        }).catch((error)=>{
            //Right now if server not on just on
            //this.navigatorReplace('MainMapPage');
        })
    }

    @action getUserFromStorage() {
    //     AsyncStorage.multiGet(['token','firstName','lastName','email']).then((data)=>{
    //     console.warn(data[0][1]);
    //     if(data[0][1])
    //     {
    //         this.accessToken = data[0][1];
    //         this.currentUser.firstName = data[1][1];
    //     }
    // })
        AsyncStorage.getItem('token').then((value) => {
            if(value)
            {
                this.accessToken = value;
                this.loginType = FACEBOOK_LOGIN;
            }
    });
    }

    initUser() {
        this.currentUser.firstName = '';
        this.currentUser.lastName='';
        this.currentUser.email='';
        this.currentUser.name='';
        this.currentUser.img=null;
    }

    @action logoutUser() {
        this.initUser();
        this.removeUserFromStorage();
    }

    removeUserFromStorage() {
        // AsyncStorage.multiRemove(['token','firstName','lastName','email']);
        AsyncStorage.removeItem('token');
    }

    @action loginWithFacebook() {
        LoginManager.logInWithReadPermissions(['public_profile','email'])
            .then(result => {
                console.warn(JSON.stringify(result, null, 3));
                if (result.isCancelled) {
                    alert('Login was cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            console.warn(_.values(data));
                            this.loginType = FACEBOOK_LOGIN;
                            this.accessToken = data.accessToken;
                            this.navigatorReplace('MainMapPage');
                             //this.getUserData();
                        });
                }
            })
            .catch(error => {
                alert('Login failed with error: ' + error);
            }
        );
    }

    @action loginWithGoogle() {
        this.loginType = GOOGLE_LOGIN;
        this.navigatorReplace('MainMapPage');
    }

    @action getUserData() {
        switch (this.loginType) {
            case FACEBOOK_LOGIN:
                this.getFacebookUserData();
                break;
            case GOOGLE_LOGIN:
                this.getGoogleUserData();
                break;
            default:
                break;
        }
    }

    @action getFacebookUserData() {
        const responseInfoCallback = (error,result)=>{
            if (error) {
                alert('Error fetching data: ' + JSON.stringify(error));
            } else {
                //this.currentUser = result.map((result)=>this.mapFacebookDataToUser)
                this.currentUser = {
                    img: result.picture.data.url,
                    firstName : result.first_name,
                    lastName: result.last_name,
                    email: result.email,
                };
                //var jresult = JSON.parse(result);
                // this.userPhoto = result.picture.data.url;
                // this.firstName = result.first_name;
                // this.lastName = result.last_name;
                // this.email = result.email;
                // AsyncStorage.multiSet([['token',this.accessToken],['firstName',this.currentUser.firstName],
                // ['lastname',this.currentUser.lastName],['email',this.currentUser.email]],(err)=>{
                //     if (err)
                //     {
                //         console.warn('something not right');
                //     }
                // });
                AsyncStorage.setItem('token', this.accessToken);
                this.sendFacebookLoginDataToServer()
            }
        };

        const infoRequest = new GraphRequest(
            '/me',
            {
                accessToken: this.accessToken,
                parameters: {
                    fields: {
                        string: 'email,first_name,last_name,name,picture' // what you want to get
                    }
                }},
            responseInfoCallback
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    mapFacebookDataToUser(fbUser) {
        return ({
            img: fbUser.picture.data.url,
            firstName: fbUser.first_name,
            lastName: fbUser.last_name,
            email: fbUser.email,
        });
    }

    @computed get userFullName() {
        return this.currentUser.firstName + " " + this.currentUser.lastName;
    }

    @action getGoogleUserData() {
        this.currentUser.img = "https://www.wired.com/wp-content/uploads/2015/09/google-logo-1200x630.jpg";
        this.currentUser.firstName = "Google";
        this.currentUser.lastName = "Google";
        this.currentUser.email = "gal@google.com";
    }

    @action setAppNavigator(nav) {
        this.appNavigator = nav;
    }

    @action setLoginTokens(tokens) {
        this.loginTokens = tokens;
    }

    @action navigatorReplace(screenId) {
        this.appNavigator.replace({id: screenId})
    }

    @action navigatorOpenTourModal(screenId,configureScene ) {
        this.appNavigator.push({
            id: screenId,
            chosenTour: this.chosenTour,
            configureScene: configureScene
        });
    }

    @action navigatorOpenDrawer(screenId, configureScene) {
        this.appNavigator.push({
            id: screenId,
            configureScene: configureScene
        });
    }

    @action navigatorPop() {
        this.appNavigator.pop();
    }
    
    @action getAvailableTours() {
        if(GET_FROM_SERVER) {
            fetch(URL_TOURS_ENDPOINT)
                .then(response => response.json())
                .then(result => {
                    this.availableTours = result;
                })
                .catch(error => {
                    console.warn(error);
                });
        } else {
            this.availableTours = [
                {
                    key: 1,
                    name: 'The Heart Of Tel Aviv',
                    description: 'Get to know why Tel Aviv is called "The city that never stops",' +
                   'Walk the street and see where the magic happens. This tour is for everyone who wants to feel the heart of Tel Aviv beating inside of them',
                    duration: '1.30',
                    accessible: true,
                    distance: '2',
                    reviews: 13,
                    rating: 4.5,
                    coordinate: {
                        latitude: 32.075326,
                        longitude: 34.775259
                    },
                    img: 'https://lh6.googleusercontent.com/-GypE5jzX-Ak/UPPRsgs8evI/AAAAAAAAIGY/s7pCJLnEYdY/s320/sarona.jpg'
                },
                {
                    key: 2,
                    name: 'Israel\'s Beautiful coastline & Tel Aviv harbor ',
                    description: 'Represents the beautiful coastline of Tel Aviv-Yafo and the Mediterranean character of the city. The path runs along the Tel Aviv coastline - from the Jaffa corridor to the Tel Aviv port and the lighthouse in the north.',
                    duration: '1.5',
                    accessible: false,
                    distance: '2.5',
                    reviews: 32,
                    rating: 5,
                    coordinate: {
                        latitude: 32.055031,
                        longitude: 34.754356
                    },
                    img: 'http://images1.ynet.co.il//PicServer3/2013/08/12/4793977/47939300990100408242no.jpg'
                },
                {
                    key: 3,
                    name: 'Educational tour in College of Management Academic Studies',
                    description: 'The College of Management Academic Studies is the pioneer of academic colleges in Israel',
                    duration: '2',
                    accessible: true,
                    distance: '3.2',
                    reviews: 20,
                    rating: 5,
                    coordinate: {
                        latitude: 31.969742,
                        longitude: 34.772797
                    },
                    img: 'http://www.universities-colleges.org.il/upload/1530_364x968.jpg'
                },
                // {
                //     key: 4,
                //     name: 'History of Petach Tikva',
                //     description: 'Learn about Petach Tikva. a city that grew in the last few years',
                //     duration: '0.50',
                //     accessible: false,
                //     distance: '1.5',
                //     reviews: 0,
                //     rating: 0,
                //     coordinate: {
                //         latitude: 32.078801,
                //         longitude: 34.907979
                //     },
                //     img: 'http://images1.ynet.co.il/xnet//PicServer2/pic/012012/154037/31_735.jpg'
                // }
            ];
        }
    }

    @action getTourStations() {
         // Get tour stations by this.chosenTour.key
        if(GET_FROM_SERVER) {
            //TODO: GET FROM SERVER
        } else {
            switch(this.chosenTour.key) {
                case 1:
                    this.tourStations =  [
                    {
                        key: 1,
                        name: 'Dizengoff Center',
                        coordinate: {
                            latitude: 32.074840,
                            longitude: 34.775946
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Dizengof_Center_Tel_Aviv.jpg'
                    },
                    {
                        key: 2,
                        name: 'Sarona compound',
                        coordinate: {
                            latitude: 32.073299,
                            longitude: 34.787055
                        },
                        img: 'http://images.globes.co.il/images/NewGlobes/big_image_800/2016/sarona-800.2016125T152619.jpg'
                    },
                    {
                        key: 3,
                        name: 'London Ministore',
                        coordinate: {
                            latitude: 32.075196,
                            longitude: 34.781718
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/London_Ministores%2C_tel_aviv.jpg/1280px-London_Ministores%2C_tel_aviv.jpg'
                    },
                    {
                        key: 4,
                        name: 'Rabin Square',
                        coordinate: {
                            latitude: 32.079714,
                            longitude: 34.781176
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Rabin_Squre_eco_pool.jpg'
                    },
                    {
                        key: 5,
                        name: 'The memorial to Yitzhak Rabin',
                        coordinate: {
                            latitude: 32.081937,
                            longitude: 34.781240
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Memorial_of_Israeli_Prime_Minister_Yitzchak_Rabin.jpg/400px-Memorial_of_Israeli_Prime_Minister_Yitzchak_Rabin.jpg'
                    }
                ];
                    break;
                case 2:
                    this.tourStations = [
                    {
                        key: 1,
                        name: 'Jappa Clock Square',
                        coordinate: {
                            latitude: 32.055499,
                            longitude: 34.756486
                        },
                        img: 'https://images1.calcalist.co.il/PicServer2/20122005/118617/AMIT_l.jpg'
                    },
                    {
                        key: 2,
                        name: 'The Opera Tower',
                        coordinate: {
                            latitude: 32.073837,
                            longitude: 34.765507
                        },
                        img: 'https://images1.calcalist.co.il/PicServer2/20122005/188354/CAL0009129_l.jpg'
                    },
                    {
                        key: 3,
                        name: 'Jerusalem Beach',
                        coordinate: {
                            latitude: 32.073960,
                            longitude: 34.764584
                        },
                        img: 'http://www.israelhayom.co.il/sites/default/files/styles/566x349/public/images/articles/2016/08/03/14701835615544_b.jpg'
                    },
                    {
                        key: 4,
                        name: 'Independence Park',
                        coordinate: {
                            latitude: 32.089911,
                            longitude: 34.772031
                        },
                        img: 'http://www.nrg.co.il/images/archive/465x349/1/071/952.jpg'
                    },
                    {
                        key: 5,
                        name: 'Tel Aviv Harbor',
                        coordinate: {
                            latitude: 32.096460,
                            longitude: 34.772611
                        },
                        img: 'http://kinderland.co.il/wp-content/uploads/2015/04/19343-namal.jpg'
                    },
                    {
                        key: 6,
                        name: 'Tel Aviv\'s Lighthouse',
                        coordinate: {
                            latitude: 32.104054,
                            longitude: 34.776745
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Reading_Power_Station022.jpg/250px-Reading_Power_Station022.jpg'
                    },
                ];
                    break;
                case 3:
                    this.tourStations = [
                        {
                            key:1,
                            name: 'Acadamon',
                            coordinate: {
                                latitude: 31.970070,
                                longitude: 34.772808 },
                            img: 'http://in.bgu.ac.il/alumni/DocLib/Pages/hatava-academon/academon.bmp'
                        },
                        {
                            key:2,
                            name: 'Law School',
                            coordinate: {
                                latitude: 31.970070,
                                longitude: 34.772808},
                            img: 'https://www.kaptest.com/blog/lsat-the-180/wp-content/uploads/sites/11/2016/03/iStock_000087169105_Small-e1457387991459.jpg'
                        },
                        {
                            key:3,
                            name: 'The Library',
                            coordinate: {
                                latitude: 31.970480,
                                longitude: 34.772014},
                            img: 'http://www.archijob.co.il/archijob_projects/projects/PR285/4.jpg'
                        },
                        {
                            key:4,
                            name: 'Fabiano',
                            coordinate: {
                                latitude: 31.970834,
                                longitude: 34.771660},
                            img: 'https://static.wixstatic.com/media/b8a557_232a4480efc845e6b1e80450a2a52616.jpg_srz_668_440_85_22_0.50_1.20_0.00_jpg_srz'
                        },
                        {
                            key:5,
                            name: 'School of Computer Science',
                            coordinate: {
                                latitude: 31.970880,
                                longitude: 34.771360},
                            img: 'http://www.news1.co.il/uploadimages/NEWS1-749111354351044.jpg'
                        },
                        {
                            key:6,
                            name: 'School of Business Administration',
                            coordinate: {
                                latitude: 31.970143,
                                longitude: 34.771617
                            },
                            img: 'http://www.ilimudim.co.il/files/8491.jpg'
                        }
                    ]
                    break;
                default:
                    this.tourStations = [];
                    break;
            }
        }
    }

    @action resetChosenTour() {
        this.chosenTour = null;
        this.tourStations = [];
    }

    @action onTourPress(tour) {
        this.chosenTour = tour;
        this.isTourModalOpen = true;
    }

    @action onStationPress(station) {
        this.chosenStation = station;
        this.isStationModelOpen = true;
    }

    @action setLocation(latitude,longitude,latitudeDelta,longitudeDelta) {
        this.setRegion(latitude,longitude,latitudeDelta,longitudeDelta);
        this.setCurrRegion(latitude,longitude,latitudeDelta,longitudeDelta);
        this.setPosition(latitude,longitude);
    }

    @action setRegion(latitude,longitude,latitudeDelta,longitudeDelta) {
        this.region = {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        }
    }

    @action setCurrRegion(latitude,longitude,latitudeDelta,longitudeDelta) {
        this.currRegion = {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        }
    }

    @action setPosition(latitude,longitude) {
        this.position = {
            latitude,
            longitude
        }
    }

    @action watchPosition(latitude,longitude,latitudeDelta,longitudeDelta) {
        this.setCurrRegion(latitude,longitude,latitudeDelta,longitudeDelta);
        this.setPosition(latitude,longitude);
    }

    @action setTourModalOpen(value) {
        this.isTourModalOpen = value;
    }

    @action setStationModalOpen(value) {
        this.isTourModalOpen = value;
    }

    @action logOff() {
        this.currentUser = {
            img: "http://www.worldofbuzz.com/wp-content/uploads/2015/04/noprofilemale.gif?x82567",
            name: "Unknown"
        };
        this.loginTokens = null;
        this.accessToken = null;
        this.navigatorReplace('Exit');
    }

    @action setAudio(){
         this.audio = new Sound('kalimba.mp3',Sound.MAIN_BUNDLE,(error)=>{
             if (error) {
                 alert('Oops! failed to load the sound');
                 console.warn('failed to load the sound', error);
             }
         });
    }

    @action playAudio(){
        this.audio.play((success)=>{
            if(!success)
            {
                alert('Oops! failed to load the sound');
            }
        })
    }

    @action stopAudio(){
        this.audio.stop();
    }

    @action pauseAudio() {
        this.audio.pause();
    }

    @action releaseAudio(){
        this.audio.stop();
        this.audio.release();
        this.audio=null;
    }

    @computed get startTourPosition() {
         if(this.tourStations) {
             return {
                 latitude: this.tourStations[0].coordinate.latitude,
                 longitude: this.tourStations[0].coordinate.longitude,
                 latitudeDelta: STATION_LATITUDE_DELTA,
                 longitudeDelta: STATION_LONGITUDE_DELTA
             }
         }

         return null;
    }

}

const store = new Store();
export default store;