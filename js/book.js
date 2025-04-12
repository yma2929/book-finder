
const bookName = document.getElementById("book-name");
const bookAuthor = document.getElementById("author-name");
const send = document.getElementById("searchBtn");
const clear = document.getElementById("resetBtn");
const random = document.getElementById("randomBookBtn");


async function getBookData(){

  const bName =bookName.value.trim();
  const bAuthor = bookAuthor.value.trim();

  const bkname= /^[A-Za-z0-9\s]+$/.test(bName);
  const author= /^[A-Za-z0-9\s]+$/.test(bAuthor);

  if (bkname  && author ){
    const query= bAuthor ? bName + " " + bAuthor : bName;
    const APIendpoint=`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;


    try{
      const apiResponse = await fetch(APIendpoint);
      const data = await apiResponse.json();
     
      const books = data.docs.slice(0,5);
      const bookcontainer = document.getElementById("info-container");
      bookcontainer.innerHTML = ""; // Clear previous results

      books.forEach(book => {
        const title = book.title || "No title available";
        const author = book.author_name ? book.author_name.join(", ") : "No author available";
        const publishYear = book.first_publish_year || "No publish year available";
        const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "No cover available";
        const isbn = book.isbn ? book.isbn[0] : "No ISBN available";


        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
          <img src="${coverUrl}" alt="Book Cover">
          <h3>${title}</h3>
          <p>Author: ${author}</p>
          <p>Publish Year: ${publishYear}</p>
          <p>ISBN: ${isbn}</p>
          `;

        bookcontainer.appendChild(bookCard);

      })

      
      

    }catch(err){
      displayErrorMessage("An error occurred while fetching the book data. Please try again later.");

    }

  }


  else{
    displayErrorMessage("Please abide to the proper input format, e.g a book's name can contain letters and numbers and an author's name can contain letters and numbers.");

  }
}



function displayErrorMessage(message){
  const errormessage = document.createElement("p");
  errormessage.textContent = message;
  errormessage.classList.add("error-message");

  const errcontainer = document.getElementById("container");
  errcontainer.innerHTML="";
  errcontainer.appendChild(errormessage);

}


