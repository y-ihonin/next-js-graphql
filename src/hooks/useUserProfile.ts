"use client";

import { useQuery, useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { deleteCookie } from "cookies-next";

// graphql
import { usersPermissionsMeQuery } from "@/graphql/queries/usersPermissionsUsers";
import { IUserPermissions } from "@/types/api/UserPermissions";


export default function useUserProfile() {
  const router = useRouter();
  const client = useApolloClient();
  
  const { data, loading: isLoading, refetch } = useQuery<{ me: IUserPermissions }>(usersPermissionsMeQuery, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const logout = useCallback(async () => {
    try {
      // Clear the JWT cookie
      await deleteCookie("jwt");
      
      // Clear the entire Apollo client cache
      await client.clearStore();
      
      // Reset the Apollo client to clear any cached queries
      await client.resetStore();
      
      // Force a cache eviction for the me query
      client.cache.evict({ fieldName: 'me' });
      client.cache.gc();
      
      // Redirect to login page
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if there's an error, try to clear the cache and redirect
      try {
        await client.clearStore();
        await client.resetStore();
        client.cache.evict({ fieldName: 'me' });
        client.cache.gc();
      } catch (clearError) {
        console.error("Cache clear error:", clearError);
      }
      
      router.push("/sign-in");
    }
  }, [client, router]);

  return {
    data: data?.me || null,
    isLoading: !!isLoading,
    refetch,
    logout,
  };
}
