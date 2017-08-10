/**
 * Created by dell on 19/05/2017.
 */
// const URL_BASE = 'http://10.0.0.31:3000/';
const URL_BASE = 'http://10.160.15.29:3000/';

/** USERS */
const URL_USERS_ENDPOINT = URL_BASE+'users/';
export const LOGINUSER = URL_USERS_ENDPOINT+'login';

/** TOURS */
export const URL_TOURS_ENDPOINT = URL_BASE+'tours/';
export const URL_GET_TOUR_DETAILS = URL_TOURS_ENDPOINT+'details/';

/** REVIEWS */
export const URL_REVIEWS_ENDPOINT = URL_BASE+'reviews/';

/** RECOMMENDATION */
export const URL_RECOMMENDATION_ENDPOINT = URL_BASE+'recommendation/';
export const URL_RECOMMENDATION_CB = URL_RECOMMENDATION_ENDPOINT+'contentBasedRecommend/';
