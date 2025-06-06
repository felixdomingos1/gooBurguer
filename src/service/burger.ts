import { BurgerListResponse } from "@/lib/types/burgers";

export async function fetchBurgers(page = 1, category?: string): Promise<BurgerListResponse> {
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? process.env.API_URL ?? "http://localhost:3000" // Use API_URL no SSR
    : window?.location?.origin ?? "";

  if (!baseUrl || baseUrl.startsWith("/")) {
    throw new Error("API base URL is invalid or missing.");
  }

  const url = new URL("/api/burgers", baseUrl);
  url.searchParams.set("page", page.toString());
  if (category) {
    url.searchParams.set("category", category);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch burgers");
  }

  return response.json();
}
