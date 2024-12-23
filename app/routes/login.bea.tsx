import type { LoaderFunction } from "@remix-run/node";
// import { requireUserSession } from "~/services/brakAuth.server";
import { authenticator } from "~/services/oauth.server";

export const loader: LoaderFunction = async ({ request }) => {
  console.log("BeaLogin loader...");

  await authenticator.authenticate("provider-name", request);

  return null;
};
