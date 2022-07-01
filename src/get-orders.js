import wcpkg from '@woocommerce/woocommerce-rest-api';
const WooCommerceRestApi = wcpkg.default; // very pretty

const woo = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: "wc/v3"
});

export const getOrders = () => {
  return woo.get("orders")
  // .catch((error) => {
  //   console.log(error.response.data);
  // });
}
