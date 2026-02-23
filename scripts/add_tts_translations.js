const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'messages');
const languages = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh'];

const translations = {
  ar: {
    "diary.play_audio": "تشغيل الصوت",
    "diary.generate_audio": "توليد صوت AI",
    "diary.checking_audio": "جاري التحقق من الحالة...",
    "diary.generating_audio": "جاري توليد الصوت...",
    "diary.audio_ready": "صوت AI جاهز"
  },
  bn: {
    "diary.play_audio": "অডিও চালান",
    "diary.generate_audio": "এআই অডিও তৈরি করুন",
    "diary.checking_audio": "স্ট্যাটাস চেক করা হচ্ছে...",
    "diary.generating_audio": "অডিও তৈরি করা হচ্ছে...",
    "diary.audio_ready": "এআই অডিও প্রস্তুত"
  },
  de: {
    "diary.play_audio": "Audio abspielen",
    "diary.generate_audio": "KI-Audio generieren",
    "diary.checking_audio": "Status wird überprüft...",
    "diary.generating_audio": "Audio wird generiert...",
    "diary.audio_ready": "KI-Audio ist bereit"
  },
  es: {
    "diary.play_audio": "Reproducir audio",
    "diary.generate_audio": "Generar audio con IA",
    "diary.checking_audio": "Comprobando estado...",
    "diary.generating_audio": "Generando audio...",
    "diary.audio_ready": "El audio de IA está listo"
  },
  fr: {
    "diary.play_audio": "Lire l'audio",
    "diary.generate_audio": "Générer un audio IA",
    "diary.checking_audio": "Vérification de l'état...",
    "diary.generating_audio": "Génération de l'audio...",
    "diary.audio_ready": "L'audio IA est prêt"
  },
  hi: {
    "diary.play_audio": "ऑडियो चलाएं",
    "diary.generate_audio": "AI ऑडियो जनरेट करें",
    "diary.checking_audio": "स्थिति जांची जा रही है...",
    "diary.generating_audio": "ऑडियो जनरेट किया जा रहा है...",
    "diary.audio_ready": "AI ऑडियो तैयार है"
  },
  id: {
    "diary.play_audio": "Putar Audio",
    "diary.generate_audio": "Hasilkan Audio AI",
    "diary.checking_audio": "Memeriksa status...",
    "diary.generating_audio": "Menghasilkan Audio...",
    "diary.audio_ready": "Audio AI sudah siap"
  },
  ja: {
    "diary.play_audio": "音声を再生",
    "diary.generate_audio": "AI音声を生成",
    "diary.checking_audio": "ステータスを確認中...",
    "diary.generating_audio": "音声を生成中...",
    "diary.audio_ready": "AI音声の準備ができました"
  },
  ne: {
    "diary.play_audio": "अडियो बजाउनुहोस्",
    "diary.generate_audio": "AI अडियो उत्पन्न गर्नुहोस्",
    "diary.checking_audio": "स्थिति जाँचिदै...",
    "diary.generating_audio": "अडियो उत्पन्न गरिँदै...",
    "diary.audio_ready": "AI अडियो तयार छ"
  },
  pt: {
    "diary.play_audio": "Reproduzir áudio",
    "diary.generate_audio": "Gerar Áudio com IA",
    "diary.checking_audio": "Verificando o status...",
    "diary.generating_audio": "Gerando Áudio...",
    "diary.audio_ready": "O Áudio com IA está pronto"
  },
  ru: {
    "diary.play_audio": "Воспроизвести аудио",
    "diary.generate_audio": "Сгенерировать ИИ-аудио",
    "diary.checking_audio": "Проверка статуса...",
    "diary.generating_audio": "Генерация аудио...",
    "diary.audio_ready": "ИИ-аудио готово"
  },
  th: {
    "diary.play_audio": "เล่นเสียง",
    "diary.generate_audio": "สร้างเสียง AI",
    "diary.checking_audio": "กำลังตรวจสอบสถานะ...",
    "diary.generating_audio": "กำลังสร้างเสียง...",
    "diary.audio_ready": "เสียง AI พร้อมแล้ว"
  },
  tr: {
    "diary.play_audio": "Sesi Oynat",
    "diary.generate_audio": "Yapay Zeka Sesi Oluştur",
    "diary.checking_audio": "Durum kontrol ediliyor...",
    "diary.generating_audio": "Ses oluşturuluyor...",
    "diary.audio_ready": "Yapay Zeka Sesi hazır"
  },
  ur: {
    "diary.play_audio": "آڈیو چلائیں",
    "diary.generate_audio": "AI آڈیو بنائیں",
    "diary.checking_audio": "سٹیٹس چیک ہو رہا ہے...",
    "diary.generating_audio": "آڈیو بنائی جا رہی ہے...",
    "diary.audio_ready": "AI آڈیو تیار ہے"
  },
  vi: {
    "diary.play_audio": "Phát âm thanh",
    "diary.generate_audio": "Tạo âm thanh AI",
    "diary.checking_audio": "Đang kiểm tra trạng thái...",
    "diary.generating_audio": "Đang tạo âm thanh...",
    "diary.audio_ready": "Âm thanh AI đã sẵn sàng"
  },
  zh: {
    "diary.play_audio": "播放音频",
    "diary.generate_audio": "生成AI音频",
    "diary.checking_audio": "正在检查状态...",
    "diary.generating_audio": "正在生成音频...",
    "diary.audio_ready": "AI音频已就绪"
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
           // Support dot notation for 2 levels (diary.xxx)
           const parts = key.split('.');
           const parent = parts[0];
           const child = parts[1];

           if (!content[parent]) content[parent] = {};
           
           if (!content[parent][child]) {
             content[parent][child] = val;
             modified = true;
           } else if (content[parent][child] !== val) {
             content[parent][child] = val;
             modified = true;
           }
        });

        if (modified) {
           fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
           console.log(`Updated ${lang}.json with new TTS translations.`);
        } else {
           console.log(`TTS keys already exist in ${lang}.json.`);
        }

      } catch (e) {
        console.error(`Error processing ${lang}.json`, e);
      }
    }
  });
}

inject();
