

export default async function handler(req, res) {
  // Ambil URL Google Script dari Environment Variables
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (req.method === 'POST') {
    try {
      const secretKey = process.env.API_SECRET_KEY;
      const { name, score } = req.body;
      
      const payload = {
        name: name,
        score: score,
        key: secretKey
      };

      // Teruskan permintaan ke Google Apps Script
      await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return res.status(200).json({ result: 'success' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error on POST' });
    }
  }
  

  else if (req.method === 'GET') {
    try {
    
      const response = await fetch(googleScriptUrl);
      if (!response.ok) {
        throw new Error(`Google Script request failed with status ${response.status}`);
      }
      const leaderboardData = await response.json();
      
      // Kirim kembali data leaderboard yang didapat ke game Anda
      return res.status(200).json(leaderboardData);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error on GET' });
    }
  }


  else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
