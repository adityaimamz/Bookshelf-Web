const books = [];

const isStorageExist = function() {
  if (typeof Storage === undefined) {
    alert("Maaf, Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

const appearEvent = "appearBook";
document.addEventListener(appearEvent, function() {
  const unfinishedBooks = document.getElementById("unFinished");
  unfinishedBooks.innerHTML = "";

  const finishedBooks = document.getElementById("finished");
  finishedBooks.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBooks.append(bookElement);
    } else {
      finishedBooks.append(bookElement);
    }
  }
});

const savedEvent = "savedBook";
document.addEventListener(savedEvent, function() {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Disimpan!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(function() {
    customAlert.remove();
  }, 1500);
});

const movedEvent = "movedBook";
document.addEventListener(movedEvent, function() {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Dipindahkan!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(function() {
    customAlert.remove();
  }, 1500);
});

const deleteEvent = "deletedBook";
document.addEventListener(deleteEvent, function() {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Dihapus!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(function(){
    customAlert.remove();
  }, 1500);
});

const storageKey = "BOOKSHELF_APPS";
const loadDataFromStorage = function() {
  const data = JSON.parse(localStorage.getItem(storageKey));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(appearEvent));
};

const saveData = function() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(storageKey, parsed);
    document.dispatchEvent(new Event(savedEvent));
  }
};

const moveData = function() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(storageKey, parsed);
    document.dispatchEvent(new Event(movedEvent));
  }
};

const deleteData = function() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(storageKey, parsed);
    document.dispatchEvent(new Event(deleteEvent));
  }
};

const addBook = function() {
  const bookTitle = document.getElementById("judul");
  const bookWriter = document.getElementById("penulis");
  const bookYear = document.getElementById("tahun");
  const bookHasFinished = document.getElementById("isReaded");
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookWriter.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookWriter.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(appearEvent));
  saveData();
};

const makeBookElement = function(bookObject) {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.classList.add("itemTitle");
  elementBookTitle.innerHTML = `${bookObject.title} <span> (${bookObject.year})</span>`;

  const elementBookWriter = document.createElement("p");
  elementBookWriter.classList.add("itemWriter");
  elementBookWriter.innerText = bookObject.author;

  const descBox = document.createElement("div");
  descBox.classList.add("itemDesc");
  descBox.append(elementBookTitle, elementBookWriter);

  const actionBox = document.createElement("div");
  actionBox.classList.add("itemAction");

  const Box = document.createElement("div");
  Box.classList.add("item");
  Box.append(descBox);
  Box.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnButton = document.createElement("button");
    returnButton.classList.add("returnButton");
    returnButton.innerHTML = `<p>Belum di Baca</p>`;

    returnButton.addEventListener("click", function() {
      returnBookFromFinished(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.innerHTML = `<p>Hapus</p>`;

    deleteButton.addEventListener("click", function() {
      deleteBook(bookObject.id);
    });

    actionBox.append(returnButton, deleteButton);
    Box.append(actionBox);
  } else {
    const finishButton = document.createElement("button");
    finishButton.classList.add("finishButton");
    finishButton.innerHTML = `<p>Sudah di Baca</p>`;

    finishButton.addEventListener("click", function() {
      addBookToFinished(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.innerHTML = `<p>Hapus</p>`;

    deleteButton.addEventListener("click", function() {
      deleteBook(bookObject.id);
    });

    actionBox.append(finishButton, deleteButton);
    Box.append(actionBox);
  }

  return Box;
};

const addBookToFinished = function(bookId) {
  const bookMark = findBook(bookId);

  if (bookMark == null) return;

  bookMark.isComplete = true;
  document.dispatchEvent(new Event(appearEvent));
  moveData();
};

const returnBookFromFinished = function(bookId) {
  const bookMark = findBook(bookId);

  if (bookMark == null) return;

  bookMark.isComplete = false;
  document.dispatchEvent(new Event(appearEvent));
  moveData();
};

const deleteBook = function(bookId) {
  const bookMark = findBookIndex(bookId);

  if (bookMark === -1) return;

  books.splice(bookMark, 1);
  document.dispatchEvent(new Event(appearEvent));
  deleteData();
};

const findBook = function(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = function(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

const searchBook = function() {
  const searchInput = document.getElementById("searchTitle").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".itemTitle");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const saveForm = document.getElementById("bookInput");
  saveForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("bookSearch");
  searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchBook();
  });

});