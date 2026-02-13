import type {
  HarvestClientConfig,
  HarvestProjectAssignmentsResponse,
  HarvestProjectsResponse,
  HarvestTimeEntriesResponse,
  HarvestTimeEntry,
  HarvestUser,
  ListProjectsParams,
  GetMyProjectAssignmentsParams,
  GetTimeEntriesParams,
  CreateTimeEntryBody,
} from "./types.js";
import { HarvestApiError } from "./types.js";

const BASE_URL = "https://api.harvestapp.com/v2";
const DEFAULT_USER_AGENT = "sd-harvest-mcp/0.1.0";

export class HarvestClient {
  private readonly accessToken: string;
  private readonly accountId: string;
  private readonly userAgent: string;

  constructor(config: HarvestClientConfig) {
    this.accessToken = config.accessToken;
    this.accountId = config.accountId;
    this.userAgent = config.userAgent ?? DEFAULT_USER_AGENT;
  }

  private buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Harvest-Account-Id": this.accountId,
      "User-Agent": this.userAgent,
      "Content-Type": "application/json",
    };
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, value);
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      params?: Record<string, string>;
      body?: object;
    },
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method,
      headers: this.buildHeaders(),
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new HarvestApiError(response.status, response.statusText, body);
    }

    return response.json() as Promise<T>;
  }

  async listProjects(
    params?: ListProjectsParams,
  ): Promise<HarvestProjectsResponse> {
    const queryParams: Record<string, string> = {};
    if (params?.is_active !== undefined)
      queryParams.is_active = String(params.is_active);
    if (params?.client_id !== undefined)
      queryParams.client_id = String(params.client_id);
    if (params?.per_page !== undefined)
      queryParams.per_page = String(params.per_page);

    return this.request<HarvestProjectsResponse>("GET", "/projects", {
      params: queryParams,
    });
  }

  async getMyProjectAssignments(
    params?: Pick<GetMyProjectAssignmentsParams, "per_page">,
  ): Promise<HarvestProjectAssignmentsResponse> {
    const queryParams: Record<string, string> = {};
    if (params?.per_page !== undefined)
      queryParams.per_page = String(params.per_page);

    return this.request<HarvestProjectAssignmentsResponse>(
      "GET",
      "/users/me/project_assignments",
      { params: queryParams },
    );
  }

  async getTimeEntries(
    params?: GetTimeEntriesParams,
  ): Promise<HarvestTimeEntriesResponse> {
    const queryParams: Record<string, string> = {};
    if (params?.user_id !== undefined)
      queryParams.user_id = String(params.user_id);
    if (params?.project_id !== undefined)
      queryParams.project_id = String(params.project_id);
    if (params?.from !== undefined) queryParams.from = params.from;
    if (params?.to !== undefined) queryParams.to = params.to;
    if (params?.per_page !== undefined)
      queryParams.per_page = String(params.per_page);

    return this.request<HarvestTimeEntriesResponse>("GET", "/time_entries", {
      params: queryParams,
    });
  }

  async createTimeEntry(body: CreateTimeEntryBody): Promise<HarvestTimeEntry> {
    return this.request<HarvestTimeEntry>("POST", "/time_entries", { body });
  }

  async getMe(): Promise<HarvestUser> {
    return this.request<HarvestUser>("GET", "/users/me");
  }
}
