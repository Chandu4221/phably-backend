const bcrypt = require('bcrypt')
const Admin = require('../../models/admin')

const jwt = require("jsonwebtoken");
module.exports = (function () {
    /**
     * @params body
     * @For creating a new user
     */
    this.createAdmin = async ({ body }) => {
        /**
         * Get all the varibles name,email,password
        */
        const {name,email,password} = body;

        /** check if all varibles exists */
        if(!name || !email || !password){
            throw new Error("Invalid Parameter: name,email,password required")
        }

        /** check if admin already exists*/
        const checkIfUserExists = await Admin.findOne({adminEmail:email})
        if(checkIfUserExists){
            throw new Error("Admin Already Exists. Please try other email.")
        }

        // create new admin instance
        const newAdmin = new Admin({
            adminEmail: email,
            adminName:name,
            hash : bcrypt.hashSync(password, 10)
        })

        // save admin instance to database
        await newAdmin.save()
        return {data:{"message":"New Admin created"}}
    };

    /**
     * @params body
     * @For update the user
     */
    this.updateAdmin = async({body,decoded}) => {
        // add varibles
        const adminId = decoded._id;
        const {name,password,email} = body
        if(!adminId){
            throw new Error('Invalid parameters: adminId required')
        }

        // check if admin exists in database
        const updateAdmin = await Admin.findById(adminId)
        console.log(updateAdmin)
        // if not exists in throw error
        if(!updateAdmin)
        {
            throw new Error('Admin does not exist')
        }

        // if name exist than update name
        if(name){
            updateAdmin.adminName = name
        }

        //if email exist then update email
        if(email){
            updateAdmin.adminEmail = email
        }
        // if name exist update password
        if(password){
            updateAdmin.hash = bcrypt.hashSync(password, 10)
        }   

        // update the updateAdmin instance to database
        await updateAdmin.save()
        return {data:{"message":"Admin User updated"}}
    }

    /**
     * @params body
     * @For delete the user
     */
    this.deleteAdmin = async({params}) => {
        // add varibles
        const {adminId} = params
        if(!adminId){
            throw new Error('Invalid parameters: adminId required')
        }

        // check if admin exists in database
        const checkAdmin = await Admin.findById(adminId)

        // if not exists in throw error
        if(!checkAdmin)
        {
            throw new Error('Admin does not exist')
        }

        await checkAdmin.delete()
        return {data:{"message":"Admin User Deleted"}}
    }


    /**
     * @params body
     * @For login the superAdmin
     */
    this.loginSuperAdmin = async({body}) => {
        // get the varibles
        const {email,password} = body
        console.log(email,password)
        // if if email is avaible
        const checkAdmin = await Admin.findOne({adminEmail:email,isSuperAdmin:true})
        // console.log(checkAdmin,bcrypt.compareSync(password, checkAdmin.hash))
        // // check if credient are correct
        // if (!checkAdmin || !bcrypt.compareSync(password, checkAdmin.hash)) {
        //     throw new Error("Invalid email or password")
        // }    

        const token = jwt.sign({ _id: checkAdmin._id }, process.env.LOGIN_SUPERADMIN_SECRETE, {
            expiresIn: "3649635 days"
          });
        
        await checkAdmin.updateOne({loginToken:token})
        const superadmin = await Admin.findById(checkAdmin._id)
        return {data:{superadmin,token}}
    }
    

    /**
     * @params body
     * @For get all admin in system
     */
    this.getAllAdmin = async({body}) => {


        const admins = await Admin.find().select("adminEmail adminName createdAt updatedAt")
        return {data:{admins}}
    }

    /**
     * @params body
     * @For update super admin details
     */
    this.updateSuperAdmin = async({body,decoded}) => {
        const superUserId = decoded._id
        const {name,email,password} = body
        const superadmin = await Admin.findById(superUserId)
        if(name){
            superadmin.adminName = name
        }

        if(email){
            superadmin.adminEmail = email
        }

        if(password){
            superadmin.hash = bcrypt.hashSync(password, 10)
        }
        await superadmin.save()

        const updatedAdmin = await Admin.findById(superUserId)
        return {data:{updatedAdmin,"message":"Admin Updated!!"}}
    }


    /**
     * @params body
     * @For logout super admin
     */
    this.logoutSuperAdmin = async({decoded}) => {
        // get varibles
        const superadminId = decoded._id
        // check if superadmin is available
        if(!superadminId) {
            throw new Error("Invalid superAdminId")
        }

        const superadmin = await Admin.findById(superadminId)
        if(!superadmin){
            throw new Error("Cannot find superadmin with id " + superadminId)
        }
        // update the loginToken is empty string
        superadmin.loginToken = ""
        superadmin.save()
        return {data:{"message":"user loggout"}}
    }
    return this;
  })();