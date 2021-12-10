import mongoose from "mongoose";
import log from "../logger";

function connect(dbUri: string) {
    return mongoose
        .connect(dbUri)
        .then(() => {
            log.info("Database connected");
        })
        .catch((error) => {
            log.error(error);
            process.exit(1);
        });
}

export default connect;