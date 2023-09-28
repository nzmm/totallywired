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

/**
 * Helper type which extends `HTMLElement`, exposing the specified named values existing on the dataset.
 * @example HTMLElementWithDataset<"key1" | "key2" | ...>
 */
type HTMLElementWithDataset<
  DatasetKeys extends string,
  E extends HTMLElement = HTMLElement,
> = E & Omit<E, "dataset"> & { dataset: Record<DatasetKeys, string> };
