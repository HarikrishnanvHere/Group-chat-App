const Message = require('../models/messages');
// const MessageArchieved = require('../models/messagesArchieved');
const User = require('../models/users');
// const S3services = require('../services/s3Services');
const {Op} = require('sequelize');
// const CronJob = require('cron').CronJob;
const GroupUser = require('../models/groupUsers');
const Group = require('../models/groups');

function isValidMessage(message) {
    if(typeof message === 'string' && message.length > 0){
        return true;
    } else {
        return false;
    }
}

exports.saveMessage = async(req,res,next) => {
    try {
        const message = req.body.message;
        const groupId = req.body.groupId;
        console.log(message);
        if(isValidMessage(message)) {
            const groupUser = await GroupUser.findOne({where: {
                groupId: groupId,
                userId: req.user.id
            }})
            if(!groupUser) {
                throw new Error('user not found in group');
            }
            await req.user.createMessage({
                message: message,
                groupId: groupId,
                //username: req.user.name
            }).then((data)=>{
                res.status(200).json({message: 'msg saved to database', data: data});
            })
            
        }
        else {
            throw new Error('invalid message format');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
}


exports.getMessages = async (req, res, next) => {


    try {

   const lastMsgId = req.query.id || 0;
   const groupId = req.query.groupid;

   const messages = await  Message.findAll({
    where :{ id: { [Op.gt] : lastMsgId}, 
             groupId: groupId   },
    include: [{ model: User, attributes: ['name'] }],
   });

   res.json(messages)

    }
     catch(err) {
        console.log(err);
    }
}