export async function feature_extract(data) {
	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/Qwen/Qwen3-Embedding-0.6B/pipeline/feature-extraction",
		{
			headers: {
				Authorization: `Bearer ${process.env.HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

feature_extract({ inputs: "Today is a sunny day and I will get some ice cream." }).then((response) => {
    console.log(JSON.stringify(response));
});



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
