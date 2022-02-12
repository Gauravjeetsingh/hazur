const axios = require("axios");
const express = require("express");

const app = express();

const OPENAI = "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";

const getAnswer = async (question) => {
  const data = JSON.stringify({
    file: "file-j8jSzX073l6bXOWbzHWZqxL6",
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
      Authorization: `Bearer ${OPENAI}`,
    },
  };

  let answers;

  const apiCall = await axios
    .post(options.hostname, data, { headers: options.headers })
    .then((res) => {
      const selectedDocuments = res.data.selected_documents;
      return selectedDocuments;
    })
    .catch((err) => console.log(err));
  return apiCall;
};

app.get("/", async function (req, res) {
  const { question } = req.query;  
  const answers = await getAnswer(question);
  const response = answers.reverse().map((doc) => {
    return { gurmukhi: doc.metadata, translation: doc.text };
  });
  res.json({ response });
});

app.listen(3030);
