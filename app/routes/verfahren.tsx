import { useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { getFormDataFromRequest } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";
import { JustizBackendServiceImpl } from "~/services/justizbackend.server";
import { useLoaderData } from "@remix-run/react";
import { justizBackendService } from "~/services/servicescontext.server";

export async function loader() {
  // await requireUserSession(request);
  const verfahren = await justizBackendService.getAllVerfahren(10, 0);
  return verfahren;
}

export async function action({ request }: ActionFunctionArgs) {
  // await requireUserSession(request);
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

  if (!verfahren) {
    return null;
  }

  return (
    <div className="mt-24 ">
      {verfahren.map((v) => (
        <div id={v.id} className="border-2 border-gray-500 p-24 mb-24">
          <div className="font-bold text-3xl">{v.aktenzeichen}</div>
          <div className="text-md text-gray-500">Aktenzeichen</div>

          <div className="grid grid-cols-2 gap-2 mt-10">
            <div className="text-xl">{v.status}</div>
            <div className="text-xl">{v.status_changed}</div>
            <div className="text-md text-gray-500">Einreichungsstatus</div>

            <div className="text-md text-gray-500">Zuletzt geändert</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function CreateVerfahren() {
  const [xjustizSelected, setXjustizSelected] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  return (
    <form method="post" encType="multipart/form-data">
      <div className="flex flex-col gap-4">
        <label className="font-bold" htmlFor="xjustiz">
          XJustiz-Datei <span className="text-red-500">*</span>
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
        <button
          type="submit"
          className={`ds-button mt-24 ${xjustizSelected ? "" : "is-disabled"}`}
          disabled={!xjustizSelected}
        >
          Klage einreichen
        </button>
      </div>
    </form>
  );
}
