import type { LoaderFunction } from "@remix-run/node";
// import { requireUserSession } from "~/services/brakAuth.server";
import { authenticator } from "~/services/oauth.server";

export const loader: LoaderFunction = async ({ request }) => {
  console.log("BeaLogin loader...");

  // Using the openid-connect library:
  // await requireUserSession(request);

  // Using the remix-oauth library:
  await authenticator.authenticate("bea", request);

  return null;
};
