import { runNpmScript } from "./common/runner.mjs";

async function main() {
    const args = process.argv.slice(2);
    const prefix = "--build";
    const filter = (arg) => { return arg.startsWith(prefix); };
    const replace = (arg) => { return arg.replace(prefix, "-"); };
    const filtered = args.filter(filter).map(replace).flatMap((arg) => { return arg.split('='); });
    const others = args.filter((arg) => { return !filter(arg); });

    try {
        if (filtered.includes("--skip")) {
            console.log("Skipping build");
            process.exit(0);
        }
        await runNpmScript("lint", others);
        if (! others.includes("--tsoa-skip")) await runNpmScript("tsoa:gen");
        else                                  console.log("Skipping tsoa generation");
        await runNpmScript("build:run", filtered);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

main();
