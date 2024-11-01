import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Kommunikationsplattform" },
    { name: "description", content: "Hello Kommunikationsplattform!" },
  ];
};

export default function Index() {
  return (
    <main className={"flex flex-col items-center m-40"}>
      <h1 className={"ds-heading-01-reg mb-40"}>Hello Kommunikationsplattform!</h1>
    </main>
  );
}
