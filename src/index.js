const axios = require("axios");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const { OPENAI_API_KEY, OPENAI_FILE } = process.env;
const ON_HEROKU = "ON_HEROKU" in process.env;
const port = ON_HEROKU ? process.env.PORT : 3030;

const getAnswer = async (question, ai) => {
  const data = JSON.stringify({
    file: OPENAI_FILE,
    question,
    search_model: "ada",
    model: "curie",
    examples_context: "In 2017, U.S. life expectancy was 78.6 years.",
    examples: [
      ["What is human life expectancy in the United States?", "78 years."],
    ],
    max_rerank: 10,
    max_tokens: 5,
    stop: ["<|endoftext|>"],
    return_metadata: true,
  });

  const options = {
    hostname: "https://api.openai.com/v1/answers",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  };

  let answers;

  const apiCall = await axios
    .post(options.hostname, data, { headers: options.headers })
    .then((res) => {
      const selectedDocuments = res.data.selected_documents;
      if (ai) {
        return [{ text: res.data.answers, metadata: "" }];
      } else {
        return selectedDocuments;
      }
    })
    .catch((err) => console.log(JSON.stringify(err)));
  return apiCall;
};

app.get("/api", async function (req, res) {
  const { question } = req.query;
  const { ai } = req.query;
  const answers = await getAnswer(question, ai);
  try {
    // last five element of an array 
    const lastFive = answers.slice(-6);
    const response = lastFive.reverse().map((doc) => {
      return { gurmukhi: doc.metadata, translation: doc.text };
    });
    res.json({ response });
  } catch {
    res.json({error: true});
  }
});

app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.sendFile("./pages/index.html", { root: __dirname });
});

app.listen(port);
