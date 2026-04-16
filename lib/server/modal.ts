export function getModalCvBase(): string {
  const base = process.env.MODAL_CV_BASE_URL;
  if (!base) throw new Error('MODAL_CV_BASE_URL is not set in the environment');
  return base.replace(/\/$/, '');
}

export function getModalBertBase(): string {
  const base = process.env.MODAL_BERT_BASE_URL;
  if (!base) throw new Error('MODAL_BERT_BASE_URL is not set in the environment');
  return base.replace(/\/$/, '');
}

export function getModalHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (process.env.MODAL_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.MODAL_API_KEY}`;
  }
  return headers;
}

