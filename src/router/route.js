import userServices from "../services/user_services.js";
import JoiMainMiddleware from "../middleware/joi_middleware.js";
import authValidaton from "../middleware/auth_middleware.js";
//import userModel from "../models/user.js";

const Route = (app) => {

  //Register User
  app.post(
    "/api/user/add",
    JoiMainMiddleware.JoiMiddleware,
    userServices.userRegister
  );

  //login User
  app.post(
    "/api/user/login",
    JoiMainMiddleware.JoiMiddleware,
    userServices.userLogin
  );

  //update Details user
  app.put(
    "/api/user/update",
    [authValidaton, JoiMainMiddleware.JoiMiddleware],
    userServices.userUpdate
  );
  
  //add organization
  app.post("/api/organization/add", [authValidaton, JoiMainMiddleware.JoiMiddleware],userServices.addQrg);

  // all user & organization
  app.get("/api/organization/alluser", userServices.totalUserQrg);

  // single user & organization with token
  app.get("/api/organization/user", authValidaton, userServices.getUserQrg);

  //update organization
  app.put("/api/org/update/:id",authValidaton,userServices.orgUpdate);


  //delete user
  // app.post("/api/user/delete", authValidaton, userServices.userDelete);
};

export default Route;
