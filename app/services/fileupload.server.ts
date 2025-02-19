import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
} from "@remix-run/node";

export type KlageeinrichungFiles = {
  xjustiz: File;
  files: File[];
};

async function getFormDataFromRequest(request: Request): Promise<FormData> {
  // https://remix.run/docs/en/main/guides/file-uploads
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 6_000_000_0, // 60MB
      file: ({ filename }) => filename,
      avoidFileConflicts: false,
    }),
    unstable_createMemoryUploadHandler(),
  );
  return unstable_parseMultipartFormData(request, uploadHandler);
}

export async function getKlageeinreuchingFilesFromRequest(
  request: Request,
): Promise<KlageeinrichungFiles> {
  const formData = await getFormDataFromRequest(request);

  const xjustiz = formData.get("xjustiz") as File;
  const files = formData.getAll("files") as File[];

  return { xjustiz, files };
}
