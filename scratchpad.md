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
- [ ] PDF upload
- [ ] Convert to markdown (Marker)
- [ ] Chunk markdown (langchain.js markdown text splitter)
- [ ] Generate embeddings (Qwen)
- [ ] Store in Qdrant
- [ ] Document retrieval/search (Qwen)
- [ ] Ask AI (generation LLM - TBD which one)
- [ ] Citations with exact quotes + source reference
- [ ] Web app UI

### Deferred
- [ ] Metadata extraction (title, authors, date)
- [ ] Original PDF storage for download/reference
- [ ] Deduplication (same paper uploaded twice)
- [ ] Processing status feedback to user
- [ ] Error handling for weird/scanned PDFs

---

## Decisions

| Item | Decision |
|------|----------|
| Chunking | langchain.js markdown text splitter |
| Embeddings | Qwen |
| Vector store | Qdrant |
| PDF conversion | Marker |
| Citations | IN - exact quotes + page/section |
| Metadata extraction | DEFERRED |
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
- TBD: Claude API? OpenAI? Local?
- Consider cost vs quality tradeoff
- For MVP: whichever is easiest to integrate

---

## Open Questions

- [ ] Which LLM for generation?
- [ ] How to handle scanned/image-only PDFs?
- [ ] Max file size limits?
- [ ] Rate limiting for API costs?
