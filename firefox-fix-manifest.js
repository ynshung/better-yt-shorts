const { exec } = require("child_process");
const fs = require("fs");

const RELATIVE_PATH_TO_MANIFEST = "./dist/manifest.json";

const REPLACED_LINES = {
    service_worker: '\t\t"scripts": ["service-worker-loader.js"],',
};

exec("npm run build", (error) => {``
    if (error) {
        console.error("An error occurred while running 'npm run build'.", error);
    } else {
        try {
            const chromeManifest = fs.readFileSync(
                RELATIVE_PATH_TO_MANIFEST,
                "utf8"
            );
            const lines = chromeManifest.split("\n");
            const newLines = [];

            lines.forEach((line) => {
                for (const key in REPLACED_LINES) {
                    if (line.includes(key)) {
                        line = REPLACED_LINES[key];
                    }
                }
                newLines.push(line);
            });

            fs.writeFileSync(RELATIVE_PATH_TO_MANIFEST, newLines.join("\n"));
            console.log("Firefox manifest created successfully.");
        } catch (error) {
            console.error(
                "An error occurred while creating the Firefox manifest.", error
            );
        }
    }
});
