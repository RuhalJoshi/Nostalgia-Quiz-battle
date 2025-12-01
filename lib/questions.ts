import { Question, QuestionCategory } from './types'

export const SAMPLE_QUESTIONS: Omit<Question, 'id' | 'created_at'>[] = [
  // Cartoons
  {
    category: 'cartoons',
    question: 'Which cartoon character had a catchphrase "Cowabunga!"?',
    options: ['Teenage Mutant Ninja Turtles', 'SpongeBob SquarePants', 'Tom and Jerry', 'The Simpsons'],
    correct_answer: 0,
    difficulty: 'easy',
  },
  {
    category: 'cartoons',
    question: 'What was the name of the main character in "Dragon Ball Z"?',
    options: ['Vegeta', 'Goku', 'Piccolo', 'Gohan'],
    correct_answer: 1,
    difficulty: 'medium',
  },
  {
    category: 'cartoons',
    question: 'Which cartoon featured characters named "Johnny Bravo" and "Dexter"?',
    options: ['Cartoon Network', 'Nickelodeon', 'Disney Channel', 'Fox Kids'],
    correct_answer: 0,
    difficulty: 'medium',
  },
  {
    category: 'cartoons',
    question: 'What was the name of the pink cat in "Tom and Jerry"?',
    options: ['Butch', 'Spike', 'Toodles', 'Tuffy'],
    correct_answer: 3,
    difficulty: 'hard',
  },
  {
    category: 'cartoons',
    question: 'Which show featured a character named "Ash Ketchum"?',
    options: ['Digimon', 'Pokemon', 'Yu-Gi-Oh!', 'Beyblade'],
    correct_answer: 1,
    difficulty: 'easy',
  },
  // Bollywood
  {
    category: 'bollywood',
    question: 'Which actor starred in "Dilwale Dulhania Le Jayenge" (1995)?',
    options: ['Aamir Khan', 'Shah Rukh Khan', 'Salman Khan', 'Akshay Kumar'],
    correct_answer: 1,
    difficulty: 'easy',
  },
  {
    category: 'bollywood',
    question: 'What was the famous dialogue "Mogambo khush hua" from?',
    options: ['Mr. India', 'Sholay', 'Don', 'Deewar'],
    correct_answer: 0,
    difficulty: 'medium',
  },
  {
    category: 'bollywood',
    question: 'Which movie featured the song "Chaiyya Chaiyya"?',
    options: ['Dil Se', 'Kuch Kuch Hota Hai', 'Kabhi Khushi Kabhie Gham', 'Dilwale Dulhania Le Jayenge'],
    correct_answer: 0,
    difficulty: 'medium',
  },
  // Hollywood
  {
    category: 'hollywood',
    question: 'Which movie featured the quote "I\'ll be back"?',
    options: ['Predator', 'The Terminator', 'Total Recall', 'Commando'],
    correct_answer: 1,
    difficulty: 'easy',
  },
  {
    category: 'hollywood',
    question: 'What was the name of the main character in "The Matrix" (1999)?',
    options: ['Morpheus', 'Neo', 'Trinity', 'Agent Smith'],
    correct_answer: 1,
    difficulty: 'easy',
  },
  {
    category: 'hollywood',
    question: 'Which movie featured the song "My Heart Will Go On"?',
    options: ['Titanic', 'Avatar', 'The Notebook', 'Pearl Harbor'],
    correct_answer: 0,
    difficulty: 'easy',
  },
  // Gadgets
  {
    category: 'gadgets',
    question: 'What was the storage capacity of a standard floppy disk?',
    options: ['1.44 MB', '2.88 MB', '720 KB', '360 KB'],
    correct_answer: 0,
    difficulty: 'medium',
  },
  {
    category: 'gadgets',
    question: 'Which company made the Walkman?',
    options: ['Panasonic', 'Sony', 'Philips', 'Samsung'],
    correct_answer: 1,
    difficulty: 'easy',
  },
  {
    category: 'gadgets',
    question: 'What was the first portable music player called?',
    options: ['iPod', 'Walkman', 'Discman', 'MP3 Player'],
    correct_answer: 1,
    difficulty: 'medium',
  },
  {
    category: 'gadgets',
    question: 'Which gaming console was released in 1994?',
    options: ['Nintendo 64', 'PlayStation', 'Sega Saturn', 'Game Boy Color'],
    correct_answer: 1,
    difficulty: 'medium',
  },
  // Snacks
  {
    category: 'snacks',
    question: 'What was Pepsi Blue?',
    options: ['A blue-colored Pepsi', 'A limited edition flavor', 'A marketing campaign', 'A different brand'],
    correct_answer: 0,
    difficulty: 'hard',
  },
  {
    category: 'snacks',
    question: 'Which snack was famous for its "Phantom" cigarettes?',
    options: ['Candy cigarettes', 'Chocolate cigarettes', 'Gum cigarettes', 'All of the above'],
    correct_answer: 3,
    difficulty: 'medium',
  },
  {
    category: 'snacks',
    question: 'What was the popular bubble gum brand in the 90s?',
    options: ['Hubba Bubba', 'Bubble Yum', 'Bazooka', 'All of the above'],
    correct_answer: 3,
    difficulty: 'easy',
  },
  // Toys
  {
    category: 'toys',
    question: 'What were Tazos?',
    options: ['Collectible discs', 'Action figures', 'Stickers', 'Cards'],
    correct_answer: 0,
    difficulty: 'medium',
  },
  {
    category: 'toys',
    question: 'Which spinning top toy was popular in the 2000s?',
    options: ['Beyblade', 'Top Trumps', 'Yo-yo', 'Fidget Spinner'],
    correct_answer: 0,
    difficulty: 'easy',
  },
  {
    category: 'toys',
    question: 'What was the name of the collectible card game from the 90s?',
    options: ['Pokemon Cards', 'Yu-Gi-Oh! Cards', 'Magic: The Gathering', 'All of the above'],
    correct_answer: 3,
    difficulty: 'easy',
  },
]

