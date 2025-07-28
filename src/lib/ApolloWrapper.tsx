"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import { getCookie } from "cookies-next";
import { setVerbosity } from "ts-invariant";

setVerbosity("debug");

function makeClient(serverToken?: string | null) {
  // 1. Create an HttpLink to your GraphQL API
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    // fetchOptions: { cache: "no-store" },
  });

  // 2. Create a `setContext` link to add the Authorization header
  const authLink = setContext(async (_, { headers }) => {
    let token = null;

    // Always read token dynamically from cookies
    if (typeof window !== 'undefined') {
      // Client-side: use cookies-next
      const clientSideToken = await getCookie('jwt');
      token = clientSideToken;
    } else {
      // Server-side: use the serverToken if provided, otherwise null
      token = serverToken || null;
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  
  // 3. Combine the authLink and httpLink
  // authLink must be before httpLink so it can modify the headers before the request is sent
  const clientLink = authLink.concat(httpLink);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            clientLink, // Use the authenticated link chain for SSR
          ])
        : clientLink, // Use the authenticated link chain for CSR
  });
}

export function ApolloWrapper({ 
  children, 
  serverToken 
}: React.PropsWithChildren<{ serverToken?: string | null }>) {
  return (
    <ApolloNextAppProvider makeClient={() => makeClient(serverToken)}>
      {children}
    </ApolloNextAppProvider>
  );
}
