const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const translations = {
  ko: "모르는 문장은 모국어로 편하게 써도 인공지능이 자세히 가르쳐줍니다.",
  en: "Feel free to write in your native language if you don't know how to say it. AI will explain it in detail.",
  ja: "分からない文章は母語で気楽に書いても、AIが詳しく教えてくれます。",
  zh: "遇到不会的单词或句子可以轻松地用母语写出，AI会为您详细讲解。",
  th: "ถ้าไม่รู้ประโยคไหนก็เขียนเป็นภาษาแม่ได้เลย AI จะช่วยอธิบายให้คุณอย่างละเอียด",
  vi: "Hãy thoải mái viết bằng tiếng mẹ đẻ nếu không biết diễn đạt. AI sẽ giải thích chi tiết cho bạn.",
  id: "Jangan ragu menulis dalam bahasa ibu Anda jika tidak tahu cara mengungkapkannya. AI akan menjelaskannya secara detail.",
  es: "Siéntete libre de escribir en tu idioma nativo si no sabes cómo decirlo. La IA te lo explicará en detalle.",
  pt: "Sinta-se à vontade para escrever em sua língua nativa se não souber como dizer. A IA explicará em detalhes.",
  fr: "N'hésitez pas à écrire dans votre langue maternelle si vous ne savez pas comment le dire. L'IA l'expliquera en détail.",
  de: "Schreibe ruhig in deiner Muttersprache, wenn du etwas nicht weißt. Die KI wird es im Detail erklären.",
  tr: "Nasıl söyleyeceğinizi bilmiyorsanız çekinmeden ana dilinizde yazın. Yapay zeka size ayrıntılı olarak açıklayacaktır.",
  ar: "اكتب بثقة بلغتك الأم إذا كنت لا تعرف كيف تعبر. سيشرحها الذكاء الاصطناعي بالتفصيل.",
  hi: "यदि आपको नहीं पता कि कैसे व्यक्त करें, तो अपनी मातृभाषा में लिखें। AI इसे विस्तार से समझाएगा।",
  ru: "Смело пишите на родном языке, если не знаете, как это сказать. ИИ подробно всё объяснит.",
  bn: "কিভাবে বলতে হয় তা না জানলে নির্দ্বিধায় মাতৃভাষায় লিখুন। AI বিস্তারিতভাবে ব্যাখ্যা করবে।",
  ur: "اگر آپ کو نہیں معلوم کہ کیسے کہنا ہے تو اپنی مادری زبان میں لکھیں۔ AI اس کی تفصیل سے وضاحت کرے گا۔",
  ne: "कसरी भन्ने थाहा छैन भने आफ्नो मातृभाषामा निर्धक्क लेख्नुहोस्। AI ले विस्तारमा बुझाउनेछ।"
};

// Update translations for both "write" and "trial" (or just "write")
// The user asked for "체험하기와 일기를 쓰는 페이지에서" -> Guest trial mode and write page.
// We can just put it in "write" and use it in both, or put it in common.
// Let's put in "write.relax_msg"

for (const lang of Object.keys(translations)) {
  const filePath = path.join(messagesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${lang}.json as it does not exist.`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  
  if (!json.write) {
    json.write = {};
  }
  json.write.relax_msg = translations[lang];

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log(`Updated ${lang}.json`);
}

console.log('All done!');
