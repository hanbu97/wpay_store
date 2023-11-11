"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface BackButtonProps {
  className?: string;
  url?: string;
  color?: string; // 新添加的颜色属性
}

const SharedBackButton: React.FC<BackButtonProps> = ({
  className = "",
  url = "/",
  color = "white", // 默认颜色设置为白色
}) => {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`group relative z-10 inline-flex items-center justify-center space-x-3 ${className}`}
      onClick={() => {
        if (window.history.state && window.history.state.idx > 0) {
          router.back();
        } else {
          router.push(url); // 使用 url 参数而不是硬编码的 "/"
        }
      }}
      style={{ backgroundColor: "black" }} // 设置背景颜色为黑色
    >
      <div className="rounded-full border-2 border-slate-100 p-2.5 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none" // 设置 SVG 填充颜色为 none
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke={color} // 设置 SVG 线条颜色为白色
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </div>
    </button>
  );
};

export default SharedBackButton;
