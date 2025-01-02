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
      cookie: "oauth2",
      clientId: config().BRAK_IDP_OIDC_CLIENT_ID,
      clientSecret: config().BRAK_IDP_OIDC_CLIENT_SECRET,
      authorizationEndpoint: `${config().BRAK_IDP_OIDC_ISSUER}/protocol/openid-connect/auth`,
      tokenEndpoint: `${config().BRAK_IDP_OIDC_ISSUER}/protocol/openid-connect/token`,
      redirectURI: `${config().BRAK_IDP_OIDC_REDIRECT_URI}`,
      // scopes: ["safe_oidc", "email", "profile"], // TODO: Check which scopes we need
      codeChallengeMethod: CodeChallengeMethod.S256,
    },
    async ({ tokens, request }) => {
      // TODO: once we have a successful response, we can check which properties we need to extract from the response and return.
      // We can then update the `User` type to reflect the properties we need.
      // For now, it's just returning the accessToken
      return { code: tokens.accessToken.toString() };
    },
  ),
  "bea", // name of the strategy. When you call `authenticate`, you pass this name to use this strategy.
);
