import { data } from "autoprefixer";
import axios from "axios";
import React, { useState } from "react";

function TextImage() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      setError("Failed to Generate Image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-8 rounded-lg shadow-lg max-w-md mx-auto bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800">
          Text To Image Generator
        </h2>
        <input
          type="text"
          placeholder="Enter Your Prompt"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateImage}
          disabled={loading}
          className={`w-full py-2 mt-2 text-white font-medium rounded-md ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating Image..." : "Generate Image"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {image && (
          <img
            src={image}
            alt="Generated"
            className="w-full rounded-lg shadow-lg mt-4"
          />
        )}
      </div>
    </>
  );
}

export default TextImage;
