import { shuffle } from "./utils";

describe("shuffle", () => {
  it("should create new array of source elements in a random order", () => {
    // Arrange
    const source = ["a", "b", "c", "d", "e"];

    // Act
    const result = shuffle(source);

    // Assert
    expect(result).toBeTruthy();
    expect(result).not.toEqual(source);
    expect(result).toHaveLength(source.length);
    expect([...new Set(result)]).toHaveLength(source.length);
    result.forEach((val) => expect(source).toContain(val));
  });

  it.each([0, 1, 2, 3, 4, 5])(
    "should create new array of source elements in a random order with length %p",
    (l) => {
      // Arrange
      const source = ["a", "b", "c", "d", "e"];

      // Act
      const result = shuffle(source, l);

      // Assert
      expect(result).toBeTruthy();
      expect(result).not.toEqual(source);
      expect(result).toHaveLength(l);
      expect([...new Set(result)]).toHaveLength(l);
      result.forEach((val) => expect(source).toContain(val));
    },
  );

  it("should not exceed length of source array", () => {
    // Arrange
    const source = ["a", "b", "c", "d", "e"];

    // Act
    const result = shuffle(source, source.length * 2);

    // Assert
    expect(result).toBeTruthy();
    expect(result).not.toEqual(source);
    expect(result).toHaveLength(source.length);
    expect([...new Set(result)]).toHaveLength(source.length);
    result.forEach((val) => expect(source).toContain(val));
  });

  it("should be empty if supplied a negative length", () => {
    // Arrange
    const source = ["a", "b", "c", "d", "e"];

    // Act
    const result = shuffle(source, -1);

    // Assert
    expect(result).toBeTruthy();
    expect(result).toHaveLength(0);
  });
});
