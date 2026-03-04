import {decimalToFraction} from "../lib/helpers";
const yesNo = ["Yes", "No"]; // used for transform sort

function formatSimpleSizeFilter(items) {
  return items.map((item) => ({
    ...item,
    label: decimalToFraction(item.value) + " Inches",
  }));
}

function formatValueToNumber(items) {
  return items.map((item) => ({
    ...item,
    label: Number(item.value),
  }));
}


export const grillsFilters = [
];


export const grillssFilterTypes = {
};
