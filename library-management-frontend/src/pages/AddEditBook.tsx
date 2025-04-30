import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookForm from "../components/books/BookForm";
import { ArrowLeft } from "lucide-react";
import { useBook } from "../context/BookContext";
import { toast } from "react-hot-toast";
import { Book } from "../types/book";
import { useAuth } from "../context/AuthContext";

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBook, addBook, editBook } = useBook();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error("Unauthorized: Only admins can manage books");
      navigate("/books");
      return;
    }

    const fetchBook = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const bookData = await getBook(id);
          setBook(bookData);
        } catch (error) {
          console.error("Failed to fetch book:", error);
          toast.error("Failed to fetch book details");
          navigate("/books");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBook();
  }, [id, getBook, navigate, user]);

  const handleSubmit = async (data: Omit<Book, '_id'>) => {
    try {
      setIsLoading(true);

      // Ensure copiesAvailable is a number
      const bookData = {
        ...data,
        copiesAvailable: Number(data.copiesAvailable)
      };

      if (id) {
        await editBook(id, bookData);
        toast.success("Book updated successfully");
      } else {
        await addBook(bookData);
        toast.success("Book added successfully");
      }
      navigate("/books");
    } catch (error: any) {
      console.error("Failed to save book:", error);
      const errorMessage = error.response?.data?.message || (id ? "Failed to update book" : "Failed to add book");
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/books")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? "Edit Book" : "Add New Book"}
        </h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <BookForm
          initialData={book || undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 