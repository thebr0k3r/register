const t = require("ava");
const fs = require("fs-extra");
const path = require("path");

const PR_AUTHOR = process.env.PR_AUTHOR;
let MODIFIED_FILES = process.env.MODIFIED_FILES.split(" ");

for (let i = 0; i < MODIFIED_FILES.length; i++) {
    MODIFIED_FILES[i] = MODIFIED_FILES[i].substring(MODIFIED_FILES[i].lastIndexOf("/") + 1);
}

const domainsPath = path.resolve("domains");

const admins = require("../util/administrators.json");

t("Modified JSON files must be owned by the PR author", (t) => {
    if(process.env.EVENT !== "pull_request") {
        t.pass();
        return;
    }

    MODIFIED_FILES.forEach((file) => {
        const domain = fs.readJsonSync(path.join(domainsPath, file));

        t.true(
            domain.owner.username === PR_AUTHOR || admins.includes(PR_AUTHOR),
            `${file}: Owner is ${domain.owner.username} but ${PR_AUTHOR} is the PR author`
        );
    });
});
