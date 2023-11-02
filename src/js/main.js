document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.querySelector('.image-input');
  const uploadedImage = document.querySelector('.uploaded-image');
  const textContainer = document.querySelector('.text-container');
  const addTextButton = document.querySelector('.add-text-button');
  const saveMemeButton = document.querySelector('.save-meme-button');

  let memeCount = 0;

  imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      uploadedImage.src = imageUrl;
    }
  });

  addTextButton.addEventListener('click', function () {
    const textElement = document.createElement('div');
    textElement.contentEditable = true;
    textElement.className = 'meme-text';
    textElement.textContent = 'Введите текст';
    textContainer.appendChild(textElement);
  });

  saveMemeButton.addEventListener('click', function () {
    const meme = document.createElement('div');
    meme.className = 'meme';
    meme.appendChild(uploadedImage.cloneNode(true));

    const textElements = document.querySelectorAll('.meme-text');
    textElements.forEach((textElement) => {
      meme.appendChild(textElement.cloneNode(true));
    });

    const memeContainer = document.createElement('div');
    memeContainer.className = 'meme-container';
    memeContainer.appendChild(meme);

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(
      new Blob([memeContainer.outerHTML], { type: 'text/png' })
    );
    downloadLink.download = `meme_${memeCount++}.png`;
    downloadLink.click();
  });
});
