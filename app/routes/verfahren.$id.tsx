import { justizBackendService } from "~/services/servicescontext.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: { params: { id: string } }) {
  const akte = await justizBackendService.getAkte(params.id);

  // TODO: Get the aktenbaum here and render it
  return akte;
}
export default function VerfahrenInfo() {
  const akte = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="text-xl mb-10 font-bold">Datenraum</div>
      {/* <div className="flex flex-col gap-20">
        {akte.aktenteile && akte.aktenteile.map((aktenteil) => (
            <div key={aktenteil.id} className="text-md">
                {aktenteil.name}
                </div>
            ))}
    </div> */}
    </div>
  );
}
