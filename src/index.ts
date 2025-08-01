import { config } from "dotenv";
import * as cron from "node-cron";

config();

import app from "./app";
import { cleanExpiredMagicLinks, cleanExpiredRefreshTokens, cleanNotVerifiedUsers } from "./database/cleaner";

// En la media noche de todos los dias
cron.schedule('0 0 * * *', async () => {
    console.log("Cleaning tokens");
    await cleanExpiredRefreshTokens();
    await cleanNotVerifiedUsers();
    await cleanExpiredMagicLinks();
});

const port = app.get("port");
app.listen(port, () => {
    console.log("Serving on port: ", port);
})