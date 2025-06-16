import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import LoadingSpinner from "./LoadingSpinner";

interface PopupProps {
  result: string;
  prompt?: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ result, prompt, onClose }) => {
  useEffect(() => {
    // スクロールのロック
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // スクロールのアンロック
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="zubora-gpt-popup">
      <div className="zubora-gpt-title">AI回答</div>
      <button className="zubora-gpt-close" onClick={onClose} title="閉じる">
        &#10005;
      </button>
      {prompt && <div className="zubora-gpt-prompt">{prompt}</div>}
      <div className="zubora-gpt-result">{result}</div>
    </div>
  );
};

// ポップアップを表示する関数
export const showResultPopup = (result: string, prompt?: string): void => {
  // 既存のポップアップがあれば削除
  const existingPopup = document.getElementById("zubora-gpt-popup-container");
  if (existingPopup) {
    existingPopup.remove();
  }

  // ポップアップ用のコンテナを作成
  const container = document.createElement("div");
  container.id = "zubora-gpt-popup-container";
  document.body.appendChild(container);

  // Reactコンポーネントをレンダリング
  const root = createRoot(container);
  root.render(
    <Popup
      result={result}
      prompt={prompt}
      onClose={() => {
        root.unmount();
        container.remove();
      }}
    />
  );
};
