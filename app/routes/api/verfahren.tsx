import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  // Get the Klageeinreichung PDF & XML from the form body
  // Validate the XML against the corresponding XJustix xsd schema
  // Call the /verfahren endpoint in the Justiz-Backend-API to create a new Verfahren
  // Return the created verfahren_id
  return { verfahren_id: "verfahren" };
}
