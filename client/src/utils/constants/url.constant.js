// url list
export const homeurl = "/";
export const editprofileurl = "/profile-edit";
export const createprofileurl = "/profile-create";
export const storefronturl = "/storefront";
export const createstorefronturl = storefronturl + "/create";
export const createproducturl = (sfid, name) => storefronturl + "/" + sfid + "/" + name + "/product/add";
export const editproducturl = (sfid, name, pid) => storefronturl + "/" + sfid + "/" + name + "/product/edit/" + pid;

// url matchers
export const homematcher = homeurl;
export const editprofilematcher = editprofileurl + "/:type/:id";
export const createprofilematcher = createprofileurl + "/:type";
export const createstorefrontmatcher = createstorefronturl;
export const storefrontmatcher = storefronturl + "/:sfid/:name";
export const createproductmatcher = storefronturl + "/:sfid/:name/product/add";
export const editproductmatcher = storefronturl + "/:pid/:name/product/edit";