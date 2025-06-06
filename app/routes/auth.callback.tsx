import { redirect, type LoaderFunction } from "react-router";
import {
  AuthenticationProvider,
  authenticator,
} from "~/services/prototype.oAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const authenticationProvider = AuthenticationProvider.BEA;
  return authenticator
    .authenticate(authenticationProvider, request)
    .then((authenticationResponse) => {
      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": authenticationResponse.sessionCookieHeader,
        },
      });
    })
    .catch((error) => {
      console.log(
        `Failed to authenticate user at : ${authenticationProvider}`,
        error,
      );
      throw redirect("/error");
    });
};

export default function AuthCallback() {
  return (
    <main className={"m-40 flex flex-col items-center"}>
      <h1 className={"ds-heading-01-bold mb-40 break-all"}>
        Authentication callback error
      </h1>
    </main>
  );
}
