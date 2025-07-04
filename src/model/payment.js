import { Schema, model, models } from "mongoose"
const setUpPaymentSchema = new Schema(
  {
    schoolName: String,
    schoolId: String,
    contactEmail: {
      type: String,
      unique: true,
    },
    accountNumber: String,
    bankName: String,
    accountName: String,
    useOwnGateway: {
      type: Boolean,
      default: false,
    },
    termsAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "createdOn" } }
)
const SetUpPayment =
  models.SetUpPayment || model("SetUpPayment", setUpPaymentSchema)
export default SetUpPayment
