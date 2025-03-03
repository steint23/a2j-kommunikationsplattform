import { useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { getFormDataFromRequest } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";
import { Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
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
  const navigation = useNavigation();
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
        <div key={v.id} className="flex border-2 border-gray-500 p-24">
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
                {navigation.state === "loading" ? (
                  <div>Datenraum wird geladen...</div>
                ) : (
                  <Outlet />
                )}
              </div>
            )}
          </div>
          <Link
            to={`/verfahren/${v.id}`}
            onClick={() => toggleSidebar(v.id)}
            preventScrollReset={true}
            className="items-stretch cursor-pointer pl-24 border-l-2 border-gray-300 flex"
          >
            <div className="my-auto">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`h-24 w-24 text-gray-500 transition-transform ${expanded === v.id ? "rotate-180" : ""}`}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.5002 19.85C15.6558 19.9056 15.8225 19.9333 16.0002 19.9333C16.178 19.9333 16.3447 19.9056 16.5002 19.85C16.6558 19.7945 16.8002 19.7 16.9336 19.5667L23.0669 13.4333C23.3113 13.1889 23.4336 12.8778 23.4336 12.5C23.4336 12.1222 23.3113 11.8111 23.0669 11.5667C22.8225 11.3222 22.5113 11.2 22.1336 11.2C21.7558 11.2 21.4447 11.3222 21.2002 11.5667L16.0002 16.7667L10.8002 11.5667C10.5558 11.3222 10.2447 11.2 9.86689 11.2C9.48912 11.2 9.17801 11.3222 8.93356 11.5667C8.68912 11.8111 8.56689 12.1222 8.56689 12.5C8.56689 12.8778 8.68912 13.1889 8.93356 13.4333L15.0669 19.5667C15.2002 19.7 15.3447 19.7945 15.5002 19.85Z"
                  fill="#0073A8"
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
