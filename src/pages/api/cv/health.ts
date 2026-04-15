import type { NextApiRequest, NextApiResponse } from 'next';
import { getModalBase, getModalHeaders } from '../../../../lib/server/modal';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const modalBase = getModalBase();
    const extraHeaders = getModalHeaders();
    const r = await fetch(`${modalBase}/api/cv/health`, { headers: { ...extraHeaders } });
    if (!r.ok) return res.status(502).send('Upstream health check failed');
    const text = await r.text();
    res.status(200).send(text);
  } catch (e) {
    res.status(502).send('Upstream unreachable');
  }
}
