const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const ObjectId = require('mongoose').Types.ObjectId;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://sudipnayak152002:hellosudip@datasudip.q0s46c8.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('DB is connected!')
})

//Schema for blog input //
const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    article: String,
    type: Number,
    views: {
        type: Number,
        default: 0
    }
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/add-article', (req, res) => {
    res.render('admin/addarticle')
})

app.post('/create-post', (req, res) => {
    const Post = mongoose.model('blog', blogSchema)
    let data = new Post({
        title: req.body.title,
        description: req.body.description,
        createdAt: new Date(),
        article: req.body.article,
        type: req.body.type,
    });
    data.save();
    res.redirect('/')
})

app.get('/post', async (req, res) => {
    const Post = mongoose.model('blog', blogSchema)
    let data = await Post.find({ type: 0 })
    res.render('premium', { blogs: data })
})

app.get('/login', (req, res) => {
    res.render('login');

})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/premium', async (req, res) => {
    const Post = mongoose.model('blog', blogSchema)
    let data = await Post.find({ type: 1 })
    res.render('premium', { blogs: data })
})

app.get("/:id", async (req, res) => {
    const Post = mongoose.model('blog', blogSchema);
    let data = await Post.findById(req.params.id);
    let updateviewcount = await Post.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
            $set: {
                views:data.views + 1,
            }

        }
    );
    
    res.render('showblog', { blog: data })
})

app.get("/edit/:id", async (req, res) => {
    const Post = mongoose.model('blog', blogSchema);
    let data = await Post.findById(req.params.id);
    res.render('admin/editit', { blog: data })
})

app.get("/delete/:id", async (req, res) => {
    const Post = mongoose.model('blog', blogSchema);
    let data = await Post.deleteOne({ _id: new ObjectId(req.params.id)});
    res.redirect('/premium')
})

app.post('/update-post', async(req, res) => {
    const Post = mongoose.model('blog', blogSchema);
    let data = await Post.updateOne(
     {_id: new ObjectId(req.body.id)},
     {
            $set: {
             title: req.body.title,
             description: req.body.description,
             article: req.body.article,
             type: req.body.type,
            }

     }
);
res.redirect('/premium')
})


app.listen(3000, () => {
    console.log('Server running on port 3000')
})