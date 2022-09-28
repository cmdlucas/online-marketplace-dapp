import React from 'react';
import { UserType } from '../../utils/constants';
import Master from '../_layout/Master';
import AdminHome from './admin/AdminHome';
import ShopOwnerHome from './shop_owner/ShopOwnerHome';
import ShopperHome from './shopper/ShopperHome';

// Nominate view to render based on User Type
const Nominator = () => {
  const { userType, active } = window.dapp.defaultProfile;
  let view;
  // determine if the profile loaded from web3 is an active one
  if (active) {
    switch (userType) {
      case UserType.Admin:
      case UserType.Owner:
        view = <AdminHome />
        break;
      case UserType.ShopOwner:
        view = <ShopOwnerHome />
        break;
      default:
        view = <ShopperHome />
        break;
    }
  }
  return <Master> {view || <ShopperHome />} </Master>;
}

export default React.memo(Nominator);