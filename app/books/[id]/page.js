"use client";

import { books } from "@/constants/mockData";
import { useParams } from "next/navigation";

export default function BookPage() {
  const {id} = useParams();
  const selected = books.find((book) => id === String(book.id));
  
  console.log(selected);
  return (
    <div>
      {JSON.stringify(selected)}
    </div>
  );
}
