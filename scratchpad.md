# Paper - Scratchpad

Personal RAG system for academic papers.

---

## Pipeline

```
PDF upload → Marker (md) → Chunk → Qwen (embed) → Qdrant → Qwen (search) → LLM → Web UI
```

---

## TODO

### MVP
- [x] PDF upload (`pdf.ts`)
- [x] Convert to markdown (Marker) (`pdf.ts`)
- [x] Chunk markdown (langchain.js markdown text splitter) (`chunk.ts` - 1000 chars, 200 overlap)
- [x] Generate embeddings (Qwen) (`embed.ts` - qwen3-embedding-8b)
- [x] Store in Qdrant (`store.ts`)
- [x] Document retrieval/search (`store.ts`)
- [x] Ask AI (`generate.ts` - Claude 4.5 Haiku via Replicate)
- [ ] Citations with exact quotes + source reference (currently just chunk index)
- [ ] Web app UI

### Deferred
- [ ] Metadata extraction (title, authors, date)
- [ ] Original PDF storage for download/reference
- [x] Deduplication (`store.ts:35` - UUID v5 hash of content)
- [ ] Processing status feedback to user
- [ ] Error handling for weird/scanned PDFs

---

## Decisions

| Item | Decision |
|------|----------|
| Chunking | langchain.js markdown text splitter (1000/200) |
| Embeddings | Qwen3-embedding-8b via Replicate |
| Vector store | Qdrant (localhost:6333) |
| PDF conversion | Marker via Replicate |
| Generation LLM | Claude 4.5 Haiku via Replicate |
| Citations | IN - exact quotes + page/section (WIP - currently chunk index only) |
| Metadata extraction | DEFERRED |
| Deduplication | DONE - UUID v5 hash |
| Multi-doc querying | IN |
| Vertical positioning | IN (same tech, different marketing) |
| Additional value-adds | LATER |

---

## Notes

### Chunking
- Critical for RAG quality
- langchain.js markdown text splitter respects document structure
- Consider: heading-based splits vs fixed size with overlap

### Metadata Extraction (for later)
Marker returns structural metadata (TOC, page stats) but NOT bibliographic (title, authors).

**Fields to extract:**
| Field | Source | Notes |
|-------|--------|-------|
| `title` | First H1 heading | Usually reliable |
| `authors` | "By..." line | Format varies, return as array |
| `year` | Header/footer/refs | Often missing, null if not found |
| `summary` | First paragraph | Useful for display even without formal abstract |

**Extraction approach options:**
1. **Parse first page** - Simple but unreliable
2. **LLM extraction** - Send first ~500 chars, ask for title/authors/year as JSON. Cheap, accurate.
3. **GROBID** - Purpose-built for academic papers, free, but extra service
4. **User provides** - Zero effort, but friction
5. **Filename parsing** - Trivial fallback

**Recommended:** LLM extraction on first ~500 chars post-conversion.

**Model:** `meta/llama-3.2-3b-instruct` on Replicate
- ~$0.02/M tokens
- ~50,000+ extractions per £1
- Bump to 8B if JSON output is flaky

**Prompt template:**
```
Extract from this paper:
- title
- authors (array)
- year (null if not found)
- summary (first substantive paragraph, 1-2 sentences)

Return JSON only.

Text:
{first 500 chars of markdown}
```

**Example output:**
```json
{
  "title": "HAS SaaS LOST GO-TO-MARKET FIT? AND WHAT TO DO ABOUT IT",
  "authors": ["Jacco van der Kooij", "Dave Boyce"],
  "year": null,
  "summary": "The SaaS industry is grappling with a significant decline in key performance metrics. Since late 2021, growth rates have halved, the cost of acquiring new customers has surged by 1.5 times, and Net Revenue Retention (NRR) has seen a substantial decrease."
}
```

### Citation Tracking
- Store source doc ID + section/page with each chunk
- Retrieval returns chunk + source info
- Display to user: "According to [Paper Title, p.12]: ..."

### Generation LLM
- **Decided:** Claude 4.5 Haiku via Replicate
- Model: `anthropic/claude-4.5-haiku`
- Prompt includes context chunks with index numbers for citation

---

## Open Questions

- [x] Which LLM for generation? → Claude 4.5 Haiku
- [ ] How to handle scanned/image-only PDFs?
- [ ] Max file size limits?
- [ ] Rate limiting for API costs?
