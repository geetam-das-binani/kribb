import { createClerkSupbaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

export const useSupabase = () => {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createClerkSupbaseClient(() => getToken()),
    [getToken],
  );

  return client;
};
