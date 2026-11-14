// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<T> extends TweeterRequest {
  userAlias: string;
  pageSize: number;
  lastItem: T | null;
}
