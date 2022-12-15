import userServices from "../services/user_services.js";
import JoiMainMiddleware from "../middleware/joi_middleware.js";
import authValidaton from "../middleware/auth_middleware.js";
const UserRoute = (app) => {

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
  
}

export default UserRoute;