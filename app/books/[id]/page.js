"use client";

import { useParams, useRouter} from "next/navigation";
import React, { useState, useEffect} from "react";
import { ReactReader } from "react-reader";


export default function BookPage() {
  const { id } = useParams();

 const[book,setBook]= useState(null);
 const [location, setLocation] = useState(null);
 const router = useRouter();


  // hide global header/footer while this page is mounted
  useEffect(() => {
    fetchBookById(id);
    hideGlobalLayout(true);
    return () => hideGlobalLayout(false);

  }, []);

  async function fetchBookById(bookId) {
    const response = await fetch(`http://localhost/websites/getBookById.php?id=${bookId}`);
    const data = await response.json();
    setBook(data);
  }

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
      </div>

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
