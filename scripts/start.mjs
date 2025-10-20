import { runNpmScript } from "./common/runner.mjs";

async function main() {
    const args = process.argv.slice(2);
    const prefix = "--start";
    const filter = (arg) => { return arg.startsWith(prefix); };
    const replace = (arg) => { return arg.replace(prefix, "-"); };
    const filtered = args.filter(filter).map(replace);
    const others = args.filter((arg) => { return !filter(arg); });

    try {
        await runNpmScript("build", others);
        await runNpmScript("start:run", filtered);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

main();
