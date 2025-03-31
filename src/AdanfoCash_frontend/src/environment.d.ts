
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOAN_CANISTER_ID: string;
  readonly VITE_USER_CANISTER_ID: string;
  readonly VITE_IDENTITY_CANISTER_ID: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
