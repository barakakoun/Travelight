import {observable, action, computed, runInAction} from 'mobx';
import { LATITUDE_DELTA,
         LONGITUDE_DELTA } from "../../../Consts/variables";
import {LOGINUSER} from "../../../Consts/urls";

import FBSDK from 'react-native-fbsdk';
import React, { Component } from 'react';
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
    @observable region = null;
    @observable currRegion = null;
    @observable position = null;
    @observable drawer = null;
    @observable accessToken = null;
    @observable userName = null;
    @observable firstName = null;
    @observable lastName = null;
    @observable email = null;
    @observable userPhoto = null;
    @observable isTourModalOpen = false;

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
        this.setTourModalOpen = this.setTourModalOpen.bind(this);
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
            if(responseJson.message == massages.loginUserSucess)
            {
                this.navigatorReplace('MainMapPage');
            }
            else {
                alert(responseJson.message);
            }
        })
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
                            this.getUserData();
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
                this.firstName = result.first_name;
                this.lastName = result.last_name;
                this.email = result.email;
                var pic = result.picture.data.url;
                this.userPhoto = pic;
                this.sendFacebookLoginDataToServer()
            }
        }
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
    @action setDrawer(drawer) {
        this.drawer = drawer;
    }
    @action setTourModalOpen(value) {
        this.isTourModalOpen = value;
    }

}


const store = new Store();
export default store;