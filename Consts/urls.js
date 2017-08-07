/**
 * Created by dell on 19/05/2017.
 */
// const URL_BASE = 'http://10.0.0.31:3000/';
const URL_BASE = 'http://192.168.1.29:3000/';

/** USERS */
const URL_USERS_ENDPOINT = URL_BASE+'users/';
export const LOGINUSER = URL_USERS_ENDPOINT+'login';

/** TOURS */
export const URL_TOURS_ENDPOINT = URL_BASE+'tours/';
export const URL_RECOMMENDED_TOURS = URL_TOURS_ENDPOINT+'recommended/';

/** REVIEWS */
export const URL_REVIEWS_ENDPOINT = URL_BASE+'reviews/';
export const URL_REVIEWS_TOUR = URL_REVIEWS_ENDPOINT+'tour/';