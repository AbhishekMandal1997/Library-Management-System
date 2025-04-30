import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "../redux/booksSlice";
import axios, { AxiosError } from "axios";

interface BookFormData {
  title: string;
  author: string;
  ISBN: string;
  publishedDate: string;
  genre: string;
  copiesAvailable: number;
}

interface ServerError {
  message: string;
  errors?: { field: string; message: string }[];
}

const AddBookForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    ISBN: "",
    publishedDate: "",
    genre: "",
    copiesAvailable: 0,
  });
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "copiesAvailable" ? parseInt(value) || 0 : value
    }));
    // Clear error for the field being changed
    setErrors(errors.filter(error => error.field !== name));
  };

  const validateForm = (): boolean => {
    const newErrors: { field: string; message: string }[] = [];

    // Validate ISBN format (10 or 13 digits)
    if (!/^(?:\d{9}[\dXx]|\d{13})$/.test(formData.ISBN.replace(/[-\s]/g, ""))) {
      newErrors.push({ field: "ISBN", message: "ISBN must be valid (ISBN-10 or ISBN-13)." });
    }

    // Validate published date
    const today = new Date().toISOString().split("T")[0];
    if (formData.publishedDate > today) {
      newErrors.push({ field: "publishedDate", message: "Published Date cannot be in the future." });
    }

    // Validate copies available for academic books
    if (formData.genre === "Academic" && formData.copiesAvailable < 5) {
      newErrors.push({ field: "copiesAvailable", message: "Academic books must have at least 5 copies available." });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/books", formData);
      dispatch(setBooks(response.data));
      // Clear form and errors on success
      setFormData({
        title: "",
        author: "",
        ISBN: "",
        publishedDate: "",
        genre: "",
        copiesAvailable: 0,
      });
      setErrors([]);
    } catch (error) {
      console.error("Error adding book:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ServerError>;

        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const serverError = axiosError.response.data;

          if (serverError.errors) {
            // Server returned field-specific errors
            setErrors(serverError.errors);
          } else {
            // Server returned a general error message
            setErrors([{ field: "general", message: serverError.message || "Failed to add book. Please try again." }]);
          }
        } else if (axiosError.request) {
          // The request was made but no response was received
          setErrors([{ field: "general", message: "No response from server. Please check your connection." }]);
        } else {
          // Something happened in setting up the request that triggered an Error
          setErrors([{ field: "general", message: "Error setting up request. Please try again." }]);
        }
      } else {
        // Non-Axios error
        setErrors([{ field: "general", message: "An unexpected error occurred. Please try again." }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorForField = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          disabled={isSubmitting}
          className={`w-full p-2 border rounded ${getErrorForField("title") ? "border-red-500" : ""}`}
        />
        {getErrorForField("title") && <p className="text-red-500 text-sm">{getErrorForField("title")}</p>}
      </div>
      <div>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          required
          disabled={isSubmitting}
          className={`w-full p-2 border rounded ${getErrorForField("author") ? "border-red-500" : ""}`}
        />
        {getErrorForField("author") && <p className="text-red-500 text-sm">{getErrorForField("author")}</p>}
      </div>
      <div>
        <input
          type="text"
          name="ISBN"
          value={formData.ISBN}
          onChange={handleChange}
          placeholder="ISBN (10 or 13 digits)"
          required
          disabled={isSubmitting}
          className={`w-full p-2 border rounded ${getErrorForField("ISBN") ? "border-red-500" : ""}`}
        />
        {getErrorForField("ISBN") && <p className="text-red-500 text-sm">{getErrorForField("ISBN")}</p>}
      </div>
      <div>
        <input
          type="date"
          name="publishedDate"
          value={formData.publishedDate}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className={`w-full p-2 border rounded ${getErrorForField("publishedDate") ? "border-red-500" : ""}`}
        />
        {getErrorForField("publishedDate") && <p className="text-red-500 text-sm">{getErrorForField("publishedDate")}</p>}
      </div>
      <div>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
          disabled={isSubmitting}
          className={`w-full p-2 border rounded ${getErrorForField("genre") ? "border-red-500" : ""}`}
        />
        {getErrorForField("genre") && <p className="text-red-500 text-sm">{getErrorForField("genre")}</p>}
      </div>
      <div>
        <input
          type="number"
          name="copiesAvailable"
          value={formData.copiesAvailable}
          onChange={handleChange}
          placeholder="Copies Available"
          required
          min="0"
          disabled={isSubmitting}
          className={`w-full p-2 border rounded ${getErrorForField("copiesAvailable") ? "border-red-500" : ""}`}
        />
        {getErrorForField("copiesAvailable") && <p className="text-red-500 text-sm">{getErrorForField("copiesAvailable")}</p>}
      </div>
      {getErrorForField("general") && <p className="text-red-500 text-sm">{getErrorForField("general")}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Adding Book...' : 'Add Book'}
      </button>
    </form>
  );
};

export default AddBookForm;
