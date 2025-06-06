import BurgerListPage from "./BurgerListPage";

async function getBurgers() {
  const res = await fetch('http://localhost:3000/api/burgers?page=1', { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch burgers');
  return res.json();
}

export default async function Home() {
  const { results } = await getBurgers();
  return <BurgerListPage initialBurgers={results} />;
}