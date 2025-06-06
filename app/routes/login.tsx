import type { LoaderFunction } from "react-router";
import {
  AuthenticationProvider,
  authenticator,
} from "~/services/prototype.oAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate(AuthenticationProvider.BEA, request);
  return null;
};
