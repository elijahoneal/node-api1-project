// BUILD YOUR SERVER HERE
const express = require('express')
const Model = require('./users/model')
const server = express();


server.use(express.json())

server.post('/api/users', async (req, res) => {
    const model = req.body;
    
    if ( !model.name || !model.bio) {
        res.status(400).send({ message: "Please provide name and bio for the user" })
    } else {
      await Model.insert(model)
            .then(newModel =>  res.status(201).send(newModel))
            .catch( err => res.status(500).send({ message: "There was an error while saving the user to the database" }) )
       
    }
})

server.get('/api/users', async (req, res) => {
  await Model.find()
        .then(models => {
            res.status(200).send(models)
        })
        .catch( err => {
            res.status(500).send({ message: "The users information could not be retrieved" })
        })
})

server.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    
   await Model.findById(id)
        .then( thisModel => {
            if( thisModel){
                res.status(200).send(thisModel)
            } else { 
                res.status(404).send({ message: "The user with the specified ID does not exist" })
            }
        } )
        .catch( err => {
            res.status(500).send({ message: "The user information could not be retrieved" })
        } )
})

server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

   await Model.remove(id)
        .then( deletedModel => {
            if (deletedModel){ 
                res.status(200).send(deletedModel)
            } else { 
                res.status(404).send({ message: "The user with the specified ID does not exist" })
            }
        } )
        .catch( err => {
            res.status(500).send({ message: "The user could not be removed" })
        })
})

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if ( !changes.name || !changes.bio){
        res.status(400).send({ message: "Please provide name and bio for the user" })
    } else {
       await Model.update(id , changes)
        .then( updateModel => {
            updateModel ? res.status(200).send(updateModel) : res.status(404).send({ message: "The user with the specified ID does not exist" })
        } )
        .catch( err => { 
            res.status(500).send({ message: "The user information could not be modified" })
        })
    }

    
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
