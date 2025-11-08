import { runNpmScript } from "./common/runner.mjs";

async function main() {
    const args = process.argv.slice(2);
    const prefix = "--tsoa";
    const filter = (arg) => { return arg.startsWith(prefix); };
    const replace = (arg) => { return arg.replace(prefix, "-"); };
    const filtered = args.filter(filter).map(replace).flatMap((arg) => { return arg.split('='); });

    try {
        if (filtered.includes("--skip")) {
            console.log("Skipping tsoa generation");
            process.exit(0);
        }
        if (filtered.includes("--skip-spec")) console.log("Skipping tsoa spec generation");
        else                                  await runNpmScript("tsoa:spec");
        if (filtered.includes("--skip-routes")) console.log("Skipping tsoa routes generation");
        else                                    await runNpmScript("tsoa:routes");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

main();
