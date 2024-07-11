interface ImportMetaEnv {
  readonly BACKEND_BASE_URL: string;
  readonly CLOUD_NAME: string;
  readonly UPLOAD_PRESET: string;
  // Add more environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
  