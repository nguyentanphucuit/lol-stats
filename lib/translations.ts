import { LOCALE } from './locales'

export interface Translations {
  navigation: {
    home: string
    champions: string
    items: string
    runes: string
    spells: string
  }
  dashboard: {
    title: string
  }
  home: {
    title: string
    subtitle: string
    champions: {
      title: string
      description: string
    }
    items: {
      title: string
      description: string
    }
    runes: {
      title: string
      description: string
    }
    spells: {
      title: string
      description: string
    }
  }
  common: {
    loading: string
    error: string
    search: string
    clear: string
    next: string
    previous: string
    page: string
    of: string
    items: string
    results: string
  }
}

const translations: Record<string, Translations> = {
  [LOCALE.US]: {
    navigation: {
      home: 'Home',
      champions: 'Champions',
      items: 'Items',
      runes: 'Runes',
      spells: 'Spells',
    },
    dashboard: {
      title: 'League of Legends Data',
    },
    home: {
      title: 'Welcome to League Stats',
      subtitle:
        'Explore detailed information about Champions, Items, Runes and Spells in League of Legends',
      champions: {
        title: 'Champions',
        description: 'Learn about champions and their abilities',
      },
      items: {
        title: 'Items',
        description: 'Explore items and their effects',
      },
      runes: {
        title: 'Runes',
        description: 'Customize your build with the rune system',
      },
      spells: {
        title: 'Spells',
        description: 'Learn about spells and how to use them',
      },
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      search: 'Search',
      clear: 'Clear',
      next: 'Next',
      previous: 'Previous',
      page: 'Page',
      of: 'of',
      items: 'items',
      results: 'results',
    },
  },
  [LOCALE.VN]: {
    navigation: {
      home: 'Trang chủ',
      champions: 'Tướng',
      items: 'Vật phẩm',
      runes: 'Bảng ngọc',
      spells: 'Phép bổ trợ',
    },
    dashboard: {
      title: 'Dữ liệu League of Legends',
    },
    home: {
      title: 'Chào mừng đến với League Stats',
      subtitle:
        'Khám phá thông tin chi tiết về Champions, Items, Runes và Spells trong League of Legends',
      champions: {
        title: 'Champions',
        description: 'Tìm hiểu về các tướng và khả năng của họ',
      },
      items: {
        title: 'Items',
        description: 'Khám phá các vật phẩm và hiệu ứng của chúng',
      },
      runes: {
        title: 'Runes',
        description: 'Tùy chỉnh build với hệ thống rune',
      },
      spells: {
        title: 'Spells',
        description: 'Tìm hiểu về các phép thuật và cách sử dụng',
      },
    },
    common: {
      loading: 'Đang tải...',
      error: 'Đã xảy ra lỗi',
      search: 'Tìm kiếm',
      clear: 'Xóa',
      next: 'Tiếp',
      previous: 'Trước',
      page: 'Trang',
      of: 'trên',
      items: 'mục',
      results: 'kết quả',
    },
  },
}

export function getTranslations(locale: string): Translations {
  return translations[locale] || translations[LOCALE.US]
}

export function t(locale: string, key: string): string {
  const keys = key.split('.')
  let value: any = getTranslations(locale)

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key
}
