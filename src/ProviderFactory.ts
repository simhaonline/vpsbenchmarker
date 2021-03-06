import {IProvider, IServerOptions} from "./IProvider";
import {AmazonLightsail} from "./providers/AmazonLightsail";
import {DigitalOcean} from "./providers/DigitalOcean";
import {Hetzner} from "./providers/Hetzner";
import {Linode} from "./providers/Linode";
import {Vultr} from "./providers/Vultr";

const config = require("../config.json");

export default class ProviderFactory {
    private providerCreators = new Map();

    constructor() {
        this.providerCreators.set("lightsail", () => {
            return new AmazonLightsail({
                accessKeyId:    config.providers.lightsail.settings.accessKeyId,
                logo:           config.providers.lightsail.logo,
                name:           config.providers.lightsail.name,
                secretAccessKey: config.providers.lightsail.settings.secretAccessKey,
                sshKey:         config.providers.lightsail.settings.sshKey,
            });
        });
        this.providerCreators.set("hetzner", () => {
            return new Hetzner({
                apiToken:       config.providers.hetzner.settings.apiToken,
                logo:           config.providers.hetzner.logo,
                name:           config.providers.hetzner.name,
                sshKey:         config.providers.hetzner.settings.sshKey,
            });
        });
        this.providerCreators.set("digitalocean", () => {
            return new DigitalOcean({
                apiToken:       config.providers.digitalocean.settings.apiToken,
                logo:           config.providers.digitalocean.logo,
                name:           config.providers.digitalocean.name,
                sshKey:         config.providers.digitalocean.settings.sshKey,
            });
        });
        this.providerCreators.set("linode", () => {
            return new Linode({
                apiToken:       config.providers.linode.settings.apiToken,
                logo:           config.providers.linode.logo,
                name:           config.providers.linode.name,
                rootPassword:   config.providers.linode.settings.rootPassword,
                sshKey:         config.providers.linode.settings.sshKey,
            });
        });
        this.providerCreators.set("vultr", () => {
            return new Vultr({
                apiToken:       config.providers.vultr.settings.apiToken,
                logo:           config.providers.vultr.logo,
                name:           config.providers.vultr.name,
                sshKey:         config.providers.vultr.settings.sshKey,
            });
        });
    }

    public createProvider(name: string, options: IServerOptions): IProvider {
        const creator = this.providerCreators.get(name);
        if (creator == null) {
            throw new Error(`Provider ${name} does not exists`);
        }
        return creator(options);
    }
}
