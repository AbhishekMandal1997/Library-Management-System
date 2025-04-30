import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const bookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    ISBN: z
        .string()
        .min(1, "ISBN is required")
        .regex(
            /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ])?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
            "Invalid ISBN format"
        ),
    publishedDate: z.string().min(1, "Published date is required"),
    genre: z.string().min(1, "Genre is required"),
    copiesAvailable: z
        .number()
        .min(0, "Copies available must be 0 or greater")
        .transform((val) => {
            const parsed = parseInt(val as any);
            return isNaN(parsed) ? 0 : parsed;
        })
        .refine(
            (val) => val >= 0,
            {
                message: "Copies available must be 0 or greater",
            }
        ),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
    initialData?: Partial<BookFormData>;
    onSubmit: (data: BookFormData) => Promise<void>;
}

export default function BookForm({ initialData, onSubmit }: BookFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<BookFormData>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            ...initialData,
            copiesAvailable: initialData?.copiesAvailable || 0,
        },
    });

    const handleFormSubmit = async (data: BookFormData) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            // Ensure all data is properly formatted
            const formattedData = {
                ...data,
                copiesAvailable: Number(data.copiesAvailable),
                publishedDate: new Date(data.publishedDate).toISOString().split('T')[0]
            };

            await onSubmit(formattedData);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to save book";
            if (error.response?.data?.errors) {
                // Handle field-specific errors
                Object.entries(error.response.data.errors).forEach(([field, message]) => {
                    setError(field as keyof BookFormData, {
                        type: "manual",
                        message: message as string,
                    });
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="title"
                            {...register("title")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter book title"
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Author
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="author"
                            {...register("author")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter author name"
                            disabled={isSubmitting}
                        />
                        {errors.author && (
                            <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="ISBN" className="block text-sm font-medium text-gray-700">
                        ISBN
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="ISBN"
                            {...register("ISBN")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter ISBN number"
                            disabled={isSubmitting}
                        />
                        {errors.ISBN && (
                            <p className="mt-1 text-sm text-red-600">{errors.ISBN.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="publishedDate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Published Date
                    </label>
                    <div className="mt-1">
                        <input
                            type="date"
                            id="publishedDate"
                            {...register("publishedDate")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={isSubmitting}
                        />
                        {errors.publishedDate && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.publishedDate.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="genre"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Genre
                    </label>
                    <div className="mt-1">
                        <select
                            id="genre"
                            {...register("genre")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={isSubmitting}
                        >
                            <option value="">Select a genre</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Non-Fiction">Non-Fiction</option>
                            <option value="Academic">Academic</option>
                            <option value="Biography">Biography</option>
                            <option value="Science">Science</option>
                        </select>
                        {errors.genre && (
                            <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="copiesAvailable"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Copies Available
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="copiesAvailable"
                            min="0"
                            {...register("copiesAvailable", {
                                valueAsNumber: true,
                                setValueAs: v => parseInt(v) || 0
                            })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter number of copies"
                            disabled={isSubmitting}
                        />
                        {errors.copiesAvailable && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.copiesAvailable.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isSubmitting ? "Saving..." : initialData ? "Update Book" : "Add Book"}
                </button>
            </div>
        </form>
    );
} 