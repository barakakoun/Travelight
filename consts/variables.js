/**
 * Created by galna21 on 10/05/2017.
 */
import { Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

// Location
const ASPECT_RATIO = width / height;
export const LATITUDE = 32.080523;
export const LONGITUDE = 34.780852;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export const STATION_LATITUDE_DELTA = 0.004757;
export const STATION_LONGITUDE_DELTA = 0.006866;

//Login
export const FACEBOOK_LOGIN = "Facebook";
export const GOOGLE_LOGIN = "Google";
export const REGULAR_LOGIN = "Regular";

//Other
export const GET_FROM_SERVER = true;
export const TYPE_TEXT = 't';
export const TYPE_SOUND = 's';
export const TYPE_IMAGE = 'i';
