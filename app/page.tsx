import Link from "next/link";

interface Category {
  id: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

function MonitorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
      />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
      />
    </svg>
  );
}

const CATEGORIES: Category[] = [
  {
    id: "VDI",
    title: "VDI",
    description:
      "Get help with virtual desktop connections, performance issues, black screens, and remote access.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: <MonitorIcon />,
  },
  {
    id: "Phone",
    title: "Phone Support",
    description:
      "Troubleshoot voicemail setup, call forwarding, audio quality, and softphone configuration.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: <PhoneIcon />,
  },
  {
    id: "Scanner",
    title: "Scanner",
    description:
      "Resolve scanner connectivity, driver installation, and document scanning problems.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: <PrinterIcon />,
  },
  {
    id: "General IT",
    title: "General IT",
    description:
      "Get help with passwords, software installation, hardware issues, and general IT support.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: <WrenchIcon />,
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      data-testid="landing-page"
    >
      {/* Header */}
      <header
        className="bg-blue-900 text-white px-4 py-3 flex items-center gap-3 shadow-md"
        data-testid="landing-header"
      >
        <div
          className="w-9 h-9 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-blue-900 text-sm flex-shrink-0"
          data-testid="company-logo"
          aria-label="Company Logo"
        >
          IT
        </div>
        <span className="font-semibold text-sm" data-testid="company-name">
          Acme Corp
        </span>
      </header>

      {/* Hero Section */}
      <section
        className="bg-blue-900 text-white px-6 py-16 text-center"
        data-testid="hero-section"
      >
        <h1
          className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
          data-testid="hero-heading"
        >
          IT Self-Service Portal
        </h1>
        <p
          className="text-blue-200 text-lg max-w-xl mx-auto"
          data-testid="hero-description"
        >
          Select a support category to get instant answers from our knowledge
          base — no waiting, no hold music.
        </p>
      </section>

      {/* Category Grid */}
      <section
        className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full"
        data-testid="category-grid-section"
      >
        <h2
          className="text-xl font-semibold text-gray-700 mb-8 text-center"
          data-testid="category-grid-heading"
        >
          What can we help you with?
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          data-testid="category-grid"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/chat?category=${encodeURIComponent(cat.id)}`}
              data-testid={`category-card-link-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
              aria-label={`Start chat for ${cat.title}`}
              className="group block"
            >
              <article
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center gap-4 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-300 group-hover:-translate-y-1"
                data-testid={`category-card-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.iconBg} ${cat.iconColor}`}
                  data-testid={`category-icon-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat.icon}
                </div>
                <h3
                  className="text-lg font-semibold text-gray-800"
                  data-testid={`category-title-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat.title}
                </h3>
                <p
                  className="text-sm text-gray-500 leading-relaxed flex-1"
                  data-testid={`category-description-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat.description}
                </p>
                <span
                  className="mt-auto inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full group-hover:bg-blue-700 transition-colors"
                  data-testid={`category-cta-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  Start Chat
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center text-xs text-gray-400 py-6 border-t border-gray-200"
        data-testid="landing-footer"
      >
        Need urgent help?{" "}
        <span className="text-gray-600 font-medium">
          Call IT Helpdesk: Extension 1234
        </span>
      </footer>
    </div>
  );
}
