"use client";

import React, { useState } from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="wwyn-center">
          {/* Column 1: Newsletter */}
          <div className="footer-1">
            <h2 className="footer-tit">Đăng ký nhận bản tin</h2>
            <form className="form-dknt" onSubmit={handleSubmit}>
              <div className="input-dknt">
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email*"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn-dknt"
                aria-label="Gửi đăng ký"
              >
                <img
                  src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/dknticon-8c9d1858.png"
                  alt="DKNT Icon"
                />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-green-600 mb-3 font-medium">
                Cảm ơn bạn đã đăng ký nhận bản tin!
              </p>
            )}

            <div className="dknt-slogan">
              <p>
                By clicking on &quot;Subscribe&quot;, you confirm that you have
                read and understood our Privacy Policy and that you want to
                receive the newsletter and other marketing communication as set
                out therein.
              </p>
            </div>

            {/* Social Icons */}
            <ul className="footer-mxh">
              <li>
                <Link
                  href="#"
                  title="Facebook Ninety Eight Studio"
                >
                  <img
                    src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/facebook-04fb3bb3.webp"
                    alt="Ninety Eight Studio Facebook"
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Instagram Ninety Eight Studio"
                >
                  <img
                    src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/instagram-47e835c1.webp"
                    alt="Ninety Eight Studio Instagram"
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="TikTok Ninety Eight Studio"
                >
                  <img
                    src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/tiktok-5334f940.webp"
                    alt="Ninety Eight Studio TikTok"
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div className="footer-2">
            <h2 className="footer-tit">Chính sách</h2>
            <ul className="footer-list">
              <li>
                <Link
                  href="#"
                  title="Chính sách thanh toán"
                >
                  Chính sách thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách đặt hàng"
                >
                  Chính sách đặt hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách kiểm hàng"
                >
                  Chính sách kiểm hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách bảo mật"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách đổi trả"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách bảo vệ thông tin"
                >
                  Chính sách bảo vệ thông tin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-3">
            <h2 className="footer-tit">Hỗ trợ khách hàng</h2>
            <ul className="footer-list">
              <li>
                <Link
                  href="#"
                  title="Câu hỏi thường gặp"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Tra cứu đơn hàng"
                >
                  Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách đổi hàng"
                >
                  Chính sách đổi hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title="Chính sách giao hàng"
                >
                  Chính sách giao hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Info */}
          <div className="footer-4">
            <h2 className="footer-tit">NINETY EIGHT STUDIO</h2>
            <div className="footer-content">
              <p>
                WARDROBE ARC, 351/44 Le Van Sy, Nhieu Loc Ward, District 3, Ho
                Chi Minh City, Vietnam 700000
              </p>
              <p>
                Open 10:00 - 22:00
                <br />
                Mon - Sun
              </p>
            </div>
          </div>

          {/* Column 5: Menu Links */}
          <div className="footer-5">
            <h2 className="footer-tit">DANH MỤC</h2>
            <ul className="footer-list">
              <li>
                <Link href="/cua-hang?category=TOTE+BAG" title="TOTE BAG">
                  TOTE BAG
                </Link>
              </li>
              <li>
                <Link href="/cua-hang?category=SHOULDER+BAG" title="SHOULDER BAG">
                  SHOULDER BAG
                </Link>
              </li>
              <li>
                <Link href="/cua-hang?category=TRAVEL+BAG" title="TRAVEL BAG">
                  TRAVEL BAG
                </Link>
              </li>
              <li>
                <Link href="/cua-hang?category=ACCESSORIES" title="ACCESSORIES">
                  ACCESSORIES
                </Link>
              </li>
              <li>
                <Link href="/cua-hang?filter=new-arrival" title="SẢN PHẨM MỚI">
                  SẢN PHẨM MỚI
                </Link>
              </li>
              <li>
                <Link href="/cua-hang?filter=best-seller" title="BÁN CHẠY NHẤT">
                  BÁN CHẠY NHẤT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="wwyn-center center-bottom">
          <p className="copyright">
            Copyright © 2026 <span>Ninety Eight Studio</span>. All rights reserved. Designed by{" "}
            <a href="#">
              Vinasoftware (VNS)
            </a>
          </p>

          <div className="footer-bottom_right">
            <a
              href="#"
              className="footer-bottom_right-item"
            >
              <img
                src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/location-e7d4b058.png"
                alt="Icon location"
              />
              <span>STORE LOCATION</span>
            </a>

            <a
              href="#"
              className="footer-bottom_right-item"
            >
              <img
                src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/global-291eec35.png"
                alt="Icon global"
              />
              <span>NATIONWIDE DELIVERY</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
