import { faker } from '@faker-js/faker';

// Устанавливаем seed (любое число)
faker.seed(815);

// Теперь этот текст будет одинаковым при каждом запуске
const text = faker.lorem.words(5);
console.log(text);