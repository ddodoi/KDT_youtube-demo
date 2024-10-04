const express = require('express')
const router = express.Router()
const conn = require(`../mariadb`)
const {body, param, validationResult} = require('express-validator')

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()){
        return next()       //다음 할일(미들웨어 , 함수)
    }
    else{
        return res.status(400).json(err.array())
    }
}

router.use(express.json())


router
    .route('/')

    //채널 전체 조회
    .get( 
        [body('user_id').notEmpty().isInt().withMessage('숫자 입력 필요'),
        validate],
    (req, res, next)=>{
        const err = validationResult(req)

        if (!err.isEmpty()){
            return res.status(400).json(err.array())
        }
        
        let {user_id} = req.body

        let sql =  `SELECT * FROM posts WHERE user_id =?`
        conn.query(sql, user_id,
            function(err,results){
                if (err){
                    console.log(err)
                    return res.status(400).end()
                }
                if (results.length){
                    res.status(200).json(results)
                    }
                else{
                    return res.status(400).end()
                }
        })
    })


    //채널 개별 생성-
    .post([body('user_id').notEmpty().isInt().withMessage('숫자 입력 필요'),
        body('name').notEmpty().isString().withMessage('문자 입력 필요'),
        validate],
        (req, res)=>{
            let {name, user_id} = req.body

            let sql = `INSERT INTO posts(name, user_id) VALUES (?, ?)`
            let values = [name, user_id]
            conn.query(sql,values,
            function(err, results){
                if (err){
                    console.log(err)
                    return res.status(400).end()
                }
                if (results.length){
                    res.status(200).json(results)
                    }
                else{
                    return res.status(400).end()
                }
            })
        })




router 
    .route('/:id')
    
    //채널 개별 조회-
    .get([param('id').notEmpty().withMessage('채널 id 필요'), validate],
        (req, res)=>{            
            let {id} = req.params
            id = parseInt(id)

            let sql = `SELECT * FROM posts WHERE user_id = ?`
            conn.query(sql, id, 
                function(err, results){
                    if (results.length){
                    res.status(200).json(results)
                    }
                    else{
                        return res.status(400).end()
                    }
                }
            )
        })
    
    //채널 개별 수정-
    .put([param('id').notEmpty().withMessage('채널 id 필요'),
        body('name').notEmpty().isString().withMessage('채널명 오류'),
        validate],
        (req, res)=>{        
            let {id} = req.params
            id = parseInt(id)
            let {name} = req.body

            let sql = `UPDATE posts SET name = ? WHERE id = ?`
            let values = [name, id]
            conn.query(sql, values, 
                function(err, results){
                    if (err){
                        console.log(err)
                        return res.status(400).end()
                    }
                    if (results.affectedRows == 0){
                        return res.status(400).end()
                    }
                    else{
                        res.status(200).json(results)
                }           
            })

    })

    //채널 개별 삭제-
    .delete([param('id').notEmpty().withMessage('채널 ID 필요'),
        validate],
        (req, res)=>{
        let {id} = req.params
        id = parseInt(id)

        let sql = `DELETE FROM posts WHERE user_id = ?`
        conn.query(sql, id,
             function(err, results){
                if (err){
                    console.log(err)
                    return res.status(400).end()
                }
                if (results.affectedRows == 0){
                    return res.status(400).end()
                }
                else{
                    res.status.json(results)
                }
    })
    })



module.exports = router