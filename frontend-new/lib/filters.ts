// Конфигурация фильтров для управления через админ панель
// В реальном приложении эти данные должны храниться в базе данных

export interface FilterConfig {
  id: string;
  label: string;
  type: 'material' | 'category' | 'price' | 'sort';
  active: boolean;
  order: number;
  value?: string;
}

// Начальная конфигурация фильтров
export const initialFilters: FilterConfig[] = [
  // Материалы
  { id: 'material_buk', label: 'Бук', type: 'material', active: true, order: 1, value: 'Бук' },
  { id: 'material_yasen', label: 'Ясень', type: 'material', active: true, order: 2, value: 'Ясень' },
  { id: 'material_dub', label: 'Дуб', type: 'material', active: true, order: 3, value: 'Дуб' },
  
  // Сортировка
  { id: 'sort_popular', label: 'Популярные', type: 'sort', active: true, order: 4, value: 'popular' },
  { id: 'sort_new', label: 'Новинки', type: 'sort', active: true, order: 5, value: 'new' },
  { id: 'sort_price_asc', label: 'Цена: по возрастанию', type: 'sort', active: true, order: 6, value: 'price_asc' },
  { id: 'sort_price_desc', label: 'Цена: по убыванию', type: 'sort', active: true, order: 7, value: 'price_desc' },
];

// Функция для получения активных фильтров по типу
export function getActiveFilters(type: FilterConfig['type']): FilterConfig[] {
  return initialFilters
    .filter(filter => filter.type === type && filter.active)
    .sort((a, b) => a.order - b.order);
}

// Функция для получения значений активных фильтров
export function getActiveFilterValues(type: FilterConfig['type']): string[] {
  return getActiveFilters(type)
    .map(filter => filter.value || filter.label)
    .filter((value): value is string => value !== undefined);
}
