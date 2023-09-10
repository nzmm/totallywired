import React, { PropsWithChildren, ReactNode, useState } from "react";
import "./TabList.scss";

type TabListProps = PropsWithChildren & {
  labels?: ReactNode[];
  ariaLabelledBy?: string;
};

function TabList({ labels, ariaLabelledBy, children }: TabListProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabs">
      <div role="tablist" aria-labelledby={ariaLabelledBy}>
        {React.Children.map(children, (_, i) => {
          const label = labels?.[i] ?? `Tab ${i}`;
          return (
            <button
              id={`tab-${i}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-controls={`tabpanel-${i}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className={i === activeIndex ? "focus" : ""}>{label}</span>
            </button>
          );
        })}
      </div>

      {React.Children.map(children, (child, i) => {
        const id = `tabpanel-${i}`;
        return (
          <div
            key={id}
            id={id}
            className={i !== activeIndex ? "is-hidden" : ""}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`tab-${i}`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

export { TabList };
export type { TabListProps };
