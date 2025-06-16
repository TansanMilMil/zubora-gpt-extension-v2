// スタイル定義
const STYLES = {
  animation: `
    @keyframes zuboraFadeSlideIn {
      0% { opacity: 0; transform: translateY(40px) scale(0.95); background: #ffd700; color: #222; }
      40% { opacity: 1; background: #ffe066; color: #222; }
      60% { opacity: 1; transform: translateY(-8px) scale(1.03); background: #4f8cff; color: #fff; }
      80% { opacity: 1; transform: translateY(0) scale(1); background: #222; color: #fff; }
      100% { opacity: 1; transform: translateY(0) scale(1); background: #222; color: #fff; }
    }
    .zubora-gpt-anim {
      animation: zuboraFadeSlideIn 0.9s cubic-bezier(.23,1.1,.32,1) both;
    }
  `,
  toast: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    background: "#222",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    zIndex: "9999",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    opacity: "0",
    transition: "opacity 0.3s, transform 0.3s",
    transform: "translateY(20px) scale(0.98)",
  },
} as const;

// アニメーション用CSSの注入
const injectAnimationStyle = (): void => {
  if (!document.getElementById("zubora-gpt-msg-anim")) {
    const style = document.createElement("style");
    style.id = "zubora-gpt-msg-anim";
    style.textContent = STYLES.animation;
    document.head.appendChild(style);
  }
};

// トーストのスタイルを適用
const applyToastStyles = (toast: HTMLDivElement): void => {
  Object.entries(STYLES.toast).forEach(([key, value]) => {
    toast.style[key as keyof typeof STYLES.toast] = value;
  });
};

// トーストの表示
export const showToast = (msg: string, duration: number = 2300): void => {
  // 既存のトーストがあれば消す
  const oldToast = document.getElementById("zubora-toast");
  if (oldToast) oldToast.remove();

  // アニメーション用CSSを注入
  injectAnimationStyle();

  // トースト要素の作成
  const toast = document.createElement("div");
  toast.id = "zubora-toast";
  toast.textContent = msg;
  applyToastStyles(toast);
  toast.classList.add("zubora-gpt-anim");
  document.body.appendChild(toast);

  // アニメーションでふわっと表示
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";
  }, 10);

  // 指定時間後に非表示
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px) scale(0.98)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
};
