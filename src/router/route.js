import UserRoute from "./user";
import OrgRoute from "./organization";
const Route = (app) => {

  UserRoute(app);
  OrgRoute(app);
};

export default Route;
