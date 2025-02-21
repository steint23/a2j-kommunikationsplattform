import { justizBackendService } from "~/services/servicescontext.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: { params: { id: string } }) {
  // TODO: Get the aktenbaum here and render it
  return params.id;
}
export default function VerfahrenInfo() {
  const akte = useLoaderData<typeof loader>();
  return <>Test {akte}</>;
}
