let table = document.getElementById('books_table');
let rows = table.getElementsByTagName('tr');

for(let i = 0;i<rows.length;i++){
    let row = table.rows[i];
    if(row.id.match(/[0-9]+_book/)) {
        row.onclick = function () {
            let id = row.id;
            document.location.href = 'http://localhost:3000/library/books/' + id;
        }
    }
}

