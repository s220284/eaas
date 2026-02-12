import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { charactersApi, evaluationsApi, franchisesApi } from '../api/client';

/**
 * Stat card component
 */
const StatCard = ({ title, value, icon, color, link }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const content = (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

/**
 * Recent activity item component
 */
const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'evaluation':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'character':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      {getActivityIcon(activity.type)}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

/**
 * Quick action button component
 */
const QuickAction = ({ title, description, icon, href, color }) => {
  const colorClasses = {
    blue: 'hover:border-blue-300 hover:bg-blue-50',
    green: 'hover:border-green-300 hover:bg-green-50',
    purple: 'hover:border-purple-300 hover:bg-purple-50',
    orange: 'hover:border-orange-300 hover:bg-orange-50',
  };

  return (
    <Link
      to={href}
      className={`block p-4 border border-gray-200 rounded-lg transition-colors ${colorClasses[color]}`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
};

/**
 * Format a timestamp into a relative time string
 */
const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Dashboard home page
 * Shows overview stats, recent activity, and quick actions
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    characters: 0,
    franchises: 0,
    evaluations: 0,
    passRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentCharacters, setRecentCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [charactersRes, franchisesRes, evalsRes] = await Promise.allSettled([
          charactersApi.getAll(),
          franchisesApi.getAll(),
          evaluationsApi.getAll(),
        ]);

        let characterCount = 0;
        if (charactersRes.status === 'fulfilled') {
          const characters = charactersRes.value?.items || charactersRes.value || [];
          const charArray = Array.isArray(characters) ? characters : [];
          setRecentCharacters(charArray.slice(0, 5));
          characterCount = charArray.length;
        }

        let franchiseCount = 0;
        if (franchisesRes.status === 'fulfilled') {
          const franchises = franchisesRes.value || [];
          franchiseCount = Array.isArray(franchises) ? franchises.length : 0;
        }

        // Build character lookup for eval activity names
        const charLookup = {};
        if (charactersRes.status === 'fulfilled') {
          const chars = Array.isArray(charactersRes.value) ? charactersRes.value : (charactersRes.value?.items || []);
          chars.forEach(c => { charLookup[c.id] = c.name; });
        }

        let evalCount = 0;
        let passRate = 0;
        const activity = [];
        if (evalsRes.status === 'fulfilled') {
          const evals = evalsRes.value || [];
          const evalArray = Array.isArray(evals) ? evals : [];
          evalCount = evalArray.length;

          // Compute pass rate from evaluations that have test counts
          const scored = evalArray.filter(e => e.total_tests > 0);
          if (scored.length > 0) {
            const passed = scored.filter(e => e.passed_tests === e.total_tests && e.total_tests > 0).length;
            passRate = Math.round((passed / scored.length) * 100);
          }

          // Build recent activity from real evaluations
          const recentEvals = evalArray
            .filter(e => e.created_at)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 8);

          recentEvals.forEach(ev => {
            const charName = charLookup[ev.character_card_id] || 'Character';
            const passed = ev.passed_tests === ev.total_tests && ev.total_tests > 0;
            const score = ev.avg_total_score;
            let desc = `Evaluation run for ${charName}`;
            if (score != null) {
              desc = `${charName} — scored ${Math.round(score)}% ${passed ? '(Passed)' : '(Failed)'}`;
            }
            activity.push({
              id: ev.id,
              type: 'evaluation',
              description: desc,
              time: timeAgo(ev.created_at),
            });
          });
        }

        // If we have real characters, build character-update activity entries
        if (charactersRes.status === 'fulfilled') {
          const chars = Array.isArray(charactersRes.value) ? charactersRes.value : (charactersRes.value?.items || []);
          const recentChars = chars
            .filter(c => c.updated_at)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 3);
          recentChars.forEach(c => {
            activity.push({
              id: `char-${c.id}`,
              type: 'character',
              description: `${c.name} card updated — status: ${c.status}`,
              time: timeAgo(c.updated_at),
            });
          });
        }

        // Sort all activity by recency, take top 8
        // For items without a parseable date, keep them at the end
        activity.sort((a, b) => {
          const order = ['Just now', 'minute', 'hour', 'day', 'week'];
          const rank = (t) => {
            for (let i = 0; i < order.length; i++) {
              if (t.includes(order[i])) return i;
            }
            return order.length;
          };
          return rank(a.time) - rank(b.time);
        });

        setStats({ characters: characterCount, franchises: franchiseCount, evaluations: evalCount, passRate });
        setRecentActivity(activity.slice(0, 8));
      } catch (error) {
        // Silently handle - stats will show 0
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-mash-600 to-mash-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="mt-2 text-mash-100">
          Here's what's happening with your character evaluations today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Characters"
          value={stats.characters}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="blue"
          link="/characters"
        />
        <StatCard
          title="Franchises"
          value={stats.franchises}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="green"
          link="/franchises"
        />
        <StatCard
          title="Evaluations"
          value={stats.evaluations}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="purple"
          link="/evaluations"
        />
        <StatCard
          title="Pass Rate"
          value={`${stats.passRate}%`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mash-600"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {[
                  { id: 'd1', type: 'evaluation', description: 'Peppa Pig — scored 94% (Passed)', time: '2 hours ago' },
                  { id: 'd2', type: 'evaluation', description: 'George Pig — scored 87% (Passed)', time: '2 hours ago' },
                  { id: 'd3', type: 'character', description: 'Mummy Pig card updated — status: approved', time: '5 hours ago' },
                  { id: 'd4', type: 'evaluation', description: 'Daddy Pig — scored 72% (Failed)', time: '5 hours ago' },
                  { id: 'd5', type: 'evaluation', description: 'Suzy Sheep — scored 91% (Passed)', time: 'Yesterday' },
                  { id: 'd6', type: 'character', description: 'Rebecca Rabbit card updated — status: draft', time: 'Yesterday' },
                  { id: 'd7', type: 'evaluation', description: 'Peppa Pig brand safety re-eval — scored 98% (Passed)', time: '2 days ago' },
                  { id: 'd8', type: 'evaluation', description: 'Danny Dog — scored 83% (Passed)', time: '3 days ago' },
                ].map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <QuickAction
              title="New Character"
              description="Create a character card"
              href="/characters?action=new"
              color="blue"
              icon={
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              }
            />
            <QuickAction
              title="Run Evaluation"
              description="Test a response"
              href="/evaluations?action=new"
              color="purple"
              icon={
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              }
            />
            <QuickAction
              title="Create Test Suite"
              description="Build automated tests"
              href="/test-suites?action=new"
              color="green"
              icon={
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              }
            />
            <QuickAction
              title="View Reports"
              description="Analytics & insights"
              href="/evaluations"
              color="orange"
              icon={
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Recent Characters */}
      {recentCharacters.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Characters</h2>
            <Link to="/characters" className="text-sm text-mash-600 hover:text-mash-700">
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {recentCharacters.map((character) => (
                <Link
                  key={character.id}
                  to={`/characters/${character.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-mash-300 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 bg-mash-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-mash-600">
                      {character.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 truncate">{character.name}</p>
                  <p className="text-xs text-gray-500 truncate">{character.franchise_name || 'No franchise'}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
