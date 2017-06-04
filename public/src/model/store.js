import {observable, action, computed, runInAction} from 'mobx';
import { LATITUDE_DELTA,
         LONGITUDE_DELTA,
         FACEBOOK_LOGIN,
         GOOGLE_LOGIN,
         REGULAR_LOGIN,
         STATION_LONGITUDE_DELTA,
         STATION_LATITUDE_DELTA,
        } from "../../../Consts/variables";
import {LOGINUSER} from "../../../Consts/urls";
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

class Store {
    @observable appNavigator = null;
    @observable loginTokens = null;
    @observable availableTours = [];
    @observable chosenTour = null;
    @observable chosenStation = null;
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
    @action getUserFromStorage()
    {
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
    initUser()
    {
        this.currentUser.firstName = '';
        this.currentUser.lastName='';
        this.currentUser.email='';
        this.currentUser.name='';
        this.currentUser.img=null;
    }
    @action logoutUser()
    {
        this.initUser();
        this.removeUserFromStorage();
    }
    removeUserFromStorage()
    {
        // AsyncStorage.multiRemove(['token','firstName','lastName','email']);
        AsyncStorage.removeItem('token');
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
                             //this.getUserData();
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
                //this.currentUser = result.map((result)=>this.mapFacebookDataToUser)
                this.currentUser = this.mapFacebookDataToUser(result);
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
                            longitude: 34.907979},
                        img:'http://cdn.pcwallart.com/images/bar-refaeli-victorias-secret-wallpaper-3.jpg',
                        name:'bar station',
                        audio:'1',
                        info:'1'

                    },
                    {
                        key:2,
                        coordinate: {
                            latitude: 32.077914,
                            longitude: 34.906416},
                        img:'http://cdn.pcwallart.com/images/bar-refaeli-victorias-secret-wallpaper-3.jpg',
                        name:'bar station',
                        audio:'1'
                    },
                    {
                        key:3,
                        coordinate: {
                            latitude: 32.076970,
                            longitude: 34.908218},
                        img:'http://cdn.pcwallart.com/images/bar-refaeli-victorias-secret-wallpaper-3.jpg',
                        name:'bar station',
                        info:'1'
                    },
                    {
                        key:4,
                        coordinate: {
                            latitude: 32.075515,
                            longitude: 34.910937},
                        img:'http://cdn.pcwallart.com/images/bar-refaeli-victorias-secret-wallpaper-3.jpg',
                        name:'bar station'
                    },
                    {
                        key:5,
                        coordinate: {
                            latitude: 32.074406,
                            longitude: 34.905964},
                        img:'http://cdn.pcwallart.com/images/bar-refaeli-victorias-secret-wallpaper-3.jpg',
                        name:'bar station'
                    },
                    {
                        key:6,
                        coordinate: {
                            latitude: 32.076844,
                            longitude: 34.904783
                        },
                        img:'http://cdn.pcwallart.com/images/bar-refaeli-victorias-secret-wallpaper-3.jpg',
                        name:'bar station'
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

    @action onStationPress(station)
    {
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
                 console.warn('failed to load the sound', error);
             }
         });
    }

    @action playAudio(){
        this.audio.play((success)=>{
            if(!success)
            {
                console.warn('cant play');
            }
        })
    }

    @action stopAudio(){
        this.audio.stop();
    }

    @action pauseAudio()
    {
        this.audio.pause();
    }

    @action releaseAudio(){
        this.audio.stop();
        this.audio.release();
        this.audio=null;
    }
    @computed get startTourPosition() {
         if(this.chosenTour) {
             return {
                 latitude: this.chosenTour.stations[0].coordinate.latitude,
                 longitude: this.chosenTour.stations[0].coordinate.longitude,
                 latitudeDelta: STATION_LATITUDE_DELTA,
                 longitudeDelta: STATION_LONGITUDE_DELTA
             }
         }

         return null;
    }

}

const store = new Store();
export default store;