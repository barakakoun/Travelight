/**
 * Created by dell on 19/05/2017.
 */
// const URL_BASE = 'http://10.0.0.31:3000/';
// const URL_BASE = 'http://192.168.1.28:3000/';
const URL_BASE = 'http://192.168.14.19:3000/';

/** USERS */
const URL_USERS_ENDPOINT = URL_BASE+'users/';
export const LOGINUSER = URL_USERS_ENDPOINT+'login';
export const TOURS_HISTORY = URL_USERS_ENDPOINT+'toursHistory/';
export const URL_ADD_TOUR = URL_USERS_ENDPOINT+'addTour';


/** TOURS */
export const URL_TOURS_ENDPOINT = URL_BASE+'tours/';
export const URL_GET_TOUR_DETAILS = URL_TOURS_ENDPOINT+'details/';
export const URL_ADD_TOUR_USER = URL_TOURS_ENDPOINT+'tourUser/';

/** REVIEWS */
export const URL_REVIEWS_ENDPOINT = URL_BASE+'reviews/';
export const URL_ADD_REVIEW = URL_REVIEWS_ENDPOINT+'/create/';

/** RECOMMENDATION */
export const URL_RECOMMENDATION_ENDPOINT = URL_BASE+'recommendation/';
export const URL_RECOMMENDATION_CB = URL_RECOMMENDATION_ENDPOINT+'contentBasedRecommend/';
