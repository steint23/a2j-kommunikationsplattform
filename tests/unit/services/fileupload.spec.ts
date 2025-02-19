/**
 * @jest-environment node
 */
import { getKlageeinreuchingFilesFromRequest } from "~/services/fileupload.server";

describe("File Upload Service", () => {
  it("should extract files from multipart form data correctly", async () => {
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

    const klageEinreichungFiles =
      await getKlageeinreuchingFilesFromRequest(request);
    const xjustix = klageEinreichungFiles.xjustiz;
    const additionalFiles = klageEinreichungFiles.files;

    expect(xjustix.text()).resolves.toBe(fileContent);
    expect(additionalFiles).toHaveLength(0);
  });
});
