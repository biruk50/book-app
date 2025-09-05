"use client";

import { books } from "@/constants/mockData";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ReactReader } from "react-reader";

export default function BookPage() {
  const { id } = useParams();
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
      <h1 style={{ textAlign: "center" }}>{selected.title}</h1>
      <ReactReader
        url={"https://react-reader.metabits.no/files/alice.epub"}
        location={location}
        locationChanged={(epubcfi) => setLocation(epubcfi)}
      />
    </div>
  );
}
