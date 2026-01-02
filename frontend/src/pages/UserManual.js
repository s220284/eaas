import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Table of Contents Navigation Component
 */
const TableOfContents = ({ sections, activeSection, onSectionClick }) => {
  return (
    <nav className="sticky top-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onSectionClick(section.id)}
              className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                activeSection === section.id
                  ? 'bg-mash-100 text-mash-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {section.title}
            </button>
            {section.subsections && (
              <ul className="ml-4 mt-1 space-y-1">
                {section.subsections.map((sub) => (
                  <li key={sub.id}>
                    <button
                      onClick={() => onSectionClick(sub.id)}
                      className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                        activeSection === sub.id
                          ? 'bg-mash-50 text-mash-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {sub.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

/**
 * Code Block Component for displaying code snippets
 */
const CodeBlock = ({ code, language = 'json' }) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden my-4">
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
      <span className="text-xs text-gray-400 uppercase">{language}</span>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="text-xs text-gray-400 hover:text-white transition-colors"
      >
        Copy
      </button>
    </div>
    <pre className="p-4 overflow-x-auto text-sm text-gray-300">
      <code>{code}</code>
    </pre>
  </div>
);

/**
 * Info Box Component for tips and warnings
 */
const InfoBox = ({ type = 'info', title, children }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    tip: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    important: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    important: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`border rounded-lg p-4 my-4 ${styles[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Section Header Component
 */
const SectionHeader = ({ id, title, subtitle }) => (
  <div id={id} className="scroll-mt-6 mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    <div className="mt-4 h-1 w-20 bg-mash-600 rounded"></div>
  </div>
);

/**
 * Sub-Section Header Component
 */
const SubSectionHeader = ({ id, title }) => (
  <h3 id={id} className="scroll-mt-6 text-xl font-semibold text-gray-900 mt-8 mb-4">
    {title}
  </h3>
);

/**
 * CanonSafe User Manual Page
 * Comprehensive documentation for the evaluation-as-a-service platform
 */
const UserManual = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      subsections: [
        { id: 'what-is-canonsafe', title: 'What is CanonSafe?' },
        { id: 'key-concepts', title: 'Key Concepts' },
        { id: 'architecture', title: 'System Architecture' },
      ],
    },
    {
      id: 'getting-started',
      title: '2. Getting Started',
      subsections: [
        { id: 'account-setup', title: 'Account Setup' },
        { id: 'dashboard-overview', title: 'Dashboard Overview' },
        { id: 'navigation', title: 'Navigation Guide' },
      ],
    },
    {
      id: 'franchises',
      title: '3. Managing Franchises',
      subsections: [
        { id: 'create-franchise', title: 'Creating Franchises' },
        { id: 'franchise-settings', title: 'Franchise Settings' },
      ],
    },
    {
      id: 'characters',
      title: '4. Character Cards',
      subsections: [
        { id: 'create-character', title: 'Creating Characters' },
        { id: 'canon-facts', title: 'Canon Facts' },
        { id: 'canon-voice', title: 'Canon Voice' },
        { id: 'safety-rules', title: 'Safety Rules' },
      ],
    },
    {
      id: 'evaluations',
      title: '5. Running Evaluations',
      subsections: [
        { id: 'quick-eval', title: 'Quick Evaluation' },
        { id: 'batch-eval', title: 'Batch Evaluation' },
        { id: 'understanding-results', title: 'Understanding Results' },
      ],
    },
    {
      id: 'test-suites',
      title: '6. Test Suites',
      subsections: [
        { id: 'create-suite', title: 'Creating Test Suites' },
        { id: 'test-cases', title: 'Test Case Design' },
        { id: 'automated-testing', title: 'Automated Testing' },
      ],
    },
    {
      id: 'api-reference',
      title: '7. API Reference',
      subsections: [
        { id: 'authentication-api', title: 'Authentication' },
        { id: 'characters-api', title: 'Characters API' },
        { id: 'evaluations-api', title: 'Evaluations API' },
      ],
    },
    {
      id: 'best-practices',
      title: '8. Best Practices',
      subsections: [
        { id: 'character-design', title: 'Character Design' },
        { id: 'evaluation-strategies', title: 'Evaluation Strategies' },
        { id: 'integration-tips', title: 'Integration Tips' },
      ],
    },
    {
      id: 'troubleshooting',
      title: '9. Troubleshooting',
      subsections: [
        { id: 'common-issues', title: 'Common Issues' },
        { id: 'error-codes', title: 'Error Codes' },
      ],
    },
    { id: 'glossary', title: '10. Glossary' },
  ];

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-mash-600 to-mash-700 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-10 h-10 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <h1 className="text-3xl font-bold">CanonSafe&#8482; User Manual</h1>
              <p className="text-mash-100 mt-1">Complete Guide to IP Protection & Character Evaluation</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-mash-200">
            <span>Version 1.0.0</span>
            <span className="mx-3">|</span>
            <span>Last Updated: January 2026</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar TOC */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <TableOfContents
                sections={sections}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
            {/* SECTION 1: Introduction */}
            <section className="mb-16">
              <SectionHeader
                id="introduction"
                title="1. Introduction"
                subtitle="Welcome to CanonSafe - the enterprise platform for protecting intellectual property in AI-generated content."
              />

              <SubSectionHeader id="what-is-canonsafe" title="What is CanonSafe?" />
              <p className="text-gray-700 mb-4">
                <strong>CanonSafe&#8482;</strong> is an Evaluation-as-a-Service (EaaS) platform designed specifically for
                intellectual property owners, entertainment companies, and brand managers who need to ensure that
                AI-generated content featuring their characters remains faithful to established canon and brand guidelines.
              </p>
              <p className="text-gray-700 mb-4">
                In the age of generative AI, characters from beloved franchises can now interact with users through
                chatbots, virtual experiences, and interactive content. However, without proper safeguards, these
                AI representations can deviate from established character traits, violate brand safety guidelines,
                or even produce content that damages the integrity of the intellectual property.
              </p>
              <p className="text-gray-700 mb-4">
                CanonSafe solves this problem by providing a comprehensive "LLM-as-Judge" evaluation system that
                automatically assesses AI responses against detailed character cards containing canon facts,
                voice guidelines, and safety rules.
              </p>

              <InfoBox type="important" title="Core Value Proposition">
                CanonSafe enables IP owners to scale AI character experiences while maintaining 100% control
                over brand integrity, canon accuracy, and content safety.
              </InfoBox>

              <SubSectionHeader id="key-concepts" title="Key Concepts" />
              <div className="space-y-4">
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Character Cards</h4>
                  <p className="text-gray-600 text-sm">
                    Comprehensive profiles that define everything about a character: their facts, personality,
                    voice, relationships, and safety boundaries. These are the "source of truth" for evaluations.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">LLM-as-Judge</h4>
                  <p className="text-gray-600 text-sm">
                    A sophisticated evaluation approach where a large language model (like GPT-4 or Claude)
                    acts as an expert judge, comparing AI responses against character cards to score accuracy,
                    voice consistency, and safety compliance.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Franchises</h4>
                  <p className="text-gray-600 text-sm">
                    Organizational containers that group related characters together. A franchise might be a
                    movie series, TV show, book series, or brand mascot family.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Test Suites</h4>
                  <p className="text-gray-600 text-sm">
                    Collections of pre-defined test cases that can be run automatically to validate AI behavior
                    at scale. Essential for continuous integration and quality assurance.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Evaluations</h4>
                  <p className="text-gray-600 text-sm">
                    The actual assessment process where a prompt and response are judged against character
                    card criteria, producing detailed scores and actionable feedback.
                  </p>
                </div>
              </div>

              <SubSectionHeader id="architecture" title="System Architecture" />
              <p className="text-gray-700 mb-4">
                CanonSafe is built as a modern, cloud-native application with the following components:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Frontend</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• React 18 with modern hooks</li>
                      <li>• TailwindCSS for styling</li>
                      <li>• React Router for navigation</li>
                      <li>• Deployed on Vercel</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Backend</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• FastAPI (Python 3.11)</li>
                      <li>• PostgreSQL database</li>
                      <li>• JWT authentication</li>
                      <li>• Deployed on GCP Cloud Run</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Getting Started */}
            <section className="mb-16">
              <SectionHeader
                id="getting-started"
                title="2. Getting Started"
                subtitle="Set up your account and learn to navigate the platform."
              />

              <SubSectionHeader id="account-setup" title="Account Setup" />
              <p className="text-gray-700 mb-4">
                To begin using CanonSafe, you'll need to create an account and set up your organization.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h5 className="font-semibold text-gray-900 mb-4">Step-by-Step Registration</h5>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-mash-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
                    <div>
                      <p className="font-medium text-gray-900">Navigate to Registration</p>
                      <p className="text-sm text-gray-600">Go to <Link to="/register" className="text-mash-600 hover:underline">/register</Link> and click "Create Account"</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-mash-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
                    <div>
                      <p className="font-medium text-gray-900">Enter Your Information</p>
                      <p className="text-sm text-gray-600">Provide your name, email address, and create a secure password (min. 8 characters with uppercase, lowercase, and number)</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-mash-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
                    <div>
                      <p className="font-medium text-gray-900">Create Your Organization</p>
                      <p className="text-sm text-gray-600">Enter your organization name and choose a unique slug (URL-friendly identifier)</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-mash-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
                    <div>
                      <p className="font-medium text-gray-900">Access Your Dashboard</p>
                      <p className="text-sm text-gray-600">Upon successful registration, you'll receive an access token and be redirected to your dashboard</p>
                    </div>
                  </li>
                </ol>
              </div>

              <InfoBox type="tip" title="Password Requirements">
                Your password must be at least 8 characters long and contain at least one uppercase letter,
                one lowercase letter, and one number. Special characters are recommended for additional security.
              </InfoBox>

              <SubSectionHeader id="dashboard-overview" title="Dashboard Overview" />
              <p className="text-gray-700 mb-4">
                The dashboard provides a quick overview of your CanonSafe activity and key metrics:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Stats Cards</h5>
                  <p className="text-sm text-gray-600">
                    View at-a-glance counts of your total characters, franchises, evaluations run,
                    and overall pass rate percentage.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Recent Activity</h5>
                  <p className="text-sm text-gray-600">
                    A timeline of recent actions including evaluations completed, characters updated,
                    and test suites created.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Quick Actions</h5>
                  <p className="text-sm text-gray-600">
                    One-click buttons to create new characters, run evaluations, create test suites,
                    and view reports.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Recent Characters</h5>
                  <p className="text-sm text-gray-600">
                    Quick access to your most recently created or updated character cards.
                  </p>
                </div>
              </div>

              <SubSectionHeader id="navigation" title="Navigation Guide" />
              <p className="text-gray-700 mb-4">
                The left sidebar provides access to all major sections of the platform:
              </p>
              <table className="w-full border-collapse border border-gray-200 mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Menu Item</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Dashboard</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Overview and quick stats</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Characters</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Create and manage character cards</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Franchises</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Organize characters into franchises</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Test Suites</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Create and run automated tests</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Evaluations</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Run quick evaluations and view history</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Settings</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Manage account and preferences</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">User Manual</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">This documentation</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* SECTION 3: Managing Franchises */}
            <section className="mb-16">
              <SectionHeader
                id="franchises"
                title="3. Managing Franchises"
                subtitle="Organize your characters into logical groupings."
              />

              <SubSectionHeader id="create-franchise" title="Creating Franchises" />
              <p className="text-gray-700 mb-4">
                Franchises serve as organizational containers for related characters. Before creating characters,
                you should set up the franchise they belong to.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h5 className="font-semibold text-gray-900 mb-4">To Create a Franchise:</h5>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">1.</span>
                    Navigate to the <strong>Franchises</strong> page from the sidebar
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">2.</span>
                    Click the <strong>"Create Franchise"</strong> button in the top right
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">3.</span>
                    Enter the franchise <strong>Name</strong> (e.g., "Toy Story", "Marvel Cinematic Universe")
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">4.</span>
                    Add an optional <strong>Description</strong> to help team members understand the franchise
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">5.</span>
                    Click <strong>"Save"</strong> to create the franchise
                  </li>
                </ol>
              </div>

              <InfoBox type="tip" title="Franchise Organization">
                Consider your organizational structure when creating franchises. You might organize by:
                movie series, TV shows, book series, product lines, or brand mascots.
              </InfoBox>

              <SubSectionHeader id="franchise-settings" title="Franchise Settings" />
              <p className="text-gray-700 mb-4">
                Each franchise can be configured with specific settings that apply to all characters within it:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Default Content Rating</strong> - The baseline content rating for characters</li>
                <li><strong>Global Prohibited Topics</strong> - Topics banned across all characters in the franchise</li>
                <li><strong>Brand Guidelines URL</strong> - Link to external brand guidelines documentation</li>
                <li><strong>Default Judge Model</strong> - Which LLM to use for evaluations</li>
              </ul>
            </section>

            {/* SECTION 4: Character Cards */}
            <section className="mb-16">
              <SectionHeader
                id="characters"
                title="4. Character Cards"
                subtitle="The heart of CanonSafe - detailed character definitions for accurate evaluations."
              />

              <SubSectionHeader id="create-character" title="Creating Characters" />
              <p className="text-gray-700 mb-4">
                Character cards are comprehensive profiles that define everything the evaluation system needs
                to know about a character. A well-defined character card is essential for accurate evaluations.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h5 className="font-semibold text-gray-900 mb-4">Character Card Structure:</h5>
                <div className="space-y-4">
                  <div>
                    <h6 className="font-medium text-gray-900">Basic Information</h6>
                    <p className="text-sm text-gray-600">Name, slug (URL identifier), and franchise assignment</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Canon Facts</h6>
                    <p className="text-sm text-gray-600">Verifiable facts about the character with source citations</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Canon Voice</h6>
                    <p className="text-sm text-gray-600">Personality, tone, speech style, and catchphrases</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Canon Relationships</h6>
                    <p className="text-sm text-gray-600">Connections to other characters and entities</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Safety Configuration</h6>
                    <p className="text-sm text-gray-600">Content rating, prohibited topics, required disclosures</p>
                  </div>
                </div>
              </div>

              <SubSectionHeader id="canon-facts" title="Canon Facts" />
              <p className="text-gray-700 mb-4">
                Canon facts are verifiable pieces of information about a character. Each fact includes a value
                and a source citation, ensuring all evaluations are grounded in official canon.
              </p>

              <CodeBlock
                language="json"
                code={`{
  "canon_facts": {
    "full_name": {
      "value": "Sheriff Woody Pride",
      "source": "Toy Story (1995), verified by Pixar official materials"
    },
    "species": {
      "value": "Toy (pull-string cowboy doll)",
      "source": "Toy Story (1995)"
    },
    "owner": {
      "value": "Andy Davis (originally), later Bonnie Anderson",
      "source": "Toy Story 1-4"
    },
    "catchphrase": {
      "value": "There's a snake in my boot!",
      "source": "Toy Story (1995)"
    },
    "origin": {
      "value": "Woody's Roundup TV show merchandise from the 1950s",
      "source": "Toy Story 2 (1999)"
    }
  }
}`}
              />

              <InfoBox type="important" title="Source Citations Matter">
                Always include specific source citations for canon facts. This allows evaluations to verify
                information accuracy and provides traceability for any disputes about character authenticity.
              </InfoBox>

              <SubSectionHeader id="canon-voice" title="Canon Voice" />
              <p className="text-gray-700 mb-4">
                The canon voice section defines how a character should speak, their personality traits, and
                their characteristic communication style. This is crucial for evaluating whether AI responses
                "sound like" the character.
              </p>

              <CodeBlock
                language="json"
                code={`{
  "canon_voice": {
    "personality": "Loyal, brave, natural leader, protective, sometimes insecure about being replaced, deeply caring about friends and family, traditional values, cowboy-style honor code",
    "tone": "Warm, encouraging, heroic when needed, can be stern when protecting others, occasionally anxious about abandonment",
    "speech_style": "Western/cowboy vernacular mixed with modern expressions, uses phrases like 'partner' and 'howdy', speaks with authority but remains approachable",
    "catchphrases": [
      "There's a snake in my boot!",
      "Reach for the sky!",
      "You're my favorite deputy",
      "This town ain't big enough for the two of us"
    ],
    "vocabulary_notes": "Avoids modern slang, prefers timeless expressions, maintains PG-appropriate language at all times"
  }
}`}
              />

              <SubSectionHeader id="safety-rules" title="Safety Rules" />
              <p className="text-gray-700 mb-4">
                Safety configuration ensures AI-generated content meets brand guidelines and protects audiences:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Content Ratings</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>G</strong> - General audiences, all ages</li>
                    <li><strong>PG</strong> - Parental guidance suggested</li>
                    <li><strong>PG-13</strong> - Parents strongly cautioned</li>
                    <li><strong>R</strong> - Restricted, adult supervision</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Prohibited Topics</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Violence and weapons</li>
                    <li>• Adult content</li>
                    <li>• Drug references</li>
                    <li>• Political opinions</li>
                    <li>• Real-world tragedy</li>
                  </ul>
                </div>
              </div>

              <CodeBlock
                language="json"
                code={`{
  "safety_content_rating": "G",
  "safety_prohibited_topics": [
    "violence",
    "weapons",
    "adult_content",
    "drug_references",
    "political_opinions",
    "real_world_tragedies",
    "competitor_products"
  ],
  "safety_required_disclosures": [
    "This is an AI-generated character experience",
    "Character responses are for entertainment purposes only",
    "Not affiliated with official Pixar/Disney products"
  ]
}`}
              />
            </section>

            {/* SECTION 5: Running Evaluations */}
            <section className="mb-16">
              <SectionHeader
                id="evaluations"
                title="5. Running Evaluations"
                subtitle="Test AI responses against character cards for accuracy and safety."
              />

              <SubSectionHeader id="quick-eval" title="Quick Evaluation" />
              <p className="text-gray-700 mb-4">
                Quick evaluation allows you to test a single prompt-response pair against a character card
                in real-time. This is ideal for spot-checking responses or debugging issues.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h5 className="font-semibold text-gray-900 mb-4">Running a Quick Evaluation:</h5>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">1.</span>
                    Navigate to the <strong>Evaluations</strong> page
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">2.</span>
                    Select a <strong>Character</strong> from the dropdown menu
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">3.</span>
                    Enter the <strong>User Prompt</strong> that was sent to the AI
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">4.</span>
                    Enter the <strong>AI Response</strong> that was generated
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-mash-600 mr-2">5.</span>
                    Click <strong>"Evaluate"</strong> to run the assessment
                  </li>
                </ol>
              </div>

              <SubSectionHeader id="batch-eval" title="Batch Evaluation" />
              <p className="text-gray-700 mb-4">
                For testing multiple responses at once, use batch evaluation. This accepts a JSON file containing
                multiple prompt-response pairs and evaluates them all, providing aggregate statistics.
              </p>

              <CodeBlock
                language="json"
                code={`{
  "character_card_id": "uuid-of-character",
  "test_cases": [
    {
      "prompt": "Hi Woody! What's your favorite thing to do?",
      "response": "Howdy, partner! Well, my absolute favorite thing is spending time with my friends..."
    },
    {
      "prompt": "What do you think about modern technology?",
      "response": "Now that's an interesting question! As a toy from the 1950s..."
    }
  ]
}`}
              />

              <SubSectionHeader id="understanding-results" title="Understanding Results" />
              <p className="text-gray-700 mb-4">
                Each evaluation produces detailed results across three main categories:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4 border-l-4 border-l-blue-500">
                  <h5 className="font-semibold text-gray-900 mb-2">Canon Accuracy (0-100)</h5>
                  <p className="text-sm text-gray-600">
                    How well the response aligns with established canon facts.
                    Penalizes factual errors and contradictions.
                  </p>
                </div>
                <div className="border rounded-lg p-4 border-l-4 border-l-green-500">
                  <h5 className="font-semibold text-gray-900 mb-2">Voice Consistency (0-100)</h5>
                  <p className="text-sm text-gray-600">
                    How well the response matches the character's personality,
                    tone, and speech patterns.
                  </p>
                </div>
                <div className="border rounded-lg p-4 border-l-4 border-l-purple-500">
                  <h5 className="font-semibold text-gray-900 mb-2">Safety Compliance (Pass/Fail)</h5>
                  <p className="text-sm text-gray-600">
                    Whether the response adheres to content rating and
                    avoids prohibited topics.
                  </p>
                </div>
              </div>

              <InfoBox type="info" title="Score Interpretation">
                <ul className="space-y-1">
                  <li><strong>90-100:</strong> Excellent - Production ready</li>
                  <li><strong>70-89:</strong> Good - Minor improvements recommended</li>
                  <li><strong>50-69:</strong> Fair - Significant revision needed</li>
                  <li><strong>Below 50:</strong> Poor - Response should be rejected</li>
                </ul>
              </InfoBox>
            </section>

            {/* SECTION 6: Test Suites */}
            <section className="mb-16">
              <SectionHeader
                id="test-suites"
                title="6. Test Suites"
                subtitle="Create reusable test collections for automated quality assurance."
              />

              <SubSectionHeader id="create-suite" title="Creating Test Suites" />
              <p className="text-gray-700 mb-4">
                Test suites allow you to group related test cases together for automated, repeatable testing.
                This is essential for continuous integration and regular quality checks.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h5 className="font-semibold text-gray-900 mb-4">Test Suite Components:</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mash-600 rounded-full mt-1.5 mr-2"></span>
                    <div>
                      <strong>Name:</strong> Descriptive identifier (e.g., "Woody Basic Interactions v2")
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mash-600 rounded-full mt-1.5 mr-2"></span>
                    <div>
                      <strong>Character Assignment:</strong> Which character card to evaluate against
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mash-600 rounded-full mt-1.5 mr-2"></span>
                    <div>
                      <strong>Test Cases:</strong> Collection of prompt-response pairs to evaluate
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mash-600 rounded-full mt-1.5 mr-2"></span>
                    <div>
                      <strong>Pass Thresholds:</strong> Minimum scores required for each category
                    </div>
                  </li>
                </ul>
              </div>

              <SubSectionHeader id="test-cases" title="Test Case Design" />
              <p className="text-gray-700 mb-4">
                Effective test cases cover a range of scenarios to ensure comprehensive evaluation:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Happy Path Tests</h5>
                  <p className="text-sm text-gray-600">
                    Standard, expected interactions where the AI should perform well
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Edge Cases</h5>
                  <p className="text-sm text-gray-600">
                    Unusual or boundary condition scenarios
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Adversarial Tests</h5>
                  <p className="text-sm text-gray-600">
                    Attempts to make the character break character or violate safety rules
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Canon Verification</h5>
                  <p className="text-sm text-gray-600">
                    Questions that test specific canon facts and relationships
                  </p>
                </div>
              </div>

              <SubSectionHeader id="automated-testing" title="Automated Testing" />
              <p className="text-gray-700 mb-4">
                Test suites can be run automatically via the API for integration into CI/CD pipelines:
              </p>

              <CodeBlock
                language="bash"
                code={`# Run a test suite via API
curl -X POST "https://api.canonsafe.com/api/v1/test-suites/{suite_id}/run" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"

# Response includes aggregate results
{
  "suite_id": "uuid",
  "total_tests": 25,
  "passed": 23,
  "failed": 2,
  "pass_rate": 92.0,
  "average_canon_score": 87.5,
  "average_voice_score": 91.2,
  "details": [...]
}`}
              />
            </section>

            {/* SECTION 7: API Reference */}
            <section className="mb-16">
              <SectionHeader
                id="api-reference"
                title="7. API Reference"
                subtitle="Integrate CanonSafe into your applications programmatically."
              />

              <InfoBox type="info" title="API Base URL">
                Production: <code className="bg-gray-100 px-2 py-1 rounded">https://mash-ai-backend-611530284830.us-central1.run.app</code><br />
                Local Development: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000</code>
              </InfoBox>

              <SubSectionHeader id="authentication-api" title="Authentication" />
              <p className="text-gray-700 mb-4">
                All API requests (except registration and login) require a Bearer token in the Authorization header.
              </p>

              <CodeBlock
                language="bash"
                code={`# Register a new user
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "organization_name": "Acme Corp",
  "organization_slug": "acme-corp"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}

# Use token in subsequent requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`}
              />

              <SubSectionHeader id="characters-api" title="Characters API" />

              <CodeBlock
                language="bash"
                code={`# List all characters
GET /api/v1/characters/

# Get character by ID
GET /api/v1/characters/{character_id}

# Create character
POST /api/v1/characters
{
  "name": "Woody",
  "slug": "woody",
  "franchise_id": "uuid",
  "canon_facts": {...},
  "canon_voice": {...},
  "safety_content_rating": "G",
  "safety_prohibited_topics": ["violence"],
  "safety_required_disclosures": ["AI-generated content"]
}

# Update character
PUT /api/v1/characters/{character_id}
{...updated fields...}

# Delete character
DELETE /api/v1/characters/{character_id}`}
              />

              <SubSectionHeader id="evaluations-api" title="Evaluations API" />

              <CodeBlock
                language="bash"
                code={`# Run quick evaluation
POST /api/v1/evaluations/evaluate
{
  "character_card_id": "uuid-of-character",
  "prompt": "Hi Woody! How are you today?",
  "model_response": "Howdy, partner! I'm doing just fine..."
}

# Response
{
  "id": "eval-uuid",
  "overall_pass": true,
  "canon_accuracy_score": 92,
  "voice_consistency_score": 88,
  "safety_compliant": true,
  "detailed_feedback": {
    "canon_issues": [],
    "voice_observations": ["Good use of cowboy vernacular"],
    "safety_flags": []
  },
  "created_at": "2026-01-01T12:00:00Z"
}`}
              />
            </section>

            {/* SECTION 8: Best Practices */}
            <section className="mb-16">
              <SectionHeader
                id="best-practices"
                title="8. Best Practices"
                subtitle="Expert recommendations for getting the most out of CanonSafe."
              />

              <SubSectionHeader id="character-design" title="Character Design Best Practices" />
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Be Exhaustive with Canon Facts</h5>
                    <p className="text-sm text-gray-600">
                      Include every verifiable fact about the character. More data leads to more accurate evaluations.
                      When in doubt, include it.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Cite Primary Sources</h5>
                    <p className="text-sm text-gray-600">
                      Always cite official sources (movies, books, games) rather than fan wikis or interpretations.
                      Primary sources provide authoritative ground truth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Include Example Dialogue</h5>
                    <p className="text-sm text-gray-600">
                      Add real quotes from the character in the voice section. This gives the evaluator concrete
                      examples of how the character actually speaks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Update Regularly</h5>
                    <p className="text-sm text-gray-600">
                      As new canon content is released, update character cards to reflect new information.
                      Characters evolve across sequels and new material.
                    </p>
                  </div>
                </div>
              </div>

              <SubSectionHeader id="evaluation-strategies" title="Evaluation Strategies" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Pre-Launch Testing</h5>
                  <p className="text-sm text-gray-600">
                    Before launching any AI character experience, run comprehensive test suites with at least
                    100 diverse test cases covering all expected interaction patterns.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Continuous Monitoring</h5>
                  <p className="text-sm text-gray-600">
                    Sample live traffic and run evaluations regularly. Integrate with your analytics to
                    catch degradation early.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">A/B Testing</h5>
                  <p className="text-sm text-gray-600">
                    When adjusting AI prompts or character cards, use evaluations to compare before/after
                    quality objectively.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Adversarial Testing</h5>
                  <p className="text-sm text-gray-600">
                    Regularly test with adversarial prompts designed to break character or violate safety.
                    Your users will try this - be prepared.
                  </p>
                </div>
              </div>

              <SubSectionHeader id="integration-tips" title="Integration Tips" />
              <InfoBox type="tip" title="API Integration Patterns">
                <ul className="space-y-2">
                  <li><strong>Synchronous:</strong> Use for real-time moderation where responses can wait for evaluation</li>
                  <li><strong>Asynchronous:</strong> Use batch evaluation for high-volume analysis</li>
                  <li><strong>Hybrid:</strong> Run quick safety checks synchronously, detailed evaluation asynchronously</li>
                </ul>
              </InfoBox>
            </section>

            {/* SECTION 9: Troubleshooting */}
            <section className="mb-16">
              <SectionHeader
                id="troubleshooting"
                title="9. Troubleshooting"
                subtitle="Common issues and how to resolve them."
              />

              <SubSectionHeader id="common-issues" title="Common Issues" />
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Low Canon Accuracy Scores</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Cause:</strong> Character card may be missing relevant facts
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Review evaluation feedback for specific issues, then add missing
                    facts to the character card
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Inconsistent Voice Scores</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Cause:</strong> Voice description may be too vague
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Add more specific personality traits, speech patterns, and
                    example dialogue to the voice section
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Authentication Errors (401/403)</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Cause:</strong> Token may be expired or invalid
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Re-authenticate using the login endpoint to get a fresh token
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Slow Evaluation Times</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Cause:</strong> Large character cards or complex evaluations
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Use batch processing for multiple evaluations; consider
                    splitting very large character cards
                  </p>
                </div>
              </div>

              <SubSectionHeader id="error-codes" title="Error Codes" />
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Meaning</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">400</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Bad Request</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Check request body format</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">401</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Unauthorized</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Provide valid auth token</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">403</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Forbidden</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Check permissions</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">404</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Not Found</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Verify resource ID exists</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">422</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Validation Error</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Check field requirements</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">500</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Server Error</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Contact support</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* SECTION 10: Glossary */}
            <section className="mb-8">
              <SectionHeader
                id="glossary"
                title="10. Glossary"
                subtitle="Key terms and definitions used throughout CanonSafe."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Canon</h4>
                  <p className="text-sm text-gray-600">
                    The official, accepted facts and storylines from authoritative sources about a character or franchise.
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Character Card</h4>
                  <p className="text-sm text-gray-600">
                    A comprehensive profile defining a character's facts, voice, relationships, and safety rules.
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">LLM-as-Judge</h4>
                  <p className="text-sm text-gray-600">
                    An evaluation methodology where a large language model assesses AI outputs against defined criteria.
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Test Suite</h4>
                  <p className="text-sm text-gray-600">
                    A collection of test cases that can be run together for systematic evaluation.
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Content Rating</h4>
                  <p className="text-sm text-gray-600">
                    Classification system (G, PG, PG-13, R) indicating appropriate audience age for content.
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Voice Consistency</h4>
                  <p className="text-sm text-gray-600">
                    How well an AI response matches the character's established personality and speech patterns.
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Franchise</h4>
                  <p className="text-sm text-gray-600">
                    An organizational container grouping related characters (e.g., all characters from a movie series).
                  </p>
                </div>
                <div className="border-l-4 border-mash-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Safety Compliance</h4>
                  <p className="text-sm text-gray-600">
                    Whether content adheres to defined content ratings and avoids prohibited topics.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-8 mt-8">
              <div className="text-center text-gray-500 text-sm">
                <p className="mb-2">
                  <strong>CanonSafe&#8482;</strong> - Enterprise IP Protection Platform
                </p>
                <p>
                  For support, please contact your account representative or visit our support portal.
                </p>
                <p className="mt-4 text-xs">
                  &copy; 2026 CanonSafe. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
