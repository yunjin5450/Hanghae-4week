const express = require("express")
const {Post} = require("../models")
const {Comments} = require("../models")
const authMiddleware = require("../middlewares/auth-middleware")
const router = express.Router();

// 댓글 생성 POST : 완성
router.post("/comments/:postsId", authMiddleware, async (req, res) => {
    const {postsId} = req.params
    const {user} = res.locals
    const {nickname, comment} = req.body
    //{  "comment": "안녕하세요 댓글입니다."}

    const content = await Post.findAll(
    { where:
        { id : postsId}
    })

    if (!content.length) {
        return res.json({ message: "댓글 내용을 입력해주세요." })
    }

    await Comments.create({ userId : user.id, nickname: nickname, comment : comment})

    res.json({ message : "댓글이 등록되었습니다." });
})



// 댓글을 목록 조회 GET : 완성
router.get("/comments/:postsId", async (req, res) => {
    const { postsId } = req.params; 

    await Post.findAll({where: {id : postsId}})

    const data = await Comments.findAll({                            
        attributes : {exclude: ['nickname']}, 
        order: [['createdAt', 'DESC']], 
        where: {id : postsId}});
    
    res.json({data : data})
    
    })

// 댓글 수정 PUT : 완성

router.put("/comments/:commentId", authMiddleware, async (req, res) => {

    const {commentId} = req.params                                 
    const {comment} = req.body 
    
    await Comments.findAll(
        {where:
            {id : commentId}
        });  

    await Comments.update(
        {comment: comment}, 
        {where:
            {id : commentId}
        })
        
        res.json({ message : "댓글을 수정하였습니다." })
})


// 댓글 삭제 DELETE
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params

    await Comments.findAll(
        {where:
            {id : commentId}
        })

    await Comments.destroy(
        {where:
            {id : commentId}
        })

    return res.json({ message: "댓글을 삭제했습니다." })
})

    module.exports = router