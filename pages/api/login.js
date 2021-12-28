import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

  try {
    // Call the API to check if the user exists and store some data in session
    const response = await fetchJson(url, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const user = {
      isLoggedIn: true,
      id: response.data.id,
      username: response.data.username,
      fullname: response.data.fullname,
      email: response.data.email,
      grant: response.data.paramUserMatrix.grant,
      accessToken: response.access_token,
    };
    req.session.set("user", user);
    await req.session.save();
    res.json({ status: 200, message: response.message, data: user });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
