/**
 * @jest-environment node
 */
import { action } from "~/routes/api.verfahren"; // Adjust the import based on your file structure

describe("API Verfahren Endpoint", () => {
  it("should handle file uploads correctly", async () => {
    const file = new File(["file content"], "test.xml", { type: "text/xml" });
    const formData = new FormData();
    formData.append("files", file);

    const url = new URL("/api/verfahren", "http://localhost");
    const request = new Request(url.toString(), {
      method: "POST",
      body: formData,
    });

    const response = await action({ request, params: {}, context: {} });

    expect(response.verfahren_id).toBe("verfahren");
    expect(response.files).toHaveLength(1);
  });
});
