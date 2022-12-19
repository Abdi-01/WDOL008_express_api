const express = require('express');
const fs = require('fs');
const PORT = 5200;
const app = express();
app.use(express.json());
app.get('/', (request, response) => {
    response.status(200).send('<h1>Welcome to Express API</h1>')
});

app.get('/users', (request, response) => {
    let data = JSON.parse(fs.readFileSync('./db.json'));
    console.log(request.query);
    if (JSON.stringify(request.query) == '{}') {
       return response.status(200).send(data.users);
    } else {
        let filterData = data.users.filter((val) => {
            let temp = [];
            for (const property in request.query) {
                temp.push(request.query[property] == val[property]);
            }
            if (!temp.includes(false)) {
                return true;
            }
        })
        response.status(200).send(filterData);
    }
});

app.post('/users', (request, response) => {
    console.log(request.body);
    // fs.readFileSync : utk membaca isi file
    let data = JSON.parse(fs.readFileSync('./db.json'));
    data.users.push({
        id: data.users[data.users.length - 1].id + 1,
        ...request.body
    });
    // fs.writeFileSync : utk menulis ulang isi file
    fs.writeFileSync('./db.json', JSON.stringify(data));
    
    response.status(201).send(data.users[data.users.length - 1]);
});

app.delete('/users/:id', (req, res) => {
    console.log(req.params);
    let data = JSON.parse(fs.readFileSync('./db.json'));
    // cari index data berdasarkan parameter
    let getIdx = data.users.findIndex((val) => val.id == req.params.id);
    if (getIdx < 0) {
        res.status(404).send('Data Not Found');
    } else {
        data.users.splice(getIdx, 1);
        fs.writeFileSync('./db.json', JSON.stringify(data));
        res.status(200).send('Data isDeleted ⚠️');
    }
})

app.listen(PORT, () => console.log("EXPRESS API RUNNING"));