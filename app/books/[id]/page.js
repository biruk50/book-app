"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ReactReader } from "react-reader";
import { fetchBookById, feature_extract } from "../../Server/actions";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const audioRef = useRef(null);

  const [book, setBook] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [musicSrc, setMusicSrc] = useState("/rain.mp3");
  const [rendition, setRendition] = useState(null);

  const storageKey = `persist-location-${id}`;
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(location));
    } catch {}
  }, [location, storageKey]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const data = await fetchBookById(id);
      if (mounted && data) setBook(data);
    })();

    hideGlobalLayout(true);
    return () => {
      mounted = false;
      hideGlobalLayout(false);
      try {
        audioRef.current?.pause();
      } catch {}
    };
  }, [id]);

  useEffect(() => {
    if (!book) return;
    if (audioRef.current && audioRef.current.src !== musicSrc) {
      audioRef.current.src = musicSrc;
      audioRef.current.loop = true;
    }
    if (isMusicPlaying && audioRef.current) {
      const p = audioRef.current.play();
      if (p && typeof p.then === "function") {
        p.catch(() => setIsMusicPlaying(false));
      }
    } else {
      try {
        audioRef.current?.pause();
      } catch {}
    }
  }, [book, musicSrc, isMusicPlaying]);

  function hideGlobalLayout(hide) {
    if (hide) document.body.classList.add("hide-global-layout");
    else document.body.classList.remove("hide-global-layout");
  }

  async function handleChapterChange() {
    if (!rendition) return;
    const loc = rendition.currentLocation();
    const chapterId = loc?.start?.href || loc?.start?.cfi || "unknown";

    const cacheKey = `book-chapter-cache-${id}-${chapterId}`;
    if (localStorage.getItem(cacheKey)) return; // Local cache hit

    const contents = rendition.getContents();
    let textContent = "";
    for (const c of contents) {
      try {
        textContent += c.document.body.innerText + "\n";
      } catch {}
    }
    if (!textContent.trim()) return;

    try {
      
      const res = await fetch(`http://localhost/websites/book_chapter.php?book_id=${id}&chapter_id=${encodeURIComponent(chapterId)}`);
      const exists = await res.json();
      if (exists?.found) {
        localStorage.setItem(cacheKey, "true"); // Cache it
        return;
      }

      // Run feature extraction and store backend
      const result = await feature_extract(id, textContent);
      if (result?.music_url) setMusicSrc(result.music_url);

      await fetch(`http://localhost/websites/book_chapter.php?book_id=${id}&chapter_id=${encodeURIComponent(chapterId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ text: textContent }),
      });

      localStorage.setItem(cacheKey, "true");
    } catch (e) {
      console.error("Chapter processing failed:", e);
    }
  }

  const epubUrl =
    book?.file_format?.toLowerCase() === "epub" ? book.path : "";

  return (
    <div style={{ height: "100vh" }}>
      <div style={headerStyle}>
        <button
          className="book-page-back-button"
          style={buttonStyle}
          onClick={() => router.push("/")}
        >
          <i className="fa fa-arrow-left" style={{ fontSize: "1rem" }}></i>
        </button>

        <h1 style={titleStyle}>{book?.title}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              const next = !isMusicPlaying;
              setIsMusicPlaying(next);
              try {
                if (next) audioRef.current?.play();
                else audioRef.current?.pause();
              } catch {}
            }}
            aria-pressed={isMusicPlaying}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: 6,
              cursor: "pointer",
            }}
            title={isMusicPlaying ? "Pause music" : "Play music"}
          >
            <i
              className={`fa ${isMusicPlaying ? "fa-pause" : "fa-play"}`}
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>

      <audio ref={audioRef} loop style={{ display: "none" }} />
      
      {epubUrl ? (
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={(loc) => {
            setLocation(loc);
            handleChapterChange();
          }}
          getRendition={(rend) => {
            setRendition(rend);
            rend.on("relocated", handleChapterChange);
          }}
        />
      ) : (
        <div style={{ padding: "2rem", marginLeft: "12%" }}>
          This book is not an EPUB or no file path is available.
        </div>
      )}
    </div>
  );
}

const headerStyle = {
  display: "flex",
  backgroundColor: "#e6e4e4ff",
  padding: "0.5rem 2rem",
};
const buttonStyle = {
  width: "40px",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
};
const titleStyle = {
  fontSize: "1.2rem",
  marginBottom: "0.5rem",
  fontWeight: "bold",
  textAlign: "center",
  flex: 1,
};
