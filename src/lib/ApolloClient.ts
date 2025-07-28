import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { getCookie } from "cookies-next";


export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  // 1. Create an HttpLink to your GraphQL API
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    // fetchOptions: { cache: "no-store" },
  });

  // 2. Create a `setContext` link to add the Authorization header
  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    // In a real application, you might use a more robust state management
    // or a secure cookie for storing the JWT.
    const token = typeof window !== 'undefined' ? getCookie('jwt') : null;

    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers, // Keep existing headers
        authorization: token ? `Bearer ${token}` : "", // Add the JWT if available
      },
    };
  });
  
  // 3. Combine the authLink and httpLink
  // authLink must be before httpLink so it can modify the headers before the request is sent
  const link = authLink.concat(httpLink);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
});
