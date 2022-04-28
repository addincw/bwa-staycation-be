const scModal = document.getElementById("sc-modal");
const scModalButtons = document.querySelectorAll("[data-target='#sc-modal']");
const scModalHandler = async (evt) => {
  const modalType = evt.target.getAttribute('data-content-type');
  const modalSource = evt.target.getAttribute('data-content-source');
  const modalTarget = evt.target.getAttribute('data-content-target');

  const elTitle = scModal.getElementsByClassName('modal-title')[0];
  const elBody = scModal.getElementsByClassName('modal-body')[0];
  const elButtonSubmit = scModal.getElementsByClassName('btn-submit')[0];

  if (modalSource) {
    elBody.innerHTML = '<p class="text-center">Fetching Data...</p>';
    elButtonSubmit.setAttribute('disabled', true);

    const response = await fetch(modalSource);
    // TODO: handle append script from response
    // hint: using document.createRange().createContextualFragment(string_response)
    const {title, body} = await response.json();

    elTitle.innerHTML = title;
    elBody.innerHTML = body;

    elButtonSubmit.removeAttribute('disabled');

    if (modalType == 'form') {
      _setFormSubmit(elBody, elButtonSubmit);
    }
  }

  if (modalType === 'confirmation-delete') {
    elTitle.innerHTML = 'Confirmation Delete';
    elBody.innerHTML = `
      <form method="post" action="${ modalTarget }">
        <div class="form-group text-center">
          <label for="name">Are you sure to delete this data?</label>
        </div>
      </form>
    `;

    _setFormSubmit(elBody, elButtonSubmit);
  }
};
const scModalTriggerClick = (element, data) => {
  element.style.display = "none";

  element.setAttribute("data-toggle", "modal");
  element.setAttribute("data-target", "#sc-modal");
  element.setAttribute("data-content-type", data.type);
  element.setAttribute("data-content-source", data.source);
  element.addEventListener('click', scModalHandler);

  document.body.append(element);
  element.click();
};

const _setFormSubmit = (element, button) => {
  const form = element.getElementsByTagName('form')[0];

  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    button.setAttribute('disabled', true);

    form.submit();
  });
};

scModalButtons.forEach((scModalButton) => {
  scModalButton.addEventListener('click', scModalHandler);
});