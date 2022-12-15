import mongoose from "mongoose";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";

const organizationSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    orgName: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    inActive: {
      type: Boolean,
      default: false,
    },

    address: {
      orgAddress1: {
        type: String,
        required: false,
      },
      orgAddress2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      // country: {
      //   type: String,
      //   required: false,
      // },
      zipCode: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

let organization = mongoose.model("organization", organizationSchema);
export default organization;
