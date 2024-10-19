export const generateNum = (length: number): string => {
  const digits = '0123456789';
  let randoms = '';
  for (let i = 0; i < length; i++) {
    randoms += digits[Math.floor(Math.random() * 10)];
  }
  return randoms;
};
