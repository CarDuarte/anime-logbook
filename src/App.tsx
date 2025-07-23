import React, { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "./firebase";
import AnimeSearch from "./AnimeSearch";
import "./index.css";

type AnimeStatus = "watching" | "completed" | "plan" | "dropped";

type AniListAnime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
};

function App() {
  const animeLogsRef = collection(db, "animeLogs");
  const [logsSnapshot, loading, error] = useCollection(animeLogsRef);

  // Form state
  const [selectedAnime, setSelectedAnime] = useState<AniListAnime | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<AnimeStatus>("completed");
  const [rating, setRating] = useState<number>(10);
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addDoc(animeLogsRef, {
      title,
      status,
      rating,
      notes,
      imageUrl: selectedAnime?.coverImage.large ?? "",
    });
    setTitle("");
    setStatus("completed");
    setRating(10);
    setNotes("");
  };

  return (
    <>
      <header>
        <h1>Anime Logbook</h1>
      </header>
      <div className="container">
        <AnimeSearch
          onSelect={(anime) => {
            setSelectedAnime(anime);
            setTitle(anime.title.romaji);
            // Optionally, pre-fill other fields here
          }}
        />
        <form onSubmit={handleAddAnime} style={{ marginBottom: "2rem" }}>
          <h2>Add Anime</h2>
          <label>
            Title: <br />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <br />
          <br />
          <label>
            Status: <br />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AnimeStatus)}
            >
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="plan">Plan to Watch</option>
              <option value="dropped">Dropped</option>
            </select>
          </label>
          <br />
          <br />
          <label>
            Rating: <br />
            <input
              type="number"
              value={rating}
              min={1}
              max={10}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </label>
          <br />
          <br />
          <label>
            Notes: <br />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <br />
          <br />
          <button type="submit">Add Anime</button>
        </form>

        <h2>Your Anime Logs</h2>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        <div style={{ marginBottom: "2rem" }}>
          <input
            style={{
              background: "#202331",
              color: "#f3f4f6",
              border: "none",
              borderRadius: 8,
              padding: "0.7rem 1.1rem",
              fontSize: 18,
              width: 260,
              marginRight: 12,
            }}
            placeholder="Search your anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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

export default App;
