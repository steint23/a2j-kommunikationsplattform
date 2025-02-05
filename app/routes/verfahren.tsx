import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { getFilesFromMultipartFormData } from "~/services/fileupload.server";
import { requireUserSession } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  return null;
};
export async function action({ request }: ActionFunctionArgs) {
  await requireUserSession(request);

  const files = getFilesFromMultipartFormData(request);
  return null;
}

export default function Verfahren() {
  const [filesSelected, setFilesSelected] = useState(false);

  return (
    <main className={"m-40 flex flex-col items-center"}>
      <h1 className={"ds-heading-01-bold mb-40 break-all"}>Verfahren</h1>
      <form method="post" encType="multipart/form-data">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            name="files"
            id="files"
            multiple
            onChange={(e) =>
              setFilesSelected((e?.target?.files?.length || 0) > 0)
            }
          />
          {filesSelected && (
            <button type="submit" className={"ds-button"}>
              Klage einreichen
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
