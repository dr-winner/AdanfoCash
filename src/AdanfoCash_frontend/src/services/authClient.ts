
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

// Login with Internet Identity
export const login = async (): Promise<boolean> => {
  const client = await initAuth();
  
  return new Promise((resolve) => {
    client.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => resolve(true),
      onError: (error) => {
        console.error("Login error:", error);
        resolve(false);
      }
    });
  });
};

// Logout
export const logout = async (): Promise<void> => {
  const client = await initAuth();
  await client.logout();
};
