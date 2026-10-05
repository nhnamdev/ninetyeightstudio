"use client";

import React from "react";
import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <section className="slideshow" aria-label="Hero Slideshow">
      <div className="slideshow-slide">
        {/* Banner image */}
        <Link href="/cua-hang" title="Khám phá Ninety Eight Studio">
          <img
            src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/banners/hero-banner-27b25b23.webp"
            alt="Ninety Eight Studio"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            loading="eager"
            className="w-full object-cover"
          />
        </Link>

        {/* Floating Call to Action */}
        <div className="slideshow-ab">
          <div className="wwyn-center">
            <div className="slideshow-btn">
              <Link
                href="/cua-hang"
                className="btn-slideshow"
                title="Mua ngay"
              >
                <span>Mua ngay</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Swiper Pagination Bullet */}
        <div className="pagination-slideshow">
          <div className="pagination-bullet" role="button" aria-label="Slide 1" />
        </div>
      </div>
    </section>
  );
};
