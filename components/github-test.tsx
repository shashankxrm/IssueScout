'use client';

import { useEffect, useState } from 'react';
import { GitHubService } from '@/lib/github';

export function GitHubTest() {
  const [status, setStatus] = useState<{ success: boolean; username?: string; error?: string } | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const result = await GitHubService.testConnection();
        setStatus(result);
      } catch (error) {
        console.error('GitHub API Error:', error);
        setStatus({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    }
    testConnection();
  }, []);

  if (!status) {
    return <div className="p-4 border rounded">Testing GitHub connection...</div>;
  }

  if (status.success) {
    return <div className="p-4 border rounded bg-green-50 text-green-700">✅ Connected to GitHub as {status.username}</div>;
  }

  return (
    <div className="p-4 border rounded bg-red-50 text-red-700">
      <p>❌ GitHub API Error:</p>
      <p className="font-mono text-sm mt-2">{status.error}</p>
    </div>
  );
} 