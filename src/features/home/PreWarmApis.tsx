"use client";
import { useEffect, useRef } from 'react';
import { fetchHealthOnce } from '../../lib/client/healthCheck';

export default function PreWarmApis() {
  const hasFetchedApis = useRef(false);

  useEffect(() => {
    if (hasFetchedApis.current) return;
    hasFetchedApis.current = true;
    
    // Pre-warm the Modal APIs in the background on site load (deduplicated)
    fetchHealthOnce('/api/search/health');
    fetchHealthOnce('/api/cv/health');
    fetchHealthOnce('/api/bert/health');
  }, []);

  return null;
}
