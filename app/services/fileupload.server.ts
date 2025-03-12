import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
} from "@remix-run/node";
import { config } from "~/config/config.server";

// @TODO: adjust to React Router file upload recommendation
// @see: https://reactrouter.com/how-to/file-uploads
export async function getFormDataFromRequest(
  request: Request,
): Promise<FormData> {
  // https://remix.run/docs/en/main/guides/file-uploads
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 6_000_000_0, // 60MB,
      directory: config().FILE_UPLOAD_DIRECTORY,
      file: ({ filename }) => filename,
      avoidFileConflicts: false,
    }),
    unstable_createMemoryUploadHandler({
      maxPartSize: 6_000_000_0, // 60MB
    }),
  );
  return unstable_parseMultipartFormData(request, uploadHandler);
}
