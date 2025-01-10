import bcrypt from "bcrypt";

async function testBcrypt() {
  const password1 = "password1";
  const password2 = "password2";
  const password3 = "password3";
  const password4 = "password4";
  const password5 = "password5";
  const password6 = "password6";
  const password7 = "password7";
  const hashedPassword1 = await bcrypt.hash(password1, 12);
  const hashedPassword2 = await bcrypt.hash(password2, 12);
  const hashedPassword3 = await bcrypt.hash(password3, 12);
  const hashedPassword4 = await bcrypt.hash(password4, 12);
  const hashedPassword5 = await bcrypt.hash(password5, 12);
  const hashedPassword6 = await bcrypt.hash(password6, 12);
  const hashedPassword7 = await bcrypt.hash(password7, 12);

  console.log("Hashed Password 1:", hashedPassword1);
  console.log("Hashed Password 2:", hashedPassword2);
  console.log("Hashed Password 3:", hashedPassword3);
  console.log("Hashed Password 4:", hashedPassword4);
  console.log("Hashed Password 5:", hashedPassword5);
  console.log("Hashed Password 6:", hashedPassword6);
  console.log("Hashed Password 7:", hashedPassword7);
}

testBcrypt().catch((err) => console.error("Error:", err));
