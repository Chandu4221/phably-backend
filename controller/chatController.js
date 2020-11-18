const {
    createMessage,
    getMessages,
    sendIndividualMessage,
    getIndividualMessage
} = require("../services/chat/chatService")
module.exports = {    
    sendGroupMessage:async(req,res) => {
        try {
            ReS(res,await createMessage(req),200)
          } catch (error) {
            ReE(res, error, 422, "chat Controller >>> create sendGroupMessage method");
          }
    },
    getGroupMessage:async(req,res) => {
        try {
            ReS(res,await getMessages(req),200)
          } catch (error) {
            ReE(res, error, 422, "chat Controller >>> create getGroupMessage method");
          }
    },
    sendPrivateMessage:async (req, res) => {
      try {
        ReS(res,await sendIndividualMessage(req),200)
      } catch (error) {
        ReE(res, error, 422, "chat Controller >>> chat Controller >>> sendPrivateMessage method");
      }
    },
    getPrivateMessage:async (req, res) => {
      try {
        ReS(res,await getIndividualMessage(req),200)
      } catch (error) {
        ReE(res, error, 422, "chat Controller >>> chat Controller >>> getPrivateMessage method");
      }
    }
    
}