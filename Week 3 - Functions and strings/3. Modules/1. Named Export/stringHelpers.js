// Export individual functions
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const reverse = (str) => {
  return str.split("").reverse().join("");
};

export const shout = (str) => {
  return str.toUpperCase() + "!!!";
};

// Alternative syntax
// const capitalize = (str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };
//
// const reverse = (str) => {
//   return str.split('').reverse().join('');
// };

// Export all at once
// export { capitalize, reverse };
