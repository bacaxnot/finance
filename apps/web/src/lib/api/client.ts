// Base API client - currently mocked, will be replaced with real API

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    // Mock implementation with delay
    await this.delay(500);
    throw new Error("Not implemented - using mock data");
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    await this.delay(800);
    throw new Error("Not implemented - using mock data");
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    await this.delay(800);
    throw new Error("Not implemented - using mock data");
  }

  async delete<T>(endpoint: string): Promise<T> {
    await this.delay(600);
    throw new Error("Not implemented - using mock data");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();
