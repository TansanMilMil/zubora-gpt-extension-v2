import React from "react";
import { createRoot } from "react-dom/client";

interface LoadingSpinnerProps {
  onClose: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ onClose }) => {
  return (
    <div className="zubora-gpt-overlay">
      <div className="zubora-gpt-spinner" />
    </div>
  );
};

// ローディングスピナーを表示する関数
export const showLoadingSpinner = (): void => {
  if (document.getElementById("zubora-gpt-loading-container")) return;

  const container = document.createElement("div");
  container.id = "zubora-gpt-loading-container";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <LoadingSpinner
      onClose={() => {
        root.unmount();
        container.remove();
      }}
    />
  );
};

// ローディングスピナーを非表示にする関数
export const hideLoadingSpinner = (): void => {
  const container = document.getElementById("zubora-gpt-loading-container");
  if (container) {
    container.remove();
  }
};

export default LoadingSpinner;
