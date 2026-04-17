function showDialog(dialogId) {
  var dialog = document.getElementById(dialogId);
  if (dialog) {
      // Добавляем класс dialog-open к html элементу
      document.documentElement.classList.add('dialog-open');
      
      dialog.style.display = "block";
      updateScrollbar(dialog);
  }
}

function closeDialog(dialogId) {
  var dialog = document.getElementById(dialogId);
  if (dialog) {
      dialog.classList.add('fade-out');
      setTimeout(function () {
          dialog.style.display = "none";
          dialog.classList.remove('fade-out');
      }, 300);
      setTimeout(() => block.style.display = "none", 200)
      
      // Удаляем класс dialog-open из html элемента
      document.documentElement.classList.remove('dialog-open');
  }
}