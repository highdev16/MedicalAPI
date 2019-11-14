let API = {};
const md5= require('md5');
API.run = (app, session, db) => {    
    app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

    app.post("/api/user/login", (req, res, next) => {
        console.log('/api/user/login called');
        let sess = req.session;
        sess.id = 0;
        
        var errors = [];
        if (!req.body.password){
            errors.push("No password specified");
        }
        if (!req.body.email){
            errors.push("No email specified");
        }
        if (errors.length){
            res.status(400).json({"error" : errors.join(",")});
            return;
        }
        var data = {            
            email: req.body.email,
            password : md5(req.body.password)
        }
        
        var sql ='select * from user where email=? and password=?';
        
        var params = [req.body.email, md5(req.body.password)];
        db.all(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            
            if (result.length) {
                
                var sql ='select * from user_profile where user_id=' + result[0]['id'];
                db.all(sql, [], function(errr, resultr) {
                    if (err){
                        res.status(400).json({"error": errr.message})
                        return;                        
                    }       
                    
                    if (resultr.length) {
                        sess.id = result[0]['id'];        
                        res.json({
                            "message": "OK",
                            "user" : result[0]['id'],
                            "isApproved": result[0]['isApproved']
                        }) 
                    } else {
                        res.json({"message" : "signup in progress", "id" : sess.id});
                    }
                });                
            }
            else res.json({"message" : "no"});
        });
    })
}
module.exports = API