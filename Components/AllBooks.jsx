import { books } from "@/constants/mockData"
import React from "react"
import BookCard from "./BookCard"

export default function AllBooks() {
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