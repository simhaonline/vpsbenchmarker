import {IProvider, IServerOptions} from "./IProvider";
import {AmazonLightsail} from "./providers/AmazonLightsail";
import {DigitalOcean} from "./providers/DigitalOcean";
import {Hetzner} from "./providers/Hetzner";
import {Linode} from "./providers/Linode";

const config = require("../config.json");

export default class ProviderFactory {
    private providerCreators = new Map();

    constructor() {
        this.providerCreators.set("lightsail", () => {
            return new AmazonLightsail({
                accessKeyId:    config.providers.lightsail.settings.accessKeyId,
                secretAccessKey: config.providers.lightsail.settings.secretAccessKey,
                sshKey:         config.providers.lightsail.settings.sshKey,
            });
        });
        this.providerCreators.set("hetzner", () => {
            return new Hetzner({
                apiToken:       config.providers.hetzner.settings.apiToken,
                sshKey:         config.providers.hetzner.settings.sshKey,
            });
        });
        this.providerCreators.set("digitalocean", () => {
            return new DigitalOcean({
                apiToken:       config.providers.digitalocean.settings.apiToken,
                sshKey:         config.providers.digitalocean.settings.sshKey,
            });
        });
        this.providerCreators.set("linode", () => {
            return new Linode({
                apiToken:       config.providers.linode.settings.apiToken,
                rootPassword:   config.providers.linode.settings.rootPassword,
                sshKey:         config.providers.linode.settings.sshKey,
            });
        });
    }

    public createProvider<T extends IServerOptions>(name: string, options: T): IProvider<T> {
        const creator = this.providerCreators.get(name);
        if (creator == null) {
            throw new Error(`Provider ${name} does not exists`);
        }
        return creator(options);
    }
}
