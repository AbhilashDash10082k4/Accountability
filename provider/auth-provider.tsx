import { AuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [claims, setClaims] = useState<
    Record<string, any> | undefined | null
  >();
  const [profile, setProfile] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  console.log("CLAIMS", claims);
  console.log("PROFILE", profile);
  // Fetch the claims once, and subscribe to auth state changes
  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);

      const { data, error } = await supabase.auth.getClaims();

      if (error) {
        console.error("Error fetching claims:", error);
      }

      setClaims(data?.claims ?? null);
      setIsLoading(false);
    };

    fetchClaims();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, _session) => {
      console.log("Auth state changed:", { event: _event });
      setIsLoading(true);
      const { data } = await supabase.auth.getClaims();
      setClaims(data?.claims ?? null);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch the profile when the claims change
  useEffect(() => {
    const fetchProfile = async () => {
      setIsProfileLoading(true);

      if (claims) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", claims.sub)
          .single();

        setProfile(data);
      } else {
        setProfile(null);
      }

      setIsProfileLoading(false);
    };

    fetchProfile();
  }, [claims]);

  return (
    <AuthContext.Provider
      value={{
        claims,
        isLoading,
        profile,
        // undefined = still loading, null = not logged in, object = logged in
        isLoggedIn: claims !== undefined && claims !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
