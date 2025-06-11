import { BurgerListResponse } from "@/lib/types/burgers";

export async function fetchBurgers(page = 1, category?: string): Promise<BurgerListResponse> {
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    : window.location.origin;


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

  const data = await response.json();

  if (!data.results) {
    throw new Error("Invalid API response format");
  }

  return data;
}
