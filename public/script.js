let api = 'http://localhost:3000/books';

function loadBooks() {
    fetch(api)
    .then(response => response.json())
    .then(books => {
        let output = '';
        books.forEach(book => {
            output += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>
                        <button onclick="updateBook(${book.id})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
        document.getElementById('bookList').innerHTML = output;
    });
}

function addBook() {
    let book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        category: document.getElementById('category').value
    };

    fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadBooks();
    });
}

function updateBook(id) {
    let title = prompt("Enter new title:");
    let author = prompt("Enter new author:");
    let category = prompt("Enter new category:");

    if (title && author && category) {
        let book = {
            title: title,
            author: author,
            category: category
        };

        fetch(api + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadBooks();
        });
    }
}

function deleteBook(id) {
    fetch(api + '/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadBooks();
    });
}

loadBooks();
