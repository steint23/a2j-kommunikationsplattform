import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

interface JustizBackendService {
  createVerfahren(xjustiz: File, files: File[]): Promise<Verfahren>;
  getAllVerfahren(limit: number, offset: number): Promise<Verfahren[]>;
  getVerfahren(id: string): Promise<Verfahren | undefined>;
}

class JustizBackendServiceMockImpl implements JustizBackendService {
  verfahren: Verfahren[] = [];

  async getAllVerfahren(limit: number, offset: number): Promise<Verfahren[]> {
    return this.verfahren;
  }

  async getVerfahren(id: string): Promise<Verfahren | undefined> {
    return this.verfahren.find((v) => v.id === id);
  }

  async createVerfahren(xjustiz: File, files: File[]): Promise<Verfahren> {
    const mockVerfahren: Verfahren = {
      id: uuidv4(),
      aktenzeichen: "AZ123456",
      status: "InTransmission",
      status_changed: new Date().toISOString(),
    };
    this.verfahren.push(mockVerfahren);
    console.log("Created Verfahren:", this.verfahren);
    return mockVerfahren;
  }
}

class JustizBackendServiceImpl implements JustizBackendService {
  private baseUrl: string;

  constructor(url: string = "https://kompla.sinc.de") {
    this.baseUrl = url;
  }

  async getVerfahren(id: string): Promise<Verfahren | undefined> {
    // Hack until SINC has a valid certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const url = `${this.baseUrl}/api/v1/verfahren/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-User-ID": "Pierre", // TODO: Get the SAFE-ID from the session and set it as the X-User-ID
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        console.log("Verfahren not found: ", id);
        return undefined;
      }

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
      const parsedVerfahren: Verfahren = VerfahrenSchema.parse(body);

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

export { JustizBackendServiceImpl, JustizBackendServiceMockImpl };
export type { JustizBackendService };
