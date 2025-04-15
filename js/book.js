//getting user input and creating an object
const bookName = document.getElementById("book-name");
const bookAuthor = document.getElementById("author-name");
const send = document.getElementById("searchBtn");
const clear = document.getElementById("resetBtn");
//function to get book info
//uses AJAX to get data from the Open Library API
async function getBookData(){
  //triming user input to avoid unnecessary spaces
  let bName =bookName.value.trim();
  let bAuthor = bookAuthor.value.trim();
//validating user input
  const bkname= /^[A-Za-z0-9\s]+$/.test(bName);
  const bkauthor= /^[A-Za-z0-9\s]+$/.test(bAuthor);
//if the user input is valid, we will use the api to fetch data
  if (bkname  && bkauthor ){
    //cocnating the user input to create a query to send it in the endpoint
    const query= bAuthor ? bName + " " + bAuthor : bName;
    //creating the endpoint to send the query
    //using encodeURIComponent to encode the query to avoid any special characters
    //using the search.json endpoint of the Open Library API
    const APIendpoint=`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    //try-catch block to handle any errors that may occur while fetching data
    try{
      //fetching data from the API
      const apiResponse = await fetch(APIendpoint);
      //parse the response and store it
      const data = await apiResponse.json();
     //getting 5 books from the response
      const books = data.docs.slice(0,5);
      //container to display book info
      const bookcontainer = document.getElementById("info-container");
      bookcontainer.innerHTML = ""; // Clear previous results

      //looping through the books array to get the needed data
      books.forEach(book => {
        const title = book.title || "No title available";
        const author = book.author_name ? book.author_name.join(", ") : "No author available";
        const publishYear = book.first_publish_year || "No publish year available";
        const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "No cover available";
        const isbn = book.isbn ? book.isbn[0] : "No ISBN available";

        //creating a div to hold the book data
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        //adding the book data to the div
        bookCard.innerHTML = `
          <img src="${coverUrl}" alt="Book Cover">
          <h3>${title}</h3>
          <p>Author: ${author}</p>
          <p>Publish Year: ${publishYear}</p>
          <p>ISBN: ${isbn}</p>
          `;
        //adding the div as a child to the book card container
        bookcontainer.appendChild(bookCard);

      });
    }catch(err){
      displayErrorMessage("An error occurred while fetching the book data. Please try again later.");

    }

  }

// if the user input is not valid
  else{
    displayErrorMessage("Please abide to the proper input format, e.g a book's name can contain letters and numbers and an author's name can contain letters and numbers.");

  }
}


//function to handle errors
function displayErrorMessage(message){
  const errormessage = document.createElement("p");
  errormessage.textContent = message;
  errormessage.classList.add("error-message");

  const errcontainer = document.getElementById("container");
  errcontainer.innerHTML="";
  errcontainer.appendChild(errormessage);

}

function clearData(){
  
  const dataClear = document.getElementById("info-container");
  dataClear.innerHTML="";
  window.alert("Previous data had been cleared.");

}


//event types

send.addEventListener("click",getBookData);

clear.addEventListener("click",clearData);

bookName.addEventListener("focus",()=>{
  console.log("book name is focused.");
})

bookAuthor.addEventListener("keyup",(e)=>{
  if(e.key == "Enter")
    getBookData();
});

document.getElementById("info-container").addEventListener("dblclick",() =>{
  clearData();
});
