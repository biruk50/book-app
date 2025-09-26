"use client"
import { useState, useEffect } from "react"
import React from "react"
import BookCard from "./BookCard"
import axios from "axios"

export default function AllBooks() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get("http://localhost/websites/index.php")
      setBooks(response.data)
    }
    fetchBooks()
  }, [])

  return (
    <div className="AllBooks">
      <h1 style={{ fontSize: "2rem"}}>All Books</h1>
      <ul style={ulstyle}>
        {books.map((book,index) => (
          <li key={index}>
              <a href={`/books/${book.id}`}>
              <BookCard book={book}/>
            </a>

          </li>
        ))}
      </ul>
    </div>
  )
}

const ulstyle= {
  paddingTop: '20px',
  listStyleType: 'none',
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
}