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
      //userName validation check
      let data = await userModel.findOne({ userName: req.body.userName });
      if (data) {
        let resPayload = {
          message: MESSAGES.USERNAME_USED,
        };
        return Helper.success(res, resPayload);
      }

      //save user data
      let myUser = new userModel(req.body);

      const idUser = myUser._id;
      //organization
      if (req.body.organization) {
        let attribute = {
          orgName: req.body.organization.orgName,
          address: req.body.organization.address,
          userId: idUser,
        };
        let myQrg = new organization(attribute);
        myQrg.save();
      }

      myUser.save();

      let resPayload = {
        message: MESSAGES.USERNAME__SUCCESS,
        payload: myUser,
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
      const ExtUser = await userModel.findOne({ userName: req.body.userName });
      //user account deleted
      if (ExtUser.isDeleted == true) {
        let resPayload = {
          message: MESSAGES.DELETE_USER,
        };
        return Helper.error(res, resPayload);
      } else {
        //Invalid Credentials
        if (!ExtUser) {
          let resPayload = {
            message: MESSAGES.LOGIN_ERROR,
          };
          return Helper.error(res, resPayload);
        }
        //Password Compare
        const validPassword = await bcrypt.compare(
          req.body.password,
          ExtUser.password
        );

        //Valid Passoword or not
        if (!validPassword)
          return res.status(400).send(MESSAGES.LOGIN_PASSWORD_IN_CORRECT);

        //return res.status(400).send(MESSAGES.LOGIN_PASSWORD_IN_CORRECT);

        const token = jwt.sign({ _id: ExtUser._id }, "mytoken", {
          expiresIn: "30m",
        });
        let resPayload = {
          message: MESSAGES.LOGIN_SUCCESS,
          payload: { TokenID: token },
        };
        return Helper.success(res, resPayload);
        // return res.status(200).send({
        //   message: MESSAGES.LOGIN_SUCCESS,
        //   Token: token,
        // });
      }
    } catch (err) {
      let resPayload = {
        message: MESSAGES.LOGIN_DELETE,
      };
      return Helper.error(res, resPayload);
    }
  }

  // Update user & password
  async userUpdate(req, res) {
    try {
      if (req.body.password) {
        const passwrd = await userModel.findOne({ _id: req.user._id });
        if (passwrd.reset_password == false) {
          let resPayload = {
            message: MESSAGES.RESET_PASSWORD,
            //payload:passwrd
          };
          return Helper.success(res, resPayload);
        }
      }
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
        return Helper.success(res, resPayload);
      }

      //Successfully updated data
      const updateId = req.user._id;
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



  //Add Qrg
  async addQrg(req, res) {
    try {
      const idUser = req.user._id;
      const org = await userModel.findOne({ _id: idUser });

      //User Not Found
      if (org.isDeleted == true) {
        let resPayload = {
          message: MESSAGES.DELETE_NOT_FOUND,
        };
        return Helper.success(res, resPayload);
      }

      let attribute = {
        orgName: req.body.orgName,
        address: req.body.address,
        userId: idUser,
      };
      let myQrg = new organization(attribute);

      myQrg
        .save()
        .then((value) => {
          let resPayload = {
            message: MESSAGES.QRG_SUCCESS,
            payload: myQrg,
          };
          return Helper.success(res, resPayload);
        })
        .catch((err) => {
          let resPayload = {
            message: err,
            payload: {},
          };
          return Helper.error(res, resPayload);
        });
    } catch (err) {
      let resPayload = {
        message: MESSAGES.SERVER_ERROR,
        payload: {},
      };
      return Helper.error(res, resPayload, 500);
    }
  }

  //Show all user data
  async totalUserQrg(req, res) {
    try {
      let allUserQrg = await userModel.aggregate([
        {
          $lookup: {
            from: "organizations",
            localField: "_id",
            foreignField: "userId",
            as: "org",
          },
        },
        {
          $project: {
            _id: 0,
            userName: 1,
            org: {
              orgName: 1,
              address: {
                orgAddress1: 1,
                orgAddress2: 1,
                city: 1,
                state: 1,
                zipCode: 1,
                inActive: 1,
              },
            },
          },
        },
      ]);
      let resPayload = {
        message: MESSAGES.PROFILE,
        payload: allUserQrg,
      };
     return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGES.SERVER_ERROR,
        payload: {},
      };
      return Helper.error(res, resPayload, 500);
    }
  }

  //get token single user data with org
  async getUserQrg(req, res) {
    try {
      let tokenId = req.user._id;
      let allUserOrg = await userModel.aggregate([
        {
          $lookup: {
            from: "organizations",
            localField: "_id",
            foreignField: "userId",
            as: "org",
          },
        },
        {
          $match: {
            _id: tokenId,
          },
        },
        {
          $project: {
            _id: 0,
            userName: 1,
            org: {
              orgName: 1,
              address: {
                orgAddress1: 1,
                orgAddress2: 1,
                city: 1,
                state: 1,
                zipCode: 1,
                inActive: 1,
              },
            },
          },
        },
      ]);

      //return res.send(allUserQuotes)
      let resPayload = {
        message: MESSAGES.PROFILE,
        payload: allUserOrg,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGES.SERVER_ERROR,
        payload: {},
      };
      return Helper.error(res, resPayload, 500);
    }
  }

  //org update
  async orgUpdate(req, res) {
    try {
      // const ExtUser = await organization
      //   .findOne({ id: req.body._id})
      //Successfully updated data
      const updateId = req.params.id;
      //console.log(updateId);
      const org = await organization.findByIdAndUpdate(updateId, req.body);

      let resPayload = {
        message: MESSAGES.ORG_UPDATED,
        payload: org,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }

    //soft delete
  // async userDelete(req, res) {
  //   try {
  //     const id = req.user._id;
  //     const okUser = await userModel.findOne({ _id: id });

  //     //check it user DB isDeletted true or not
  //     //User Not Found
  //     if (okUser.isDeleted == true) {
  //       let resPayload = {
  //         message: MESSAGES.DELETE_NOT_FOUND,
  //       };
  //       return Helper.success(res, resPayload);
  //     }

  //     //User Deleted
  //     const myUser = await userModel
  //       .findByIdAndUpdate(id, { isDeleted: true })
  //       .then((item) => {
  //         let resPayload = {
  //           message: MESSAGES.DELETE_USER,
  //         };
  //         return Helper.success(res, resPayload);
  //       });
  //   } catch (error) {
  //     let resPayload = {
  //       message: err.message,
  //       payload: {},
  //     };
  //     return Helper.error(res, resPayload);
  //   }
  // }
}
export default new userServices();
