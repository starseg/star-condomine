// src/utils/functions.ts
function isValidURL(str) {
  if (str === null) return false;
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export {
  isValidURL
};
