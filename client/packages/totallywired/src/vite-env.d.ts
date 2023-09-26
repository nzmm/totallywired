/// <reference types="vite/client" />

/* Third-party modules */

declare module "trigram-similarity" {
  function trigramSimilarity(s1: string, s2: string): number;
  export = trigramSimilarity;
}

/* Utility types */

/**
 * Helper type which extends `HTMLFormElement`, exposing the specified named inputs.
 * @example HTMLFormElementWithInputs<"inputName1" | "inputName2" | ...>
 */
type HTMLFormElementWithInputs<
  InputNames extends string,
  E extends HTMLFormElement = HTMLFormElement,
> = E & Record<InputNames, HTMLInputElement>;
