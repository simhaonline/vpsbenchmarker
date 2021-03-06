import {IBenchmark, IBenchmarkResult} from "../IBenchmark";

const IGNORED_ARGS = [
    "type",
];

export default abstract class SysbenchBenchmark implements IBenchmark {
    protected readonly options: any;

    protected constructor(options: any) {
        this.options = options;
    }

    public abstract run(client: IClient): Promise<IBenchmarkResult>;

    protected getArgsString(): string {
        const args = [];
        for (const arg in this.options) {
            if (!this.options.hasOwnProperty(arg)) {
                continue;
            }
            if (IGNORED_ARGS.indexOf(arg) >= 0) {
                continue;
            }
            args.push(`--${arg}=${this.options[arg]}`);
        }
        return args.join(" ");
    }

    protected async prepare(client: IClient): Promise<void> {
        const prefix = client.isRoot() ? "" : "sudo ";
        await client.runCommand(`${prefix}apt update`);
        await client.runCommand(`${prefix}apt install sysbench -y`);
    }
}
