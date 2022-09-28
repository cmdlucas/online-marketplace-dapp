import p from "../constant/profiles";

export const setAdminsProfiles = (value) => ({
  type: p.set_admin,
  value: value,
});
export const setShopOwnersProfiles = (value) => ({
  type: p.set_shop_owner,
  value: value,
});
export const editProfile = (value) => ({ type: p.edit, value: value });
