export function getModalBase(): string {
  const base = process.env.MODAL_BASE_URL;
  if (!base) throw new Error('MODAL_BASE_URL is not set in the environment');
  return base.replace(/\/$/, '');
}

export function getModalHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (process.env.MODAL_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.MODAL_API_KEY}`;
  }
  return headers;
}
