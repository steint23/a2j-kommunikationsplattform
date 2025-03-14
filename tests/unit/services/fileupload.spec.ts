/**
 * @jest-environment node
 */
import { getFormDataFromRequest } from "~/services/fileUpload.server";

describe("File Upload Service", () => {
  it("should extract files from multipart form data correctly", async () => {
    process.env.FILE_UPLOAD_DIRECTORY = "/tmp";
    const fileName = `file_${Date.now()}.xml`;
    const fileContent = "file content";
    const file = new File([fileContent], fileName, { type: "text/xml" });
    const formData = new FormData();
    formData.append("xjustiz", file);

    const url = new URL("/api/verfahren", "http://localhost");
    const request = new Request(url.toString(), {
      method: "POST",
      body: formData,
    });

    const formDataFromRequest = await getFormDataFromRequest(request);
    const xjustiz = formDataFromRequest.get("xjustiz") as File;

    expect(xjustiz.text()).resolves.toBe(fileContent);
  });
});
