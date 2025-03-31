
// Get host URL based on environment
export const getHost = (): string => {
  // When running in DFX development environment
  if (import.meta.env.MODE === 'development') {
    return "http://localhost:4943";
  }
  
  // When deployed to IC
  return "https://ic0.app";
};

// Get NFID provider URL based on environment
export const getIdentityProviderUrl = (): string => {
  // Check if we're running locally or on the IC network
  if (import.meta.env.MODE === 'development') {
    // For local development, use the NFID development URL with application name
    return `https://identity.ic0.app/#authorize`;
  }
  
  // Production environment (Internet Computer)
  return "https://identity.ic0.app/#authorize";
};
