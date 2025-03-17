export default function decodeCredentials(hash: string): { login: string; password: string } {
    const decoded = Buffer.from(hash, 'base64').toString('utf-8');
    
    const [login, password] = decoded.split(':');

    return {
        login,
        password
    };
}