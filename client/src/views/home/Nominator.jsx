import React from 'react';
import { UserType } from '../../utils/constants';
import Master from '../_layout/Master';
import AdminHome from './admin/AdminHome';
import ShopOwnerHome from './shop_owner/ShopOwnerHome';
import ShopperHome from './shopper/ShopperHome';

// Nominate view to render based on User Type
const Nominator = () => {
    const { userType, active } = window.dapp.defaultProfile;
    let view = <></>;
    switch(userType) {
        case UserType.Admin && active:
        case UserType.Owner && active:
            view = <AdminHome />
            break;
        case UserType.ShopOwner && active:
            view = <ShopOwnerHome />
            break;
        default:
            view = <ShopperHome />
            break;
    }
    return <Master> {view} </Master>;
}

export default React.memo(Nominator);