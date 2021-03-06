// import your node modules

//require the express module, use '$ yarn add to include in project'
const express = require('express');


//connects to our database
const db = require('./data/db.js');

//creates an express application using the express module
const server = express();

// add your server code starting here
server.use(express.json()); //allows parsing of json data from req.body

//Configures our server to execute a function for every GET request to "/"
//the second argument passed to the .get() method is the "Route Handler Function"
//the route handler function will run on every GET request to "/"
server.get('/', (req, res) => {
    //express will pass the request and response objects to this function
    //.send() on the response object can be used to send a response to the client
    res.send('Server Initiated');
});

//Configuring Routing with specific endpoint
//GET request
server.get('/api/posts', (req,res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.error('error',err);
        res.status(500).json({message: 'Error getting data'})
    });
});

//POST request
server.post('/api/posts', (req,res) => {
    const { title, contents} = req.body;
    if(!title || !contents) {
        res.status(400).json({message: 'Must provide title and contents'})
        return;
    }
    db
        .insert({
            title,
            contents
        })
        .then(response => {
            res.status(201).json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({message: error});
            return;
        });
    });

//Get all posts including new posts
server.get('/api/posts',(req,res) => {
    db
    .find()
    .then(posts => {
        res.json({posts});
    })
    .catch(error => {
        res.status(500).json({message: 'The list of posts could not be retrieved'});
        return;
    });
});

//Get an individual post using a unique id
server.get('/api/posts/:id',(req,res)=> {
    const id = req.params.id;
    db
        .findById(id)
        .then(post => {
            if (post.length === 0){
                res.status(404).json({message: 'No user corresponding to that identifier'});
                return;
            }
            res.json(post);
        })
        .catch(error => {
            res.status(500).json({message: 'Error looking for post'});
        });
});

//DELETE request
server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    //delete the post referencing the id
    db
        .remove(id)
        .then(response => {
            if(response === 0) {
                res.status(404).json({message: 'The post you are trying to delete does not exist'});
                return;
            }
            res.json({success: `User with id: ${id} was removed from the system`});
        })
        .catch(error =>{
            res.status(500).json({message: 'This user could note be removed'});
            return;
        });
});

//PUT Request

server.put('/api/posts/:id', (req,res) => {
    const id = req.params.id;
    const { title, contents } = req.body;
    if(!title || !contents) {
        res.status(400).json({message: 'Must provide title and contents'});
        return;
    }
    db
        .update(id, {title, contents})
        .then(response => {
            if (response == 0) {
                res.status(404).json({message: 'There is no post with that identifier'});
                return;
            }else{
                res.status(200).json({message: 'successful update'})
            }
        db
            .findById(id)
            .then(post => {
                if (post.length === 0){
                res.status(404).json({message: 'Unable to find specified user'});
                return;
            }
            res.json(post);
            })   
        .catch(error => {
            res.status(500).json({message: 'Error looking up user'});
        }); 
    })
    .catch(error => {
        res.status(500).json({message: 'Problem encountered database'});
        return;
    });     
});

//Once the server is fully configured, we can have it listen for connections on a particular port
//the callback function passed as the second argument will run once when the server starts
server.listen(9000, () => console.log('\n==API on port 9k==\n'));