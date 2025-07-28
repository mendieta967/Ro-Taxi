import { useState } from "react";
import { Star } from "lucide-react";

const RateDriver = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit?.({ rating, comment });
      setRating(0);
      setComment("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
        ¿Cómo fue tu experiencia?
      </h2>

      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={32}
            className={`cursor-pointer transition-colors ${
              (hovered || rating) >= star
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            fill={(hovered || rating) >= star ? "currentColor" : "none"}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full py-2 px-4 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
      >
        Enviar calificación
      </button>
    </div>
  );
};

export default RateDriver;
