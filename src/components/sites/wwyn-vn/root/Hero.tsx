"use client";

import React from "react";
import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <section className="slideshow" aria-label="Hero Slideshow">
      <div className="slideshow-slide">
        {/* Banner image */}
        <Link href="#" title="WWYN - Wear What You Need">
          <img
            src="/sites/wwyn-vn/root/images/hero-banner.webp"
            alt="WWYN"
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
