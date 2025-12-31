const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'messages');
const languages = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh'];

const translations = {
  ar: {
    "common.ai_check": "تصحيح AI",
    "common.ai_checking": "جاري التصحيح...",
    "common.ai_analyzing": "Grok AI يفكر...",
    "common.ai_analyzing_desc": "تحليل يومياتك وإيجاد تعبيرات محسنة.",
    "common.apply": "تطبيق",
    "home.mascot_guest": "مرحبًا! 👋",
    "home.mascot_user": "ماذا حدث اليوم؟ 📝"
  },
  bn: {
    "common.ai_check": "এআই সংশোধন",
    "common.ai_checking": "সংশোধন করা হচ্ছে...",
    "common.ai_analyzing": "Grok AI ভাবছে...",
    "common.ai_analyzing_desc": "আপনার ডায়েরি বিশ্লেষণ এবং উন্নত অভিব্যক্তি খোঁজা হচ্ছে।",
    "common.apply": "প্রয়োগ করুন",
    "home.mascot_guest": "হ্যালো! 👋",
    "home.mascot_user": "আজ কী হলো? 📝"
  },
  de: {
    "common.ai_check": "KI-Korrektur",
    "common.ai_checking": "Korrigiere...",
    "common.ai_analyzing": "Grok AI denkt nach...",
    "common.ai_analyzing_desc": "Analysiere dein Tagebuch und finde verbesserte Ausdrücke.",
    "common.apply": "Anwenden",
    "home.mascot_guest": "Hallo! 👋",
    "home.mascot_user": "Was ist heute passiert? 📝"
  },
  es: {
    "common.ai_check": "Corrección de IA",
    "common.ai_checking": "Corrigiendo...",
    "common.ai_analyzing": "Grok AI está pensando...",
    "common.ai_analyzing_desc": "Analizando tu diario y encontrando expresiones mejoradas.",
    "common.apply": "Aplicar",
    "home.mascot_guest": "¡Hola! 👋",
    "home.mascot_user": "¿Qué pasó hoy? 📝"
  },
  fr: {
    "common.ai_check": "Correction IA",
    "common.ai_checking": "Correction en cours...",
    "common.ai_analyzing": "Grok AI réfléchit...",
    "common.ai_analyzing_desc": "Analyse de votre journal et recherche d'expressions améliorées.",
    "common.apply": "Appliquer",
    "home.mascot_guest": "Bonjour ! 👋",
    "home.mascot_user": "Que s'est-il passé aujourd'hui ? 📝"
  },
  hi: {
    "common.ai_check": "एआई सुधार",
    "common.ai_checking": "सुधार रहा है...",
    "common.ai_analyzing": "Grok AI सोच रहा है...",
    "common.ai_analyzing_desc": "अपनी डायरी का विश्लेषण और बेहतर अभिव्यक्ति ढूँढना।",
    "common.apply": "लागू करें",
    "home.mascot_guest": "नमस्ते! 👋",
    "home.mascot_user": "आज क्या हुआ? 📝"
  },
  id: {
    "common.ai_check": "Koreksi AI",
    "common.ai_checking": "Sedang mengoreksi...",
    "common.ai_analyzing": "Grok AI sedang berpikir...",
    "common.ai_analyzing_desc": "Menganalisis buku harian Anda dan menemukan ekspresi yang lebih baik.",
    "common.apply": "Terapkan",
    "home.mascot_guest": "Halo! 👋",
    "home.mascot_user": "Apa yang terjadi hari ini? 📝"
  },
  ja: {
    "common.ai_check": "AI添削",
    "common.ai_checking": "添削中...",
    "common.ai_analyzing": "Grok AIが考え中...",
    "common.ai_analyzing_desc": "日記を分析し、より良い表現を見つけています。",
    "common.apply": "適用",
    "home.mascot_guest": "こんにちは！ 👋",
    "home.mascot_user": "今日は何があった？ 📝"
  },
  ko: {
    "common.ai_check": "AI 교정",
    "common.ai_checking": "교정 중...",
    "common.ai_analyzing": "Grok AI가 생각 중...",
    "common.ai_analyzing_desc": "일기를 분석하고 더 나은 표현을 찾고 있습니다.",
    "common.apply": "적용",
    "home.mascot_guest": "안녕! 👋",
    "home.mascot_user": "오늘 무슨 일이 있었어? 📝"
  },
  ne: {
    "common.ai_check": "AI सुधार",
    "common.ai_checking": "सुधार गर्दै...",
    "common.ai_analyzing": "Grok AI सोच्दै छ...",
    "common.ai_analyzing_desc": "तपाईंको डायरी विश्लेषण गर्दै र सुधारिएका अभिव्यक्तिहरू फेला पार्दै।",
    "common.apply": "लागू गर्नुहोस्",
    "home.mascot_guest": "नमस्ते! 👋",
    "home.mascot_user": "आज के भयो? 📝"
  },
  pt: {
    "common.ai_check": "Correção de IA",
    "common.ai_checking": "Corrigindo...",
    "common.ai_analyzing": "Grok AI está pensando...",
    "common.ai_analyzing_desc": "Analisando seu diário e encontrando expressões melhoradas.",
    "common.apply": "Aplicar",
    "home.mascot_guest": "Olá! 👋",
    "home.mascot_user": "O que aconteceu hoje? 📝"
  },
  ru: {
    "common.ai_check": "AI-коррекция",
    "common.ai_checking": "Исправление...",
    "common.ai_analyzing": "Grok AI думает...",
    "common.ai_analyzing_desc": "Анализ дневника и поиск улучшенных выражений.",
    "common.apply": "Применить",
    "home.mascot_guest": "Привет! 👋",
    "home.mascot_user": "Что случилось сегодня? 📝"
  },
  th: {
    "common.ai_check": "แก้ไขโดย AI",
    "common.ai_checking": "กำลังแก้ไข...",
    "common.ai_analyzing": "Grok AI กำลังคิด...",
    "common.ai_analyzing_desc": "วิเคราะห์ไดอารี่ของคุณและค้นหาสำนวนที่ดีขึ้น",
    "common.apply": "ใช้",
    "home.mascot_guest": "สวัสดี! 👋",
    "home.mascot_user": "วันนี้เกิดอะไรขึ้น? 📝"
  },
  tr: {
    "common.ai_check": "Yapay Zeka Düzeltimi",
    "common.ai_checking": "Düzeltiliyor...",
    "common.ai_analyzing": "Grok AI düşünüyor...",
    "common.ai_analyzing_desc": "Günlüğünüzü analiz ediyor ve geliştirilmiş ifadeler buluyor.",
    "common.apply": "Uygula",
    "home.mascot_guest": "Merhaba! 👋",
    "home.mascot_user": "Bugün ne oldu? 📝"
  },
  ur: {
    "common.ai_check": "AI تصحیح",
    "common.ai_checking": "درست کر رہا ہے...",
    "common.ai_analyzing": "Grok AI سوچ رہا ہے...",
    "common.ai_analyzing_desc": "آپ کی ڈائری کا تجزیہ اور بہتر تاثرات تلاش کرنا۔",
    "common.apply": "لاگو کریں",
    "home.mascot_guest": "ہیلو! 👋",
    "home.mascot_user": "آج کیا ہوا؟ 📝"
  },
  vi: {
    "common.ai_check": "Sửa lỗi AI",
    "common.ai_checking": "Đang sửa...",
    "common.ai_analyzing": "Grok AI đang suy nghĩ...",
    "common.ai_analyzing_desc": "Phân tích nhật ký của bạn và tìm các biểu thức cải tiến.",
    "common.apply": "Áp dụng",
    "home.mascot_guest": "Xin chào! 👋",
    "home.mascot_user": "Hôm nay có chuyện gì thế? 📝"
  },
  zh: {
    "common.ai_check": "AI 修正",
    "common.ai_checking": "正在修正...",
    "common.ai_analyzing": "Grok AI 正在思考...",
    "common.ai_analyzing_desc": "分析您的日记并寻找改进的表达方式。",
    "common.apply": "应用",
    "home.mascot_guest": "你好！ 👋",
    "home.mascot_user": "今天发生了什么？ 📝"
  }
};

function inject() {
  languages.forEach(lang => {
    const filePath = path.join(dir, `${lang}.json`);
    const langData = translations[lang];

    if (langData && fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;

        // Injections
        Object.entries(langData).forEach(([key, val]) => {
           // Support dot notation for 2 levels (common.x, home.x)
           const parts = key.split('.');
           const parent = parts[0];
           const child = parts[1];

           if (!content[parent]) content[parent] = {};
           
           if (!content[parent][child]) {
             content[parent][child] = val;
             modified = true;
           }
        });

        if (modified) {
           fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
           console.log(`Updated ${lang}.json with missing keys.`);
        } else {
           console.log(`No missing keys in ${lang}.json.`);
        }

      } catch (e) {
        console.error(`Error processing ${lang}.json`, e);
      }
    }
  });
}

inject();
