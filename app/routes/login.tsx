import type { LoaderFunction } from "@remix-run/node";
import { AuthenticationProvider, authenticator } from "~/services/oauth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate(AuthenticationProvider.BEA, request);
  return null;
};
