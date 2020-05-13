const express = require('express');
const router = express.Router();
const db = require('./data/db');

router.post('/', (req,res)=>{
    // console.log('req in router post',req.body)
    const post = req.body;
    if(!post.contents || !post.title){
        
        res.status(400).json({errorMessage:'Please provide title and contents for the post.' })
        
        }else{
            db.insert(post)
        .then(
            postId =>{
            post.id = postId.id;
            res.status(201).json(post);
            })
        .catch(err =>{
            res.status(500).json({errorMessage:'There was an error while saving the post to the database'})
        })
        
    }



})

router.get('/', (req,res)=>{
    // console.log(res)
    db.find()
    .then(postList =>{
        res.status(200).json(postList)
    })
    .catch(err=>{
        res.status(500).json({error:'The posts information could not be retrieved.'})
    })

})

router.get('/:id',(req,res)=>{
    // console.log(req.body)
    db.findById(req.params.id)
    .then(post =>{
        if(post.length){
            res.status(200).json(post[0])
        }else{res.status(404).json({message:'The post with the specified ID does not exist.'})}
    })
    .catch(err=>{res.status(500).json({error:'The post information could not be retrieved.'})})
})

router.put('/:id',(req,res)=>{
    // console.log(req.body)
    const changes = req.body;
    if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
       }else{ 
       db.update(req.params.id, changes)
    .then(post=>{
        if(post){
            res.status(200).json(changes)
        }else{
            res.status(404).json({message:'The post with the specified ID does not exist.'})
        }
    })
    .catch(err=>{
        res.status(500).json({ error: "The post information could not be modified." })
    })

    }
})

router.delete('/:id',(req,res)=>{
    // console.log(req.body)
    db.remove(req.params.id)
    .then(post =>{
        if(post >0 ){
            res.status(200).json({message:'The Post has been deleted'});
        }else{res.status(404).json({message:'The post with the specified ID does not exist.'})}
    })
    .catch(err =>{
        res.status(500).json({message: 'The post could not be removed'})
    })
})

router.get('/:id/comments',(req,res)=>{
    // console.log(req.body)
    db.findPostComments(req.params.id)
    .then(comment=>{
        if(comment.length >0 ){
            res.status(200).json(comment)
        }else{
            res.status(404).json({message: '"The post with the specified ID does not exist."'})
        }
    })
})

router.post('/:id/comments',(req,res)=>{
    console.log(req.body)
    let comment = req.body;
    if(!comment.post_id){
        res.status(404).json({message:'The post with the specified ID does not exist'})
    }else if(!comment.text){
        res.status(400).json({errorMessage: 'Please provide text for the comment'})
    }else{
      db.insertComment(comment)
      .then(
        commentId =>{
        comment.id = commentId.id;
        res.status(201).json(comment);
      })
      .catch(err =>{
        res.status(500).json({error: "There was an error while saving the comment to the database"})
      })
    }
    
    
})
module.exports = router;