import {observable, action, computed, runInAction} from 'mobx';
import { LATITUDE_DELTA,
<<<<<<< HEAD
         LONGITUDE_DELTA } from "../../../Consts/variables";
import FBSDK from 'react-native-fbsdk';
const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    AccessToken
} = FBSDK;
class Store {
=======
         LONGITUDE_DELTA } from '../../../consts/variables';
import React, { Component } from 'react';
    class Store {
>>>>>>> 962046cb01d06d76bfacae90be76d91ad66a8c9b

    @observable appNavigator = null;
    @observable loginTokens = null;
    @observable availableTours = [];
    @observable chosenTour = null;
    @observable region = null;
    @observable currRegion = null;
    @observable position = null;
<<<<<<< HEAD
    @observable drawer = null;
    @observable accessToken = null;
    @observable userName = null;
    @observable userPhoto = null;
=======
    @observable isTourModalOpen = false;
>>>>>>> 962046cb01d06d76bfacae90be76d91ad66a8c9b

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
<<<<<<< HEAD
        this.getUserData = this.getUserData.bind(this);
        this.loginWithFacebook = this.loginWithFacebook.bind(this);
=======
        this.setTourModalOpen = this.setTourModalOpen.bind(this);
>>>>>>> 962046cb01d06d76bfacae90be76d91ad66a8c9b
    }
    @action loginWithFacebook() {
        LoginManager.logInWithReadPermissions(['public_profile','email']).then(
            (result)=> {
                if (result.isCancelled) {
                    alert('Login was cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            let accessToken = data.accessToken;
                            this.accessToken=accessToken;
                            this.navigatorReplace('MainMapPage');
                        });
                }
            },
            (error)=> {
                alert('Login failed with error: ' + error);
            }
        );
    }
    @action  getUserData(){
        const responseInfoCallback = (error,result)=>{
            if (error) {
                alert('Error fetching data: ' + JSON.stringify(error));
            } else {
                //var jresult = JSON.parse(result);
                this.userName = result.name;
                var pic = result.picture.data.url;
                this.userPhoto = pic;
            }
        }
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

<<<<<<< HEAD
    @action setDrawer(drawer) {
        this.drawer = drawer;

=======
    @action setTourModalOpen(value) {
        this.isTourModalOpen = value;
>>>>>>> 962046cb01d06d76bfacae90be76d91ad66a8c9b
    }

}


const store = new Store();
export default store;