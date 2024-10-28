const Group = require('../models/groups');
const GroupUser = require('../models/groupUsers');

exports.postGroup = async (req, res, next) => {
    const group_name = req.body.group_name;

    try {

       const response = await req.user.createGroup({
            group_name: group_name,
            //userId: req.user.id,
        });
     
        res.status(201).json({ message: response });

    }
     catch(err) {
        console.log(err);
    }
}


exports.addGroupUser = async (req, res, next) => {
    const userId = req.body.userId;
    const groupId = req.body.groupId;
    const isAdmin = req.body.isAdmin;

    console.log(isAdmin);
    console.log("Testng hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

    try {
        const existingGroupUser = await GroupUser.findOne({
            where: {
                userId: userId,
                groupId: groupId
            }
        });

        if (existingGroupUser) {
       
            return res.status(409).json({ message: 'User is already in the group.' });
        }

        const response = await GroupUser.create({
            userId: userId,
            groupId: groupId,
            isAdmin: isAdmin,
        });

        res.status(201).json({ message: 'User added to the group.' });

    } catch (err) {

        res.status(400).json({ message: 'Error adding user to the group.' });
    }
};


exports.removeGroupUser =  async (req, res, next) => {
    const userId = req.body.userId;
    const groupId =req.body.groupId;

    try {
       const response = await GroupUser.destroy({ where : {
            userId: userId,
            groupId: groupId,
       }
        });
    if(response > 0){
        res.status(201).json({ message: "User Removed Successfully" });
    } else{
        res.status(401).json({ message: "User Does Not Exist" });
    }
    }
     catch(err) {
 
        res.status(500).json({message: err});
    }
}


exports.getGroups =  async (req, res, next) => {

    try {
        console.log(req.user.id);

       const response = await GroupUser.findAll({
        
            where: { userId: req.user.id},
            include: [{ model: Group, attributes: ['group_name'] }],
        });

        res.status(201).json({ message: response });

    }
     catch(err) {
        console.log(err);
    }
}
