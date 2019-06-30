import { combineReducers } from 'redux';
import { adminProfiles, shopOwnersProfiles } from './profiles';

const reducers = combineReducers({ adminProfiles, shopOwnersProfiles });

export default reducers;