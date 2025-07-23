import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase"; // update the path if needed

type AniListAnime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
  tags: { name: string }[];
  episodes?: number;
  studios?: { nodes: { name: string }[] };
};

export default function AnimeDetail() {
  const { state } = useLocation() as { state: { anime: AniListAnime } };
  const { anime } = state || {};
  const navigate = useNavigate();

  const [personalRating, setPersonalRating] = useState("");
  const [personalReview, setPersonalReview] = useState("");
  const [status, setStatus] = useState("completed");

  if (!anime) return <div>Anime not found.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally validate input here (e.g., require rating)
    await addDoc(collection(db, "animeLogs"), {
      aniListId: anime.id,
      title: anime.title.romaji,
      imageUrl: anime.coverImage.large,
      episodes: anime.episodes ?? null,
      studio: anime.studios?.nodes[0]?.name ?? null,
      status: status,
      rating: personalRating,
      review: personalReview,
      createdAt: new Date(),
    });
    // Optionally show a success message or redirect!
    navigate("/");
    setPersonalRating("");
    setPersonalReview("");
  };

  return (
    <div className="anime-detail-wrapper">
      <img
        className="anime-detail-cover"
        src={anime.coverImage.large}
        alt={anime.title.romaji}
      />

      <form className="anime-detail-info" onSubmit={handleSubmit}>
        <div className="anime-detail-info">
          <div className="anime-detail-title">{anime.title.romaji}</div>

          <div style={{ marginTop: "1rem" }}>
            <span className="anime-detail-label">Episodes:</span>{" "}
            {anime.episodes ?? "N/A"}
          </div>
          <div style={{ marginTop: "1rem" }}>
            <span className="anime-detail-label">Studio:</span>{" "}
            {anime.studios?.nodes[0]?.name ?? "Unknown"}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <span className="anime-detail-label">Your Rating:</span>
            <input
              className="anime-rating-input"
              type="number"
              min={1}
              max={10}
              value={personalRating}
              onChange={(e) => setPersonalRating(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <span className="anime-detail-label">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                marginLeft: "0.8rem",
                fontSize: "1.08rem",
                borderRadius: 6,
                padding: "2px 9px",
                border: "none",
              }}
            >
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="plan">Plan to Watch</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <span className="anime-detail-label">Your Review:</span>
            <textarea
              className="anime-review-box"
              value={personalReview}
              onChange={(e) => setPersonalReview(e.target.value)}
              rows={5}
              placeholder="Write your thoughts here..."
            />
          </div>
        </div>
        <button
          type="submit"
          style={{
            marginTop: "1.4rem",
            background: "#6c63ff",
            color: "white",
            padding: "0.6rem 1.4rem",
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            fontSize: 17,
            cursor: "pointer",
            width: "10%",
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
}
