import { Authenticator } from "remix-auth";
import { CodeChallengeMethod, OAuth2Strategy } from "remix-auth-oauth2";
import { config } from "~/config/config.server";

interface User {
  code: string;
}

export const authenticator = new Authenticator<User>();

authenticator.use(
  new OAuth2Strategy(
    {
      cookie: "oauth2", // Optional, can also be an object with more options

      clientId: config().BRAK_IDP_OIDC_CLIENT_ID,
      clientSecret: config().BRAK_IDP_OIDC_CLIENT_SECRET,

      authorizationEndpoint: `${config().BRAK_IDP_OIDC_ISSUER}/protocol/openid-connect/auth`,
      tokenEndpoint: `${config().BRAK_IDP_OIDC_ISSUER}/protocol/openid-connect/token`,
      redirectURI: `${config().BRAK_IDP_OIDC_REDIRECT_URI}`,

      //   tokenRevocationEndpoint: "https://provider.com/oauth2/revoke", // optional

      // scopes: ["safe_oidc", "email", "profile"],
      codeChallengeMethod: CodeChallengeMethod.S256, // optional
    },
    async ({ tokens, request }) => {
      // here you can use the params above to get the user and return it
      // what you do inside this and how you find the user is up to you

      return { code: tokens.accessToken.toString() };
    },
  ),
  // this is optional, but if you setup more than one OAuth2 instance you will
  // need to set a custom name to each one
  "bea",
);
