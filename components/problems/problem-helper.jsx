function checkTLAES(user) {
  if (user.username === "denisukma") {
    return true;
  } else {
    return false;
  }
}

const memberAES = ["10923", "029374", "83641"];

export { memberAES, checkTLAES };
