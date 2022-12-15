import userModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import MESSAGES from "../utils/common_message.js";
import Helper from "../utils/helper.js";
import organization from "../models/organization.js";

class userServices {
  //Register User
  async userRegister(req, res) {
    try {
      //userName & Email validation check using mongose query
      let userData = await userModel.findOne({
        $or: [{ userName: req.body.userName }, { email: req.body.email }],
      });
      if (userData) {
        let resPayload = {
          message: MESSAGES.USERNAME_EMAIL_USED,
        };
        return Helper.error(res, resPayload);
      }
     
      let myUser = new userModel(req.body);

      const idUser = myUser._id;
      //organization
      if (req.body.organization) {
        let attribute = {
          orgName: req.body.organization.orgName,
          address: req.body.organization.address,
          userId: idUser,
          inActive: true,
        };
        let myQrg = new organization(attribute);
        //org save data
        myQrg.save();
      }

      //save user data
      let registeredUser = await myUser.save();

      //token
      const TokenID = await userModel.findOne({ userName: req.body.userName });
      const token = jwt.sign({ _id: TokenID._id }, process.env.MY_TOKEN, {
        expiresIn: "30m",
      });

      let displayData = {
        UserName: registeredUser.userName,
        FirstName: registeredUser.firstName,
        LastName: registeredUser.lastName,
        Email: registeredUser.email,
        TokenId: token,
      };
      let resPayload = {
        message: MESSAGES.USERNAME__SUCCESS,
        payload: displayData,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Helper.error(res, resPayload);
    }
  }

  //Login user
  async userLogin(req, res) {
    try {

      //check user is a valid user or not
      const extUser = await userModel.findOne({ userName: req.body.userName });
      if (!extUser) {
        let resPayload = {
          message: MESSAGES.LOGIN_ERROR,
          payload: {},
        };
        return Helper.error(res, resPayload);
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        extUser.password
      );
      if (!validPassword) {
        let resPayload = {
          message: MESSAGES.LOGIN_PASSWORD_IN_CORRECT,
          payload: {},
        };
        return Helper.error(res, resPayload);
      }

      // genrate jwt token
      const token = jwt.sign({ _id: extUser._id }, process.env.MY_TOKEN, {
        expiresIn: "6000s",
      });
      let resPayload = {
        message: MESSAGES.LOGIN_SUCCESS,
        payload: { token: token },
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Helper.error(res, resPayload);
    }
  }

  // Update user & password
  async userUpdate(req, res) {
    try {
      const idUser = req.user._id;

      const name = await userModel
        .findOne({ userName: req.body.userName, _id: { $ne: idUser } })
        .lean();

      //name allready used
      if (name) {
        let resPayload = {
          message: MESSAGES.ALLREADY_REGISTER,
          //payload:name
        };
        return Helper.error(res, resPayload);
      }

      //Successfully updated data
      const updateId = req.user._id;

      //password update :  "updatePassword":true
      if (!req.body.updatePassword) {
        delete req.body.password;
      }

      const user = await userModel
        .findByIdAndUpdate(updateId, req.body)
        .select("userName firstName lastName email password ");

      let resPayload = {
        message: MESSAGES.UPDATED_SUCCESS,
        payload: user,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }

}
export default new userServices();
