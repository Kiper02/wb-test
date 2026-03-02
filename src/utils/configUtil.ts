export default function configUtil(variable: string) {
    const key = process.env[variable];
    if (!key) throw new Error(`Переменная окружения '${variable}' не найдена`);
    return key;
}
