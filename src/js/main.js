document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.querySelector('.my-canvas');
  const ctx = canvas.getContext('2d');
  const imageInput = document.querySelector('.image-input');
  const textColor = document.querySelector('.text-color');
  const fontSize = document.querySelector('.font-size');
  const textInput = document.querySelector('.text-input');
  const addTextButton = document.querySelector('.add-text-button');
  const saveMemeButton = document.querySelector('.save-meme-button');

  let canvasImage; // изображение на канвасе
  let isDragging = false; //который будет использоваться для определения, перетаскивается ли какой-либо текстовый элемент.
  let activeText = null; //хранить активный текстовый элемент, который мы перетаскиваем.
  let offsetX, offsetY; //чтобы хранить смещение курсора мыши относительно верхнего левого угла текстового элемента.
  const textElements = [];

  //загружаем изображение на канвас
  imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvasImage = img; // Устанавливаем canvasImage в загруженное изображение
      };
    }
  });

  //добавление текста на канвас
  addTextButton.addEventListener('click', function () {
    const text = textInput.value;
    console.log(text);
    const color = textColor.value;
    const size = fontSize.value;
    console.log(size);
    //вставляем по центру холста
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    //добавляем в массив инфо о тексте
    textElements.push({ text, color, size, x: textX, y: textY });
    drawTextElements();
  });

  //сохранение мема как картинки
  saveMemeButton.addEventListener('click', function () {
    const image = new Image();
    image.src = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image.src;
    link.download = 'meme.png';
    link.click();
  });

  //отрисовка текста поверх канваса
  function drawTextElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовываем изображение на холсте
    if (canvasImage) {
      ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);
    }

    // Отрисовываем текстовые элементы поверх изображения
    textElements.forEach(function (element) {
      ctx.fillStyle = element.color;
      ctx.font = element.size + 'px Arial';
      ctx.fillText(element.text, element.x, element.y);
    });
  }
});

// canvas.addEventListener('mousedown', function (e) {
//   const x = e.clientX - canvas.getBoundingClientRect().left;
//   const y = e.clientY - canvas.getBoundingClientRect().top;

//   for (let i = textElements.length - 1; i >= 0; i--) {
//     const element = textElements[i];
//     const textWidth = ctx.measureText(element.text).width;
//     const textHeight = element.size;
//     if (
//       x >= element.x &&
//       x <= element.x + textWidth &&
//       y >= element.y - textHeight &&
//       y <= element.y
//     ) {
//       isDragging = true;
//       activeText = element;
//       offsetX = x - element.x;
//       offsetY = y - element.y;
//     }
//   }
// });

// canvas.addEventListener('mousemove', function (e) {
//   if (isDragging && activeText) {
//     activeText.x = e.clientX - canvas.getBoundingClientRect().left - offsetX;
//     activeText.y = e.clientY - canvas.getBoundingClientRect().top - offsetY;
//     drawTextElements();
//   }
// });
// canvas.addEventListener('mouseup', function () {
//   isDragging = false;
// });
