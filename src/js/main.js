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
      canvasImage = img;
    };
  }
});

//загружаем изображение на канвас
const addImg = (event) => {
  const file = event.target.files[0];
  if (file) {
    img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      scale = canvasWidth / img.width;
      ctx.drawImage(img, imageX, imageY);
      canvasImage = img;
      removeDisableBtn();
    };
  }
};

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
};

const onMouseMove = (e) => {
  console.log(img.width);
  console.log(img.height);

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
    updateCoordinatesText(originX, originY);
  }
};

//отрисовка текстового элемента на канвас
const renderTextCanvas = () => {
  if (img) {
    ctx.clearRect(0, 0, img.width, img.height);
    if (canvasImage) {
      ctx.drawImage(canvasImage, 0, 0);
    }
    textComponents.forEach((textObj) => {
      ctx.font = textObj.fontSize + 'px Arial';
      ctx.fillStyle = textObj.color;
      ctx.fillText(textObj.text, textObj.x, textObj.y, img.width);
    });
  } else {
    alert('Вы не загрузили изображение');
  }
};

//обновление координат для текстового элемента
const updateCoordinatesText = (x, y) => {
  textComponents.forEach((textObj) => {
    if (!textObj.saved) {
      textObj.x = x;
      textObj.y = y;
    }
  });
  renderTextCanvas();
};

//регистрация текстового элемента
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
  const text = textInput.value;
  const color = textColor.value;
  const size = fontSize.value;
  const textX = 50;
  const textY = 50;
  const saved = false;
  registerTextComponent(text, textX, textY, size, color, saved);
  textInput.value = '';
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
    }
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

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('touchmove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('touchend', onMouseUp);
canvas.addEventListener('touchstart', onMouseDown);
canvas.addEventListener('mousedown', onMouseDown);

addTextButton.addEventListener('click', addText);
deleteTextButton.addEventListener('click', deleteText);
saveTextButton.addEventListener('click', saveText);
saveMemeButton.addEventListener('click', saveMeme);
