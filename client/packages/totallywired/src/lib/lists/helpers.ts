import { ReactNode } from "react";

export const separatedNodes = (...conditionalNodes: [boolean, ReactNode][]) => {
  return conditionalNodes.reduce<ReactNode[]>((acc, [condition, node]) => {
    if (!condition) {
      return acc;
    }
    if (acc.length) {
      acc.push(" · ");
    }
    acc.push(node);
    return acc;
  }, []);
};
