import {observable, action, computed, runInAction} from 'mobx';

class Store {

    @observable appNavigator = null;
    @observable loginTokens = null;
    @observable availableTours = [];

    constructor() {
        this.setAppNavigator = this.setAppNavigator.bind(this);
        this.setLoginTokens = this.setLoginTokens.bind(this);
        this.navigatorReplace = this.navigatorReplace.bind(this);
        this.navigatorPush = this.navigatorPush.bind(this);
        this.navigatorPop = this.navigatorPop.bind(this);
    }

    @action setAppNavigator(nav) {
        this.appNavigator = nav;
    }

    @action setLoginTokens(tokens) {
        this.loginTokens = tokens;
    }

    @action navigatorReplace(screenId) {
        this.appNavigator.replace( {id: screenId})
    }

    @action navigatorPush(screenId) {
        this.appNavigator.replace( {id: screenId})
    }

    @action navigatorPop() {
        this.appNavigator.replace( {id: screenId})
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
}

const store = new Store();
export default store;