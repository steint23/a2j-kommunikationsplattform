/**
 * @jest-environment node
 */
import { getFilesFromMultipartFormData } from "~/services/fileupload.server";

describe("File Upload Service", () => {
  it("should extract files from multipart form data correctly", async () => {
    const fileName = `file_${Date.now()}.xml`;
    const fileContent = "file content";
    const file = new File([fileContent], fileName, { type: "text/xml" });
    const formData = new FormData();
    formData.append("files", file);

    const url = new URL("/api/verfahren", "http://localhost");
    const request = new Request(url.toString(), {
      method: "POST",
      body: formData,
    });

    const files = await getFilesFromMultipartFormData(request);

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe(fileName);
    expect(files[0].text()).resolves.toBe(fileContent);
  });
});
