import { justizBackendService } from "~/services/servicescontext.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: { params: { id: string } }) {
  const akte = await justizBackendService.getAkte(params.id);

  //   akte?.aktenteile?.forEach((aktenteil) => {
  //     console.log(aktenteil.id!);
  //     });

  const dokumentePromises =
    akte?.aktenteile?.map((aktenteil) => {
      return justizBackendService.getDokumente(
        params.id,
        aktenteil.id!,
        100,
        0,
      );
    }) || [];

  const dokumente = await Promise.all(dokumentePromises);
  return dokumente.flatMap((d) => d.dokumente);
}
export default function VerfahrenInfo() {
  const dokumente = useLoaderData<typeof loader>();

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

      <div className="flex flex-col gap-20">
        {dokumente &&
          dokumente.map((dokument) => {
            return (
              <div key={dokument!.id} className="text-md">
                {dokument!.name}
              </div>
            );
          })}
      </div>
    </div>
  );
}
