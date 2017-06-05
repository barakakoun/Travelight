import {observable, action, computed, runInAction} from 'mobx';
import { LATITUDE_DELTA,
         LONGITUDE_DELTA,
         FACEBOOK_LOGIN,
         GOOGLE_LOGIN,
         REGULAR_LOGIN,
         STATION_LONGITUDE_DELTA,
         STATION_LATITUDE_DELTA,
        } from "../../../Consts/variables";
import { LOGINUSER,
         URL_TOURS_ENDPOINT } from "../../../Consts/urls";
import FBSDK from 'react-native-fbsdk';
import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import massages from "../../../Consts/messages";
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
        this.getUserFromStorage = this.getUserFromStorage.bind(this);
        this.mapFacebookDataToUser.bind(this);
        this.removeUserFromStorage = this.removeUserFromStorage.bind(this);
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

    @action removeUserFromStorage() {
        // AsyncStorage.multiRemove(['token','firstName','lastName','email']);
        AsyncStorage.removeItem('token');
    }

    @action loginWithFacebook() {
        LoginManager.logInWithReadPermissions(['public_profile','email'])
            .then(result => {
                console.warn("here");
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
        fetch(URL_TOURS_ENDPOINT)
            .then(response => response.json())
            .then(result => {
                console.warn(JSON.stringify(result));
                this.availableTours = result;
            })
            .catch(error => { console.warn(error); });
    }

    @action getTourStations() {
         // Get tour stations by this.chosenTour.key

        this.tourStations = [
            {
                key:1,
                name: 'station 1',
                coordinate: {
                    latitude: 32.078801,
                    longitude: 34.907979 },
                img: 'https://www.stationonecoffeehouse.ca/sites/all/themes/tributary/logo.png'
            },
            {
                key:2,
                name: 'station 2',
                coordinate: {
                    latitude: 32.077914,
                    longitude: 34.906416},
                img: 'http://station2richmond.com/wp-content/uploads/2017/01/retina-logo-1.png'
            },
            {
                key:3,
                name: 'station 3',
                coordinate: {
                    latitude: 32.076970,
                    longitude: 34.908218},
                img: 'http://static1.squarespace.com/static/5373e99ae4b0297decd47b98/t/557eef98e4b0d40fa1ac11f7/1489091006453/?format=1500w'
            },
            {
                key:4,
                name: 'station 4',
                coordinate: {
                    latitude: 32.075515,
                    longitude: 34.910937},
                img: 'https://media-cdn.tripadvisor.com/media/photo-s/07/04/4e/36/station-4-beach-bar.jpg'
            },
            {
                key:5,
                name: 'station 5',
                coordinate: {
                    latitude: 32.074406,
                    longitude: 34.905964},
                img: 'http://station5.dk/wp-content/uploads/2014/12/Station5_logo2.png'
            },
            {
                key:6,
                name: 'station 6',
                coordinate: {
                    latitude: 32.076844,
                    longitude: 34.904783
                },
                img: 'https://pbs.twimg.com/profile_images/751094091002179584/CeEyWUd6.jpg'
            }
        ]
    }

    @action resetChosenTour() {
        this.chosenTour = null;
        this.tourStations = [];
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