export async function feature_extract(text) {
  const prompt = `
Summarize the following text focusing ONLY on:
- Weather or environmental conditions
- Surrounding environment (e.g., beach, city, forest, etc.)
- Whether it feels crowded or empty
- The general emotional or atmospheric mood.

Text: ${text} `;

  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/Falconsai/text_summarization",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result.generated_text || result[0]?.generated_text || JSON.stringify(result);
}



export async function fetchBookById(bookId) {
  if (!bookId) return null;
  const storageKey = `book_${bookId}`;

  // try cached copy first
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore localStorage errors and continue to fetch
  }

  // fetch from backend
  try {
    const response = await fetch(
      `http://localhost/websites/getBookById.php?id=${bookId}`
    );
    if (!response.ok) throw new Error("Network response not ok");
    const data = await response.json();
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      // ignore storage write errors
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch book:", err);
    // fallback to any cached data if fetch failed
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return null;
  }
}
