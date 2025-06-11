"use client";
import { useEffect, useState } from "react";
import BurgerListPage from "./BurgerListPage";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Gooburger - Burgers",
  description: "Explore our delicious burger menu at Gooburger. Find your favorite burger and order online for delivery or pickup.",
  openGraph: {
    title: "Gooburger - Burgers",
    description: "Explore our delicious burger menu at Gooburger. Find your favorite burger and order online for delivery or pickup.",
    images: [
      {
        url: "/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gooburger - Delicious Burgers",
      },
    ],
  },
  twitter: {
    title: "Gooburger - Burgers",
    description: "Explore our delicious burger menu at Gooburger. Find your favorite burger and order online for delivery or pickup.",
    card: "summary_large_image",
    images: ["/img/og-image.jpg"],
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
