const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

const translations = {
  ar: "✏️ سؤال اليوم",
  bn: "✏️ আজকের ডায়েরি প্রম্পট",
  de: "✏️ Heutige Tagebuchfrage",
  en: "✏️ Today's Diary Prompt",
  es: "✏️ Pregunta del diario de hoy",
  fr: "✏️ Sujet pour le journal d'aujourd'hui",
  hi: "✏️ आज का डायरी प्रॉम्प्ट",
  id: "✏️ Prompt Buku Harian Hari Ini",
  ja: "✏️ 今日の日記プロンプト",
  ko: "✏️ 오늘의 일기 소재 추천",
  ne: "✏️ आजको डायरी प्रम्प्ट",
  pt: "✏️ Pergunta do diário de hoje",
  ru: "✏️ Вопрос для дневника на сегодня",
  th: "✏️ คำถามสำหรับบันทึกประจำวันของวันนี้",
  tr: "✏️ Günlük Soru İstemi",
  ur: "✏️ آج کی ڈائری کا سوال",
  vi: "✏️ Gợi ý nhật ký hôm nay",
  zh: "✏️ 今日日记提示"
};

const usePromptTranslations = {
  ar: "استخدم هذا الموجه",
  bn: "এই প্রম্পট ব্যবহার করুন",
  de: "Diesen Prompt verwenden",
  en: "Use this prompt",
  es: "Usar este aviso",
  fr: "Utiliser cette invite",
  hi: "इस प्रॉम्प्ट का उपयोग करें",
  id: "Gunakan prompt ini",
  ja: "このプロンプトを使う",
  ko: "이 질문으로 일기 쓰기",
  ne: "यो प्रम्प्ट प्रयोग गर्नुहोस्",
  pt: "Usar este prompt",
  ru: "Использовать эту подсказку",
  th: "ใช้พรอมต์นี้",
  tr: "Bu istemi kullan",
  ur: "یہ پرامپٹ استعمال کریں",
  vi: "Sử dụng gợi ý này",
  zh: "使用此提示"
};

const defaultMsg = "✏️ Today's Diary Prompt";
const defaultUsePromptMsg = "Use this prompt";

function updateMessages() {
  const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const locale = file.replace('.json', '');
    const filePath = path.join(messagesDir, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      const msg = translations[locale] || defaultMsg;
      const useMsg = usePromptTranslations[locale] || defaultUsePromptMsg;
      
      if (!data.diary) {
        data.diary = {};
      }
      
      data.diary.dailyPrompt = msg;
      data.diary.usePrompt = useMsg;
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✅ Added 'diary.dailyPrompt' and 'diary.usePrompt' to ${file}`);
    } catch (error) {
      console.error(`❌ Error updating ${file}:`, error);
    }
  }
}

updateMessages();
