const fs = require("fs");
const path = require("path");

//โจทย์ข้อที่ 1
const setStringHdp = (num) => {
  if (num % 0.25 !== 0) {
    throw new Error("Number must be divisible by 0.25");
  }

  let integerPart = num < 0 ? Math.ceil(num) : Math.floor(num);
  let fractionPart = Math.abs(num - integerPart);
  let result = "";

  switch (fractionPart) {
    case 0:
      result = `${integerPart}.0`;
      break;
    case 0.25:
      result = `${integerPart}/${integerPart + 0.5}`;
      break;
    case 0.5:
      result = `${integerPart}.5`;
      break;
    case 0.75:
      result = `${integerPart + 0.5}/${integerPart + 1}`;
      break;
    default:
      result = num.toString();
  }

  if (num < 0 && fractionPart !== 0) {
    switch (fractionPart) {
      case 0.25:
        result = `${integerPart}/${Math.abs(integerPart) + 0.5}`;
        break;
      case 0.75:
        result = `${integerPart + 0.5}/${Math.abs(integerPart) + 1}`;
        break;
    }
  }

  return `input ${num} --> output ${result}`;
};

// debug ข้อที่ 1
console.log(
  "============================================= ข้อที่ 1 ================================================================="
);
console.log(setStringHdp(0));
console.log(setStringHdp(1));
console.log(setStringHdp(2));
console.log(setStringHdp(1.25));
console.log(setStringHdp(1.5));
console.log(setStringHdp(1.75));
console.log(setStringHdp(2.75));
console.log(setStringHdp(-3.25));

// ----------------------------------------------------------------------------------//

//โจทย์ข้อที่ 2
const printFileData = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const lines = data.split("\n").map((line) => line.trim());

    lines.forEach((line) => {
      const parts = line.split("|");
      if (parts.length === 9) {
        console.log(`${parts[7]} ${parts[8]} ${parts[2]} ${parts[3]}`);
      }
    });
  });
};

// debug ข้อที่ 2
console.log(
  "============================================= ข้อที่ 2 ================================================================="
);
const filePath = path.join(__dirname, "./data/textFile.txt");
printFileData(filePath);
