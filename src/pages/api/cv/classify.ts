import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import { getModalBase, getModalHeaders } from '../../../../lib/server/modal';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, _fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });

    const fileEntry = Array.isArray(files.file) ? (files.file as any)[0] : (files.file as any) || Object.values(files)[0];
    if (!fileEntry) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = fileEntry.filepath || fileEntry.path;
    const stream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('file', stream, fileEntry.originalFilename || fileEntry.newFilename || 'upload.jpg');

    try {
      const modalBase = getModalBase();
      const extraHeaders = getModalHeaders();

      const response = await fetch(`${modalBase}/api/cv/classify`, {
        method: 'POST',
        body: formData as any,
        headers: {
          ...(formData.getHeaders ? formData.getHeaders() : {}),
          ...extraHeaders,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).send(text);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (e: any) {
      res.status(502).json({ error: e?.message || 'Upstream request failed' });
    }
  });
}
