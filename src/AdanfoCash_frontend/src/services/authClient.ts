
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";

// Auth client singleton
let authClient: AuthClient | null = null;

// Initialize the auth client
export const initAuth = async (): Promise<AuthClient> => {
  if (!authClient) {
    authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true // Disable idle timeout for better UX
      }
    });
  }
  return authClient;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const client = await initAuth();
  return await client.isAuthenticated();
};

// Get user identity
export const getIdentity = async (): Promise<Identity | undefined> => {
  const client = await initAuth();
  return client.getIdentity();
};

// Login and logout functions are now moved to authOperations.ts
// to avoid conflicts, so they are removed from here
