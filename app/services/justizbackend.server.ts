import { z } from "zod";

interface JustizBackendService {
  createVerfahren(xjustiz: File, files: File[]): Promise<Verfahren>;
  getAllVerfahren(limit: number, offset: number): Promise<Verfahren[]>;
}

class JustizBackendServiceImpl implements JustizBackendService {
  private baseUrl: string;

  constructor(url: string = "https://kompla.sinc.de") {
    this.baseUrl = url;
  }
  async getAllVerfahren(limit: number, offset: number): Promise<Verfahren[]> {
    // Hack until SINC has a valid certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const url = `${this.baseUrl}/api/v1/verfahren?limit=${limit}&offset=${offset}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-User-ID": "Pierre", // TODO: Get the SAFE-ID from the session and set it as the X-User-ID
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        response.body
          ?.getReader()
          .read()
          .then((r) =>
            console.error("Failed to fetch Verfahren: ", r.value?.toString()),
          );
        throw new Error(`Failed to fetch Verfahren`);
      }

      const body = await response.json();
      // TODO: Once the API is fixed, we can use the commented line below instead of working directly with an array.
      // const parsedVerfahren: Verfahren[] = z.object( { data: z.array(VerfahrenSchema) }).parse(body)?.data;
      const parsedVerfahren: Verfahren[] = z.array(VerfahrenSchema).parse(body);

      console.log("Fetched Verfahren successfully:", parsedVerfahren);
      return parsedVerfahren;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle zod validation errors
        console.error("Zod validation error:", error.errors);
      } else {
        console.error("Error fetching Verfahren:", error);
      }
      throw error;
    }
  }

  async createVerfahren(xjustiz: File, files: File[]): Promise<Verfahren> {
    // Hack until SINC has a valid certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const url = `${this.baseUrl}/api/v1/verfahren`;

    const formData = new FormData();

    formData.append("xjustiz", xjustiz);
    files.forEach((file) => formData.append("file", file));

    // TODO: Get the SAFE-ID from the session and set it as the X-User-ID
    const headers = {
      "X-User-ID": "Pierre",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        response.body
          ?.getReader()
          .read()
          .then((r) =>
            console.error("Failed to create Verfahren: ", r.value?.toString()),
          );
        throw new Error(`Failed to create Verfahren`);
      }

      const data = await response.json();
      const parsedVerfahren: Verfahren = VerfahrenSchema.parse(data);

      console.log("Verfahren created successfully:", parsedVerfahren);
      return parsedVerfahren;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle zod validation errors
        console.error("Zod validation error:", error.errors);
      } else {
        console.error("Error creating Verfahren:", error);
      }
      throw error;
    }
  }
}

const VerfahrenStatusSchema = z.enum([
  "InTransmission",
  "Transmitted",
  "Pending",
  "Closed",
]);

const VerfahrenSchema = z.object({
  id: z.string().uuid(),
  aktenzeichen: z.string().nullable(),
  status: VerfahrenStatusSchema,
  status_changed: z.string().datetime(),
});

// type VerfahrenStatus = z.infer<typeof VerfahrenStatusSchema>;
type Verfahren = z.infer<typeof VerfahrenSchema>;

export { JustizBackendServiceImpl };
export type { JustizBackendService };
