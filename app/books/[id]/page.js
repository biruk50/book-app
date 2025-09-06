"use client";

import { books } from "@/constants/mockData";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ReactReader } from "react-reader";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const selected = books.find((book) => id === String(book.id));

  // hide global header/footer while this page is mounted
  useEffect(() => {
    document.body.classList.add("hide-global-layout");
    return () => {
      document.body.classList.remove("hide-global-layout");
    };
  }, []);

  if (!selected) {
    return (
      <div style={{ marginLeft: "12%", padding: "2rem", color: "#900" }}>
        Book not found
      </div>
    );
  }

  const [location, setLocation] = useState(null);
  return (
    <div style={{ height: "100vh" }}>
      <div style={headerStyle}>
        <button className="book-page-back-button" style={buttonStyle}
          onClick={() => router.push("/")}
        >
          <i className="fa fa-arrow-left" style={{ fontSize: "1rem" }}></i>
        </button>

        <h1 style={titleStyle}>
          {selected.title}
        </h1>
      </div>

      <ReactReader
        url={"https://react-reader.metabits.no/files/alice.epub"}
        location={location}
        locationChanged={(epubcfi) => setLocation(epubcfi)}
      />
    </div>
  );
}

const headerStyle = {
          display: "flex",
          backgroundColor: "#e6e4e4ff",
          padding: "0.5rem 2rem",
  }
const buttonStyle  = {
          width: "40px",
          border: "none",
          borderRadius: "7px",
          cursor: "pointer",
      
}

const titleStyle = {
          fontSize: "1.2rem",
          marginBottom: "0.5rem",
          fontWeight: "bold",
          textAlign: "center",
          flex: 1,
}
