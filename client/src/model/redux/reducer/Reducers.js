import { combineReducers } from 'redux';
import { adminProfiles, shopOwnersProfiles } from './profiles';
import { storeFronts } from './storeFronts';
import { products } from './products';

const reducers = combineReducers({ adminProfiles, shopOwnersProfiles, storeFronts, products });

export default reducers;