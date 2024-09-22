import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const app = express();

app.use(cors({ origin: "https://bajaj-frontend-sandy.vercel.app", credentials: true }));  
app.use(express.json({ limit: "28kb" }));
app.use(express.urlencoded({ extended: true, limit: "28kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const upload = multer({ storage: multer.memoryStorage() });
const getHighestLowercase = (alphabets) => {
  const lowercaseAlphabets = alphabets.filter((c) => c >= "a" && c <= "z");
  return lowercaseAlphabets.length > 0
    ? lowercaseAlphabets.sort().reverse()[0]
    : null;
};

const validateBase64File = (base64String) => {
  try {
    const buffer = Buffer.from(base64String, "base64");
    const fileSizeKB = (buffer.length / 1024).toFixed(2);
    const mimeType = "image/png";
    return { valid: true, mimeType, fileSizeKB };
  } catch (error) {
    return { valid: false, mimeType: null, fileSizeKB: null };
  }
};

app.post("/bfhl", upload.none(), (req, res) => {
  const { data, file_b64 } = req.body;

  // Validate input data
  if (!data || !Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, error: "Invalid data format." });
  }

  // Separate numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));
  const highestLowercaseAlphabet = getHighestLowercase(alphabets);

  // Validate the base64 file
  const fileData = validateBase64File(file_b64 || "");

  // Set file validity to false if no valid file was uploaded
  const fileValid = fileData.valid; // Keep this logic if you want to check for valid files
  const isFileValid = file_b64 ? fileValid : false; // Change to false if no file was uploaded

  res.status(200).json({
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet
      ? [highestLowercaseAlphabet]
      : [], // Keep as an array
    file_valid: isFileValid, // Ensure this reflects the expected value
  });
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.all("*", (req, res) => {
  res.status(404).json({
    message: `The requested route ${req.originalUrl} does not exist or the ${req.method} method is not allowed.`,
    status: 404,
  });
});


app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
