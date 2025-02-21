import { useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { getFormDataFromRequest } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";
import { JustizBackendServiceImpl } from "~/services/justizbackend.server";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  // await requireUserSession(request);
  const justizBackendService = new JustizBackendServiceImpl();
  const verfahren = await justizBackendService.getAllVerfahren(10, 0);
  return verfahren;
}

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
      <ListVerfahren />
    </main>
  );
}
function ListVerfahren() {
  const verfahren = useLoaderData<typeof loader>();

  return verfahren.map((v) => (
    <div key={v.id} className="flex flex-col gap-4">
      <h2 className="font-bold">Verfahren {v.aktenzeichen}</h2>
      <p>Status: {v.status}</p>
      <p>Geändert am: {v.status_changed}</p>
    </div>
  ));
}
function CreateVerfahren() {
  const [xjustizSelected, setXjustizSelected] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  return (
    <form method="post" encType="multipart/form-data">
      <div className="flex flex-col gap-4">
        <label className="font-bold" htmlFor="xjustiz">
          XJustiz-Datei
        </label>
        <input
          className={`border-2 border-black-300 p-10 hover:border-blue-600 ${xjustizSelected ? "border-green-500" : ""}`}
          type="file"
          accept=".xml"
          name="xjustiz"
          id="xjustiz"
          onChange={(e) =>
            setXjustizSelected((e?.target?.files?.length || 0) > 0)
          }
        />
        <label className="font-bold" htmlFor="files">
          Anhänge
        </label>

        <input
          className={`border-2 border-black-300 p-10 hover:border-blue-600 ${filesSelected ? "border-green-500" : ""}`}
          type="file"
          name="files"
          id="files"
          multiple
          onChange={(e) =>
            setFilesSelected((e?.target?.files?.length || 0) > 0)
          }
        />
        {xjustizSelected && (
          <button type="submit" className={"ds-button mt-24"}>
            Klage einreichen
          </button>
        )}
      </div>
    </form>
  );
}
