/// <reference types="vite/client" />

/* Utility types */

/**
 * Helper type which extends `HTMLFormElement`, exposing the specified named inputs.
 * @example HTMLFormElementWithInputs<"inputName1" | "inputName2" | ...>
 */
type HTMLFormElementWithInputs<
  InputNames extends string,
  E extends HTMLFormElement = HTMLFormElement,
> = E & Record<InputNames, HTMLInputElement>;
