// url list
export const homeurl = `/`;
export const editprofileurl = `/profile-edit`;
export const createprofileurl = `/profile-create`;
export const storefronturi = `/storefront`;
export const storefronturl = (sfid, name) => `${storefronturi}/${sfid}/${name}`;
export const createstorefronturl = `${storefronturi}/create`;
export const createproducturl = (sfid, name) => `${storefronturi}/${sfid}/${name}/product/add`;
export const editproducturl = (sfid, name, pid) => `${storefronturi}/${sfid}/${name}/product/edit/${pid}`;
export const buyproducturl = (sfid, name, pid) => `${storefronturi}/${sfid}/${name}/product/buy/${pid}`;

// url matchers
export const homematcher = homeurl;
export const editprofilematcher = `${editprofileurl}/:type/:id`;
export const createprofilematcher = `${createprofileurl}/:type`;
export const createstorefrontmatcher = createstorefronturl;
export const storefrontmatcher = `${storefronturi}/:sfid/:name`;
export const createproductmatcher = `${storefronturi}/:sfid/:name/product/add`;
export const editproductmatcher = `${storefronturi}/:sfid/:name/product/edit/:pid`;
export const buyproductmatcher = `${storefronturi}/:sfid/:name/product/buy/:pid`;