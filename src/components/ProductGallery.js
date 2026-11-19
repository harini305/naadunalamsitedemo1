"use client";

import { useState } from "react";
import s from "@/app/product/[slug]/product.module.css";

export default function ProductGallery({ images, name }) {
  const [i, setI] = useState(0);
  const img = images[i];
  if (!img) return null;
  return (
    <div className={s.gallery}>
      <div className={`${s.mainImg} ${img.label ? s.isLabel : ""}`}>
        <img src={img.src} alt={img.alt} width={img.w} height={img.h} fetchPriority="high" />
      </div>
      {images.length > 1 && (
        <div className={s.thumbs} role="group" aria-label={`${name} images`}>
          {images.map((im, k) => (
            <button key={im.src} type="button" aria-pressed={k === i} aria-label={`Show image ${k + 1}`} onClick={() => setI(k)} className={im.label ? s.isLabel : ""}>
              <img src={im.src} alt="" width={im.w} height={im.h} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
