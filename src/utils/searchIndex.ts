export interface IndexableItem {
  id: string;
  [key: string]: any;
}

export class KeywordSearchIndex<T extends IndexableItem> {
  // Map of lowercase keyword token -> Set of item IDs
  private index: Map<string, Set<string>> = new Map();
  // Map of item ID -> original item
  private itemsMap: Map<string, T> = new Map();
  private fieldsToIndex: (keyof T)[] = [];

  constructor(items: T[], fieldsToIndex: (keyof T)[]) {
    this.fieldsToIndex = fieldsToIndex;
    this.buildIndex(items);
  }

  private tokenize(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove punctuation
      .split(/\s+/)
      .filter(token => token.length > 1); // skip empty or single character tokens
  }

  public buildIndex(items: T[]) {
    this.index.clear();
    this.itemsMap.clear();

    for (const item of items) {
      this.itemsMap.set(item.id, item);
      
      const tokens = new Set<string>();
      for (const field of this.fieldsToIndex) {
        const val = item[field];
        if (typeof val === 'string') {
          this.tokenize(val).forEach(t => tokens.add(t));
        } else if (Array.isArray(val)) {
          val.forEach(v => {
            if (typeof v === 'string') {
              this.tokenize(v).forEach(t => tokens.add(t));
            }
          });
        }
      }

      for (const token of tokens) {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token)!.add(item.id);
      }
    }
  }

  public search(query: string, allItems: T[]): T[] {
    const searchTokens = this.tokenize(query);
    if (searchTokens.length === 0) {
      return allItems;
    }

    // Rank matching items based on how many query tokens match indexed tokens
    const scores: Map<string, number> = new Map();

    for (const token of searchTokens) {
      this.index.forEach((idSet, indexToken) => {
        // If query token matches or is part of the index token
        if (indexToken.includes(token) || token.includes(indexToken)) {
          for (const id of idSet) {
            // Give higher weight if it's an exact match
            const weight = indexToken === token ? 2 : 1;
            scores.set(id, (scores.get(id) || 0) + weight);
          }
        }
      });
    }

    // Filter allItems to preserve only those matching our search (and preserve their Firestore sync'd order or score-based order)
    const matchingIds = new Set(scores.keys());
    
    return allItems
      .filter(item => matchingIds.has(item.id))
      .sort((a, b) => {
        const scoreA = scores.get(a.id) || 0;
        const scoreB = scores.get(b.id) || 0;
        return scoreB - scoreA; // sort descending by score/relevance
      });
  }
}
