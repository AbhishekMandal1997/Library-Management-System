import { useState } from "react";
import { Book } from "../types/book";

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: Omit<Book, "_id">) => Promise<void>;
}

export default function BookForm({ initialData, onSubmit }: BookFormProps) {
  const [formData, setFormData] = useState<Omit<Book, "_id">>({
    title: initialData?.title || "",
    author: initialData?.author || "",
    ISBN: initialData?.ISBN || "",
    publishedDate: initialData?.publishedDate || "",
    genre: initialData?.genre || "Fiction",
    copiesAvailable: initialData?.copiesAvailable || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "copiesAvailable" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Author</label>
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">ISBN</label>
        <input
          name="ISBN"
          value={formData.ISBN}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Published Date</label>
        <input
          name="publishedDate"
          type="date"
          value={formData.publishedDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Genre</label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Academic">Academic</option>
          <option value="Biography">Biography</option>
          <option value="Science">Science</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Copies Available</label>
        <input
          name="copiesAvailable"
          type="number"
          min="1"
          value={formData.copiesAvailable}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        {initialData ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
}
