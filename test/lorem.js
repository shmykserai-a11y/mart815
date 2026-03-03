import { LoremIpsum } from "lorem-ipsum";
import seedrandom from "seedrandom";

// Создаём детерминированный генератор с конкретным seed (например, 12345)
const rng = seedrandom("815");

const lorem = new LoremIpsum({
    random: rng // передаём нашу функцию вместо Math.random
});

// Теперь при каждом запуске будет один и тот же текст
console.log(lorem.generateWords(5));
//adipiscing consectetur lorem ipsum dolor
//console.log(lorem.generateSentences(1));
//console.log(lorem.generateParagraphs(2));