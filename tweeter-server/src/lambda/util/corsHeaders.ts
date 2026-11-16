// AI-assisted: see AI-ATTRIBUTION.md

// API Gateway's Lambda proxy integration passes a Lambda's response straight
// through to the client with no integration-response mapping, so every
// response (success or error) must set this header itself.
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
};
