function checkTLAES(user) {
  if (user.username === "denisukma") {
    return true;
  } else {
    return false;
  }
}

function noData() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <text className="text-4xl font-medium text-gray-500">No Data</text>
      </div>
    </>
  );
}

const memberAES = ["10923", "029374", "83641"];

export { memberAES, checkTLAES, noData };
