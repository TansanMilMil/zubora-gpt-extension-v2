import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../styles/toast.css";

interface ToastProps {
  message: string;
  duration?: number;
  type?: "default" | "error" | "success";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  duration = 2300,
  type = "default",
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 表示アニメーション
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // 非表示アニメーション
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`zubora-gpt-toast zubora-gpt-anim ${type}`}
      style={{
        opacity: isVisible ? "1" : "0",
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.98)",
      }}
    >
      {message}
    </div>
  );
};

// トーストを表示する関数
export const showToast = (
  message: string,
  duration: number = 2300,
  type: "default" | "error" | "success" = "default"
): void => {
  // 既存のトーストがあれば消す
  const oldToast = document.getElementById("zubora-toast-container");
  if (oldToast) oldToast.remove();

  // トースト用のコンテナを作成
  const container = document.createElement("div");
  container.id = "zubora-toast-container";
  document.body.appendChild(container);

  // Reactコンポーネントをレンダリング
  const root = createRoot(container);
  root.render(
    <Toast
      message={message}
      duration={duration}
      type={type}
      onClose={() => {
        root.unmount();
        container.remove();
      }}
    />
  );
};
