import type { NextApiRequest, NextApiResponse } from 'next';
import { getModalBase, getModalHeaders } from '../../../../lib/server/modal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { format = 'gif', batch_size = '1' } = req.query;
  try {
    const modalBase = getModalBase();
    const extraHeaders = getModalHeaders();

    const url = `${modalBase}/api/cv/generate?format=${encodeURIComponent(String(format))}&batch_size=${encodeURIComponent(String(batch_size))}`;
    const r = await fetch(url, { method: 'GET', headers: { ...extraHeaders } });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }

    const contentType = r.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.status(200).send(buffer);
  } catch (e: any) {
    res.status(502).json({ error: e?.message || 'Upstream request failed' });
  }
}
