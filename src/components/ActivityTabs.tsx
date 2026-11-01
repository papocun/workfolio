'use client';

import { useState } from 'react';
import GitHubContributions from '@/components/GitHubContributions';
import DailySQLContributions from '@/components/DailySQLContributions';
import LeetCodeContributions from '@/components/LeetCodeContributions';

const TABS = [
  { id: 'github', label: 'GitHub' },
  { id: 'leetcode', label: 'LeetCode' },
  { id: 'dailysql', label: 'DailySQL' },
] as const;

export default function ActivityTabs({
  githubUsername,
  leetcodeUsername,
}: {
  githubUsername: string;
  leetcodeUsername: string;
}) {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('github');

  return (
    <div>
      <div
        role="tablist"
        aria-label="Activity source"
        className="mb-3.5 inline-flex rounded-full border border-slate-200/80 dark:border-[#2F3336]/60 bg-slate-100/70 dark:bg-[#16181C]/60 p-0.5"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 ${
              active === t.id
                ? 'bg-white dark:bg-slate-100 text-slate-900 shadow-xs'
                : 'text-slate-500 dark:text-[#71767B] hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {active === 'github' ? (
          <GitHubContributions username={githubUsername} />
        ) : active === 'leetcode' ? (
          <LeetCodeContributions username={leetcodeUsername} />
        ) : (
          <DailySQLContributions />
        )}
      </div>
    </div>
  );
}
