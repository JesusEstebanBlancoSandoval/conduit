import {defineConfig} from "@mikro-orm/core"
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';


export default defineConfig({
    host:'localhost',
    port: 3307,
    user :'root',
    password:'',
    dbName: 'conduitdb',
    entities: ['./dist/**/*.entities.js'],
    entitiesTs: ['./src/**/*.entities.ts'],
    debug: true,
    //highlighter:
    //revisar si este apartado es correcto
    metadataProvider: TsMorphMetadataProvider,
})
    