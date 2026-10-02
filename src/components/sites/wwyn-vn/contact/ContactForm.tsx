"use client";

import React, { useState } from "react";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 800);
  };

  return (
    <form className="form-contact-card" onSubmit={handleSubmit}>
      {/* Success Notification */}
      {success && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Cảm ơn bạn đã liên hệ! 98 STUDIO đã tiếp nhận thông tin và sẽ phản hồi sớm nhất.
          </span>
        </div>
      )}

      {/* Row 1: Name and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="input-contact">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên *"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-contact">
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại *"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row 2: Address and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="input-contact">
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="input-contact">
          <input
            type="email"
            name="email"
            placeholder="Email *"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row 3: Subject */}
      <div className="input-contact">
        <input
          type="text"
          name="subject"
          placeholder="Chủ đề cần tư vấn *"
          required
          value={formData.subject}
          onChange={handleChange}
        />
      </div>

      {/* Row 4: Message */}
      <div className="input-contact">
        <textarea
          name="message"
          placeholder="Nội dung lời nhắn *"
          required
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-3">
        <button
          type="submit"
          className="btn-contact-submit"
          disabled={loading}
        >
          {loading ? (
            <span>Đang gửi...</span>
          ) : (
            <>
              <span>GỬI LIÊN HỆ</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
