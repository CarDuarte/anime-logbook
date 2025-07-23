import React, { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "./firebase";
import AnimeSearch from "./AnimeSearch";
import "./index.css";
import { useNavigate } from "react-router-dom";

type AnimeStatus = "watching" | "completed" | "plan" | "dropped";

type AniListAnime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
  episodes?: number;
  studios?: { nodes: { name: string }[] };
};

function HomePage() {
  const navigate = useNavigate();
  const animeLogsRef = collection(db, "animeLogs");
  const [logsSnapshot, loading, error] = useCollection(animeLogsRef);

  // Form state
  const [selectedAnime, setSelectedAnime] = useState<AniListAnime | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <header>
        <h1>Logbook</h1>
      </header>
      <div className="container">
        <AnimeSearch
          onSelect={(anime) => {
            // Instead of just setting state:
            navigate(`/anime/${anime.id}`, { state: { anime } });
          }}
        />

        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}

        <div className="anime-grid">
          {logsSnapshot?.docs
            .filter((docSnap) => {
              const data = docSnap.data();
              return data.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            })
            .map((docSnap) => {
              const data = docSnap.data();
              return (
                <div className="anime-card" key={docSnap.id}>
                  <button
                    className="anime-delete"
                    title="Delete"
                    onClick={async () => {
                      await deleteDoc(doc(db, "animeLogs", docSnap.id));
                    }}
                  >
                    🗑️
                  </button>
                  {data.imageUrl && (
                    <img
                      className="anime-cover"
                      src={data.imageUrl}
                      alt={data.title}
                    />
                  )}
                  <div className="anime-title">{data.title}</div>
                  <div className="anime-meta">
                    Status: <b>{data.status}</b>
                    <br />
                    Rating: <b>{data.rating}</b>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {selectedAnime && (
        <div style={{ margin: "1rem 0" }}>
          <img
            src={selectedAnime.coverImage.large}
            alt={selectedAnime.title.romaji}
            style={{ width: 100, borderRadius: 8 }}
          />
          <div>
            <strong>{selectedAnime.title.romaji}</strong>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
