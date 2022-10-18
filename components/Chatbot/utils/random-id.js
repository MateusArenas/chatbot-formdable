export default function Random (length=20) {
  const caracters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  const token = new Array(length).fill(caracters.length-1).map(size => {
      return caracters[(Math.random() * size).toFixed(0)]
  });
  
  return token.join("");
};