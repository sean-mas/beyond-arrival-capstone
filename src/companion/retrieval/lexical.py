"""TF-IDF retrieval. The control, not the product.

This exists to answer one question before a week is spent on embeddings: **does
semantic search earn its cost on this corpus?** It matches words, so it will
fail exactly where the corpus lives. `c004` describes loneliness through the image
of a caged bird, and the card it must reach is about loneliness; they share no words.
`docs/primer.md` makes the same point in the other direction: "Two chunks about
loneliness end up with similar numbers even if they share no words. This is
what makes search work on meaning rather than on keywords."

If the two recall@k curves overlap, that is a finding worth having in week 1
rather than week 4. If they do not, the gap is the argument for the embedding
model, measured rather than assumed.

It is also free: no model, no download, no database, no network.
"""

from __future__ import annotations

import numpy as np

from companion.retrieval.chunking import Chunk
from companion.retrieval.types import Hit


class TfidfRetriever:
    """Character n-grams, not words.

    German compounds are why. A query saying "Anmeldung" should reach a chunk
    saying "Anmeldebestätigung", and word-level TF-IDF treats those as
    unrelated tokens. Character n-grams share the stem. This also gives the
    lexical baseline a fair run rather than a strawman one, which matters
    because the comparison is the whole point of building it.
    """

    name = "tfidf"

    def __init__(self, chunks: list[Chunk], tenant_id: str = "global"):
        if not chunks:
            raise ValueError("no chunks: refusing to build an empty retriever")
        # Imported here, not at the top: this is the evals' control, never the
        # app's retriever, and scikit-learn is an `eval` extra. The Render
        # image installs only what the app runs. 25.09.2026.
        from sklearn.feature_extraction.text import TfidfVectorizer

        self._chunks = chunks
        self._tenant_id = tenant_id
        self._vectorizer = TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3, 5),
            sublinear_tf=True,
            min_df=1,
        )
        self._matrix = self._vectorizer.fit_transform(c.text for c in chunks)

    def search(self, query: str, tenant_id: str = "global", k: int = 5) -> list[Hit]:
        if tenant_id != self._tenant_id:
            # The lexical baseline is single-tenant by construction. Returning
            # nothing is the honest answer; silently ignoring the filter would
            # make the isolation test pass for the wrong reason.
            return []
        vector = self._vectorizer.transform([query])
        scores = (self._matrix @ vector.T).toarray().ravel()
        top = np.argsort(-scores)[:k]
        return [
            Hit(chunk=self._chunks[i], score=float(scores[i]), tenant_id=tenant_id)
            for i in top
            if scores[i] > 0
        ]

    def score_all(self, query: str) -> np.ndarray:
        """Every score, for the similarity-distribution plot."""
        return (self._matrix @ self._vectorizer.transform([query]).T).toarray().ravel()
