
export default {
  oidc: {
    clientId: 'your_clientid',
    issuer:'https://yourdomain/oauth2/default',
    redirectUri:  window.location.origin +  '/login/callback',
    // scopes: ['openid', 'profile', 'email'],
    // testing: {
    //   disableHttpsCheck: `${OKTA_TESTING_DISABLEHTTPSCHECK}`
    // },
  }
};
