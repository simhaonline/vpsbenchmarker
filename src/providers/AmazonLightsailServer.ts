import {Instance} from "aws-sdk/clients/lightsail";
import {IServer, IServerInfo} from "../IServer";
import {ISshClientOptions, SshClient} from "../SshClient";

const logger = console;

export default class AmazonLightsailServer implements IServer {
    public readonly instanceName: string;
    public readonly region: string;
    private readonly serverInfo: Instance;
    private readonly clientOptions: ISshClientOptions;

    public constructor(instanceName: string, region: string, serverInfo: Instance, clientOptions: ISshClientOptions) {
        this.instanceName = instanceName;
        this.region = region;
        this.serverInfo = serverInfo;
        this.clientOptions = clientOptions;
    }

    public async connect(): Promise<IClient> {
        const client = new SshClient(this.clientOptions);
        while (true) {
            try {
                await client.connect();
                break;
            } catch (e) {
                logger.log(`Error during connection to server ${this.instanceName}: ${e.message}\nTrying again...`);
                await new Promise((resolve) => setTimeout(resolve, 30000));
            }
        }
        return client;
    }

    public async getInfo(): Promise<IServerInfo> {
        return {
            city: "",
            cores: 1,
            country: "",
            id: this.instanceName,
            location: "",
            memory: 0,
            os: ``,
            priceHourly: 0,
            priceMonthly: 0,
            transfer: 0,
            volumeSize: 0,
            volumeType: "ssd",
        };
    }
}