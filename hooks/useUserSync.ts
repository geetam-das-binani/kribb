import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useSupabase } from "./useSupabase";
import { useEffect } from "react";

export const useUserSync = () => {
  const { user } = useUser();
  
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const authSupabase = useSupabase();

  useEffect(() => {
    if (!user) return;
    syncUser();
  }, [user]);

  async function syncUser() {
    const { data } = await authSupabase
      .from("users")
      .select("is_admin , clerk_id")
      .eq("clerk_id", user!.id)
      .single();

    if (data) {
      setIsAdmin(data.is_admin ?? false);
      return;
    }
    const { data: newUser } = await authSupabase
      .from("users")
      .insert({
        clerk_id: user!.id,
        email: user!.emailAddresses[0].emailAddress,
        first_name: user!.firstName,
        last_name: user!.lastName,
        avatar_url: user!.imageUrl,
      })
      .select("is_admin")
      .single();


    setIsAdmin(newUser!.is_admin ?? false);
  }
};
