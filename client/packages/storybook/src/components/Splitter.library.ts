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
  "Enter"
]);

const getPosition = (
  e: DragEvent,
  orientation: Orientation,
  splitter: HTMLDivElement
) => {
  return orientation === "horizontal"
    ? e.clientX - splitter.offsetLeft
    : e.clientY - splitter.offsetTop;
};

const getStyles = (
  orientation: Orientation,
  position: CSSDimension,
  minSize: CSSDimension
) => {
  return orientation === "horizontal"
    ? [{ width: position, minWidth: minSize }, { minWidth: minSize }]
    : [{ height: position, minHeight: minSize }, { minHeight: minSize }];
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

export { SUPPORTED_KEYS, getPosition, getStyles, shiftX, shiftY };
export type { CSSDimension, SplitterProps };
