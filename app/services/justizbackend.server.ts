import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

interface JustizBackendService {
  createVerfahren(xjustiz: File, files: File[]): Promise<Verfahren>;
  getAllVerfahren(limit: number, offset: number): Promise<Verfahren[]>;
  getVerfahren(id: string): Promise<Verfahren | undefined>;
  getAkte(verfahrenId: string): Promise<Akte | undefined>;
  getAllDokumente(
    verfahrenId: string,
    aktenteilId: string,
    limit: number,
    offset: number,
  ): Promise<AllDokumenteResponse>;
  getDokumentFile(
    verfahrenId: string,
    dokumentId: string,
  ): Promise<DokumentFile | undefined>; // New method
}

class JustizBackendServiceMockImpl implements JustizBackendService {
  verfahren: Verfahren[] = [];
  akten: Map<string, Akte> = new Map(); // verfahrenId -> akte
  dokumente: Map<string, Dokument[]> = new Map(); // aktenteilId -> dokumente
  dokumentFiles: Map<string, Blob> = new Map(); // dokumentId -> file

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

    const mockAkte: Akte = {
      id: uuidv4(),
      aktenzeichen: mockVerfahren.aktenzeichen,
      aktenteile: [
        {
          id: uuidv4(),
          name: "Hauptakte",
          parent_id: null,
        },
        {
          id: uuidv4(),
          name: "Eingänge",
          parent_id: null,
        },
      ],
    };
    this.akten.set(mockVerfahren.id, mockAkte);

    const mockDokumente: Dokument[] = [
      {
        id: uuidv4(),
        name: xjustiz.name,
      },
    ].concat(
      files
        .filter((file) => file.size > 0)
        .map((file) => ({
          id: uuidv4(),
          name: file.name,
        })),
    );

    mockDokumente.forEach((dokument) => {
      this.dokumentFiles.set(dokument.id!, new Blob([dokument.name!]));
    });

    this.dokumente.set(mockAkte.aktenteile![0].id!, mockDokumente);

    console.log("Created Verfahren:", this.verfahren);
    return mockVerfahren;
  }

  async getAkte(verfahrenId: string): Promise<Akte | undefined> {
    return this.akten.get(verfahrenId);
  }

  async getAllDokumente(
    verfahrenId: string,
    aktenteilId: string,
    limit: number,
    offset: number,
  ): Promise<AllDokumenteResponse> {
    const dokumente = this.dokumente.get(aktenteilId) || [];
    const paginatedDokumente = dokumente.slice(offset, offset + limit);
    return {
      verfahren_id: verfahrenId,
      dokumente: paginatedDokumente,
      count: dokumente.length,
    };
  }

  async getDokumentFile(
    verfahrenId: string,
    dokumentId: string,
  ): Promise<DokumentFile | undefined> {
    const blob = this.dokumentFiles.get(dokumentId);
    const fileName =
      this.dokumente.get(verfahrenId)?.find((d) => d.id === dokumentId)?.name ||
      "dokument.pdf";
    if (blob) {
      return { file: blob, fileName };
    }
    return undefined;
  }
}

class JustizBackendServiceImpl implements JustizBackendService {
  private baseUrl: string;

  constructor(url: string = "https://kompla.sinc.de") {
    this.baseUrl = url;
  }

  async getVerfahren(id: string): Promise<Verfahren | undefined> {
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
    const url = `${this.baseUrl}/api/v1/verfahren`;

    const formData = new FormData();

    formData.append("xjustiz", xjustiz);
    files.forEach((file) => formData.append("files", file));

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

  async getAkte(verfahrenId: string): Promise<Akte | undefined> {
    const url = `${this.baseUrl}/api/v1/verfahren/${verfahrenId}/akte`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-User-ID": "Pierre",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        console.log("Akte not found for verfahren: ", verfahrenId);
        return undefined;
      }

      if (!response.ok) {
        response.body
          ?.getReader()
          .read()
          .then((r) =>
            console.error("Failed to fetch Akte: ", r.value?.toString()),
          );
        throw new Error(`Failed to fetch Akte`);
      }

      const body = await response.json();
      const parsedAkte: Akte = AkteSchema.parse(body);

      console.log("Fetched Akte successfully:", parsedAkte);
      return parsedAkte;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle zod validation errors
        console.error("Zod validation error:", error.errors);
      } else {
        console.error("Error fetching Akte:", error);
      }
      throw error;
    }
  }

  async getAllDokumente(
    verfahrenId: string,
    aktenteilId: string,
    limit: number,
    offset: number,
  ): Promise<AllDokumenteResponse> {
    const url = `${this.baseUrl}/api/v1/verfahren/${verfahrenId}/dokumente/${aktenteilId}?limit=${limit}&offset=${offset}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-User-ID": "Pierre",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        console.log("Dokumente not found for aktenteil: ", aktenteilId);
        return { verfahren_id: verfahrenId, dokumente: [], count: 0 };
      }

      if (!response.ok) {
        response.body
          ?.getReader()
          .read()
          .then((r) =>
            console.error("Failed to fetch Dokumente: ", r.value?.toString()),
          );
        throw new Error(`Failed to fetch Dokumente`);
      }

      const body = await response.json();
      const parsedDokumentResponse: AllDokumenteResponse =
        AllDokumenteResponseSchema.parse(body);

      console.log("Fetched Dokumente successfully:", parsedDokumentResponse);
      return parsedDokumentResponse;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle zod validation errors
        console.error("Zod validation error:", error.errors);
      } else {
        console.error("Error fetching Dokumente:", error);
      }
      throw error;
    }
  }

  async getDokumentFile(
    verfahrenId: string,
    dokumentId: string,
  ): Promise<DokumentFile | undefined> {
    const url = `${this.baseUrl}/api/v1/verfahren/${verfahrenId}/dokument/${dokumentId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-User-ID": "Pierre",
        },
      });

      if (response.status === 404) {
        console.log("Dokument not found: ", dokumentId);
        return undefined;
      }

      if (!response.ok) {
        response.body
          ?.getReader()
          .read()
          .then((r) =>
            console.error(
              "Failed to fetch Dokument file: ",
              r.value?.toString(),
            ),
          );
        throw new Error(`Failed to fetch Dokument file`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");

      let fileName = "dokument.pdf";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="([^"]+)"/);
        const fileNameStarMatch = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/,
        );

        if (fileNameStarMatch) {
          fileName = decodeURIComponent(fileNameStarMatch[1]);
        } else if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      const file = await response.blob();

      console.log("Fetched Dokument file successfully:", file);
      return { file, fileName };
    } catch (error) {
      console.error("Error fetching Dokument file:", error);
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

const AkteSchema = z.object({
  id: z.string().uuid(),
  aktenzeichen: z.string().nullable(),
  aktenteile: z
    .array(
      z.object({
        id: z.string().nullable(),
        name: z.string().nullable(),
        parent_id: z.string().nullable(),
      }),
    )
    .nullable(),
});

const DokumentSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
});

const AllDokumenteResponseSchema = z.object({
  verfahren_id: z.string().nullable(),
  dokumente: z.array(DokumentSchema).nullable(),
  count: z.number().int(),
});

type DokumentFile = { file: Blob; fileName: string };

type Dokument = z.infer<typeof DokumentSchema>;
type AllDokumenteResponse = z.infer<typeof AllDokumenteResponseSchema>;

type Akte = z.infer<typeof AkteSchema>;
type Verfahren = z.infer<typeof VerfahrenSchema>;

export { JustizBackendServiceImpl, JustizBackendServiceMockImpl };
export type { JustizBackendService };
