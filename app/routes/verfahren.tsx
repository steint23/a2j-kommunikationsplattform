import type { ActionFunctionArgs } from "@remix-run/node";
import { getFilesFromMultipartFormData } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  await requireUserSession(request);

  const files = getFilesFromMultipartFormData(request);
  // Validate the XML against the corresponding XJustix xsd schema
  // Call the /verfahren endpoint in the Justiz-Backend-API, reusing the same formData from the req to create a new Verfahren
  // Return the created verfahren_id
  return {
    verfahren_id: "verfahren",
  };
}

export default function Verfahren() {
  return (
    <main className={"m-40 flex flex-col items-center"}>
      <h1 className={"ds-heading-01-bold mb-40 break-all"}>Verfahren</h1>
      <form method="post" encType="multipart/form-data">
        <label htmlFor="files" className="">
          Dateien hochladen
        </label>
        <input
          type="file"
          name="files"
          id="files"
          multiple
          className="hidden"
        />

        <button type="submit" className={"ds-button"}>
          Klage einreichen
        </button>
      </form>
    </main>
  );
}
