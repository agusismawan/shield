import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const url = `https://ularkadut.xyz/v1.0/login`;
  console.log("Body", req.body);

  try {
    // we check that the us""er exists on GitHub and store some data in session
    const response = await fetchJson(url, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const user = {
      isLoggedIn: true,
      name: response.username,
      accessToken: response.access_token,
    };
    req.session.set("user", user);
    await req.session.save();
    res.json({ status: 200, message: response.message });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
