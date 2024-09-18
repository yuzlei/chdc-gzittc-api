import path from "path";

const port: number = 3000

const apiUrl: string = process.env.VITE_API_URL || `http://localhost:${port}`;

const dbUrl: string = process.env.DB_URL || 'mongodb://localhost:27017/chdc-gzittc';

const routerPrefix: string = '/api/v1'

const publicPath: string = path.join(__dirname, '../../public')

export {
    apiUrl,
    dbUrl,
    routerPrefix,
    port,
    publicPath
}