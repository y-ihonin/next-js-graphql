import { ApolloError } from "@apollo/client";


const apolloErrorHandler = (err: ApolloError): string => {
   // Parse the Apollo Error object to get a cleaner message
   let displayMessage = "An unknown error occurred.";

   if (err.graphQLErrors && err.graphQLErrors.length > 0) {
     // These are errors thrown by your GraphQL resolver (e.g., from your `throw new Error(...)` calls)
     displayMessage = err.graphQLErrors[0].message;
   } else if (err.networkError) {
     // These are network-related errors (e.g., server unreachable, bad response status)
     displayMessage = `Network error: ${err.networkError.message || "Could not connect to server."}`;
   } else {
     // Fallback for other ApolloClient errors
     displayMessage = err.message.replace("ApolloError: ", ""); // Remove the prefix for generic Apollo errors
   }

   return displayMessage;
}

export default apolloErrorHandler;
