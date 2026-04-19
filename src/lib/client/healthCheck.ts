"use client";

const healthPromises: Record<string, Promise<{ initialized: boolean }>> = {};

export function fetchHealthOnce(url: string): Promise<{ initialized: boolean }> {
  if (!healthPromises[url]) {
    healthPromises[url] = fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          return { initialized: !(payload?.code === 'MODEL_INITIALIZING') };
        }
        return { initialized: true };
      })
      .catch(() => {
        return { initialized: false };
      });
  }
  return healthPromises[url];
}
