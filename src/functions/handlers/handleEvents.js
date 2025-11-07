import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export default (client) => {
    client.handleEvents = async () => {
        const eventFolders = readdirSync(`./src/events`);
        for (const folder of eventFolders) {
            const eventFiles = readdirSync(`./src/events/${folder}`)
                .filter((file) => file.endsWith(".js"));
            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const fullPath = path.resolve(`./src/events/${folder}/${file}`);
                        const mod = await import(pathToFileURL(fullPath).href);
                        const event = mod.default ?? mod;
                        if (event.once) 
                            client.once(event.name, (...args) => 
                                event.execute(...args, client)
                            );
                        else 
                            client.on(event.name, (...args) => 
                                event.execute(...args, client)
                            );
                    }
                    break;
                    
                default:
                    break;
            }
        }
    }
};