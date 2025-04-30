import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBooks, setLoading, setError } from "../redux/booksSlice";
import { RootState } from "../redux/store";
import axios from "axios";

const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get("/api/books");
        console.log("Fetched books:", response.data);  // Log the data to verify its structure
        if (Array.isArray(response.data)) {
          dispatch(setBooks(response.data));  // Only dispatch if it's an array
        } else {
          dispatch(setError("Books data is not an array"));
        }
      } catch (err) {
        console.error(err);
        dispatch(setError("Failed to fetch books"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchBooks();
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Safe check to ensure books is an array before calling map
  if (!Array.isArray(books)) {
    return <p>Error: Books data is not available.</p>;
  }

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
