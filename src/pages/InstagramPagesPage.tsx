import React, { useState, useMemo } from 'react';
import {
  Instagram,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowUpDown,
  Calendar,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ClientProfile, AgencyInfo, PageStatus, InstagramPageItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';

/**
 * ============================================================================
 * EDIT PAGE STATS HERE
 * You can also edit the initial Instagram accounts directly in this array,
 * or configure them in src/data/portalData.ts.
 * ============================================================================
 */
export const LOCAL_INSTAGRAM_PAGES_CONFIG: InstagramPageItem[] = [
  {
    id: 'ig-1',
    handle: 'hotel_the_heaven_inn',
    displayName: 'HOTEL THE HEAVEN INN JODHPUR',
    category: 'Hotel',
    posts: 99,
    followers: 5335,
    following: 69,
    status: 'Paused',
    bio: 'Your Home Away From Home. Relax, Rewind, Recharge. Ocean Views, Luxe Comforts. Near Raj Bagh Dali B Circle, Jodhpur',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '', // Optional avatar image URL, fallback initials used if empty
  },
  {
    id: 'ig-2',
    handle: 'samarohgreen_stays',
    displayName: 'Hotel Samaroh Green',
    category: 'Hotel',
    posts: 33,
    followers: 1288,
    following: 7,
    status: 'Paused',
    bio: 'Samaroh Green Stay. Comfort, Convenience, Hospitality. Premium Rooms for Families & Travelers. Free Parking. Jodhpur, Rajasthan 342008',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
  {
    id: 'ig-3',
    handle: 'samarohgreen_hotel',
    displayName: 'Samaroh Green',
    category: 'Hotel',
    posts: 34,
    followers: 1382,
    following: 298,
    status: 'Active',
    bio: 'Where Dreams Turn Into Celebrations. Hotel + Marriage Garden. Weddings | Receptions | Parties',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
  {
    id: 'ig-4',
    handle: 'royalgroupofhotels01',
    displayName: 'Royal Group',
    category: 'Hotel',
    posts: 2,
    followers: 0,
    following: 0,
    status: 'Active',
    bio: 'Room property requirement for hotel and guest house',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
];

interface InstagramPagesPageProps {
  client: ClientProfile;
  agency: AgencyInfo;
  onCopyNotice: (handle: string) => void;
}

type SortOption = 'followers-desc' | 'followers-asc' | 'posts-desc' | 'name-asc';

export const InstagramPagesPage: React.FC<InstagramPagesPageProps> = ({
  client,
  agency,
  onCopyNotice,
}) => {
  // Use client.instagramPages if provided, otherwise fallback to master array
  const pagesData: InstagramPageItem[] = client.instagramPages || LOCAL_INSTAGRAM_PAGES_CONFIG;

  const [filter, setFilter] = useState<'All' | PageStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('followers-desc');
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  // Dynamic calculations from the data array (not hardcoded)
  const totalPages = pagesData.length;
  const totalFollowers = useMemo(
    () => pagesData.reduce((acc, page) => acc + (page.followers || 0), 0),
    [pagesData]
  );
  const totalPosts = useMemo(
    () => pagesData.reduce((acc, page) => acc + (page.posts || 0), 0),
    [pagesData]
  );
  const activePages = useMemo(
    () => pagesData.filter((p) => p.status === 'Active').length,
    [pagesData]
  );
  const pausedPages = useMemo(
    () => pagesData.filter((p) => p.status === 'Paused').length,
    [pagesData]
  );

  // Filter and sort pages
  const processedPages = useMemo(() => {
    let result = [...pagesData];

    // Status filter
    if (filter !== 'All') {
      result = result.filter((page) => page.status === filter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (page) =>
          page.handle.toLowerCase().includes(q) ||
          page.displayName.toLowerCase().includes(q) ||
          page.bio.toLowerCase().includes(q) ||
          page.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'followers-desc') {
        return (b.followers || 0) - (a.followers || 0);
      }
      if (sortBy === 'followers-asc') {
        return (a.followers || 0) - (b.followers || 0);
      }
      if (sortBy === 'posts-desc') {
        return (b.posts || 0) - (a.posts || 0);
      }
      if (sortBy === 'name-asc') {
        return a.displayName.localeCompare(b.displayName);
      }
      return 0;
    });

    return result;
  }, [pagesData, filter, searchQuery, sortBy]);

  const handleCopy = (handle: string) => {
    navigator.clipboard.writeText(`@${handle}`);
    setCopiedHandle(handle);
    onCopyNotice(`@${handle}`);
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  // Helper to get initials from display name
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Avatar gradient palettes per page
  const getAvatarGradient = (index: number) => {
    const gradients = [
      'from-indigo-600 via-purple-600 to-pink-500',
      'from-rose-500 via-amber-500 to-yellow-500',
      'from-emerald-500 via-teal-600 to-cyan-500',
      'from-blue-600 via-indigo-600 to-violet-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Section Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Managed Instagram Profiles
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Live performance metrics and profile oversight for {client.name}
        </p>
      </div>

      {/* Dynamic Summary KPI Cards at the Top of Instagram Pages (Calculated dynamically) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Pages */}
        <StatCard
          title="Total Pages"
          value={totalPages}
          subValue={`${activePages} active • ${pausedPages} paused`}
          icon={Layers}
          variant="indigo"
        />

        {/* Total Followers */}
        <StatCard
          title="Total Followers"
          value={totalFollowers.toLocaleString('en-IN')}
          subValue="Across all 4 profiles"
          icon={Users}
          variant="purple"
          badgeText="Hospitality Reach"
        />

        {/* Total Posts */}
        <StatCard
          title="Total Posts"
          value={totalPosts.toLocaleString('en-IN')}
          subValue="Published feed content"
          icon={ImageIcon}
          variant="emerald"
        />

        {/* Active Pages */}
        <StatCard
          title="Active Pages"
          value={activePages}
          subValue="Currently in active management"
          icon={CheckCircle2}
          variant="emerald"
          badgeText="Active"
        />
      </div>

      {/* Filter Tabs, Search Bar, and Sorting Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs (All / Active / Paused) */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {(['All', 'Active', 'Paused'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? totalPages
                : tab === 'Active'
                ? activePages
                : pausedPages;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filter === tab
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search and Sort controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search handle, name, bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            />
          </div>

          {/* Sort By Followers Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <option value="followers-desc">Followers: High to Low</option>
              <option value="followers-asc">Followers: Low to High</option>
              <option value="posts-desc">Most Posts</option>
              <option value="name-asc">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile Cards Grid (2 columns on large screens) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {processedPages.map((page, idx) => {
          const initials = getInitials(page.displayName || page.handle);
          const gradientClass = getAvatarGradient(idx);

          return (
            <div
              key={page.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900/60"
            >
              <div>
                {/* Header: Avatar, Display Name, Handle, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Avatar with fallback colored circle and initials */}
                    {page.avatarUrl ? (
                      <img
                        src={page.avatarUrl}
                        alt={page.displayName}
                        className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                      />
                    ) : (
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${gradientClass} text-white shadow-md shadow-indigo-500/20`}
                      >
                        <span className="text-base font-extrabold tracking-wider">
                          {initials}
                        </span>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {page.displayName}
                        </h3>
                      </div>

                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          @{page.handle}
                        </span>
                        <button
                          onClick={() => handleCopy(page.handle)}
                          title="Copy Instagram handle"
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          {copiedHandle === page.handle ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {page.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={page.status} size="sm" />
                </div>

                {/* Bio text */}
                <div className="mt-4 rounded-2xl bg-slate-50/80 p-3.5 text-xs text-slate-700 leading-relaxed dark:bg-slate-800/40 dark:text-slate-300">
                  <p className="line-clamp-3 italic">
                    "{page.bio}"
                  </p>
                </div>

                {/* 3 Stat Boxes for Posts / Followers / Following */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {/* Posts box */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-xs dark:border-slate-800/80 dark:bg-slate-800/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Posts
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {page.posts.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Followers box */}
                  <div className="rounded-2xl border border-indigo-100/80 bg-indigo-50/40 p-3 text-center shadow-xs dark:border-indigo-900/40 dark:bg-indigo-950/30">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Followers
                    </p>
                    <p className="mt-1 text-base font-bold text-indigo-700 dark:text-indigo-300 sm:text-lg">
                      {page.followers.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Following box */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-xs dark:border-slate-800/80 dark:bg-slate-800/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Following
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {page.following.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer: Last Updated Date + View on Instagram Button */}
              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Stats as of {date} (15 Oct 2026) */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Stats as of {page.lastUpdated || '15 Oct 2026'}</span>
                  </div>

                  {/* View on Instagram button */}
                  <a
                    href={`https://instagram.com/${page.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>View on Instagram</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {processedPages.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Instagram className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
            No Instagram profiles match your criteria
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing your search query or switching filter tabs.
          </p>
        </div>
      )}
    </div>
  );
};
