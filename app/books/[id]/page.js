"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ReactReader } from "react-reader";
import { fetchBookById, feature_extract } from "../../Server/actions";

export default function BookPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [location, setLocation] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const router = useRouter();

  // ref for audio element
  const audioRef = useRef(null);

  // hide global header/footer while this page is mounted
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
      // ensure audio is paused on unmount
      try {
        audioRef.current?.pause();
      } catch (e) {}
    };
  }, [id]);

  // when book loads, start looping music (attempt autoplay)
  useEffect(() => {
    if (!book) return;
    const musicSrc = "/rain.mp3";
    if (audioRef.current && audioRef.current.src !== musicSrc) {
      audioRef.current.src = musicSrc;
      audioRef.current.loop = true;
    }
    if (isMusicPlaying && audioRef.current) {
      // autoplay may be blocked; handle promise
      const p = audioRef.current.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {
          // autoplay blocked; leave audio paused until user toggles
          setIsMusicPlaying(false);
        });
      }
    } else {
      try {
        audioRef.current?.pause();
      } catch (e) {}
    }
  }, [book, isMusicPlaying]);

  function hideGlobalLayout(hide) {
    if (hide) {
      document.body.classList.add("hide-global-layout");
    } else {
      document.body.classList.remove("hide-global-layout");
    }
  }

  if (!book) {
    return (
      <div style={{ marginLeft: "12%", padding: "2rem", color: "#900" }}>
        Book not found
      </div>
    );
  }

  const epubUrl =
    book.file_format && String(book.file_format).toLowerCase() === "epub"
      ? book.path
      : "";

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

        <h1 style={titleStyle}>{book.title}</h1>

        {/* Music toggle control */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              const next = !isMusicPlaying;
              setIsMusicPlaying(next);
              try {
                if (next) audioRef.current?.play();
                else audioRef.current?.pause();
              } catch (e) {}
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

      {/* hidden/simple audio element; source set when book loads. Loops by attribute and controlled via ref. */}
      <audio ref={audioRef} loop style={{ display: "none" }} />

      {epubUrl ? (
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
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
     