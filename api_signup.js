let API = {};
const md5= require('md5');
API.run = (app, session, db) => {    
    app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

    app.post("/api/user_cnt/", (req, res, next) => {
        var errors=[]
        if (/^[0-9]\d*.?\d*$/.test(req.body.current_weight)){
            errors.push("No valid weight specified");
        }
        if (/^[0-9]\d*.?\d*$/.test(req.body.current_Height)){
            errors.push("No valid Height specified");
        }
        
        if (/^[1-9]\d*$/.test(req.body.age)){
            errors.push("No valid age specified");
        }        
        
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        
        const {user_id, gender, starting_weight, current_weight, current_height, age, daily_calorie_height} = req.body;
        
        var sql ='INSERT INTO user_profile (age, photo, gender,starting_weight, current_weight, current_height, daily_calorie_limit, user_id) values (?,?,?,?,?,?,?,?)';
        var params =[
            age, '', gender, starting_weight, current_weight, current_height, daily_calorie_height, user_id
        ];

        db.run(sql, params, function (err, result) {
            if (err){
                console.log(err);
                res.status(400).json({"error": err.message})
                return;
            }

            console.log(this.lastID + " returns");
            res.json({
                "message": "success", "value" : this.lastID
            })
        });
    })

}
module.exports = API