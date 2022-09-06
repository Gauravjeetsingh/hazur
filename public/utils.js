const questionHtml = (question) => {
  const msgcount = document.querySelectorAll('.message').length;
  return (
    `<div class="message-wrapper" id="msg-${msgcount}">
        <div class="avatar">
          <img src="/public/assets/icons/whitelogo.svg">
        </div>
        <div class="message-content">
          <p class="user">You</p>
          <div class="message">
            <p class="msg-text">${question}</p>
          </div>
        </div>
    </div>`
  )
}

const createLink = (shabadId, verseId) => (
  `https://www.sikhitothemax.org/shabad?id=${shabadId}&highlight=${verseId}`
);

const resultHtml = (topResult, otherResults) => {
  const countSelect = document.querySelector('.source-G .result-count');
  let otherResultsHtml = "";
  if (otherResults.length) {
    otherResultsHtml = `<div class="other-results">
                        <h3 class="label">Other Results</h3>`;
    otherResults.forEach((result) => {
      otherResultsHtml += `<a target="_blank" href=${createLink(result.gurmukhi.shabadId, result.gurmukhi.verseId)}>
                           <p class="gurmukhi">${result.gurmukhi.gurmukhi}</p>
                           <p class="translation">${result.translation}</p>
                           </a>`;
    });
    otherResultsHtml += `</div>`;
  }
  countSelect.textContent = otherResults.length + 1;
  countSelect.style.display = "inline-block";
  return `<div class="message-wrapper">
            <svg class="avatar avatar-sggs" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0319 1.46104C21.5923 -0.358546 24.4077 -0.358546 25.9681 1.46104C27.0558 2.7293 28.8291 3.16638 30.3815 2.54884C32.6088 1.66285 35.1017 2.97122 35.6378 5.30756C36.0115 6.936 37.3785 8.1471 39.0401 8.32175C41.424 8.57233 43.0234 10.8893 42.4123 13.2072C41.9864 14.8228 42.634 16.5304 44.0241 17.4573C46.0186 18.787 46.3579 21.5819 44.7397 23.3503C43.6118 24.5828 43.3916 26.3959 44.1918 27.8626C45.3398 29.9668 44.3414 32.5993 42.0868 33.4131C40.5152 33.9803 39.4777 35.4834 39.5047 37.1539C39.5432 39.5507 37.4359 41.4176 35.0613 41.0904C33.4062 40.8623 31.789 41.7111 31.0365 43.2028C29.9568 45.3429 27.2233 46.0167 25.2727 44.6234C23.9132 43.6523 22.0868 43.6523 20.7273 44.6234C18.7767 46.0167 16.0432 45.3429 14.9635 43.2028C14.211 41.7111 12.5938 40.8623 10.9387 41.0904C8.56409 41.4176 6.45675 39.5507 6.49535 37.1539C6.52225 35.4834 5.48476 33.9803 3.91324 33.4131C1.65855 32.5993 0.660209 29.9668 1.80821 27.8626C2.60837 26.3959 2.38823 24.5828 1.26032 23.3503C-0.357913 21.5819 -0.0185589 18.787 1.97585 17.4573C3.36596 16.5304 4.0136 14.8228 3.58769 13.2072C2.97664 10.8893 4.57595 8.57233 6.95988 8.32175C8.62148 8.1471 9.98853 6.936 10.3622 5.30756C10.8983 2.97122 13.3912 1.66285 15.6185 2.54884C17.1709 3.16638 18.9442 2.7293 20.0319 1.46104Z" fill="#FA6B2D"/>
            </svg>
            <div class="message-content">
              <p class="user">Sri Guru Granth Sahib ji</p>
              <div class="result">
              <a target="_blank" href=${createLink(topResult.gurmukhi.shabadId, topResult.gurmukhi.verseId)}>
					      <div class="top-result">
						      <h3 class="label">Top Result</h3>
						      <p class="gurmukhi">${topResult.gurmukhi.gurmukhi}</p>
						      <p class="translation">${topResult.translation}</p>
					      </div>
              </a>
                ${otherResultsHtml}
				      </div>
            </div>
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
    document.querySelector('.header').textContent = question;
    msgContainer.lastChild.scrollIntoView({ behavior: "smooth" });
    fetch("/api?question=" + question)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          msgContainer.innerHTML += errorHtml();
        } else {
          console.log(data.response);
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