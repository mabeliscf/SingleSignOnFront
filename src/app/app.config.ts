
export default {
  oidc: {
    clientId: '0oa6swbgjmTw1UyQK5d7',
    issuer:'https://dev-27108252.okta.com/oauth2/default',
    redirectUri:  window.location.origin +  '/login/callback',
    // scopes: ['openid', 'profile', 'email'],
    // testing: {
    //   disableHttpsCheck: `${OKTA_TESTING_DISABLEHTTPSCHECK}`
    // },
  }
};
