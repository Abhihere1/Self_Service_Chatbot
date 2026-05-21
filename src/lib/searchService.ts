import Fuse from "fuse.js";
import vdiData from "@/data/vdi.json";
import phoneData from "@/data/phone.json";
import scannerData from "@/data/scanner.json";
import generalData from "@/data/general.json";

export interface KBEntry {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
  tags: string[];
  priority: number;
}

export interface SearchResult {
  item: KBEntry;
  score: number;
  confidence: "high" | "low";
  matchType: "exact" | "keyword" | "tag" | "fuzzy";
}

const allEntries: KBEntry[] = [
  ...(vdiData as KBEntry[]),
  ...(phoneData as KBEntry[]),
  ...(scannerData as KBEntry[]),
  ...(generalData as KBEntry[]),
];

const fuse = new Fuse(allEntries, {
  includeScore: true,
  threshold: 0.3,
  keys: ["question", "keywords", "tags"],
});

function normalizeScore(fuseScore: number): number {
  // Fuse score: 0 = perfect, 1 = no match. Convert to 0-1 confidence (1 = best)
  return 1 - fuseScore;
}

function determineMatchType(
  query: string,
  item: KBEntry
): "exact" | "keyword" | "tag" | "fuzzy" {
  const q = query.toLowerCase();
  if (item.question.toLowerCase().includes(q)) return "exact";
  if (item.keywords.some((k) => k.toLowerCase().includes(q))) return "keyword";
  if (item.tags.some((t) => t.toLowerCase().includes(q))) return "tag";
  return "fuzzy";
}

export function search(query: string): SearchResult | null {
  if (!query.trim()) return null;

  const results = fuse.search(query);
  if (results.length === 0) return null;

  // Sort by: exact > keyword > tag > fuzzy, then by fuse score
  const ranked = results.map((r) => ({
    item: r.item,
    fuseScore: r.score ?? 1,
    matchType: determineMatchType(query, r.item),
  }));

  const matchOrder: Record<string, number> = {
    exact: 0,
    keyword: 1,
    tag: 2,
    fuzzy: 3,
  };

  ranked.sort((a, b) => {
    const typeOrder = matchOrder[a.matchType] - matchOrder[b.matchType];
    if (typeOrder !== 0) return typeOrder;
    return a.fuseScore - b.fuseScore;
  });

  const best = ranked[0];
  const confidence = normalizeScore(best.fuseScore);

  return {
    item: best.item,
    score: confidence,
    confidence: confidence >= 0.5 ? "high" : "low",
    matchType: best.matchType,
  };
}

export function getRelatedQuestions(
  entry: KBEntry,
  limit = 3
): KBEntry[] {
  return allEntries
    .filter((e) => {
      if (e.id === entry.id) return false;
      const sameCategory = e.category === entry.category;
      const sharedTag = e.tags.some((t) => entry.tags.includes(t));
      return sameCategory || sharedTag;
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}

export function getEntriesByCategory(category: string): KBEntry[] {
  return allEntries.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPopularQuestions(limit = 5): KBEntry[] {
  return [...allEntries].sort((a, b) => a.priority - b.priority).slice(0, limit);
}

export function getAllEntries(): KBEntry[] {
  return allEntries;
}
