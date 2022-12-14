import userModel from "../models/user.js";
import MESSAGES from "../utils/common_message.js";
import Helper from "../utils/helper.js";
import organization from "../models/organization.js";

class orgServices {

    //Add Qrg
  async addQrg(req, res) {
    try {
      const idUser = req.user._id;
      const org = await userModel.findOne({ _id: idUser });

      let attribute = {
        orgName: req.body.orgName,
        address: req.body.address,
        userId: idUser,
        inActive: true,
      };
      let myQrg = new organization(attribute);

      myQrg.save().then(async (value) => {
        const updatOrg = await organization.updateMany(
          { userId: req.user._id, _id: { $ne: value._id } },
          { inActive: false }
        );
        let resPayload = {
          message: MESSAGES.QRG_SUCCESS,
          payload: value,updatOrg,
        };
        return Helper.success(res, resPayload);
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
              inActive: 1,
              address: {
                orgAddress1: 1,
                orgAddress2: 1,
                city: 1,
                state: 1,
                zipCode: 1,
                //inActive: 1,
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
              inActive: 1,
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
      //const updateId = req.params.id;
      const org = await organization
        .findByIdAndUpdate(
          req.params.id,
          { ...req.body, inActive: true },
          { new: true }
        )
        .then(async (value) => {
          const updatOrg = await organization.updateMany(
            { userId: req.user._id, _id: { $ne: value._id } },
            { inActive: false }
          );
          let resPayload = {
            message: MESSAGES.ORG_UPDATED,
            payload: value
          };
          return Helper.success(res, resPayload);
        });
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }
}
export default new orgServices();