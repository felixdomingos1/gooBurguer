import { Burger, BurgerListResponse } from "../types/burgers";

const API_URL = '/api/burgers';

export async function fetchPopularBurgers(): Promise<BurgerListResponse> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch burgers');
  }
  return response.json();
}

export async function fetchBurgersPage(page = 1, category?: string): Promise<{ results: Burger[]; total_pages: number }> {
  const url = new URL(API_URL, window.location.origin);
  url.searchParams.set('page', page.toString());
  if (category) {
    url.searchParams.set('category', category);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch burgers');
  }
  
  const data = await response.json();
  return {
    results: data.results,
    total_pages: data.totalPages,
  };
}

export async function fetchBurgerDetails(id: string): Promise<Burger> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch burger details');
  }
  return response.json();
}

export async function fetchTopRatedBurgers(page = 1) {
  return fetchBurgersPage(page);
}

export async function fetchUpcomingBurgers(page = 1) {
  return fetchBurgersPage(page);
}