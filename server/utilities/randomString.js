module.exports = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomidx = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomidx);
    }
    return result;
  };
  

  