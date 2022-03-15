const admin = require("../models/admin");
const aliens = require("../models/train");

const adminCtrl = {
    // google login logic
    login: async (req, res) => {
        try{
            const {username, password} = req.body;
            const user = await admin.findOne({ username: username, password: password })   
            if(user){
                return res.json({ user: true })
            }else {
                return res.json({ user: false })
            }
        }catch(err){
            console.log(err)
        }
    },
    savetrain: async (req, res) => {
        try{
            
            const {course, details} = req.body;
            const new_train = new aliens({
                pname: course.pname,
                price: course.price,
                img: course.img,
                category: course.category,
                discription: course.description,
                invigilator: course.invigilator,
                featured: course.featured,
                details: details
            })
            new_train.save();
            return res.json({ data: "added" })

        }catch(err){
            console.log(err);
        }
    },
    update_train: async (req, res) => {
        try{
            const {values} = req.body;
            console.log(values);
            const category = values.category_of_update;
            console.log(category);
            const find = await aliens.findOne({pname: values.pname});
            var updateVal = {};
            updateVal[category] = values.update;
            console.log(updateVal)
            if(find){
                const document = {
                    $set: updateVal,
                  };
                  const update2 = await aliens.updateOne(find, document);
                  if(update2.n > 0){
                      return res.json({ data: "updated" })
                  }else {
                      return res.json({ data: "failed" })
                  }
            }else {
                return res.json({ data: "failed" })
            }
        }catch(err){
            console.log(err)
        }
    },
    delete_train: async (req, res) => {
        try{
            const {values} = req.body;
            const response = await aliens.deleteOne({ pname: values.pname });
            if(response.n > 0){
                return res.json({ data: "updated" })
            }else {
                return res.json({ data: "failed" });
            }
        }catch(err){
            console.log(err);
        }
    }
    
}

module.exports = adminCtrl;