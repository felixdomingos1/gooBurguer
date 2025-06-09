"use client";
import { useEffect, useState } from "react";
import BurgerListPage from "./BurgerListPage";

export default function Home() {
  const [burgers, setBurgers] = useState([]);

  useEffect(() => {
    fetch('/api/burgers?page=1')
      .then(res => res.json())
      .then(data => setBurgers(data.results));
  }, []);

  return <BurgerListPage initialBurgers={burgers} />;
}
