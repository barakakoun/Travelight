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
         URL_TOURS_ENDPOINT,
         URL_REVIEWS_TOUR,
         URL_RECOMMENDED_TOURS} from "../../../Consts/urls";
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
    @observable tourKeyForRanking = null;
    @observable tourStations = [];
    @observable counter = 0;
    @observable region = null;
    @observable currRegion = null;
    @observable position = null;
    @observable accessToken = null;
    @observable firstName = null;
    @observable lastName = null;
    @observable email = null;
    @observable isTourModalOpen = false;
    @observable isStationModelOpen = false;
    @observable isRankModalOpen = false;
    @observable currentUser = {
        img: "http://www.worldofbuzz.com/wp-content/uploads/2015/04/noprofilemale.gif?x82567",
        name: "Unknown"
    };
    @observable tourReviews = [];
    @observable recommendedTours = [];

    constructor() {
        this.setAppNavigator = this.setAppNavigator.bind(this);
        this.setLoginTokens = this.setLoginTokens.bind(this);
        this.navigatorReplace = this.navigatorReplace.bind(this);
        this.navigatorOpenTourModal = this.navigatorOpenTourModal.bind(this);
        this.navigatorOpenDrawer = this.navigatorOpenDrawer.bind(this);
        this.navigatorPop = this.navigatorPop.bind(this);
        this.onTourPress = this.onTourPress.bind(this);
        this.onStationPress = this.onStationPress.bind(this);
        this.onRankIconPress = this.onRankIconPress.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setCounter = this.setCounter.bind(this);
        this.setCurrRegion = this.setCurrRegion.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.watchPosition = this.watchPosition.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.loginWithFacebook = this.loginWithFacebook.bind(this);
        this.loginWithGoogle = this.loginWithGoogle.bind(this);
        this.getFacebookUserData = this.getFacebookUserData.bind(this);
        this.setTourModalOpen = this.setTourModalOpen.bind(this);
        this.setStationModalOpen = this.setStationModalOpen.bind(this);
        this.setRankModalOpen = this.setRankModalOpen.bind(this);
        this.getUserFromStorage = this.getUserFromStorage.bind(this);
        this.mapFacebookDataToUser.bind(this);
        this.setAudio = this.setAudio.bind(this);
        this.playAudio = this.playAudio.bind(this);
        this.stopAudio = this.stopAudio.bind(this);
        this.pauseAudio = this.pauseAudio.bind(this);
        this.releaseAudio = this.releaseAudio.bind(this);
        this.setTourStations = this.setTourStations.bind(this);
        this.calculateDistance = this.calculateDistance.bind(this);
        //this.removeUserFromStorage = this.removeUserFromStorage.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.getTourReviews = this.getTourReviews.bind(this);
        this.getRecommendedTours = this.getRecommendedTours.bind(this);
        this.onRecommendedTourPress = this.onRecommendedTourPress.bind(this);
    }

    sendFacebookLoginDataToServer(){
        fetch(LOGINUSER,{method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                EMAIL: this.currentUser.email,
                FIRST_NAME: this.currentUser.firstName,
                LAST_NAME: this.currentUser.lastName,
                BIRTH_DATE: this.currentUser.birthDate,
                LOGIN_TYPE: '1',
                IMG: this.currentUser.img,

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
        this.currentUser.img = null;
        this.currentUser.birthDate = null;
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
                    birthDate: result.birthday,
                    // birthday:result.birthday
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
                        string: 'email,first_name,last_name,name,picture,birthday' // what you want to get
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
                        latitude: 32.055499,
                        longitude: 34.756486
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
                {
                    key: 4,
                    name: 'The old and new Jerusalem',
                    description: 'A walking tour through the highlights of one of the most sacred and majestic spots in the world!',
                    duration: '0.50',
                    accessible: false,
                    distance: '1.5',
                    reviews: 0,
                    rating: 0,
                    coordinate: {
                        latitude: 31.776714,
                        longitude: 35.234525
                    },
                    img: 'http://israel-tour-guide.com/wp-content/uploads/2014/12/1-Jewish-Quarter-from-Mt.-of-Olives.jpg'
                }
            ];
        }
    }

    @action getTourStations() {
         // Get tour stations by this.chosenTour.key
        if(GET_FROM_SERVER) {
            const url = URL_TOURS_ENDPOINT+this.chosenTour.key+'/getStations';
            fetch(url).then(response => response.json())
                .then(result => {
                    this.tourStations = result;
                })
                .catch(error => {
                    console.warn(error);
                });
        } else {
            switch(this.chosenTour.key) {
                case 1:
                    this.tourStations =  [
                    {
                        key: 1,
                        name: 'Dizengoff Center',
                        coordinate: this.availableTours[0].coordinate,
                        img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Dizengof_Center_Tel_Aviv.jpg',
                        audio: new Sound('t1s1.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 2,
                        name: 'Sarona compound',
                        coordinate: {
                            latitude: 32.073299,
                                longitude: 34.787055
                        },
                        img: 'http://images.globes.co.il/images/NewGlobes/big_image_800/2016/sarona-800.2016125T152619.jpg',
                        audio: new Sound('t1s2.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 3,
                        name: 'London Ministore',
                        coordinate: {
                            latitude: 32.075196,
                            longitude: 34.781718
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/London_Ministores%2C_tel_aviv.jpg/1280px-London_Ministores%2C_tel_aviv.jpg',
                        audio: new Sound('t1s3.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 4,
                        name: 'Rabin Square',
                        coordinate: {
                            latitude: 32.079714,
                            longitude: 34.781176
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Rabin_Squre_eco_pool.jpg',
                        audio: new Sound('t1s4.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 5,
                        name: 'The memorial to Yitzhak Rabin',
                        coordinate: {
                            latitude: 32.081937,
                            longitude: 34.781240
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Memorial_of_Israeli_Prime_Minister_Yitzchak_Rabin.jpg/400px-Memorial_of_Israeli_Prime_Minister_Yitzchak_Rabin.jpg',
                        audio: new Sound('t1s5.mp3',Sound.MAIN_BUNDLE)
                    }
                ];
                    break;
                case 2:
                    this.
                        tourStations = [
                    {
                        key: 1,
                        name: 'Jappa Clock Square',
                        coordinate: this.availableTours[1].coordinate,
                        img: 'https://images1.calcalist.co.il/PicServer2/20122005/118617/AMIT_l.jpg',
                        audio: new Sound('t2s1.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 2,
                        name: 'The Opera Tower',
                        coordinate: {
                            latitude: 32.073837,
                            longitude: 34.765507
                        },
                        img: 'https://images1.calcalist.co.il/PicServer2/20122005/188354/CAL0009129_l.jpg',
                        audio: new Sound('t2s2.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 3,
                        name: 'Jerusalem Beach',
                        coordinate: {
                            latitude: 32.073960,
                            longitude: 34.764584
                        },
                        img: 'http://www.israelhayom.co.il/sites/default/files/styles/566x349/public/images/articles/2016/08/03/14701835615544_b.jpg',
                        audio: new Sound('t2s3.mp3',Sound.MAIN_BUNDLE)
                        //     img: 'http://www.israelhayom.co.il/sites/default/files/styles/566x349/public/images/articles/2016/08/03/14701835615544_b.jpg',
                        // audio: new Sound('station3.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 4,
                        name: 'Tel Aviv Harbor',
                        coordinate: {
                            latitude: 32.096460,
                            longitude: 34.772611
                        },
                        img: 'http://kinderland.co.il/wp-content/uploads/2015/04/19343-namal.jpg',
                        audio: new Sound('t2s4.mp3',Sound.MAIN_BUNDLE)
                    },
                    {
                        key: 5,
                        name: 'Tel Aviv\'s Power Station',
                        coordinate: {
                            latitude: 32.104054,
                            longitude: 34.776745
                        },
                        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Reading_Power_Station022.jpg/250px-Reading_Power_Station022.jpg',
                        audio: new Sound('t2s5.mp3',Sound.MAIN_BUNDLE)
                    },
                ];
                    break;
                case 3:
                    this.tourStations = [
                        {
                            key:1,
                            name: 'Acadamon',
                            coordinate: this.availableTours[2].coordinate,
                            img: 'http://in.bgu.ac.il/alumni/DocLib/Pages/hatava-academon/academon.bmp',
                            audio: new Sound('t3s1.mp3',Sound.MAIN_BUNDLE)
                        },
                        {
                            key:2,
                            name: 'Law School',
                            coordinate: {
                                latitude: 31.970480,
                                longitude: 34.772808},
                            img: 'https://www.kaptest.com/blog/lsat-the-180/wp-content/uploads/sites/11/2016/03/iStock_000087169105_Small-e1457387991459.jpg',
                            audio: new Sound('t3s2.mp3',Sound.MAIN_BUNDLE)
                        },
                        {
                            key:3,
                            name: 'The Library',
                            coordinate: {
                                latitude: 31.970480,
                                longitude: 34.772014},
                            img: 'http://www.archijob.co.il/archijob_projects/projects/PR285/4.jpg',
                            audio: new Sound('t3s3.mp3',Sound.MAIN_BUNDLE)
                        },
                        {
                            key:4,
                            name: 'Fabiano',
                            coordinate: {
                                latitude: 31.970834,
                                longitude: 34.771660},
                            img: 'https://static.wixstatic.com/media/b8a557_232a4480efc845e6b1e80450a2a52616.jpg_srz_668_440_85_22_0.50_1.20_0.00_jpg_srz',
                            audio: new Sound('t3s4.mp3',Sound.MAIN_BUNDLE)
                        },
                        {
                            key:5,
                            name: 'School of Computer Science',
                            coordinate: {
                                latitude: 31.970880,
                                longitude: 34.771360},
                            img: 'http://www.news1.co.il/uploadimages/NEWS1-749111354351044.jpg',
                            audio: new Sound('t3s5.mp3',Sound.MAIN_BUNDLE)
                        },
                        {
                            key:6,
                            name: 'School of Business Administration',
                            coordinate: {
                                latitude: 31.970143,
                                longitude: 34.771617
                            },
                            img: 'http://www.ilimudim.co.il/files/8491.jpg',
                            audio: new Sound('t3s6.mp3',Sound.MAIN_BUNDLE)
                        }
                    ];
                    break;
                case 4:
                    this.tourStations = [
                        {
                            key:1,
                            name: 'Via Dolorosa',
                            coordinate: {
                                latitude: 31.780182,
                                longitude: 35.232126},
                            audio: new Sound('t4s1.mp3',Sound.MAIN_BUNDLE),
                            // coordinate: this.availableTours[3].coordinate,
                            // audio: new Sound('station1.mp3',Sound.MAIN_BUNDLE),

                            img: 'http://cdn.c.photoshelter.com/img-get2/I0000O3ynRRbGbRI/fit=1000x750/Station-five-of-the-Via-Dolorosa-in-the-Old-City-of-Jerusalem-000032-275.jpg'
                        },
                        {
                            key:2,
                            name: 'Western Wall',
                            coordinate: {
                                latitude: 31.970070,
                                longitude: 34.772808},
                            audio: new Sound('t4s2.mp3',Sound.MAIN_BUNDLE),
                            img: 'https://www.itraveljerusalem.com/wp-content/uploads/2016/07/atr-western-wall-2.jpg'
                        },
                        {
                            key:3,
                            name: 'Alrov Mamilla Avenue',
                            coordinate: {
                                latitude: 31.779283,
                                longitude: 35.223841},
                            audio: new Sound('t4s3.mp3',Sound.MAIN_BUNDLE),
                            img: 'https://images1.calcalist.co.il/PicServer2/20122005/312181/CAL000290-L.jpg'
                        },
                        {
                            key:4,
                            name: 'Jerusalem Historical City Hall Building',
                            coordinate: {
                                latitude: 31.970834,
                                longitude: 35.224689},
                            audio: new Sound('t4s4.mp3',Sound.MAIN_BUNDLE),
                            img: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Jerusalem_Historical_City_Hall_Building_2.JPG'
                        },
                        {
                            key:5,
                            name: 'Machane Yehudah Market',
                            coordinate: {
                                    latitude: 31.785212,
                                longitude: 35.210817},
                            audio: new Sound('t4s5.mp3',Sound.MAIN_BUNDLE),
                            img: 'https://media-cdn.tripadvisor.com/media/photo-s/0a/0c/8c/07/mahane-yehuda-market.jpg'
                        },
                    ];
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
        this.tourReviews = [];
    }

    @action onTourPress(tour) {
        this.chosenTour = tour;
        this.isTourModalOpen = false;

        setTimeout(() => {
            if (this.chosenTour !=null) {
                this.isTourModalOpen = true;
            }
        }, 500);
    }

    @action onStationPress(station) {
        this.chosenStation = station;
        this.isStationModelOpen = false;

        // setTimeout(() => {
        //     if (this.chosenStation!=null) {
        //         this.isStationModelOpen = true;
        //     }
        // }, 500);
    }

    @action onRankIconPress(tourKey) {
        this.tourKeyForRanking = tourKey;
        this.isRankModalOpen = false;

        // setTimeout(() => {
        //     if (this.chosenStation!=null) {
        //         this.isStationModelOpen = true;
        //     }
        // }, 500);
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

    @action setCounter(value) {
        this.counter = value;
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
        this.isStationModelOpen = value;
    }

    @action setRankModalOpen(value) {
        this.isRankModalOpen = value;
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
    }

    @action playAudio(){
        if (this.chosenStation.audio) {
            this.chosenStation.audio.play(success => {
                if (!success) {
                    alert('Oops! failed to load the sound');
                }
            })
        }
    }

    @action stopAudio(){
        if (this.chosenStation.audio) {
            this.chosenStation.audio.stop();
        }
    }

    @action pauseAudio() {
        if (this.chosenStation.audio) {
            this.chosenStation.audio.pause();
        }
    }

    @action releaseAudio(){
        if (this.chosenStation.audio) {
            this.chosenStation.audio.stop();
            this.chosenStation.audio.release();
            this.chosenStation.audio = null;
        }
    }

    @action setTourStations(value) {
        this.tourStations = value;
    }

    @action calculateDistance(pointA, pointB) {

        const lat1 = pointA.latitude;
        const lon1 = pointA.longitude;

        const lat2 = pointB.latitude;
        const lon2 = pointB.longitude;

        const R = 6371e3; // earth radius in meters
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
            ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance; // in meters
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

    @action getTourReviews() {
        const url = `${URL_REVIEWS_TOUR}${this.chosenTour.key}`;
        fetch(url)
            .then(response => response.json())
            .then(result => {
                console.warn(JSON.stringify(result,null,3));
                this.tourReviews = result;
            })
            .catch(error => {
                console.warn(error);
            });
    }

    @action getRecommendedTours() {
        const url = `${URL_RECOMMENDED_TOURS}${this.currentUser.email}`;
        fetch(url)
            .then(response => response.json())
            .then(result => {
                this.recommendedTours = result;
            })
            .catch(err => {console.warn("Error in getRecommendedTours " + err)});
    }

    @action onRecommendedTourPress(tour, configureScene) {
        this.chosenTour = tour;
        this.getTourStations();
        this.appNavigator.push({
            id: 'TourDetailsPage',
            chosenTour: this.chosenTour,
            configureScene: configureScene
        });
    }
}

const store = new Store();
export default store;