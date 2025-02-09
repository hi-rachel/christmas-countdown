import React, { ReactNode, ReactElement } from "react";

interface TreeProps {
  height?: number;
  width?: string;
}

const Tree: React.FC<TreeProps> = ({ height = 20, width = "w-72" }) => {
  const ornaments = ["●", "○", "◆", "♥", "✦", "❆", "◉"];
  const colors = [
    "text-red-400",
    "text-blue-400",
    "text-yellow-300",
    "text-purple-400",
    "text-pink-400",
    "text-cyan-400",
  ];

  const renderLine = (content: ReactNode, extraClass = ""): ReactElement => (
    <div className={`text-center w-full ${extraClass}`}>{content}</div>
  );

  const renderTree = (): ReactElement[] => {
    const tree: ReactElement[] = [];

    // Star
    tree.push(
      renderLine(
        <span
          key="star"
          className="text-yellow-300 animate-pulse font-bold text-xl inline-block"
        >
          ⭐
        </span>,
        "mb-1"
      )
    );

    // Tree body
    for (let i = 0; i < height; i++) {
      const lineContent: ReactElement[] = [];
      const lineWidth = Math.floor(1.7 * i + 1);

      for (let j = 0; j < lineWidth; j++) {
        if (Math.random() < 0.15) {
          const ornament =
            ornaments[Math.floor(Math.random() * ornaments.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          lineContent.push(
            <span
              key={`ornament-${i}-${j}`}
              className={`${color} animate-pulse`}
            >
              {ornament}
            </span>
          );
        } else {
          lineContent.push(
            <span key={`branch-${i}-${j}`} className="text-emerald-400">
              {i % 2 === 0 ? "✧" : "*"}
            </span>
          );
        }
      }

      tree.push(
        renderLine(
          <div
            key={`line-${i}`}
            className="inline-block font-bold"
            style={{ textShadow: "0 0 8px rgba(52, 211, 153, 0.8)" }}
          >
            {lineContent}
          </div>
        )
      );
    }

    // Tree trunk
    const trunk = ["┏━━━┓", "┃███┃"];
    trunk.forEach((line, index) => {
      tree.push(
        renderLine(
          <span
            key={`trunk-${index}`}
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
    <div className={`font-mono text-sm md:text-base select-none ${width}`}>
      {renderTree()}
    </div>
  );
};

const TreesBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="fixed bottom-0 left-16 hidden md:block">
        <Tree height={15} width="w-56" />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2">
        <Tree height={20} width="w-72 md:w-80" />
      </div>

      <div className="fixed bottom-0 right-16 hidden md:block">
        <Tree height={15} width="w-56" />
      </div>
    </div>
  );
};

export default TreesBackground;
