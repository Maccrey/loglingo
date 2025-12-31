const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'messages');
const languages = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh'];

const guestWelcomeTranslations = {
  ar: "أنا بطة الدراسة! سأساعدك على الدراسة بجد!",
  bn: "আমি স্টাডি ডাক! আমি তোমাকে ভালোভাবে পড়াশোনা করতে সাহায্য করব!",
  de: "Ich bin Study Duck! Ich helfe dir, fleißig zu lernen!",
  es: "¡Soy Study Duck! ¡Te ayudaré a estudiar mucho!",
  fr: "Je suis Study Duck ! Je vais t'aider à bien étudier !",
  hi: "मैं स्टडी डक हूँ! मैं पढ़ाई में आपकी पूरी मदद करूँगा!",
  id: "Aku Study Duck! Aku akan bantuin kamu belajar giat!",
  ja: "私はスタディダック！一生懸命勉強するのを手伝うよ！",
  ko: "난 스터디덕이야! 열심히 공부하게 도와줄게!",
  ne: "म स्टडी डक हुँ! म तिमीलाई कडा अध्ययन गर्न मद्दत गर्नेछु!",
  pt: "Sou o Study Duck! Vou te ajudar a estudar bastante!",
  ru: "Я Study Duck! Я помогу тебе усердно учиться!",
  th: "ฉันคือ Study Duck! ฉันจะช่วยให้เธอตั้งใจเรียนเอง!",
  tr: "Ben Study Duck! Çok çalışmana yardım edeceğim!",
  ur: "میں ہوں سٹڈی ڈک! میں آپ کی دل لگا کر پڑھنے میں مدد کروں گا!",
  vi: "Tôi là Study Duck! Tôi sẽ giúp bạn học tập chăm chỉ!",
  zh: "我是 Study Duck！我会帮你努力学习的！"
};

function applyTranslations() {
  languages.forEach(lang => {
    const filePath = path.join(dir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Update guest_welcome if it exists (structure should ensure it does now)
        if (content.mascot && content.mascot.home) {
           const translated = guestWelcomeTranslations[lang];
           if (translated) {
             content.mascot.home.guest_welcome = translated;
             console.log(`Updated ${lang}: guest_welcome -> ${translated}`);
           }
        }
        
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      } catch (e) {
        console.error(`Error processing ${lang}.json`, e);
      }
    }
  });
}

applyTranslations();
