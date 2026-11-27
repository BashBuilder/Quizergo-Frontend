# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

## Graphify Knowledge Graph

This repository has a **knowledge graph** generated via graphify for code exploration. Use `/graphify` to navigate the codebase.

### Available Commands

| Command                        | Purpose                                                        |
| ------------------------------ | -------------------------------------------------------------- |
| `/graphify .`                  | Full graph build/refresh from current directory                |
| `/graphify query "<question>"` | Ask questions about the codebase (e.g., "how does auth work?") |
| `/graphify path "A" "B"`       | Find shortest path between two concepts                        |
| `/graphify explain "X"`        | Get plain-language explanation of a node                       |

### Graph Outputs

- `graphify-out/graph.html` - Interactive visualization
- `graphify-out/graph.json` - Raw graph data
- `graphify-out/GRAPH_REPORT.md` - Full analysis report
- `graphify-out/obsidian/` - Obsidian vault for note-taking

### Key Graph Insights

**Key insight:** `cn()` is a cross-cutting dependency connecting 7+ communities - use graphify to trace its usage.
**God Nodes (most connected):**

- `cn()` (68 edges) - className utility, central coupling point
- `lucide-react` (30 edges) - icon library
- `react`, `next` (27 edges each) - core framework
- `useAuth()` (17 edges) - auth hook
- `Header()` (11 edges) - site header

**Architecture Finding:** `cn()` connects 7+ communities, making it a cross-cutting dependency.

Graph outputs: `graphify-out/graph.html`, `graphify-out/graph.json`, `graphify-out/obsidian/`

End
