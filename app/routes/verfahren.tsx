import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { getFormDataFromRequest } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";
import { JustizBackendServiceImpl } from "~/services/justizbackend.server";

export const loader: LoaderFunction = async ({ request }) => {
  // await requireUserSession(request);
  return null;
};

export async function action({ request }: ActionFunctionArgs) {
  // await requireUserSession(request);
  const justizBackendService = new JustizBackendServiceImpl();
  const formData = await getFormDataFromRequest(request);

  const xjustiz = formData.get("xjustiz") as File;
  const files = formData.getAll("files") as File[];

  await justizBackendService.createVerfahren(xjustiz, files);

  return null;
}

export default function Verfahren() {
  return (
    <main className={"m-40 flex flex-col items-center"}>
      <h1 className={"ds-heading-01-bold mb-40 break-all"}>Verfahren</h1>
      <CreateVerfahren />
    </main>
  );
}

function CreateVerfahren() {
  const [filesSelected, setFilesSelected] = useState(false);
  return (
    <form method="post" encType="multipart/form-data">
      <div className="flex flex-col gap-4">
        <label className="font-bold" htmlFor="xjustiz">
          XJustiz-Datei
        </label>
        <input
          className="border-2 border-black-300 p-10"
          type="file"
          accept=".xml"
          name="xjustiz"
          id="xjustiz"
          onChange={(e) =>
            setFilesSelected((e?.target?.files?.length || 0) > 0)
          }
        />
        <label className="font-bold" htmlFor="files">
          Anhänge
        </label>

        <input
          className="border-2 border-black-300 p-10"
          type="file"
          name="files"
          id="files"
          multiple
        />
        {filesSelected && (
          <button type="submit" className={"ds-button"}>
            Klage einreichen
          </button>
        )}
      </div>
    </form>
  );
}
