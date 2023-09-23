// Source: https://github.com/fabvalaaah/damerau-levenshtein-js/tree/master

/**
 * MIT License
 *
 * Copyright (c) 2018 Fabvalaaah - fabvalaaah@laposte.net
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const initMatrix = (s1: string, s2: string) => {
  if (s1 == null || s2 == null) {
    return null;
  }

  let d: number[][] = [];

  for (let i = 0; i <= s1.length; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= s2.length; j++) {
    d[0][j] = j;
  }

  return d;
};

const damerau = (
  i: number,
  j: number,
  s1: string,
  s2: string,
  d: number[][],
  cost: number,
) => {
  if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
    d[i][j] = Math.min.apply(null, [d[i][j], d[i - 2][j - 2] + cost]);
  }
};

/**
 * Calculates the distance between two strings using the Damerau–Levenshtein method.
 * @seealso https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
 */
const distance = (s1: string, s2: string) => {
  if (s1 == null || s2 == null) {
    return -1;
  }

  let d = initMatrix(s1, s2);

  if (null === d) {
    return -1;
  }
  for (var i = 1; i <= s1.length; i++) {
    let cost;
    for (let j = 1; j <= s2.length; j++) {
      if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
        cost = 0;
      } else {
        cost = 1;
      }

      d[i][j] = Math.min.apply(null, [
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost,
      ]);

      damerau(i, j, s1, s2, d, cost);
    }
  }

  return d[s1.length][s2.length];
};

export { distance };
