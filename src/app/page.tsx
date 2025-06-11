"use client";
import { useEffect, useState } from "react";
import BurgerListPage from "./BurgerListPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gooburger - Hamburgers Deliciosos",
  keywords: ["hamburgers", "entregas", "gooburger", "hamburgers deliciosos", "Peça um online"],
  authors: [{ name: "Gooburger Team", url: "https://goo-burguer.vercel.app/" }],
  creator: "Equipa Gooburger",
  publisher: "Gooburger",
  themeColor: "#ff5722",
  colorScheme: "light dark",
  description: "Explore nosso menu de hambúrgueres deliciosos no Gooburger. Encontre seu hambúrguer favorito e peça online para entrega ou retirada.",
  openGraph: {
    title: "Gooburger - Hamburgers Deliciosos",
    description: "Explore nosso menu de hambúrgueres deliciosos no Gooburger. Encontre seu hambúrguer favorito e peça online para entrega ou retirada.",
    images: [
      {
        url: "/images/7.jpg",
        width: 1200,
        height: 630,
        alt: "Gooburger - Delicious Hamburgers Deliciosos",
      },
    ],
  },
  twitter: {
    title: "Gooburger - Hamburgers Deliciosos",
    description: "Explore nosso menu de hambúrgueres deliciosos no Gooburger. Encontre seu hambúrguer favorito e peça online para entrega ou retirada.",
    card: "summary_large_image",
    images: ["/images/7.jpg"],
  }, 
  robots: {
    index: true,
    follow: true,
  },
};
export default function Home() {
  const [burgers, setBurgers] = useState([]);

  useEffect(() => {
    fetch('/api/burgers?page=1')
      .then(res => res.json())
      .then(data => setBurgers(data.results));
  }, []);

  return <BurgerListPage initialBurgers={burgers} />;
}
