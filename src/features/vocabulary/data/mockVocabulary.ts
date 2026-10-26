import type { VocabularyTopic } from '../types/vocabulary'

const topicNames = [
  ['Greetings & Introductions', 'Chào hỏi & giới thiệu'],
  ['Family & People', 'Gia đình & con người'],
  ['Home & Furniture', 'Nhà cửa & nội thất'],
  ['Food & Drinks', 'Đồ ăn & thức uống'],
  ['Daily Activities', 'Hoạt động hằng ngày'],
  ['School & Education', 'Trường học & giáo dục'],
  ['Work & Career', 'Công việc & sự nghiệp'],
  ['Travel & Transport', 'Du lịch & phương tiện'],
  ['Health & Body', 'Sức khỏe & cơ thể'],
  ['Weather & Nature', 'Thời tiết & thiên nhiên'],
  ['Time & Calendar', 'Thời gian & lịch'],
  ['Places & Directions', 'Địa điểm & phương hướng'],
  ['Technology', 'Công nghệ'],
  ['Communication', 'Giao tiếp'],
  ['Shopping & Money', 'Mua sắm & tiền bạc'],
  ['Sports & Hobbies', 'Thể thao & sở thích'],
  ['Feelings', 'Cảm xúc'],
  ['Common Verbs', 'Động từ thông dụng'],
  ['Common Adjectives', 'Tính từ thông dụng'],
  ['Everyday Phrases', 'Cụm từ hằng ngày'],
] as const

const sampleWords = {
  1: [
    {
      id: 101,
      word: 'Hello',
      pronunciation: '/həˈləʊ/',
      meaning: 'Xin chào',
      example: 'Hello, nice to meet you!',
      exampleMeaning: 'Xin chào, rất vui được gặp bạn!',
    },
    {
      id: 102,
      word: 'Introduce',
      pronunciation: '/ˌɪntrəˈdjuːs/',
      meaning: 'Giới thiệu',
      example: 'Let me introduce myself.',
      exampleMeaning: 'Hãy để tôi tự giới thiệu.',
    },
    {
      id: 103,
      word: 'Welcome',
      pronunciation: '/ˈwelkəm/',
      meaning: 'Chào mừng',
      example: 'Welcome to our English class.',
      exampleMeaning: 'Chào mừng bạn đến với lớp tiếng Anh.',
    },
    {
      id: 104,
      word: 'Goodbye',
      pronunciation: '/ˌɡʊdˈbaɪ/',
      meaning: 'Tạm biệt',
      example: 'Goodbye, see you tomorrow.',
      exampleMeaning: 'Tạm biệt, hẹn gặp bạn ngày mai.',
    },
    {
      id: 105,
      word: 'Name',
      pronunciation: '/neɪm/',
      meaning: 'Tên',
      example: 'What is your name?',
      exampleMeaning: 'Tên của bạn là gì?',
    },
    {
      id: 106,
      word: 'Meet',
      pronunciation: '/miːt/',
      meaning: 'Gặp gỡ',
      example: 'It is nice to meet you.',
      exampleMeaning: 'Rất vui được gặp bạn.',
    },
    {
      id: 107,
      word: 'Friend',
      pronunciation: '/frend/',
      meaning: 'Bạn bè',
      example: 'She is my best friend.',
      exampleMeaning: 'Cô ấy là bạn thân nhất của tôi.',
    },
    {
      id: 108,
      word: 'Morning',
      pronunciation: '/ˈmɔːnɪŋ/',
      meaning: 'Buổi sáng',
      example: 'Good morning, everyone.',
      exampleMeaning: 'Chào buổi sáng mọi người.',
    },
    {
      id: 109,
      word: 'Thanks',
      pronunciation: '/θæŋks/',
      meaning: 'Cảm ơn',
      example: 'Thanks for your help.',
      exampleMeaning: 'Cảm ơn sự giúp đỡ của bạn.',
    },
    {
      id: 110,
      word: 'Sorry',
      pronunciation: '/ˈsɒri/',
      meaning: 'Xin lỗi',
      example: 'I am sorry I am late.',
      exampleMeaning: 'Tôi xin lỗi vì đã đến muộn.',
    },
  ],
  4: [
    {
      id: 401,
      word: 'Delicious',
      pronunciation: '/dɪˈlɪʃəs/',
      meaning: 'Ngon',
      example: 'This soup is delicious.',
      exampleMeaning: 'Món súp này rất ngon.',
    },
    {
      id: 402,
      word: 'Breakfast',
      pronunciation: '/ˈbrekfəst/',
      meaning: 'Bữa sáng',
      example: 'I have breakfast at seven.',
      exampleMeaning: 'Tôi ăn sáng lúc bảy giờ.',
    },
  ],
  17: [
    {
      id: 1701,
      word: 'Excited',
      pronunciation: '/ɪkˈsaɪtɪd/',
      meaning: 'Hào hứng',
      example: 'She is excited about the trip.',
      exampleMeaning: 'Cô ấy hào hứng về chuyến đi.',
    },
    {
      id: 1702,
      word: 'Calm',
      pronunciation: '/kɑːm/',
      meaning: 'Bình tĩnh',
      example: 'Try to stay calm.',
      exampleMeaning: 'Hãy cố gắng giữ bình tĩnh.',
    },
  ],
} satisfies Record<number, VocabularyTopic['words']>

export const mockTopics: VocabularyTopic[] = topicNames.map(
  ([title, titleVi], index) => {
    const id = index + 1
    const words = sampleWords[id as keyof typeof sampleWords] ?? []

    return {
      id,
      title,
      titleVi,
      totalWords: 50,
      learnedWords: 0,
      words,
    }
  },
)
