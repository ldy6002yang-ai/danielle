import { ArticleSection, QuizQuestion } from './types';

export const ARTICLE_TITLE = "为什么要简化汉字";

export const ARTICLE_CONTENT: ArticleSection[] = [
  {
    id: 'intro',
    content: `很长一段时间，网络上有些人认为应该坚持使用繁体字，不应该简化汉字。他们认为简化后的汉字没有了汉字基本的象形含义，缺乏美感。我认为人们之所以有这种想法是因为对汉字的发展缺乏了解，很容易“跟风跑”，从而赞同使用繁体字。`
  },
  {
    id: 'point1',
    content: `首先，大家应该明白文字最初的用途是记录。对于记录来说，最关键的是高效。古代刚出现文字时，是用刻字的方式来记录的，如果笔画太复杂，不但占的面积大，速度也慢。后来，中国人发明了印刷术，对部分汉字的笔画进行简化。笔画太多，印出来的字可能会看不清楚。从那时起，人们对文字进行了严格的规范，要求字形保持一致。于是文字就得到了统一，书写效率就更高了。`
  },
  {
    id: 'point2',
    content: `其次，文字要具备可识别性和易书写性，这样才能很好地传承下去。从汉字的发展过程来看，古代的汉字只有社会上层人士才会书写和识别。但随着不同朝代对文字的简化，不仅社会上层人士能写能认，很多平民也会写会认，这样的简化是为提高汉字的易书写性和易读性。`
  },
  {
    id: 'point3',
    content: `最后，因为新中国成立后，不识字的人有四亿之多，教这些人认字、写字是个大问题。因此，我们需要简化汉字来提高书写效率和易识别性。于是，汉字又开始了新一轮的简化。`
  },
  {
    id: 'conclusion',
    content: `综上所述，不论是从汉字的历史发展来看，还是从汉字的书写和交流需要来看，汉字确实需要简化。`
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "为什么有些人不同意简化汉字？" },
  { id: 2, question: "为什么有些人会“跟风跑”？" },
  { id: 3, question: "“跟风跑”是什么意思？" },
  { id: 4, question: "文字最初的用途是什么？" },
  { id: 5, question: "古代人是如何记录文字的？" },
  { id: 6, question: "为什么中国人发明了印刷术就要对汉字进行简化？" },
  { id: 7, question: "文字要传承下去需要具备什么特点？" },
  { id: 8, question: "古代的汉字发展存在什么问题？" },
  { id: 9, question: "为什么中国不同的朝代都要对汉字进行简化？" },
  { id: 10, question: "新中国成立后，有多少人不识字？" }
];

export const SKIMMING_TIPS = [
  "略读法可以增加阅读的数量，扩大视野。",
  "略读法可以增广见闻，提高阅读效率。",
  "略读法可以迅速掌握文章大意和要点。",
  "找出文中“路标”（如：首先、其次、最后）。"
];

export const VOCAB_HUNT_ITEMS = [
  { term: "效率", clue: "Find the word for 'Efficiency' (Key reason for simplification)" },
  { term: "印刷术", clue: "Find the word for 'Printing Technology' (Invention that required clearer characters)" },
  { term: "传承", clue: "Find the word for 'Inherit/Pass down' (Why texts need to be readable)" },
  { term: "平民", clue: "Find the word for 'Common People' (Who gained access to literacy)" },
  { term: "象形", clue: "Find the word for 'Pictographic' (The meaning some say was lost)" }
];

export const DEBATE_ARGUMENTS = [
  { id: 'a1', text: "Lacks aesthetic beauty (缺乏美感)", side: 'anti' },
  { id: 'a2', text: "Loses pictographic meaning (象形含义)", side: 'anti' },
  { id: 'a3', text: "Increases writing efficiency (书写效率)", side: 'pro' },
  { id: 'a4', text: "Easier for common people to learn (易书写性)", side: 'pro' },
  { id: 'a5', text: "Clearer for printing (印刷清晰)", side: 'pro' },
  { id: 'a6', text: "Traditional heritage (传统文化)", side: 'anti' }
];