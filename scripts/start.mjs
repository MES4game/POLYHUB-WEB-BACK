import { runNpmScript } from "./common/runner.mjs";

async function main() {
    const args = process.argv.slice(2);
    const prefix = "--start";
    const filter = (arg) => { return arg.startsWith(prefix); };
    const replace = (arg) => { return arg.replace(prefix, "-"); };
    const filtered = args.filter(filter).map(replace).flatMap((arg) => { return arg.split('='); });
    const others = args.filter((arg) => { return !filter(arg); });

    try {
        await runNpmScript("build", others);
        await runNpmScript("start:run", filtered, true);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

main();
