const questionHtml = (question) => {
  const msgcount = document.querySelectorAll('.message').length;
  return (
    `<div class="message" id="msg-${msgcount}">
      <p class="msg-text">${question}</p>
    </div>`
  )
}

const resultHtml = (topResult, otherResults) => {
  const countSelect = document.querySelector('.source-G .result-count');
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
  countSelect.textContent = otherResults.length;
  countSelect.style.display = "inline-block";
  return `<div class="result">
					<div class="top-result">
						<h3 class="label">Top Result</h3>
						<p class="gurmukhi">${topResult.gurmukhi}</p>
						<p class="translation">${topResult.translation}</p>
					</div>
          ${otherResultsHtml}
				</div>`;
};

const errorHtml = () => (
  `<div class="result">
    <div class="other-results">
      <p class="msg-text">We were unable to process this question, can you try rephrasing?</p>
    </div>
  </div>`
);

const getAnswers = () => {
  const questionInput = document.querySelector("#question-input");
  const msgContainer = document.querySelector('.message-container');
  const question = questionInput.value;
  questionInput.value = "";
  if (question) {
    msgContainer.innerHTML += questionHtml(question);
    msgContainer.lastChild.scrollIntoView({ behavior: "smooth" });
    fetch("/api?question=" + question)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          msgContainer.innerHTML += errorHtml();
        } else {
          msgContainer.innerHTML += resultHtml(
            data.response[0],
            data.response.slice(1)
          );
        }
        msgContainer.lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      });
  }
};

function toggleSidebar() {
  const element = document.querySelector(".sidebar");
  element.classList.toggle("sidebar-open");
}