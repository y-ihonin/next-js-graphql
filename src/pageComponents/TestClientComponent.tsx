"use client";

import React, { Suspense } from "react";
import { useQuery, useSuspenseQuery } from "@apollo/client";

import { ApolloWrapper } from "@/lib/ApolloWrapper";

// helpers
import { usersPermissionsUsersQuery } from "@/graphql/queries/usersPermissionsUsers";




function SuspenseQueryUser({ children }: React.PropsWithChildren) {
  const result = useSuspenseQuery(usersPermissionsUsersQuery, { fetchPolicy: "cache-first" });

  console.log("SuspenseQueryUser", result)

  return (
    <>
      <React.Fragment key="children">{children}</React.Fragment>
    </>
  );
}

function QueryUser({ children }: React.PropsWithChildren) {
  const result = useQuery(usersPermissionsUsersQuery, { fetchPolicy: "cache-first" });

  console.log("QueryUser", result)

  return (
    <>
      <React.Fragment key="children">{children}</React.Fragment>
    </>
  );
}

const TestClientComponent = () => {
  return (
    <ApolloWrapper>
      <div>
        <Suspense>
          <SuspenseQueryUser>
            Suspense Test
          </SuspenseQueryUser>
        </Suspense>
        <QueryUser>
          Query Test
        </QueryUser>
      </div>
    </ApolloWrapper>
  )
}

export default TestClientComponent;
