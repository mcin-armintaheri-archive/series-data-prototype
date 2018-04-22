import { ORM } from "redux-orm";
import { Series } from "./series";

const orm = new ORM();
orm.register(Series);

export default orm;
