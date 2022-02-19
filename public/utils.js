const questionHtml = (question) => `<div class="message">
									                	<p class="msg-text">${question}</p>
								               	  </div>`;

const resultHtml = (topResult, otherResults) => {
  let otherResultsHtml = "";
  if (otherResults.length) {
    otherResultsHtml = `<div class="other-results">
                          <h3 class="label">Other Results</h3>`;
    otherResults.forEach((result) => {
      otherResultsHtml += `<p class="gurmukhi">${result.gurmukhi}</p>
                  <p class="translation">${result.translation}</p>`;
    });
    otherResultsHtml += `</div>`;
  }
  return `<div class="result">
					<div class="top-result">
						<h3 class="label">Top Result</h3>
						<p class="gurmukhi">${topResult.gurmukhi}</p>
						<p class="translation">${topResult.translation}</p>
					</div>
          ${otherResultsHtml}
				</div>`;
};

const errorHtml = () => `<div class="result">
                            <div class="other-results">
                              <p class="msg-text">We were unable to process this question, can you try rephrasing?</p>
                            </div>
                          </div>`;

const getAnswers = () => {
  const questionInput = document.querySelector("#question-input");
  const question = questionInput.value;
  questionInput.value = "";
  if (question) {
    document.querySelector(".message-container").innerHTML +=
      questionHtml(question);
    fetch("/api?question=" + question)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          document.querySelector(".message-container").innerHTML += errorHtml();
        } else {
          document.querySelector(".message-container").innerHTML += resultHtml(
            data.response[0],
            data.response.slice(1)
          );
        }
      });
  }
};
