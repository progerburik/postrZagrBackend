const express = require('express');
const cors = require('cors');
const errorNotFound = { error: 'id.not_found' };
let nextId = 1;
let posts = [];

const server = express();
server.use(express.json());
server.use(cors());

function postId(id) {
    return posts.findIndex(o => o.id === id);
}

server.get('/posts/seenPosts/:lastSeenId', (req, res) => {
    const lastSeenId = Number(req.params.lastSeenId);
    const index = postId(lastSeenId);

    let lastPosts;

    if (lastSeenId === 0) {
        if (posts.length <= 5) {
            lastPosts = posts;
        } else {
            lastPosts = posts.slice(posts.length - 5);
        }


    } else if (lastSeenId > 0 && lastSeenId <= 5) {
        lastPosts = posts.slice(0, index);

    } else {
        lastPosts = posts.slice(index - 5, index);
    }

    res.send(lastPosts);
});

server.get('/posts/:firstSeenId', (req, res) => {
    const firstSeenId = Number(req.params.firstSeenId);

    res.send(posts.slice(firstSeenId));

    console.log(firstSeenId);
});

server.get('/posts/seenPosts', (req, res) => {
    res.send(posts);
});

server.post('/posts', (req, res) => {
    const body = req.body;
    const id = body.id;

    if (id === 0) {
        const newPost = {
            id: nextId++,
            url: body.content,
            name: body.name,
            likes: 0,
        }
        posts.push(newPost)
        res.send(newPost)
        return;
    }
    const index = postId(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
});

server.post('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);

    const index = postId(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts[index].likes++;
    res.send(posts);
});

server.delete('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);

    const index = postId(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts[index].likes--;
    res.send(posts);
});

server.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = postId(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }

    posts.splice(index, 1);
    res.send(posts);
});
server.listen(process.env.PORT || 9999);