"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface HeroImageProps {
  imagePath: string;
  alt: string;
}

export const HeroImage = ({ imagePath, alt }: HeroImageProps) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <motion.div className="absolute inset-0 -z-10" style={{ y }}>
      <Image
        src={imagePath || "/img/default-burger.jpg"}
        alt={alt}
        fill
        className="object-cover"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />
    </motion.div>
  );
};