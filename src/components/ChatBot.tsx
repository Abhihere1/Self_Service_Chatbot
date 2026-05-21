"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  search,
  searchPrioritized,
  getRelatedQuestions,
  getEntriesByCategory,
  getPopularQuestions,
  type KBEntry,
} from "@/lib/searchService";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  isEscalation?: boolean;
  relatedQuestions?: KBEntry[];
  timestamp: Date;
}

const CATEGORIES = ["VDI", "Phone", "Scanner", "General IT"];

const CATEGORY_GREETINGS: Record<string, string> = {
  VDI: "How can I help you with VDI today? I can assist with connection issues, performance, black screens, and more.",
  Phone: "How can I help you with Phone Support today? I can assist with voicemail, call forwarding, audio quality, and softphone setup.",
  Scanner: "How can I help you with Scanner issues today? I can assist with connectivity, driver setup, and document scanning problems.",
  "General IT": "How can I help you with General IT today? I can assist with passwords, software installation, hardware issues, and more.",
};

function getInitialMessages(category?: string): Message[] {
  const content = category && CATEGORY_GREETINGS[category]
    ? CATEGORY_GREETINGS[category]
    : "Hello! I'm your IT Support Assistant. I can help you with VDI, Phone, Scanner, and General IT questions. How can I help you today?";
  return [{ id: "welcome", role: "bot", content, timestamp: new Date() }];
}

const SUGGESTED_PROMPTS = [
  "How do I connect to VDI?",
  "Scanner not working",
  "Forgot my password",
  "How to forward calls?",
  "Computer running slow",
];

const ESCALATION_MESSAGE =
  "I could not find an exact solution. Please contact IT Helpdesk: helpdesk@company.com Extension: 1234";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

interface ChatBotProps {
  initialCategory?: string;
}

export default function ChatBot({ initialCategory }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    getInitialMessages(initialCategory)
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory ?? null
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularQuestions: KBEntry[] = getPopularQuestions(5);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      setRecentSearches((prev) => {
        const updated = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(
          0,
          10
        );
        return updated;
      });

      // Simulate async search delay
      await new Promise((r) => setTimeout(r, 600));

      const result = activeCategory
        ? searchPrioritized(trimmed, activeCategory)
        : search(trimmed);
      let botMsg: Message;

      if (!result || result.confidence === "low") {
        botMsg = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: ESCALATION_MESSAGE,
          isEscalation: true,
          timestamp: new Date(),
        };
      } else {
        const related = getRelatedQuestions(result.item, 3);
        botMsg = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: escapeHtml(result.item.answer),
          relatedQuestions: related,
          timestamp: new Date(),
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    },
    [activeCategory]
  );

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchValue.trim()) {
      handleSend(globalSearchValue);
      setGlobalSearchValue("");
    }
  };

  const categoryEntries =
    activeCategory ? getEntriesByCategory(activeCategory) : [];

  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      data-testid="chatbot-container"
    >
      {/* Header */}
      <header
        className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0"
        data-testid="header"
      >
        <div
          className="flex items-center gap-2"
          data-testid="header-logo-area"
        >
          <div
            className="w-9 h-9 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-blue-900 text-sm"
            data-testid="company-logo"
            aria-label="Company Logo"
          >
            IT
          </div>
          <span className="font-semibold text-sm hidden sm:block">
            Acme Corp
          </span>
        </div>

        <h1
          className="text-lg font-bold tracking-wide"
          data-testid="chatbot-title"
        >
          IT Support Assistant
        </h1>

        <form
          onSubmit={handleGlobalSearch}
          className="flex items-center gap-1"
          data-testid="global-search-form"
          role="search"
          aria-label="Global search"
        >
          <input
            type="search"
            value={globalSearchValue}
            onChange={(e) => setGlobalSearchValue(e.target.value)}
            placeholder="Search knowledge base..."
            className="bg-blue-800 text-white placeholder-blue-300 rounded px-3 py-1.5 text-sm border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-44 sm:w-60"
            data-testid="global-search-input"
            aria-label="Search knowledge base"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm transition-colors"
            data-testid="global-search-btn"
            aria-label="Submit search"
          >
            Search
          </button>
        </form>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto flex-shrink-0 hidden md:flex"
          data-testid="sidebar"
          aria-label="Sidebar navigation"
        >
          {/* Category Navigation */}
          <section
            className="p-4 border-b border-gray-200"
            data-testid="sidebar-categories"
          >
            <h2
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
              data-testid="categories-heading"
            >
              Categories
            </h2>
            <nav
              aria-label="Category navigation"
              data-testid="category-nav"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left px-3 py-2 rounded text-sm mb-1 transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  data-testid={`category-btn-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {activeCategory && categoryEntries.length > 0 && (
              <div
                className="mt-3 space-y-1"
                data-testid="category-entries-list"
              >
                {categoryEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleSend(entry.question)}
                    className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    data-testid={`category-entry-${entry.id}`}
                  >
                    {entry.question}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Popular Issues */}
          <section
            className="p-4 border-b border-gray-200"
            data-testid="sidebar-popular"
          >
            <h2
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
              data-testid="popular-issues-heading"
            >
              Popular Issues
            </h2>
            <ul
              className="space-y-1"
              data-testid="popular-issues-list"
              aria-label="Popular issues"
            >
              {popularQuestions.map((q) => (
                <li key={q.id} data-testid={`popular-issue-${q.id}`}>
                  <button
                    onClick={() => handleSend(q.question)}
                    className="w-full text-left text-xs text-gray-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1.5 rounded transition-colors"
                    data-testid={`popular-issue-btn-${q.id}`}
                  >
                    {q.question}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Searches */}
          <section
            className="p-4"
            data-testid="sidebar-recent-searches"
          >
            <h2
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
              data-testid="recent-searches-heading"
            >
              Recent Searches
            </h2>
            {recentSearches.length === 0 ? (
              <p
                className="text-xs text-gray-400 italic"
                data-testid="no-recent-searches"
              >
                No recent searches
              </p>
            ) : (
              <ul
                className="space-y-1"
                data-testid="recent-searches-list"
                aria-label="Recent searches"
              >
                {recentSearches.map((s, i) => (
                  <li key={i} data-testid={`recent-search-${i}`}>
                    <button
                      onClick={() => handleSend(s)}
                      className="w-full text-left text-xs text-gray-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1.5 rounded transition-colors truncate"
                      data-testid={`recent-search-btn-${i}`}
                      title={s}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        {/* Main Chat Area */}
        <main
          className="flex-1 flex flex-col overflow-hidden"
          data-testid="chat-main"
          aria-label="Chat area"
        >
          {/* Suggested Prompts */}
          <div
            className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0"
            data-testid="suggested-prompts-bar"
            aria-label="Suggested prompts"
          >
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Try:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors"
                data-testid={`suggested-prompt-${i}`}
                aria-label={`Suggested: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Feed */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            data-testid="message-feed"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.role}-${msg.id}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : msg.isEscalation
                        ? "bg-amber-50 border border-amber-300 text-amber-900 rounded-bl-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                  data-testid={`message-bubble-${msg.id}`}
                >
                  {msg.role === "bot" && (
                    <div
                      className="flex items-center gap-1.5 mb-1"
                      data-testid={`bot-label-${msg.id}`}
                    >
                      <div className="w-5 h-5 bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          IT
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        IT Support
                      </span>
                    </div>
                  )}
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line"
                    data-testid={`message-content-${msg.id}`}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                  <span
                    className={`text-xs mt-1 block ${
                      msg.role === "user"
                        ? "text-blue-200"
                        : "text-gray-400"
                    }`}
                    data-testid={`message-timestamp-${msg.id}`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* Related Questions */}
                  {msg.relatedQuestions && msg.relatedQuestions.length > 0 && (
                    <div
                      className="mt-3 pt-3 border-t border-gray-200"
                      data-testid={`related-questions-${msg.id}`}
                    >
                      <p
                        className="text-xs font-semibold text-gray-500 mb-2"
                        data-testid={`related-questions-label-${msg.id}`}
                      >
                        Related Questions:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.relatedQuestions.map((rq) => (
                          <button
                            key={rq.id}
                            onClick={() => handleSend(rq.question)}
                            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-1 hover:bg-blue-100 transition-colors"
                            data-testid={`related-question-btn-${rq.id}`}
                          >
                            {rq.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                className="flex justify-start"
                data-testid="typing-indicator"
                aria-label="Bot is typing"
                role="status"
              >
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div
                    className="flex items-center gap-1"
                    data-testid="typing-dots"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0"
            data-testid="input-area"
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
              data-testid="chat-input-form"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question or describe your IT issue..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                data-testid="chat-input"
                aria-label="Type your message"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0"
                data-testid="send-btn"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
