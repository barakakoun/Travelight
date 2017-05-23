import {observable, action, computed, runInAction} from 'mobx';
import { LATITUDE_DELTA,
         LONGITUDE_DELTA,
         FACEBOOK_LOGIN,
         GOOGLE_LOGIN,
         REGULAR_LOGIN,
        } from "../../../Consts/variables";
import FBSDK from 'react-native-fbsdk';
import React, { Component } from 'react';
const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    AccessToken
} = FBSDK;

class Store {
    @observable appNavigator = null;
    @observable loginTokens = null;
    @observable availableTours = [];
    @observable chosenTour = null;
    @observable region = null;
    @observable currRegion = null;
    @observable position = null;
    @observable accessToken = null;
    @observable userName = null;
    @observable userPhoto = null;
    @observable isTourModalOpen = false;
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
    }

    @action loginWithFacebook() {
        LoginManager.logInWithReadPermissions(['public_profile','email']).then(
            (result)=> {
                if (result.isCancelled) {
                    alert('Login was cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            this.loginType = FACEBOOK_LOGIN;
                            this.accessToken = data.accessToken;
                            this.navigatorReplace('MainMapPage');
                        });
                }
            },
            (error)=> {
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
                //var jresult = JSON.parse(result);
                this.userName = result.name;
                this.userPhoto = result.picture.data.url;
            }
        };

        const infoRequest = new GraphRequest(
            '/me',
            {
                accessToken: this.accessToken,
                parameters: {
                    fields: {
                        string: 'email,name,picture' // what you want to get
                    }
                }},
            responseInfoCallback
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    @action getGoogleUserData() {
        this.currentUser.img = "https://www.wired.com/wp-content/uploads/2015/09/google-logo-1200x630.jpg";
        this.currentUser.name = "Google"
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
        this.availableTours = [
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
            },
            {
                key: 4,
                coordinate: {
                    latitude: 32.078801,
                    longitude: 34.907979
                },
                stations: [
                    {
                        key:1,
                        coordinate: {
                            latitude: 32.078801,
                            longitude: 34.907979}
                    },
                    {
                        key:2,
                        coordinate: {
                            latitude: 32.077914,
                            longitude: 34.906416}
                    },
                    {
                        key:3,
                        coordinate: {
                            latitude: 32.076970,
                            longitude: 34.908218}
                    },
                    {
                        key:4,
                        coordinate: {
                            latitude: 32.075515,
                            longitude: 34.910937}
                    },
                    {
                        key:5,
                        coordinate: {
                            latitude: 32.074406,
                            longitude: 34.905964}
                    },
                    {
                        key:6,
                        coordinate: {
                            latitude: 32.076844,
                            longitude: 34.904783
                        }
                    }
                ],
                latDel: LATITUDE_DELTA,
                lonDel: LONGITUDE_DELTA
            }
        ];
    }

    @action onTourPress(tour) {
        this.chosenTour = tour;
        this.isTourModalOpen = true;
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

    @action logOff() {
        this.currentUser = {
            img: "http://www.worldofbuzz.com/wp-content/uploads/2015/04/noprofilemale.gif?x82567",
            name: "Unknown"
        };
        this.loginTokens = null;
        this.accessToken = null;
        this.navigatorReplace('Exit');
    }

}


const store = new Store();
export default store;