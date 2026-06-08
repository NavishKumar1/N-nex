import https from 'https';

export const fetchUrl = (url, token) => new Promise((resolve, reject) => {
  const headers = { 'User-Agent': 'N-NEX-CLI' };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  https.get(url, { headers }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, token).then(resolve).catch(reject);
    }
    let data = [];
    res.on('data', (chunk) => data.push(chunk));
    res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(data) }));
  }).on('error', reject);
});
