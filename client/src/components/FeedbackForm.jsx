import { useState } from "react";
import {
  FiStar,
  FiSend,
  FiSmile,
  FiMeh,
  FiFrown,
} from "react-icons/fi";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [emoji, setEmoji] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you for your feedback!");

    setRating(0);
    setEmoji("");
    setFeedback("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-8"
    >
      {/* Header */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-gray-800">
          Customer Feedback
        </h2>

        <p className="text-gray-500 mt-2">
          We'd love to hear your experience with our service.
        </p>

      </div>

      {/* Star Rating */}

      <div className="mb-8">

        <label className="block font-semibold mb-4">
          Rate our service
        </label>

        <div className="flex gap-3">

          {[1, 2, 3, 4, 5].map((star) => (

            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition hover:scale-110"
            >
              <FiStar
                size={38}
                className={
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>

          ))}

        </div>

      </div>

      {/* Emoji */}

      <div className="mb-8">

        <label className="block font-semibold mb-4">
          Overall Experience
        </label>

        <div className="flex gap-8">

          <button
            type="button"
            onClick={() => setEmoji("happy")}
            className={`p-5 rounded-2xl border transition ${
              emoji === "happy"
                ? "bg-green-100 border-green-500"
                : "hover:bg-gray-100"
            }`}
          >
            <FiSmile size={45} className="text-green-600" />
          </button>

          <button
            type="button"
            onClick={() => setEmoji("neutral")}
            className={`p-5 rounded-2xl border transition ${
              emoji === "neutral"
                ? "bg-yellow-100 border-yellow-500"
                : "hover:bg-gray-100"
            }`}
          >
            <FiMeh size={45} className="text-yellow-500" />
          </button>

          <button
            type="button"
            onClick={() => setEmoji("sad")}
            className={`p-5 rounded-2xl border transition ${
              emoji === "sad"
                ? "bg-red-100 border-red-500"
                : "hover:bg-gray-100"
            }`}
          >
            <FiFrown size={45} className="text-red-500" />
          </button>

        </div>

      </div>

      {/* Feedback */}

      <div className="mb-8">

        <label className="block font-semibold mb-3">
          Your Feedback
        </label>

        <textarea
          rows="6"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what went well and what we can improve..."
          className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-600"
        />

      </div>

      {/* Submit */}

      <div className="flex justify-end">

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2"
        >
          <FiSend />
          Submit Feedback
        </button>

      </div>

    </form>
  );
}