import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Kommunikationsplattform" },
    { name: "description", content: "Hello Kommunikationsplattform!" },
  ];
};

const onBeaLoginClick = () => {
  alert("beA Login with BRAK IdP");
};

export default function Index() {
  return (
    <main className={"m-40 flex flex-col items-center"}>
      <h1 className={"ds-heading-01-bold mb-40 break-all"}>
        Kommunikationsplattform
      </h1>
      <h2 className={"ds-heading-03-reg break-word"}>
        Willkommen auf der Pilotplattform für den digitalen Austausch zwischen
        Gerichten und Verfahrensbeteiligten in Zivilprozessen vor Amtsgerichten
      </h2>
      <div className={"m-40 text-center"}>
        <p className={"pb-20"}>Bitte wählen Sie Ihre Loginmethode:</p>
        <button onClick={onBeaLoginClick} className={"ds-button"}>
          beA-Portal
        </button>
      </div>
    </main>
  );
}
