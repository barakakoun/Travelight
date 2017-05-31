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
        this.availableTours = [
            {
                key: 1,
                name: 'The history of Rabin Square',
                description: 'Get to know Rabin Square from the beginning to present. get to know the full history of formerly kings of Israel square',
                duration: '1.30',
                accessible: true,
                distance: '2',
                reviews: 5,
                rating: 4.5,
                coordinate: {
                    latitude: 32.0802627,
                    longitude: 34.7808783
                },
                latDel: LATITUDE_DELTA,
                lonDel: LONGITUDE_DELTA,
                img: 'http://www.mapa.co.il/WWWTemp/UDP/105936_800_600.jpeg'
            },
            {
                key: 2,
                name: 'Dizingoff street as you never seen before',
                description: 'Dizengoff Street is a major street in central Tel Aviv, named after Tel Avivs first mayor, Meir Dizengoff.',
                duration: '1.30',
                accessible: false,
                distance: '1.5',
                reviews: 9,
                rating: 3.7,
                coordinate: {
                    latitude: 32.0745575,
                    longitude: 34.7772692
                },
                latDel: LATITUDE_DELTA,
                lonDel: LONGITUDE_DELTA,
                img: 'http://www.sea-hotel.co.il/sites/sea/UserContent/images/Attractions/%D7%93%D7%99%D7%96%D7%99%D7%A0%D7%92%D7%95%D7%A3%20%D7%A1%D7%A0%D7%98%D7%A8.jpg'
            },
            {
                key: 3,
                name: 'Beautiful tour in Rothschild Boulevard',
                description: 'Rothschild Boulevard is one of the principal streets in the center of Tel Aviv, Israel, beginning in Neve Tzedek at its southwestern edge and running north to Habima Theatre.',
                duration: '2',
                accessible: true,
                distance: '3.2',
                reviews: 20,
                rating: 5,
                coordinate: {
                    latitude: 32.0633612,
                    longitude: 34.7730913
                },
                latDel: LATITUDE_DELTA,
                lonDel: LONGITUDE_DELTA,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/PikiWiki_Israel_8331_rotshild_blvd._tel-aviv.jpg/800px-PikiWiki_Israel_8331_rotshild_blvd._tel-aviv.jpg'
            },
            {
                key: 4,
                name: 'History of Petach Tikva',
                description: 'Learn about Petach Tikva. a city that grew in the last few years',
                duration: '0.50',
                accessible: false,
                distance: '1.5',
                reviews: 0,
                rating: 0,
                coordinate: {
                    latitude: 32.078801,
                    longitude: 34.907979
                },
                latDel: LATITUDE_DELTA,
                lonDel: LONGITUDE_DELTA,
                img: 'http://images1.ynet.co.il/xnet//PicServer2/pic/012012/154037/31_735.jpg'
            }
        ];
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