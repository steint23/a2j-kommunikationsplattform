import { redirect, type LoaderFunction } from "react-router";
import {
  AuthenticationProvider,
  authenticator,
} from "~/services/prototype.oAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // refactoring of _index.tsx code:
  // test for a code param, will be deleted, if it is not present
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    console.log("Auth code is:", code);
  }

  const authenticationProvider = AuthenticationProvider.BEA;
  return authenticator
    .authenticate(authenticationProvider, request)
    .then((authenticationResponse) => {
      return redirect("/prototype/verfahren", {
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
