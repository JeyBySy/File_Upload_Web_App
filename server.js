const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');
const multer = require("multer");
let port = process.env.PORT || 5600

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname })
})

app.get('/getApp/:name', (req, res) => {
    // console.log(req.params)
    var appName = req.params.name
    const file = `${__dirname}/uploads/${appName}`;
    // console.log(file)
    res.download(file);
})
app.get('/removeApp/:name', (req, res) => {
    // console.log(req.params)
    var appName = req.params.name
    const file = `${__dirname}/uploads/${appName}`;

    fs.unlink(file, (err) => {
        if (err) {
            console.error(new Error("No file exist"))
            return res.redirect('/')
        }
        return res.redirect('/')

    })
})


app.get('/list', (req, res) => {
    const dir = `${__dirname}/uploads`
    const files = fs.readdirSync(dir)
    var items = []
    for (const file of files) {
        items.push(file)
    }
    // console.log(items)
    return res.send(JSON.stringify(items))
})

const upload = multer({
    dest: path.join(__dirname, "/uploads")
});

app.post("/upload", upload.fields([{ name: "file" }]), (req, res) => {
    // console.log(req.files)
    const uploadedFiles = req.files.file
    const dir = `${__dirname}/uploads`
    const files = fs.readdirSync(dir)
    // for (let i = 0;i<= files.length;i++){
    //     if (req.file.filename == files[i]){

    //     }
    // }
    try {
        uploadedFiles.forEach(item => {
            fs.rename(item.path, path.join(__dirname, "/uploads/" + item.originalname), err => {
                if (err) {
                    console.log(new Error(err))
                }
            });
        });
        res.redirect('/')
    } catch (error) {
        console.log(error)
        return res.redirect('/')
    }

})
app.listen(port, (req, res) => {
    console.log(`http://localhost:${port}`)
})
app.get('*', function (req, res) {
    res.sendFile('views/404.html', { root: __dirname })
});
