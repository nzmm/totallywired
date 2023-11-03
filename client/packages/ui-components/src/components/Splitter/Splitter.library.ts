type Unit = "%" | "px" | "em" | "vw" | "vh";

type CSSDimension = number | `${number}${Unit}`;

type Orientation = "vertical" | "horizontal";

type SplitterProps = {
  /**
   * The orientation of the split panels.
   */
  orientation: Orientation;

  /**
   * The initial position of the splitter handle.
   */
  initialPosition?: CSSDimension;

  /**
   * The smallest size that a child can have.
   */
  minSize?: CSSDimension;

  /**
   * The component must be supplied with exactly two children (the panels).
   * The first child will occupy `panel a` and the second child will occupy `panel b`.
   */
  children: [React.ReactNode, React.ReactNode];
};

const SUPPORTED_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "Enter",
]);

const getPosition = (
  e: DragEvent,
  orientation: Orientation,
  splitter: HTMLDivElement,
) => {
  return orientation === "horizontal"
    ? e.clientX - splitter.offsetLeft
    : e.clientY - splitter.offsetTop;
};

const setStyles = (
  panelA: HTMLDivElement,
  panelB: HTMLDivElement,
  orientation: Orientation,
  position: CSSDimension,
  minSize: CSSDimension,
) => {
  const positionStyle =
    typeof position === "number" ? `${position}px` : position;
  const minSizeStyle = typeof minSize === "number" ? `${minSize}px` : minSize;

  switch (orientation) {
    case "horizontal": {
      panelA.style.cssText = `width: ${positionStyle}; min-width: ${minSizeStyle}`;
      panelB.style.cssText = `min-width: ${minSizeStyle}`;
      return;
    }
    case "vertical": {
      panelA.style.cssText = `height: ${positionStyle}; min-height: ${minSizeStyle}`;
      panelB.style.cssText = `min-height: ${minSizeStyle}`;
      return;
    }
  }
};

const shiftX = (parent: HTMLElement, step: number) => {
  const cs = getComputedStyle(parent);
  return (
    parent.offsetLeft -
    parseFloat(cs.paddingLeft) -
    parseFloat(cs.borderLeftWidth) +
    step
  );
};

const shiftY = (parent: HTMLElement, step: number) => {
  const cs = getComputedStyle(parent);
  return (
    parent.offsetTop -
    parseFloat(cs.paddingTop) -
    parseFloat(cs.borderTopWidth) +
    step
  );
};

export { SUPPORTED_KEYS, getPosition, setStyles, shiftX, shiftY };
export type { CSSDimension, SplitterProps };
