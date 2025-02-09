import React from "react";

const Tree = ({ height = 20, width = "w-72", className = "" }) => {
  const ornaments = ["●", "○", "◆", "♥", "✦", "❆", "◉"];
  const colors = [
    "text-red-400",
    "text-blue-400",
    "text-yellow-300",
    "text-purple-400",
    "text-pink-400",
    "text-cyan-400",
  ];

  const renderLine = (content, extraClass = "") => (
    <div className={`text-center w-full ${extraClass}`}>{content}</div>
  );

  const renderTree = () => {
    const tree = [];

    // 별
    tree.push(
      renderLine(
        <span className="text-yellow-300 animate-pulse font-bold text-xl inline-block">
          ⭐
        </span>,
        "mb-1"
      )
    );

    // 트리 바디 - 더 삼각형에 가깝게 조정
    for (let i = 0; i < height; i++) {
      const lineContent = [];
      // 라인 너비를 조절하여 더 삼각형에 가깝게 만듦
      const lineWidth = Math.floor(1.8 * i + 1);

      for (let j = 0; j < lineWidth; j++) {
        if (Math.random() < 0.15) {
          const ornament =
            ornaments[Math.floor(Math.random() * ornaments.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          lineContent.push(
            <span key={j} className={`${color} animate-pulse`}>
              {ornament}
            </span>
          );
        } else {
          lineContent.push(
            <span key={j} className="text-emerald-400">
              {i % 2 === 0 ? "✧" : "*"}
            </span>
          );
        }
      }

      tree.push(
        renderLine(
          <div
            className="inline-block font-bold"
            style={{ textShadow: "0 0 8px rgba(52, 211, 153, 0.8)" }}
          >
            {lineContent}
          </div>
        )
      );
    }

    // 나무 기둥
    const trunk = ["┏━━━┓", "┃███┃"];
    trunk.forEach((line) => {
      tree.push(
        renderLine(
          <span
            className="text-yellow-800 font-bold inline-block"
            style={{ textShadow: "0 0 5px rgba(146, 64, 14, 0.8)" }}
          >
            {line}
          </span>
        )
      );
    });

    return tree;
  };

  return (
    <div
      className={`font-mono text-sm md:text-base select-none ${width} ${className}`}
    >
      {renderTree()}
    </div>
  );
};

const TreesBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 왼쪽 트리 (작은 크기) */}
      <div className="fixed bottom-0 left-8">
        <Tree height={15} width="w-56" />
      </div>

      {/* 중앙 트리 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2">
        <Tree height={20} width="w-80" />
      </div>

      {/* 오른쪽 트리 */}
      <div className="fixed bottom-0 right-8">
        <Tree height={15} width="w-56" />
      </div>
    </div>
  );
};

export default TreesBackground;
