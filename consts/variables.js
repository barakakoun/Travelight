/**
 * Created by galna21 on 10/05/2017.
 */
import { Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
export const LATITUDE = 32.080523;
export const LONGITUDE = 34.780852;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;