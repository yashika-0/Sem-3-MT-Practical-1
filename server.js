
const http = require('http');

let books = [];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }

    let id = parseInt(req.url.split('/')[2]);

    if (req.method === 'GET' && req.url === '/books') {
        res.end(JSON.stringify(books));
    }
    else if (req.method === 'GET' && req.url.startsWith('/books/')) {
        let book = books.find(b => b.id === id);
        if (book) {
            res.end(JSON.stringify(book));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Book not found" }));
        }
    }
    else if (req.method === 'POST' && req.url === '/books') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let book = JSON.parse(body);
            book.id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
            books.push(book);
            res.end(JSON.stringify({ message: "Book added", book }));
        });
    }
    else if (req.method === 'PUT' && req.url.startsWith('/books/')) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let updatedBook = JSON.parse(body);
            let book = books.find(b => b.id === id);

            if (book) {
                book.title = updatedBook.title;
                book.author = updatedBook.author;
                book.category = updatedBook.category;
                res.end(JSON.stringify({ message: "Book updated", book }));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Book not found" }));
            }
        });
    }
    else if (req.method === 'DELETE' && req.url.startsWith('/books/')) {
        let index = books.findIndex(b => b.id === id);

        if (index !== -1) {
            books.splice(index, 1);
            books.forEach((book, i) => {
                book.id = i + 1;
            });
            res.end(JSON.stringify({ message: "Book deleted" }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Book not found" }));
        }
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Invalid route" }));
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
