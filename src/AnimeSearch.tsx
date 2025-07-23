// src/AnimeSearch.tsx
import React, { useState } from "react";

type AniListAnime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
};

const query = `
  query ($search: String) {
    Page(perPage: 10) {
      media(search: $search, type: ANIME) {
        id
        title { romaji }
        coverImage { large }
        episodes
        studios(isMain: true) {
          nodes { name }
        }
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
          className="anime-search-input"
          style={{
            background: "inherit",
            color: "#ffffffff",
            border: "#b3b7c5 1px solid",
            borderRadius: 8,
            padding: "0.7rem 1.1rem",
            fontSize: 18,
            width: 260,
            marginRight: 12,
            outline: "none",
          }}
          placeholder="Search your anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
