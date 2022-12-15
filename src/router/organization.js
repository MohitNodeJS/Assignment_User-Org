import JoiMainMiddleware from "../middleware/joi_middleware.js";
import authValidaton from "../middleware/auth_middleware.js";
import orgServices from "../services/org_services.js";
const OrgRoute = (app) => {
      //add organization
  app.post("/api/organization/add", [authValidaton, JoiMainMiddleware.JoiMiddleware],orgServices.addQrg);

  // all user & organization
  app.get("/api/organization/alluser", orgServices.totalUserQrg);

  // single user & organization with token
  app.get("/api/organization/user", authValidaton, orgServices.getUserQrg);

  //update organization
  app.put("/api/org/update/:id",[authValidaton, JoiMainMiddleware.JoiMiddleware],orgServices.orgUpdate);

}
export default OrgRoute;