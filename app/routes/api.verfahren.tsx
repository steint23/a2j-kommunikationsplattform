import type { ActionFunctionArgs } from "@remix-run/node";
import { getFilesFromMultipartFormData } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  // TODO: Remove/change auth once we've implemented authenticating the Authorization header with BEA's token endpoint.
  // The auth is currently a placeholder to not allow unauthorized access to the route.
  await requireUserSession(request);

  const files = getFilesFromMultipartFormData(request);
  // Validate the XML against the corresponding XJustix xsd schema
  // Call the /verfahren endpoint in the Justiz-Backend-API, reusing the same formData from the req to create a new Verfahren
  // Return the created verfahren_id
  return {
    verfahren_id: "verfahren",
  };
}
