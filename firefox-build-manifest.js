const { exec } = require("child_process");
const fs = require("fs");

const RELATIVE_PATH_TO_MANIFEST = "./dist/manifest.json";

if (process.argv[2] && process.argv[2] === "--skip-build") {
    buildFirefoxManifest();
} else {
    exec("npm run build", (error) => {
        if (error) {
            console.error(
                "An error occurred while running 'npm run build'.",
                error
            );
        } else {
            buildFirefoxManifest();
        }
    });
}

function buildFirefoxManifest() {
    try {
        const manifest = JSON.parse(
            fs.readFileSync(RELATIVE_PATH_TO_MANIFEST, "utf8")
        );

        manifest.manifest_version = 2;
        manifest.browser_action = manifest.action;
        delete manifest.action;

        manifest.background.scripts = [manifest.background.service_worker];
        delete manifest.background.service_worker;

        manifest.web_accessible_resources = manifest.web_accessible_resources.resources;

        manifest.browser_specific_settings = {
            gecko: {
                id: "{ac34afe8-3a2e-4201-b745-346c0cf6ec7d}",
            },
        };

        fs.writeFileSync(
            RELATIVE_PATH_TO_MANIFEST,
            JSON.stringify(manifest, null, 2)
        );

        console.log("Firefox manifest created successfully.");
    } catch (error) {
        console.error(
            "An error occurred while creating the Firefox manifest.",
            error
        );
    }
}
