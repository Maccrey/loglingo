const fs = require('fs');
const path = require('path');

const koPrompts = {
  "question_1": "오늘 가장 감사했던 일은 무엇인가요?",
  "question_2": "최근 가장 기대되는 일정은 무엇인가요?",
  "question_3": "나를 행복하게 만드는 소소한 취미는 무엇인가요?",
  "question_4": "어릴 적 가장 좋아했던 장소는 어디인가요?",
  "question_5": "다시 만나고 싶은 예전 친구가 있나요?",
  "question_6": "나에게 주어진 자유 시간엔 보통 무엇을 하나요?",
  "question_7": "요즘 가장 자주 듣는 노래가 있나요?",
  "question_8": "내가 가장 좋아하는 영화 속 명대사는 무엇인가요?",
  "question_9": "여행을 간다면 가장 가보고 싶은 도시는 어디인가요?",
  "question_10": "내가 가장 자랑스럽게 생각하는 나의 장점은 무엇인가요?",
  "question_11": "지금 당장 먹고 싶은 음식이 있나요?",
  "question_12": "살면서 가장 크게 웃었던 기억은 언제인가요?",
  "question_13": "최근에 새롭게 배운 것이 있다면 무엇인가요?",
  "question_14": "나의 버킷리스트 1번은 무엇인가요?",
  "question_15": "마음이 복잡할 때 나만의 스트레스 해소법은 무엇인가요?",
  "question_16": "가장 감명 깊게 읽은 책은 무엇인가요?",
  "question_17": "어린 시절의 나에게 해주고 싶은 말이 있나요?",
  "question_18": "내가 가장 좋아하는 계절과 그 이유는 무엇인가요?",
  "question_19": "평생 매일 똑같은 음식만 먹어야 한다면 무엇을 고를 건가요?",
  "question_20": "돈 걱정이 없다면 어떤 직업을 가지고 싶나요?",
  "question_21": "혼자 있을 때 나는 어떤 모습인가요?",
  "question_22": "나의 하루 중 가장 좋아하는 시간대는 언제인가요?",
  "question_23": "최근 나를 가장 뿌듯하게 만들었던 일은 무엇인가요?",
  "question_24": "아무도 나를 모르는 곳에 가서 한 달을 살 수 있다면 어디로 갈 건가요?",
  "question_25": "인생에서 가장 큰 전환점이 되었던 사건은 무엇인가요?",
  "question_26": "타인에게 들었던 가장 기억에 남는 칭찬은 무엇인가요?",
  "question_27": "나의 꿈은 어릴 적과 지금 어떻게 달라졌나요?",
  "question_28": "오늘 하루를 한 단어로 표현한다면 무엇일까요?",
  "question_29": "과거로 돌아갈 수 있다면 언제로 돌아가고 싶나요?",
  "question_30": "나에게 '성공'이란 어떤 의미인가요?"
};

const enPrompts = {
  "question_1": "What are you most grateful for today?",
  "question_2": "What upcoming event are you most looking forward to?",
  "question_3": "What small hobby makes you happy?",
  "question_4": "Where was your favorite place as a child?",
  "question_5": "Is there an old friend you want to meet again?",
  "question_6": "What do you usually do in your free time?",
  "question_7": "What song do you listen to the most these days?",
  "question_8": "What's your favorite quote from a movie?",
  "question_9": "If you could travel anywhere, which city would you visit?",
  "question_10": "What's the strength you are most proud of?",
  "question_11": "What food are you craving right now?",
  "question_12": "When was the time you laughed the hardest?",
  "question_13": "What is something new you learned recently?",
  "question_14": "What's number one on your bucket list?",
  "question_15": "What is your unique way of relieving stress?",
  "question_16": "What's the most impressive book you've read?",
  "question_17": "What would you like to tell your younger self?",
  "question_18": "What's your favorite season and why?",
  "question_19": "If you had to eat the same food every day, what would it be?",
  "question_20": "If money were not an issue, what job would you want?",
  "question_21": "What are you like when you are alone?",
  "question_22": "What's your favorite time of day?",
  "question_23": "What made you feel the most proud recently?",
  "question_24": "If you could live somewhere unknown for a month, where would it be?",
  "question_25": "What was the biggest turning point in your life?",
  "question_26": "What's the most memorable compliment you've received?",
  "question_27": "How has your dream changed since childhood?",
  "question_28": "If you could describe today in one word, what would it be?",
  "question_29": "If you could go back in time, when would you go to?",
  "question_30": "What does 'success' mean to you?"
};

const messagesDir = path.join(__dirname, '../messages');

const files = fs.readdirSync(messagesDir);
files.forEach(file => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(messagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(content);
      
      const promptsData = file === 'ko.json' ? koPrompts : enPrompts;
      data.prompts = promptsData;
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${file}`);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }
});
