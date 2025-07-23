// src/AnimeSearch.tsx
import React, { useState } from "react";

type AniListAnime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
};

const query = `
  query ($search: String) {
    Page(perPage: 5) {
      media(search: $search, type: ANIME) {
        id
        title { romaji }
        coverImage { large }
      }
    }
  }
`;

export default function AnimeSearch({
  onSelect,
}: {
  onSelect: (anime: AniListAnime) => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<AniListAnime[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search } }),
    });
    const json = await res.json();
    setResults(json.data.Page.media);
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anime..."
          required
        />
        <button type="submit">Search</button>
      </form>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {results.map((anime) => (
          <div
            key={anime.id}
            onClick={() => onSelect(anime)}
            style={{ cursor: "pointer", width: 120, textAlign: "center" }}
            title="Click to add"
          >
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <div style={{ fontSize: 14 }}>{anime.title.romaji}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
