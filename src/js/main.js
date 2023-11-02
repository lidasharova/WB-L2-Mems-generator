const canvas = document.querySelector('.my-canvas');
const ctx = canvas.getContext('2d');

const imageInput = document.querySelector('.image-input');
const textColor = document.querySelector('.text-color');
const fontSize = document.querySelector('.font-size');
const textInput = document.querySelector('.text-input');
const addTextButton = document.querySelector('.add-text-button');
const saveMemeButton = document.querySelector('.save-meme-button');

let textComponents = [];

let scale = 1;
let viewportOffsetX = 0;
let viewportOffsetY = 0;

let drag = false;

let canvasImage;
let img;
let originX = 0;
let originY = 0;

let imageX = 0;
let imageY = 0;

//загружаем изображение на канвас
imageInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, imageX, imageY);
      canvasImage = img; // Устанавливаем canvasImage в загруженное изображение
      console.log('картинка загрузилась', canvasImage);
    };
  }
});

function registerTextComponent(text, textX, textY, size, color) {
  textComponents.push({
    text,
    x: textX,
    y: textY,
    saved: false,
    fontSize: size,
    color,
  });
  renderTextCanvas();
}

//добавление текста на канвас
addTextButton.addEventListener('click', function () {
  const text = textInput.value;
  const color = textColor.value;
  const size = fontSize.value;
  const textX = canvas.width / 2;
  const textY = canvas.height / 2;
  //добавляем в массив инфо о тексте
  registerTextComponent(text, textX, textY, size, color);
  textInput.value = '';
});

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('touchmove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('touchend', onMouseUp);
canvas.addEventListener('touchstart', onMouseDown);
canvas.addEventListener('mousedown', onMouseDown);

function renderTextCanvas() {
  ctx.clearRect(0, 0, img.width, img.height);

  // Отрисовываем загруженное изображение на холсте
  if (canvasImage) {
    ctx.drawImage(canvasImage, 0, 0);
  }

  textComponents.forEach(function (textObj) {
    ctx.save();
    ctx.font = textObj.size + 'px Arial';
    ctx.fillStyle = textObj.color;
    if (textObj.saved) {
      ctx.fillText(
        textObj.text,
        textObj.x + viewportOffsetX,
        textObj.y + viewportOffsetY
      );
    } else {
      ctx.fillText(textObj.text, textObj.x, textObj.y);
      textObj.saved = true;
      textObj.x -= viewportOffsetX;
      textObj.y -= viewportOffsetY;
    }
    ctx.restore();
  });
}
function onMouseUp() {
  drag = false;
}

function onMouseDown(event) {
  originX = event.pageX;
  originY = event.pageY;

  if (event.touches) {
    let touches = event.touches[0];
    originX = touches.pageX;
    originY = touches.pageY;
  }

  if (textInput.value) {
    let rect = canvas.getBoundingClientRect();
    let x = originX - rect.left;
    let y = originY - rect.top;
    registerTextComponent(
      textInput.value,
      x,
      y,
      fontSize.value,
      textColor.value
    );

    textInput = null;
    return;
  }
  drag = true;
}

function onMouseMove(e) {
  if (drag) {
    let pageX = e.pageX;
    let pageY = e.pageY;

    if (e.touches) {
      let touches = e.touches[0];
      pageX = touches.pageX;
      pageY = touches.pageY;
    }

    let deltaX = pageX - originX;
    let deltaY = pageY - originY;

    if (Math.abs(viewportOffsetX) < Math.abs(img.width / 2)) {
      viewportOffsetX += deltaX;
    } else {
      if (viewportOffsetX < 0) {
        viewportOffsetX += 1;
      } else {
        viewportOffsetX -= 1;
      }
    }
    if (Math.abs(viewportOffsetY) < Math.abs(img.height / 2)) {
      viewportOffsetY += deltaY;
    } else {
      if (viewportOffsetY < 0) {
        viewportOffsetY += 1;
      } else {
        viewportOffsetY -= 1;
      }
    }
    originX = pageX;
    originY = pageY;
    renderTextCanvas();
  }
}

//сохранение мема как картинки
saveMemeButton.addEventListener('click', function () {
  img = new Image();
  img.src = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = img.src;
  link.download = 'meme.png';
  link.click();
});

//   //отрисовка текста поверх канваса
//   function drawTextElements() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     // Отрисовываем изображение на холсте
//     if (canvasImage) {
//       ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);
//     }
//     // Отрисовываем текстовые элементы поверх изображения
//     textComponents.forEach(function (element) {
//       ctx.fillStyle = element.color;
//       ctx.font = element.size + 'px Arial';
//       ctx.fillText(element.text, element.x, element.y);
//     });
//   }
// });

// canvas.addEventListener('mousemove', function (e) {
//   if (isDrag && activeText) {
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;
//     activeText.x = x - offsetX;
//     activeText.y = y - offsetY;

//     // Обновите координаты текста в массиве textElements
//     const index = textElements.indexOf(activeText);
//     if (index !== -1) {
//       textElements[index].x = activeText.x;
//       textElements[index].y = activeText.y;
//     }

//     drawTextElements();
//   }

//   canvas.addEventListener('mouseup', function () {
//     isDrag= false;
//     activeText = null;
//   });

//   canvas.addEventListener('mousedown', function (e) {
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;

//     for (let i = textElements.length - 1; i >= 0; i--) {
//       const element = textElements[i];
//       const textWidth = ctx.measureText(element.text).width;
//       const textHeight = element.size;
//       if (
//         x >= element.x &&
//         x <= element.x + textWidth &&
//         y >= element.y - textHeight &&
//         y <= element.y
//       ) {
//         isDragging = true;
//         activeText = element;
//         offsetX = x - element.x;
//         offsetY = y - element.y;
//       }
//     }
//   });
// });

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
