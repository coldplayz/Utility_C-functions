import { TArrayItem } from "../interface/types";

/**
 * Randomly selects an item from an array.
 * @param array - the array to randomly select an item from.
 * @returns the randomly selected item.
 */
export default function selectRandom<ArrayType extends unknown[]>(
  array: ArrayType
) {
  return array[
    Math.floor(Math.random() * array.length)
  ] as TArrayItem<ArrayType>;
}
