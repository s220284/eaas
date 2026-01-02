import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Settings section component
 */
const SettingsSection = ({ title, description, children }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/**
 * Toggle switch component
 */
const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-mash-500 focus:ring-offset-2 ${
        enabled ? 'bg-mash-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

/**
 * Settings Page
 */
const Settings = () => {
  const { user, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Profile settings
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
  });

  // Organization settings
  const [organization, setOrganization] = useState({
    name: '',
    slug: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_evaluations: true,
    email_weekly_report: true,
    email_system_updates: false,
    browser_notifications: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    two_factor: false,
    session_timeout: '30',
  });

  // API settings
  const [apiSettings, setApiSettings] = useState({
    rate_limit: '1000',
    webhook_url: '',
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'member',
      });
      if (user.organization) {
        setOrganization({
          name: user.organization.name || '',
          slug: user.organization.slug || '',
        });
      }
    }
  }, [user]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSaveMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Password change logic would go here
    setSaveMessage({ type: 'success', text: 'Password change email sent' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Profile Settings */}
      <SettingsSection
        title="Profile"
        description="Update your personal information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div className="pt-4">
            <button
              onClick={handleProfileSave}
              disabled={isSaving}
              className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Organization Settings */}
      <SettingsSection
        title="Organization"
        description="Manage your organization settings"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={organization.name}
                onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Slug
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  mash.ai/
                </span>
                <input
                  type="text"
                  value={organization.slug}
                  onChange={(e) => setOrganization({ ...organization, slug: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-mash-500 focus:border-mash-500"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection
        title="Notifications"
        description="Configure how you receive updates"
      >
        <div className="divide-y divide-gray-200">
          <Toggle
            enabled={notifications.email_evaluations}
            onChange={(v) => setNotifications({ ...notifications, email_evaluations: v })}
            label="Evaluation alerts"
            description="Receive email notifications for failed evaluations"
          />
          <Toggle
            enabled={notifications.email_weekly_report}
            onChange={(v) => setNotifications({ ...notifications, email_weekly_report: v })}
            label="Weekly reports"
            description="Get a weekly summary of your evaluation metrics"
          />
          <Toggle
            enabled={notifications.email_system_updates}
            onChange={(v) => setNotifications({ ...notifications, email_system_updates: v })}
            label="System updates"
            description="Be notified about platform updates and new features"
          />
          <Toggle
            enabled={notifications.browser_notifications}
            onChange={(v) => setNotifications({ ...notifications, browser_notifications: v })}
            label="Browser notifications"
            description="Show desktop notifications for important events"
          />
        </div>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection
        title="Security"
        description="Protect your account"
      >
        <div className="space-y-6">
          <div className="divide-y divide-gray-200">
            <Toggle
              enabled={security.two_factor}
              onChange={(v) => setSecurity({ ...security, two_factor: v })}
              label="Two-factor authentication"
              description="Add an extra layer of security to your account"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Timeout (minutes)
            </label>
            <select
              value={security.session_timeout}
              onChange={(e) => setSecurity({ ...security, session_timeout: e.target.value })}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Change Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              We'll send you an email with a link to change your password.
            </p>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Send Password Reset Email
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* API Settings */}
      <SettingsSection
        title="API & Integrations"
        description="Configure API access and webhooks"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                disabled
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-mono text-sm"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Reveal
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Regenerate
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Use this key to authenticate API requests
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate Limit (requests/hour)
            </label>
            <select
              value={apiSettings.rate_limit}
              onChange={(e) => setApiSettings({ ...apiSettings, rate_limit: e.target.value })}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            >
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1,000</option>
              <option value="5000">5,000</option>
              <option value="10000">10,000</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL
            </label>
            <input
              type="url"
              value={apiSettings.webhook_url}
              onChange={(e) => setApiSettings({ ...apiSettings, webhook_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
              placeholder="https://your-server.com/webhook"
            />
            <p className="mt-1 text-xs text-gray-500">
              Receive real-time notifications for evaluation events
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">Delete Account</h3>
            <p className="text-sm text-red-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;
