export { useClientTranslation } from './client'
export { useServerTranslation } from './server'
export * from './settings'

// Для упрощения использования, создаем общий алиас для клиентской функции
// Файлы, использующие хук, должны явно импортировать его как:
// import { useTranslation } from '@/i18n'
export const useTranslation = useClientTranslation