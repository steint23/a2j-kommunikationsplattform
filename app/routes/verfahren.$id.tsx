import { justizBackendService } from "~/services/servicescontext.server";
import { useLoaderData } from "react-router";

export async function loader({ params }: { params: { id: string } }) {
  const akte = await justizBackendService.getAkte(params.id);

  const dokumentePromises =
    akte?.aktenteile?.map(async (aktenteil) => {
      const dokumente = await justizBackendService.getAllDokumente(
        params.id,
        aktenteil.id!,
        100,
        0,
      );
      return {
        aktenteilId: aktenteil.id,
        aktenteilName: aktenteil.name,
        dokumente: dokumente.dokumente,
      };
    }) || [];

  const dokumente = await Promise.all(dokumentePromises);
  return {
    verfahrenId: params.id,
    aktenTeileWithDokumente: dokumente,
  };
}

export default function VerfahrenInfo() {
  return (
    <div>
      <div className="text-xl mb-20 font-bold">Datenraum</div>
      {/* <ListDokumente /> */}
      <AkteWithDokumente />
    </div>
  );
}

function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

function AkteWithDokumente() {
  const { verfahrenId, aktenTeileWithDokumente } =
    useLoaderData<typeof loader>();
  const filteredAkteTeile = aktenTeileWithDokumente.filter(
    (aktenteil) => (aktenteil?.dokumente?.length || 0) > 0,
  );

  return (
    <div>
      {filteredAkteTeile &&
        filteredAkteTeile.map((aktenteil) => {
          return (
            <div className="my-10" key={aktenteil.aktenteilId}>
              <div className="mb-10 font-medium">{aktenteil.aktenteilName}</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-y-16 flex-wrap">
                {aktenteil.dokumente &&
                  aktenteil.dokumente.map((dokument, index) => {
                    return (
                      <div
                        className="flex flex-col"
                        key={`${dokument!.id}-${index}`}
                      >
                        <a
                          download
                          key={dokument!.id}
                          href={`/verfahren/${verfahrenId}/dokument/${dokument!.id}`}
                          className="flex gap-10 items-center"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.5875 21.4125C4.97917 21.8042 5.45 22 6 22H18C18.55 22 19.0208 21.8042 19.4125 21.4125C19.8042 21.0208 20 20.55 20 20V8.825C20 8.55833 19.95 8.30417 19.85 8.0625C19.75 7.82083 19.6083 7.60833 19.425 7.425L14.575 2.575C14.3917 2.39167 14.1792 2.25 13.9375 2.15C13.6958 2.05 13.4417 2 13.175 2H6C5.45 2 4.97917 2.19583 4.5875 2.5875C4.19583 2.97917 4 3.45 4 4V20C4 20.55 4.19583 21.0208 4.5875 21.4125ZM13.2875 8.7125C13.0958 8.52083 13 8.28333 13 8V4L18 9H14C13.7167 9 13.4792 8.90417 13.2875 8.7125Z"
                              fill="#0073A8"
                            />
                          </svg>

                          <div className="text-md text-[#0073A8]">
                            {truncateText(dokument.name!, 25)}
                          </div>
                        </a>
                        <div className="text-sm text-gray-500">
                          {dokument.dokumentKlasse}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
