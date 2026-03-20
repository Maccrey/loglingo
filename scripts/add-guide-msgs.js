// 가이드 페이지 다국어 번역 키를 18개 언어 JSON에 주입하는 스크립트
const fs = require("fs");
const path = require("path");
const dir = path.join(process.cwd(), "messages");

const en = {
  back: "Back to Home",
  start_cta: "Start Now",
  write: {
    title: "Write Daily",
    subtitle: "Write a diary in your target language to learn naturally.",
    why_title: "Why is diary writing effective?",
    why_desc:
      "Languages improve fastest through consistent use. Even a short daily entry builds vocabulary naturally. Write unknown phrases in your native language and AI will teach them in the target language.",
    step1_title: "1. Pick a Date & Write",
    step1_desc:
      "Select a date and write freely about your day, feelings, or learnings. Even one sentence is great.",
    step2_title: "2. Attach a Photo (Optional)",
    step2_desc: "Capture today with a photo. Images are automatically optimized.",
    step3_title: "3. Get AI Correction",
    step3_desc:
      "Press AI Correction after writing for instant feedback on grammar, vocabulary, and expression.",
    tip_title: "Tip",
    tip_desc: "Use the Daily Prompt feature when you are unsure what to write about.",
  },
  correct: {
    title: "AI Correction",
    subtitle: "Grok AI instantly analyzes grammar, vocabulary, and natural expressions.",
    why_title: "Why is AI correction different?",
    why_desc:
      "Unlike basic spell-checkers, Loglingo AI suggests expressions native speakers actually use, with explanations so you stop repeating the same mistakes.",
    step1_title: "1. Click AI Correction",
    step1_desc: "Write your diary and press AI Correction. Results appear in seconds.",
    step2_title: "2. Review Results",
    step2_desc:
      "Grammar errors, awkward expressions, and better alternatives are clearly organized with reasons and example sentences.",
    step3_title: "3. Apply & Save",
    step3_desc:
      "Apply corrections you like and save important expressions to your learning archive.",
    tip_title: "Tip",
    tip_desc: "AI emotional feedback is included. The duck mascot leaves a supportive comment on your diary.",
  },
  archive: {
    title: "Personal Archive",
    subtitle: "Save expressions from AI correction and review with personalized quizzes.",
    why_title: "Why is the archive effective?",
    why_desc:
      "Unlike a word list, Loglingo saves expressions from your actual mistakes — your own error-based learning database that is far more memorable.",
    step1_title: "1. Save After AI Correction",
    step1_desc:
      "Press Save next to any expression in AI correction results. Classify by grammar, vocabulary, or idiom.",
    step2_title: "2. Browse Your Archive",
    step2_desc: "Filter saved expressions by type. Use the AI dictionary for instant meaning lookup.",
    step3_title: "3. Review with Quizzes",
    step3_desc: "Take instant quizzes with your saved expressions using hints and answer checks.",
    tip_title: "Tip",
    tip_desc: "Check your current CEFR language level and priority learning advice on the dashboard.",
  },
  speaking: {
    title: "Speaking Practice",
    subtitle: "Practice pronunciation and expressions with AI and get instant feedback.",
    why_title: "Why speaking practice?",
    why_desc:
      "Reading and writing alone will not improve real conversation skills. Loglingo analyzes your pronunciation in real time and suggests more natural expressions.",
    step1_title: "1. Free Speaking",
    step1_desc:
      "Press the mic button and speak freely in your target language. AI analyzes pronunciation and grammar.",
    step2_title: "2. Challenge Mode",
    step2_desc:
      "AI picks a weak expression and creates a practice sentence. Repeat it aloud for focused improvement.",
    step3_title: "3. Check Results & Continue",
    step3_desc:
      "See pronunciation accuracy, better expressions, and grammar points instantly, then continue to the next challenge.",
    tip_title: "Tip",
    tip_desc:
      "Complete 3 sessions a day to receive an AI tutor prompt for deeper practice with ChatGPT or Gemini.",
  },
};

const ko = {
  back: "홈으로",
  start_cta: "지금 시작하기",
  write: {
    title: "매일 쓰기",
    subtitle: "목표 언어로 일기를 쓰며 자연스럽게 언어를 습득하세요.",
    why_title: "왜 일기 쓰기가 효과적인가요?",
    why_desc:
      "언어는 꾸준히 사용할 때 가장 빠르게 늘어납니다. 매일 짧게라도 목표 언어로 일기를 쓰면 표현력과 어휘력이 자연스럽게 성장합니다.",
    step1_title: "1. 날짜 선택 & 일기 작성",
    step1_desc:
      "날짜를 선택하고 오늘 있었던 일, 느낌, 배운 것들을 자유롭게 써보세요. 짧은 한 문장도 괜찮습니다.",
    step2_title: "2. 사진 첨부 (선택)",
    step2_desc: "오늘의 순간을 사진으로 남길 수 있습니다. 이미지는 자동으로 최적화됩니다.",
    step3_title: "3. AI 교정 받기",
    step3_desc:
      "작성 후 AI 교정 버튼을 누르면 문법, 어휘, 표현 등을 즉각 피드백 받을 수 있습니다.",
    tip_title: "팁",
    tip_desc: "오늘의 일기 소재 추천 기능을 활용하면 무슨 내용을 써야 할지 막막할 때 도움이 됩니다.",
  },
  correct: {
    title: "AI 교정",
    subtitle: "Grok AI가 문법, 어휘, 자연스러운 표현을 즉각 분석하고 피드백을 제공합니다.",
    why_title: "AI 교정이 왜 다를까요?",
    why_desc:
      "일반 문법 검사기는 단순 오타만 잡지만, Loglingo AI는 원어민이 실제로 사용하는 자연스러운 표현까지 제안하고 이유를 설명해 줍니다.",
    step1_title: "1. AI 교정 클릭",
    step1_desc: "일기를 작성하고 AI 교정 버튼을 누르면 수초 내에 분석 결과가 나타납니다.",
    step2_title: "2. 교정 결과 확인",
    step2_desc:
      "문법 오류, 어색한 표현, 더 나은 대안이 한눈에 정리됩니다. 각 항목마다 이유와 예시 문장이 제공됩니다.",
    step3_title: "3. 교정 적용 & 저장",
    step3_desc:
      "마음에 드는 교정을 선택해 적용하고, 중요한 표현은 아카이브에 저장하세요.",
    tip_title: "팁",
    tip_desc:
      "AI 감성 피드백도 함께 제공됩니다. 오리 마스코트가 오늘의 일기 내용에 공감하는 코멘트를 남겨드립니다.",
  },
  archive: {
    title: "개인 아카이브",
    subtitle: "AI 교정에서 발견한 표현을 저장하고 맞춤형 퀴즈로 복습하세요.",
    why_title: "왜 아카이브가 효과적인가요?",
    why_desc:
      "단어장과 달리 내가 실제로 틀렸던 표현을 저장합니다. 내 실수에서 만들어진 나만의 학습 데이터베이스이기 때문에 훨씬 더 기억에 남습니다.",
    step1_title: "1. AI 교정 후 저장",
    step1_desc:
      "AI 교정 결과에서 기억하고 싶은 표현 옆의 저장 버튼을 누르세요. 문법, 어휘, 관용구로 분류도 가능합니다.",
    step2_title: "2. 아카이브 목록 확인",
    step2_desc:
      "저장된 표현들을 종류별로 필터링하여 확인할 수 있습니다. AI 사전으로 뜻도 바로 찾아볼 수 있습니다.",
    step3_title: "3. 퀴즈로 복습",
    step3_desc: "저장된 표현으로 즉석 퀴즈를 풀 수 있습니다. 힌트와 정답 확인으로 스스로 점검해보세요.",
    tip_title: "팁",
    tip_desc:
      "대시보드에서 현재 나의 언어 실력 레벨(CEFR 기준)과 우선 학습 조언을 확인할 수 있습니다.",
  },
  speaking: {
    title: "말하기 연습",
    subtitle: "AI와 함께 발음과 표현을 연습하고 즉각적인 피드백을 받으세요.",
    why_title: "왜 말하기 연습인가요?",
    why_desc:
      "읽고 쓰는 것만으로는 실제 대화 실력이 늘지 않습니다. Loglingo는 실시간으로 발음을 분석하고 더 자연스러운 표현을 제안해 줍니다.",
    step1_title: "1. 자유 말하기",
    step1_desc:
      "마이크 버튼을 눌러 자유롭게 목표 언어로 말해보세요. AI가 발음과 문법을 분석합니다.",
    step2_title: "2. 챌린지 모드",
    step2_desc:
      "AI가 내 취약 표현 중 하나를 고르고 연습 문장을 만들어 줍니다. 따라 말하며 집중 연습합니다.",
    step3_title: "3. 결과 확인 & 다음 도전",
    step3_desc:
      "발음 정확도, 더 나은 표현, 문법 포인트를 즉각 확인하고 바로 다음 도전으로 이어갈 수 있습니다.",
    tip_title: "팁",
    tip_desc:
      "하루 3회 세션을 완료하면 ChatGPT, Gemini 등과 심화 연습을 이어갈 수 있는 AI 튜터 프롬프트를 받습니다.",
  },
};

const ja = {
  back: "ホームへ",
  start_cta: "今すぐ始める",
  write: { ...en.write, title: "毎日書く", subtitle: "目標言語で日記を書き、自然に言語を習得しましょう。" },
  correct: { ...en.correct, title: "AI添削", subtitle: "Grok AIが文法・語彙・自然な表現を即座に分析しフィードバックします。" },
  archive: { ...en.archive, title: "個人アーカイブ", subtitle: "AI添削で見つけた表現を保存し、クイズで復習しましょう。" },
  speaking: { ...en.speaking, title: "スピーキング練習", subtitle: "AIと一緒に発音と表現を練習し、即座なフィードバックを受けましょう。" },
};

const zh = {
  back: "返回首页",
  start_cta: "立即开始",
  write: { ...en.write, title: "每日写作", subtitle: "用目标语言写日记，自然地习得语言。" },
  correct: { ...en.correct, title: "AI纠错", subtitle: "Grok AI即时分析语法、词汇和自然表达。" },
  archive: { ...en.archive, title: "个人档案", subtitle: "保存AI纠错中发现的表达，通过个性化测验复习。" },
  speaking: { ...en.speaking, title: "口语练习", subtitle: "与AI一起练习发音和表达，获得即时反馈。" },
};

const es = {
  back: "Volver al inicio",
  start_cta: "Empezar ahora",
  write: { ...en.write, title: "Escribir a diario", subtitle: "Escribe un diario en tu idioma objetivo para aprender de forma natural." },
  correct: { ...en.correct, title: "Corrección IA", subtitle: "Grok IA analiza gramática, vocabulario y expresiones naturales al instante." },
  archive: { ...en.archive, title: "Archivo personal", subtitle: "Guarda expresiones de la corrección IA y repásalas con cuestionarios." },
  speaking: { ...en.speaking, title: "Práctica oral", subtitle: "Practica pronunciación y expresiones con IA y recibe retroalimentación instantánea." },
};

const fr = {
  back: "Retour à l'accueil",
  start_cta: "Commencer maintenant",
  write: { ...en.write, title: "Ecrire chaque jour", subtitle: "Ecrivez un journal dans votre langue cible pour apprendre naturellement." },
  correct: { ...en.correct, title: "Correction IA", subtitle: "L'IA Grok analyse instantanement la grammaire, le vocabulaire et les expressions." },
  archive: { ...en.archive, title: "Archive personnelle", subtitle: "Sauvegardez les expressions de la correction IA et revisez avec des quiz." },
  speaking: { ...en.speaking, title: "Pratique orale", subtitle: "Pratiquez la prononciation avec l'IA et recevez des retours instantanes." },
};

const de = {
  back: "Zur Startseite",
  start_cta: "Jetzt starten",
  write: { ...en.write, title: "Taeglich schreiben", subtitle: "Schreibe ein Tagebuch in deiner Zielsprache und lerne auf natuerliche Weise." },
  correct: { ...en.correct, title: "KI-Korrektur", subtitle: "Grok KI analysiert sofort Grammatik, Vokabular und natuerliche Ausdruecke." },
  archive: { ...en.archive, title: "Persoenliches Archiv", subtitle: "Speichere Ausdruecke aus der KI-Korrektur und uebe sie mit Quiz." },
  speaking: { ...en.speaking, title: "Sprechubung", subtitle: "Uebe Aussprache und Ausdruecke mit KI und erhalte sofortiges Feedback." },
};

const pt = {
  back: "Voltar ao inicio",
  start_cta: "Comecar agora",
  write: { ...en.write, title: "Escrever diariamente", subtitle: "Escreva um diario na sua lingua-alvo para aprender naturalmente." },
  correct: { ...en.correct, title: "Correcao de IA", subtitle: "A IA Grok analisa instantaneamente gramatica, vocabulario e expressoes naturais." },
  archive: { ...en.archive, title: "Arquivo pessoal", subtitle: "Salve expressoes da correcao de IA e revise com testes personalizados." },
  speaking: { ...en.speaking, title: "Pratica oral", subtitle: "Pratique pronuncia e expressoes com IA e receba feedback instantaneo." },
};

const ru = {
  back: "На главную",
  start_cta: "Начать сейчас",
  write: { ...en.write, title: "Писать каждый день", subtitle: "Ведите дневник на целевом языке и осваивайте его естественно." },
  correct: { ...en.correct, title: "Исправление ИИ", subtitle: "ИИ Grok мгновенно анализирует грамматику, лексику и естественные выражения." },
  archive: { ...en.archive, title: "Личный архив", subtitle: "Сохраняйте выражения из исправлений ИИ и повторяйте с тестами." },
  speaking: { ...en.speaking, title: "Практика речи", subtitle: "Практикуйте произношение с ИИ и получайте мгновенную обратную связь." },
};

const tr = {
  back: "Ana Sayfaya Don",
  start_cta: "Simdi Basla",
  write: { ...en.write, title: "Her Gun Yaz", subtitle: "Dogal olarak ogrenin: hedef dilinizde gunluk tutun." },
  correct: { ...en.correct, title: "Yapay Zeka Duzeltmesi", subtitle: "Grok YZ anlinda dilbilgisi, kelime ve dogal ifadeleri analiz eder." },
  archive: { ...en.archive, title: "Kisisel Arsiv", subtitle: "YZ duzeltmelerindeki ifadeleri kaydedin ve testlerle tekrar edin." },
  speaking: { ...en.speaking, title: "Konusma Pratigi", subtitle: "YZ ile telaffuz ve ifade pratigi yapin, aninda geri bildirim alin." },
};

const ar = {
  back: "العودة للرئيسية",
  start_cta: "ابدأ الآن",
  write: { ...en.write, title: "الكتابة اليومية", subtitle: "اكتب يومياتك بلغتك المستهدفة لتتعلم بشكل طبيعي." },
  correct: { ...en.correct, title: "التصحيح بالذكاء الاصطناعي", subtitle: "يحلل Grok AI القواعد والمفردات والتعبيرات الطبيعية فورًا." },
  archive: { ...en.archive, title: "الأرشيف الشخصي", subtitle: "احفظ التعبيرات من التصحيح وراجعها بالاختبارات." },
  speaking: { ...en.speaking, title: "تدريب المحادثة", subtitle: "تدرب على النطق والتعبير مع الذكاء الاصطناعي واحصل على تغذية راجعة فورية." },
};

const hi = {
  back: "होम पर जाएं",
  start_cta: "अभी शुरू करें",
  write: { ...en.write, title: "रोज लिखें", subtitle: "अपनी लक्ष्य भाषा में डायरी लिखकर स्वाभाविक रूप से सीखें।" },
  correct: { ...en.correct, title: "AI सुधार", subtitle: "Grok AI तुरंत व्याकरण, शब्दावली और प्राकृतिक अभिव्यक्तियों का विश्लेषण करता है।" },
  archive: { ...en.archive, title: "व्यक्तिगत आर्काइव", subtitle: "AI सुधार से अभिव्यक्तियाँ सहेजें और प्रश्नोत्तरी से समीक्षा करें।" },
  speaking: { ...en.speaking, title: "बोलने का अभ्यास", subtitle: "AI के साथ उच्चारण और अभिव्यक्ति का अभ्यास करें और तुरंत फीडबैक पाएं।" },
};

const id = {
  back: "Kembali ke Beranda",
  start_cta: "Mulai Sekarang",
  write: { ...en.write, title: "Menulis Setiap Hari", subtitle: "Tulis jurnal dalam bahasa target Anda untuk belajar secara alami." },
  correct: { ...en.correct, title: "Koreksi AI", subtitle: "Grok AI langsung menganalisis tata bahasa, kosakata, dan ekspresi alami." },
  archive: { ...en.archive, title: "Arsip Pribadi", subtitle: "Simpan ekspresi dari koreksi AI dan tinjau dengan kuis personal." },
  speaking: { ...en.speaking, title: "Latihan Berbicara", subtitle: "Latih pengucapan dan ekspresi bersama AI dan dapatkan umpan balik instan." },
};

const th = {
  back: "กลับหน้าหลัก",
  start_cta: "เริ่มตอนนี้",
  write: { ...en.write, title: "เขียนทุกวัน", subtitle: "เขียนไดอารี่ในภาษาเป้าหมายเพื่อเรียนรู้อย่างธรรมชาติ" },
  correct: { ...en.correct, title: "การแก้ไข AI", subtitle: "Grok AI วิเคราะห์ไวยากรณ์ คำศัพท์ และการแสดงออกที่เป็นธรรมชาติทันที" },
  archive: { ...en.archive, title: "คลังส่วนตัว", subtitle: "บันทึกคำแสดงออกจากการแก้ไข AI และทบทวนด้วยแบบทดสอบส่วนตัว" },
  speaking: { ...en.speaking, title: "ฝึกพูด", subtitle: "ฝึกการออกเสียงและการแสดงออกกับ AI และรับข้อเสนอแนะทันที" },
};

const vi = {
  back: "Quay lại trang chủ",
  start_cta: "Bắt đầu ngay",
  write: { ...en.write, title: "Viết mỗi ngày", subtitle: "Viết nhật ký bằng ngôn ngữ mục tiêu để học tự nhiên." },
  correct: { ...en.correct, title: "Sửa lỗi AI", subtitle: "Grok AI phân tích ngữ pháp, từ vựng và cách diễn đạt tự nhiên ngay lập tức." },
  archive: { ...en.archive, title: "Kho lưu trữ cá nhân", subtitle: "Lưu các cách diễn đạt từ sửa lỗi AI và ôn lại bằng bài kiểm tra cá nhân." },
  speaking: { ...en.speaking, title: "Luyện nói", subtitle: "Luyện phát âm và cách diễn đạt với AI, nhận phản hồi ngay lập tức." },
};

const bn = {
  back: "হোমে ফিরুন",
  start_cta: "এখনই শুরু করুন",
  write: { ...en.write, title: "প্রতিদিন লেখা", subtitle: "লক্ষ্য ভাষায় ডায়েরি লিখে স্বাভাবিকভাবে শিখুন।" },
  correct: { ...en.correct, title: "AI সংশোধন", subtitle: "Grok AI তাৎক্ষণিকভাবে ব্যাকরণ, শব্দভান্ডার এবং স্বাভাবিক প্রকাশ বিশ্লেষণ করে।" },
  archive: { ...en.archive, title: "ব্যক্তিগত আর্কাইভ", subtitle: "AI সংশোধন থেকে প্রকাশ সংরক্ষণ করুন এবং কুইজ দিয়ে পর্যালোচনা করুন।" },
  speaking: { ...en.speaking, title: "কথা বলার অনুশীলন", subtitle: "AI এর সাথে উচ্চারণ ও প্রকাশ অনুশীলন করুন এবং তাৎক্ষণিক প্রতিক্রিয়া পান।" },
};

const ur = {
  back: "ہوم پر واپس",
  start_cta: "ابھی شروع کریں",
  write: { ...en.write, title: "روزانہ لکھیں", subtitle: "اپنی ہدف زبان میں ڈائری لکھ کر قدرتی طریقے سے سیکھیں۔" },
  correct: { ...en.correct, title: "AI اصلاح", subtitle: "Grok AI فوری طور پر گرامر، الفاظ اور قدرتی اظہار کا تجزیہ کرتا ہے۔" },
  archive: { ...en.archive, title: "ذاتی آرکائیو", subtitle: "AI اصلاح سے اظہارات محفوظ کریں اور کوئزز سے دہرائیں۔" },
  speaking: { ...en.speaking, title: "بولنے کی مشق", subtitle: "AI کے ساتھ تلفظ اور اظہار کی مشق کریں اور فوری رائے پائیں۔" },
};

const ne = {
  back: "गृहपृष्ठमा फिर्ता",
  start_cta: "अहिले सुरू गर्नुहोस्",
  write: { ...en.write, title: "रोज लेख्नुहोस्", subtitle: "लक्ष्य भाषामा डायरी लेखेर स्वाभाविक रूपमा सिक्नुहोस्।" },
  correct: { ...en.correct, title: "AI सुधार", subtitle: "Grok AI तुरुन्त व्याकरण, शब्दावली र स्वाभाविक अभिव्यक्तिहरू विश्लेषण गर्छ।" },
  archive: { ...en.archive, title: "व्यक्तिगत पुरालेख", subtitle: "AI सुधारबाट अभिव्यक्तिहरू बचत गर्नुहोस् र प्रश्नोत्तरीले समीक्षा गर्नुहोस्।" },
  speaking: { ...en.speaking, title: "बोल्ने अभ्यास", subtitle: "AI सँग उच्चारण र अभिव्यक्ति अभ्यास गर्नुहोस् र तत्काल प्रतिक्रिया पाउनुहोस्।" },
};

const localeMap = { en, ko, ja, zh, es, fr, de, pt, ru, tr, ar, hi, id, th, vi, bn, ur, ne };

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const loc = file.replace(".json", "");
  const fp = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  data.guide = localeMap[loc] || en;
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("Done:", file);
}
