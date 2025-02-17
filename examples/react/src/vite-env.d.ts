/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_COHORT_API_KEY: string;
};

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
