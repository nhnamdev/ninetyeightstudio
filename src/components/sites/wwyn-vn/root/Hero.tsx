"use client";

import React from "react";
import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <section className="slideshow" aria-label="Hero Slideshow">
      <div className="slideshow-slide">
        {/* Banner image */}
        <Link href="#" title="Ninety Eight Studio">
          <img
            src="/sites/wwyn-vn/root/images/hero-banner.webp"
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
                href="#"
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
