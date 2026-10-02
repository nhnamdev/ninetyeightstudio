import React from "react";

export const TopBar: React.FC = () => {
  return (
    <div
      id="top-bar"
      className="header-top hide-for-sticky nav-dark flex-has-center bg-[#9c0b13] text-white py-2 px-4 transition-colors z-40 w-full"
    >
      <div className="flex-row container mx-auto flex items-center justify-center text-center">
        <div className="flex-col flex-center">
          <ul className="nav nav-center nav-small nav-divided list-none m-0 p-0">
            <li className="html custom html_topbar_right">
              <div className="rotate-top-bar">
                <p className="text-center block text-[11.5px] sm:text-[12.5px] md:text-[13px] font-normal leading-snug tracking-wide text-white m-0">
                  Đăng ký thành viên Spoiled Club để nhận Letter Charm cho đơn hàng đầu tiên
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
