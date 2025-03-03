import { LoaderFunction } from "@remix-run/node";
import { justizBackendService } from "~/services/servicescontext.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { id, dokumentId } = params;
  const dokumentFile = await justizBackendService.getDokumentFile(
    id!,
    dokumentId!,
  );

  if (!dokumentFile) {
    throw new Response("Not Found", { status: 404 });
  }

  const { file, fileName } = dokumentFile;

  return new Response(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
};
