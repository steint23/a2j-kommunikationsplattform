import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
} from "@remix-run/node";

export async function getFilesFromMultipartFormData(
  request: Request,
): Promise<File[]> {
  // https://remix.run/docs/en/main/guides/file-uploads
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 6_000_000_0, // 60MB
      file: ({ filename }) => filename,
      avoidFileConflicts: false,
    }),
    unstable_createMemoryUploadHandler(),
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const files = formData.getAll("files") as File[];

  return files;
}
