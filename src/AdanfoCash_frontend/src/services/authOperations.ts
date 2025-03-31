
import { initAuth } from "./authClient";
import { getIdentityProviderUrl } from "./authConfig";

// Login with NFID
export const login = async (): Promise<boolean> => {
  const client = await initAuth();
  
  // Get the proper identity provider URL based on environment
  const identityProviderUrl = getIdentityProviderUrl();
  
  console.log("Attempting login with Internet Identity provider URL:", identityProviderUrl);
  
  return new Promise((resolve) => {
    try {
      client.login({
        identityProvider: identityProviderUrl,
        onSuccess: () => {
          console.log("Internet Identity Login successful!");
          resolve(true);
        },
        onError: (error) => {
          console.error("Internet Identity Login failed:", error);
          
          // Try fallback options
          console.log("Trying fallback Internet Identity URLs...");
          
          // Try multiple URL formats 
          const alternativeURLs = [
            // Primary Internet Identity URL
            `https://identity.ic0.app`,
            // Standard Internet Identity URL
            `https://identity.ic0.app/#authorize`,
            // Local Internet Identity - works in development
            `http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`
          ];
          
          // Try each URL sequentially
          const tryNextURL = (index = 0) => {
            if (index >= alternativeURLs.length) {
              console.error("All Internet Identity login attempts failed");
              resolve(false);
              return;
            }
            
            const url = alternativeURLs[index];
            console.log(`Trying alternative URL (${index + 1}/${alternativeURLs.length}):`, url);
            
            client.login({
              identityProvider: url,
              onSuccess: () => {
                console.log(`Login successful with alternative URL: ${url}`);
                resolve(true);
              },
              onError: (fallbackError) => {
                console.error(`Login failed with URL ${url}:`, fallbackError);
                // Try next URL
                tryNextURL(index + 1);
              },
              // Maximum authorization expiration is 8 days
              maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000)
            });
          };
          
          // Start trying alternative URLs
          tryNextURL();
        },
        // Maximum authorization expiration is 8 days
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000)
      });
    } catch (e) {
      console.error("Unexpected error during login process:", e);
      resolve(false);
    }
  });
};

// Logout from Internet Identity
export const logout = async (): Promise<void> => {
  const client = await initAuth();
  await client.logout();
};
