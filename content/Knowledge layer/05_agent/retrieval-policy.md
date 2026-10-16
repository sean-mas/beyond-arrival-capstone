# RAG Retrieval Policy

## Query Parsing
When a user asks for an activity or training module, the system should parse for:
- `target_domain`: (Cognitive, Affective, Behavioral, Communicative)
- `modality`: (Digital, Hybrid, In-person)
- `risk_level`: (Low, Medium, High)

## Grounding Rules
1. **Source Hierarchy:** 
   - Primary: Knowledge layer `.yaml` activity cards and `.md` framework summaries.
   - Secondary: General LLM knowledge (must be explicitly flagged if used).
2. **Copyright Protection:** Do not attempt to reconstruct or quote extensively from copyrighted source texts outside of this knowledge base. Rely strictly on the abstracted cards and synthetic frameworks provided in this directory.
3. **Hallucination Prevention:** If an activity matching the exact constraints (e.g., "5 minute VR activity for 500 people") does not exist in the knowledge layer, state the limitation and offer the closest pedagogical match.
