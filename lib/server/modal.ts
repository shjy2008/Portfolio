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

export function getModalSearchBase(): string {
  const base = process.env.MODAL_SEARCH_BASE_URL;
  if (!base) throw new Error('MODAL_SEARCH_BASE_URL is not set in the environment');
  return base.replace(/\/$/, '');
}

export function getModalHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  // Recommended: Modal "Proxy Auth Tokens" to protect public modal.run URLs.
  // Your Modal web endpoints must be created with requires_proxy_auth=True.
  const modalProxyKey = process.env.MODAL_PROXY_KEY;
  const modalProxySecret = process.env.MODAL_PROXY_SECRET;
  if (modalProxyKey && modalProxySecret) {
    headers['Modal-Key'] = modalProxyKey;
    headers['Modal-Secret'] = modalProxySecret;
    return headers;
  }

  return headers;
}

export function isLikelyModelInitializing(status: number, bodyText: string): boolean {
  const normalized = bodyText.toLowerCase();

  if ([502, 503, 504].includes(status)) {
    return true;
  }

  return [
    'initializing',
    'loading',
    'warming',
    'cold start',
    'starting up',
    'booting',
    'unavailable',
    'timeout',
  ].some((phrase) => normalized.includes(phrase));
}

export function createInitializingResponse(serviceName: string, status: number = 503) {
  return Response.json(
    {
      code: 'MODEL_INITIALIZING',
      message: `${serviceName} is initializing. This can take a few seconds during a cold start.`,
    },
    { status }
  );
}
