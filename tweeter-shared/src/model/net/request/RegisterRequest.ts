// AI-assisted: see AI-ATTRIBUTION.md
import { AuthRequest } from "./AuthRequest";

export interface RegisterRequest extends AuthRequest {
  firstName: string;
  lastName: string;
  userImageBytesBase64: string;
  imageFileExtension: string;
}
