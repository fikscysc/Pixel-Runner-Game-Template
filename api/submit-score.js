export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secretKey = process.env.API_SECRET_KEY;
    const { name, score } = req.body;
    const payload = {
      name: name,
      score: score,
      key: secretKey
    };
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Google Script request failed with status ${response.status}`);
    }
    res.status(200).json({ result: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
