import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { getFormDataFromRequest } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
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

  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSidebar = (id: string) => {
    setExpanded((prevExpanded) => {
      const isExpanded = prevExpanded !== id;
      return isExpanded ? id : null;
    });
  };

  if (!verfahren) {
    return null;
  }

  return (
    <div className="mt-36 flex flex-col gap-24 w-full sm:w-3/4 xl:w-2/3 2xl:w-1/2">
      {verfahren.map((v) => (
        <div className="flex border-2 border-gray-500 p-24">
          <div className="w-full">
            <div className="font-bold text-3xl">{v.aktenzeichen}</div>
            <div className="text-sm text-gray-500">Aktenzeichen</div>

            <div className="grid grid-cols-2 gap-y-2  mt-24">
              <div className="text-xl">{v.status}</div>
              <div className="text-xl">
                {new Date(v.status_changed).toLocaleDateString("de-DE")}
              </div>
              <div className="text-sm text-gray-500">Einreichungsstatus</div>

              <div className="text-sm text-gray-500">Zuletzt geändert</div>
            </div>

            {expanded === v.id && (
              <div className="mt-20">
                <Outlet />
              </div>
            )}
          </div>
          <Link
            to={`/verfahren/${v.id}`}
            key={v.id}
            onClick={() => toggleSidebar(v.id)}
            preventScrollReset={true}
            className="items-stretch cursor-pointer pl-24 border-l-2 border-gray-300 flex"
          >
            <div className="my-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-24 w-24 text-gray-500 transition-transform ${expanded === v.id ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

function CreateVerfahren() {
  const [xjustizSelected, setXjustizSelected] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  return (
    <form method="post" encType="multipart/form-data" action="/verfahren">
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
          className={`ds-button mt-20 ${xjustizSelected ? "" : "is-disabled"}`}
          disabled={!xjustizSelected}
        >
          Klage einreichen
        </button>
      </div>
    </form>
  );
}
