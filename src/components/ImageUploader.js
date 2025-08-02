"use client";
import { useState } from "react";
import Tesseract from "tesseract.js";
import { extractPakPassportMRZ } from "@/lib/mrzParser";
import { readableFieldNames } from "@/utils/fieldLabels";

const ImageUploader = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState({});
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(file);
            setPreview(imageURL);
            setText("");
            setFields({});
        }
    };


    const handleProcessImage = async () => {
        if (!image) return;
        setLoading(true);
        try {
            const {
                data: { text },
            } = await Tesseract.recognize(image, "eng", {
                logger: (m) => console.log(m),
            });
            setText(text);
            const fields = extractPakPassportMRZ(text);

            if (!fields) {
                setError("The image does not appear to be a valid Pakistani passport.");
                return;
            }
            setFields(fields);

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to process image. Try a clearer photo.");
        } finally {
            setLoading(false);

        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-2xl shadow-lg bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upload Pakistani Passport</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-6 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {error && (
                <div className="my-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
                    {error}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {preview && (
                    <div className="w-full lg:w-1/2">
                        <img
                            src={preview}
                            alt="Passport Preview"
                            className="rounded-lg shadow-md w-full h-auto max-h-[300px] object-contain"
                        />
                    </div>
                )}

                {text && (
                    <div className="w-full lg:w-1/2">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Extracted MRZ Information</h3>
                        <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg">
                            <table className="w-full text-sm text-left text-gray-700">
                                <tbody>
                                {Object.entries(fields).map(([key, value]) => (
                                    <tr key={key} className="border-b border-gray-100">
                                        <td className="px-4 py-2 font-medium text-gray-600 bg-gray-50">
                                            {readableFieldNames[key] || key}
                                        </td>
                                        <td className="px-4 py-2">{value || '—'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm disabled:opacity-50"
                    onClick={handleProcessImage}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Extract Info"}
                </button>
            </div>
        </div>

    );
};

export default ImageUploader;
