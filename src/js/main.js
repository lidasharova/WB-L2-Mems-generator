const canvas = document.querySelector('.my-canvas');
const ctx = canvas.getContext('2d');

const imageInput = document.querySelector('.image-input');
const textColor = document.querySelector('.text-color');
const fontSize = document.querySelector('.font-size');
const textInput = document.querySelector('.text-input');
const addTextButton = document.querySelector('.add-text-button');
const saveMemeButton = document.querySelector('.save-meme-button');
const saveTextButton = document.querySelector('.save-text-button');
const deleteTextButton = document.querySelector('.delete-text-button');
const canvasElement = document.querySelector('.my-canvas');

let textComponents = [];

let scale = 1; // масштаб изображения относительно канваса
let viewportOffsetX = 0;
let viewportOffsetY = 0;

let drag = false;

let canvasImage;
let img;
let originX = 0;
let originY = 0;

let imageX = 0;
let imageY = 0;

const rect = canvas.getBoundingClientRect();

// загружаем изображение на канвас
const addImg = (event) => {
  event.preventDefault();
  canvasElement.style.background = 'none';
  const file = event.target.files[0];
  if (file) {
    img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      scale = img.width / rect.width;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, imageX, imageY);
      canvasImage = img;
      removeDisableBtn();
    };
  }
};

imageInput.addEventListener('change', addImg);

const onMouseUp = () => {
  drag = false;
};

const onMouseDown = (event) => {
  originX = event.pageX;
  originY = event.pageY;
  if (event.touches) {
    let touches = event.touches[0];
    originX = touches.pageX;
    originY = touches.pageY;
  }
  drag = true;
};

const onMouseMove = (e) => {
  e.preventDefault();
  // расстояние до канваса от окна
  const offsetX = rect.left;
  const offsetY = rect.top;
  // координаты относительно канваса
  const mouseX = e.pageX - offsetX;
  const mouseY = e.pageY - offsetY;

  if (drag) {
    let pageX = e.pageX;
    let pageY = e.pageY;

    if (e.touches) {
      let touches = e.touches[0];
      pageX = touches.pageX;
      pageY = touches.pageY;
    }
    updateCoordinatesText(mouseX * scale, mouseY * scale);
  }
};

// отрисовка текстового элемента на канвас
const renderTextCanvas = () => {
  if (img) {
    ctx.clearRect(0, 0, img.width, img.height);
    if (canvasImage) {
      ctx.drawImage(canvasImage, 0, 0);
    }
    textComponents.forEach((textObj) => {
      ctx.font = textObj.fontSize * scale + 'px Tahoma, Verdana, sans-serif';
      ctx.fillStyle = textObj.color;
      ctx.textBaseline = 'middle';
      ctx.fillText(textObj.text, textObj.x, textObj.y);
    });
  } else {
    alert('Вы не загрузили изображение');
  }
};

// обновление координат для надписи
const updateCoordinatesText = (x, y) => {
  textComponents.forEach((textObj) => {
    if (!textObj.saved) {
      textObj.x = x;
      textObj.y = y;
    }
  });
  renderTextCanvas();
};

// добавление новой надписи
const registerTextComponent = (text, textX, textY, size, color, saved) => {
  textComponents.push({
    text,
    x: textX,
    y: textY,
    saved: false,
    fontSize: size,
    color,
    saved: saved,
  });
  renderTextCanvas();
};

const removeDisableBtn = () => {
  if (img) {
    addTextButton.removeAttribute('disabled');
    deleteTextButton.removeAttribute('disabled');
    saveTextButton.removeAttribute('disabled');
    saveMemeButton.removeAttribute('disabled');
  }
};

const addText = () => {
  if (img) {
    const text = textInput.value;
    const color = textColor.value;
    const size = fontSize.value;
    const textX = 50;
    const textY = 50;
    const saved = false;
    const hasUnsavedText = textComponents.some((component) => !component.saved);
    if (hasUnsavedText) {
      alert('Сохраните откредактированную надпись');
    } else {
      registerTextComponent(text, textX, textY, size, color, saved);
      textInput.value = '';
    }
  } else {
    alert('Вы не загрузили изображение');
  }
};

const deleteText = () => {
  if (textComponents.length > 0) {
    textComponents.pop();
    renderTextCanvas();
  }
};

const saveText = () => {
  if (textComponents.length > 0) {
    const lastTextComponent = textComponents[textComponents.length - 1];
    if (lastTextComponent.saved === true) {
      textComponents.forEach((component) => {
        if (component.saved === false) {
          component.saved = true;
        }
      });
    } else {
      lastTextComponent.saved = true;
    }
    renderTextCanvas();
  }
};

//сохранение мема как картинки
const saveMeme = () => {
  img = new Image();
  img.src = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = img.src;
  link.download = 'meme.png';
  link.click();
};

// изменения цвета текста
const changeFontColor = () => {
  if (textComponents.length > 0) {
    const color = textColor.value;
    textComponents[textComponents.length - 1].color = color;
    renderTextCanvas();
  }
};

// изменения размера шрифта
const changeFontSize = () => {
  {
    if (textComponents.length > 0) {
      const size = fontSize.value;
      textComponents[textComponents.length - 1].fontSize = size;
      renderTextCanvas();
    }
  }
};
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('touchmove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('touchend', onMouseUp);
canvas.addEventListener('touchstart', onMouseDown);
canvas.addEventListener('mousedown', onMouseDown);

fontSize.addEventListener('input', changeFontSize);
textColor.addEventListener('input', changeFontColor);

addTextButton.addEventListener('click', addText);
deleteTextButton.addEventListener('click', deleteText);
saveTextButton.addEventListener('click', saveText);
saveMemeButton.addEventListener('click', saveMeme);
