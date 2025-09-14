import { ApolloError } from "@apollo/client";


const apolloErrorHandler = (err: ApolloError): string => {
   // Parse the Apollo Error object to get a cleaner message
   let displayMessage = "An unknown error occurred.";

   if (err.graphQLErrors && err.graphQLErrors.length > 0) {
     // Handle multiple GraphQL errors
     const errorMessages = err.graphQLErrors.map(graphQLError => {
       // Check if it's a validation error (BAD_USER_INPUT)
       if (graphQLError.extensions?.code === 'BAD_USER_INPUT') {
         // Parse validation error messages to be more user-friendly
         const message = graphQLError.message;
         
         // Handle field validation errors
         if (message.includes('Field') && message.includes('was not provided')) {
           const fieldMatch = message.match(/Field "([^"]+)" of required type/);
           if (fieldMatch) {
             const fieldName = fieldMatch[1];
             return `The ${fieldName} field is required.`;
           }
         }
         
         // Handle undefined field errors
         if (message.includes('is not defined by type')) {
           const fieldMatch = message.match(/Field "([^"]+)" is not defined/);
           if (fieldMatch) {
             const fieldName = fieldMatch[1];
             return `The field "${fieldName}" is not valid for this request.`;
           }
         }
         
         // Handle invalid value errors
         if (message.includes('got invalid value')) {
           return 'Please check your input and try again.';
         }
         
         // Return the original message if we can't parse it
         return message;
       }
       
       // For other GraphQL errors, return the message as-is
       return graphQLError.message;
     });
     
     // Join multiple error messages
     displayMessage = errorMessages.join(' ');
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
