
const express = require("express");
const path = require("path");
const fs = require("fs");

const dbDir = path.resolve(__dirname, "Develop", "db");
const outputPath = path.join(dbDir, "db.json");

//Express
const app = express();
const PORT = process.env.PORT || 3001;

// Create Array to hold note objects
let notes = [];

//Enable easy return of jsons
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop/public')));


//Setting Routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "Develop", "public", "notes.html"));
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "Develop", "public", "index.html")));


app.get("/api/notes", (req, res) => {
    res.json(notes);
});

//Delete functionality
app.delete("/api/notes/:id", (req, res) => {
    notes = notes.filter((obj) => {
        return obj.id !== parseInt(req.params.id)
    });
    updater();
    res.json(notes);
    console.log(notes);
});

app.get("/api/notes/:id", (req, res) => {
    res.json(notes.filter(note => note.id === parseInt(req.params.id)));
    console.log(req.params.id);
});


// Post new notes to server
app.post(`/api/notes/`, (req, res) => {
    let newNote = req.body;
    newNote.id = notes.length + 1;
    console.log(newNote);
    notes.push(newNote);
    console.log(notes);
    updater();
    res.json(notes);
});

const assignmentFunc = () => {
    fs.readFile(outputPath, "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        if (data === "") {
            notes = [];
        }
        else {
            notes = JSON.parse(data);
        }

        console.log(data);
    });
}

const updater = () => {
    fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
        if (err) {
            throw err;
        }
        console.log("Successfully wrote to file");
    });
}

assignmentFunc();

//Listen for the given port
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});