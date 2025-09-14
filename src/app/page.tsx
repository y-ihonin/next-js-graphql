// components
import TestClientComponent from "@/pageComponents/TestClientComponent";

import { getClient } from "@/lib/ApolloClient";

// helpers
import { usersPermissionsUsersQuery } from "@/graphql/queries/usersPermissionsUsers";

export default async function Home() {
  try {
    const { data } = await getClient().query({
      query: usersPermissionsUsersQuery,
      context: {
        fetchOptions: {
          next: { revalidate: 10 },
        },
      }
    });

    console.log("data", data)
  } catch (err) {
    console.log(err)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <TestClientComponent /> 
    </div>
  );
}
