const express = require("express");
const {Post} = require("../models")
const {Likes} = require("../models")
const authMiddleware = require("../middlewares/auth-middleware")
const router = express.Router();


// 게시글 작성 POST check : 완성
router.post("/posts", authMiddleware, async (req, res) => {
    const {title, content} = req.body
    const {user} = res.locals
    console.log(user)
    await Post.create({userId : user.id, nickname : user.nickname, title : title, content : content})
     
    //  {
    //     "title" : "안녕하세요 1번 게시글 제목입니다.",
    //     "content" : "안녕하세요 1번 content입니다"
    //   }

    res.json({ result : "message : 게시글 작성에 성공하였습니다." })
});


// 게시글 조회 GET // : 완성
router.get("/posts", async (req, res) => {
    const data = await Post.findAll({
    attributes : {exclude: ['content']},
    order: [['createdAt', 'DESC']],
    })
    res.json({ data : data });
})

// 좋아요 게시글 조회 - 더 보기
router.get('/posts/likes', authMiddleware, async (req, res) => {
    const {user} = res.locals  

    const likeA = await Post.findAll({
    attributes : {exclude: ['likes'], order :['DESC']}
    })

    const likeB = await Likes.findAll({
        where:
            {userId : user.id}
    })

    const data = []
    for (let i = 0; i < likeA.length; i++) {
            data.push(await Post.findOne(
                {where : 
                    {userId : likeB[i].userId}
            }))
        
    }
    res.json ({data : data})
})




// // {"data": 
// //     [{      
// //     "postId": 4,      
// //     "userId": 1,      
// //     "nickname": "Developer",     
// //     "title": "안녕하세요 4번째 게시글 제목입니다.",     
// //     "createdAt": "2022-07-25T07:58:39.000Z",      
// //     "updatedAt": "2022-07-25T07:58:39.000Z",      
// //     "likes": 1    
// //         }]}


// 게시글 상세 조회 GET check :완성
router.get("/posts/:postsId", async (req, res) => {
    const {postsId} = req.params
    console.log(req.params)
    const data= await Post.findAll(
    {where : 
        {id : postsId}
    })

    if(!data.length){
        return res.json({message : "게시글이 없습니다."})
    } 

    res.json({ data })
})

// {  
// "data":    
// "postId": 2,    
// "userId": 1,    
// "nickname": ,
// "Developer",    
// "title": "안녕하새요 수정된 게시글 입니다.",    
// "content": "안녕하세요 content 입니다.",    
// "createdAt": "2022-07-25T07:45:56.000Z",    
// "updatedAt": "2022-07-25T07:52:09.000Z",    
// "likes": 0
// }



// // 게시글 수정 PUT check : 완성
router.put("/posts/:postsId", authMiddleware, async (req, res) => {

    const {postsId} = req.params
    const{title, content} = req.body

// {  "title": "안녕하새요 수정된 게시글 입니다.",  
// "content": "안녕하세요 content 입니다."}

    await Post.findAll({where:{id : postsId}})

    await Post.update(
    { title : title , content : content},
    {where:
        {id : postsId}
    })
    
    res.json({ "message" : "게시글이 수정되었습니다." })
    })


//게시글 삭제 DELETE check : 완성
router.delete("/posts/:postsId", authMiddleware, async (req, res) => {
    const {postsId} = req.params
 
    await Post.findOne(
        {where : 
            {id : postsId}
        })
    
    await Post.destroy({
        where:
        {id : postsId}
    })
    
    res.json({ message: "게시글을 삭제하였습니다." })
    
})

//게시글 좋아요 - 
router.put('/posts/:postsId/likes', authMiddleware, async (req, res) => {
          
    const { postsId } = req.params                                    
    const { user } = res.locals.user                              
    const { likes } = req.body  

    const likeC = await Post.findAll(
        {where : {id: postsId, userId : user.id}
    })

    const likeD = await Likes.findOne(
        {where : 
            {userId : user.id}
        })

    if(likeC) {
        if(likes === 1) {
            if(likeD){
                await Likes.create({id: postsId, userId : user.id})
                await Post.increment({likes : 1}),{where : {id : postsId}}
                res.json({"message": "게시글의 좋아요를 등록하였습니다."})
            }
        }else {
                await Likes.destroy({where:{id: postsId, userId : user.id}})
                await Post.decrement({like : 1}, {where : {id : postsId}})
                res.json({"message": "게시글의 좋아요를 취소하였습니다."})
            }
        }   
    })

module.exports = router