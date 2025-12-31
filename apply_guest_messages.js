const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'messages');
const languages = ['ar', 'bn', 'de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh'];

// 25 Guest Messages (Welcome + Signup Motivation)
const messages = {
  en: [
    "I'm Study Duck! Let's learn together!", "Sign up to save your daily progress.", "Don't lose your streak—log in now!", "I can help you fix your diary.", "Create a free account to start.",
    "Nice to meet you! I'm your AI tutor.", "Want to remember this word? Sign up!", "Join our community of learners.", "Your language journey starts here.", "Login to unlock more features.",
    "I'm waiting for you to sign up!", "Let's make learning fun.", "Keep your notes safe in the cloud.", "Become a member for better feedback.", "Hello! I'm here to help.",
    "Ready to master a new language?", "Sign up and get smarter everyday.", "I'm lonely... join me!", "Your personal archive awaits.", "Track your growth with a profile.",
    "It's free to join!", "Let's study hard today.", "I have so much to teach you.", "Save your favorite sentences.", "Welcome friend! Login to continue."
  ],
  ko: [
    "안녕! 난 스터디덕이야. 같이 공부하자!", "매일의 학습 기록을 저장하려면 가입해!", "연속 학습 기록을 놓치지 마. 로그인 해!", "내가 너의 일기를 교정해 줄 수 있어.", "무료 계정을 만들고 시작해 봐.",
    "반가워! 난 너의 AI 튜터야.", "이 단어를 기억하고 싶니? 가입해!", "우리 학습 커뮤니티에 들어와.", "네 언어 학습 여정이 여기서 시작돼.", "더 많은 기능을 보려면 로그인 해.",
    "네가 가입하기를 기다리고 있어!", "공부를 더 재미있게 만들어 보자.", "내용을 클라우드에 안전하게 보관해.", "더 좋은 피드백을 위해 회원이 되어봐.", "안녕! 널 도우러 왔어.",
    "새로운 언어를 마스터할 준비 됐어?", "가입하고 매일 더 똑똑해지자.", "나 외로워... 같이 하자!", "너만의 개인 아카이브가 기다려.", "프로필로 성장을 기록해 봐.",
    "가입은 무료야!", "오늘도 열심히 공부하자.", "너에게 알려줄 게 아주 많아.", "좋아하는 문장을 저장해 봐.", "환영해 친구! 계속 하려면 로그인 해."
  ],
  ja: [
    "私はスタディダック！一緒に勉強しよう！", "毎日の進捗を保存するために登録してね。", "学習記録を途切れさせないで。ログインして！", "日記の添削を手伝うよ。", "無料アカウントを作成して始めよう。",
    "はじめまして！私はあなたのAIチューターです。", "この単語を覚えたい？登録して！", "学習コミュニティに参加しよう。", "あなたの語学の旅はここから始まる。", "もっと機能を使うにはログインしてね。",
    "あなたが登録するのを待ってるよ！", "学習をもっと楽しくしよう。", "ノートをクラウドに安全に保存しよう。", "より良いフィードバックのためにメンバーになって。", "こんにちは！手伝いに来たよ。",
    "新しい言語をマスターする準備はいい？", "登録して毎日賢くなろう。", "寂しいな…一緒にやろう！", "あなただけのアーカイブが待っているよ。", "プロフィールで成長を記録しよう。",
    "参加は無料だよ！", "今日も一生懸命勉強しよう。", "教えたいことがたくさんあるんだ。", "お気に入りの文章を保存しよう。", "ようこそ！続けるにはログインして。"
  ],
  es: [
    "¡Soy Study Duck! ¡Aprendamos juntos!", "Regístrate para guardar tu progreso diario.", "No pierdas tu racha, ¡inicia sesión ahora!", "Puedo ayudarte a corregir tu diario.", "Crea una cuenta gratuita para empezar.",
    "¡Encantado! Soy tu tutor de IA.", "¿Quieres recordar esta palabra? ¡Regístrate!", "Únete a nuestra comunidad de estudiantes.", "Tu viaje lingüístico comienza aquí.", "Inicia sesión para desbloquear más funciones.",
    "¡Estoy esperando que te registres!", "Hagamos que aprender sea divertido.", "Mantén tus notas seguras en la nube.", "Hazte miembro para recibir mejores comentarios.", "¡Hola! Estoy aquí para ayudar.",
    "¿Listo para dominar un nuevo idioma?", "Regístrate y vuélvete más inteligente cada día.", "Estoy solo... ¡únete a mí!", "Tu archivo personal te espera.", "Sigue tu crecimiento con un perfil.",
    "¡Unirse es gratis!", "Estudiemos mucho hoy.", "Tengo mucho que enseñarte.", "Guarda tus frases favoritas.", "¡Bienvenido amigo! Inicia sesión para continuar."
  ],
  fr: [
    "Je suis Study Duck ! Apprenons ensemble !", "Inscrivez-vous pour sauvegarder vos progrès.", "Ne perdez pas votre série, connectez-vous !", "Je peux vous aider à corriger votre journal.", "Créez un compte gratuit pour commencer.",
    "Enchanté ! Je suis votre tuteur IA.", "Vous voulez retenir ce mot ? Inscrivez-vous !", "Rejoignez notre communauté d'apprenants.", "Votre voyage linguistique commence ici.", "Connectez-vous pour débloquer plus de fonctions.",
    "J'attends votre inscription !", "Rendons l'apprentissage amusant.", "Gardez vos notes en sécurité dans le cloud.", "Devenez membre pour de meilleurs retours.", "Bonjour ! Je suis là pour aider.",
    "Prêt à maîtriser une nouvelle langue ?", "Inscrivez-vous et apprenez chaque jour.", "Je me sens seul... rejoignez-moi !", "Votre archive personnelle vous attend.", "Suivez votre croissance avec un profil.",
    "C'est gratuit de rejoindre !", "Étudions dur aujourd'hui.", "J'ai tant à vous apprendre.", "Sauvegardez vos phrases préférées.", "Bienvenue l'ami ! Connectez-vous pour continuer."
  ],
  de: [
    "Ich bin Study Duck! Lern mit mir!", "Melde dich an, um Fortschritte zu speichern.", "Verliere nicht deinen Streak – log dich ein!", "Ich kann dir beim Tagebuch helfen.", "Erstelle ein kostenloses Konto.",
    "Freut mich! Ich bin dein KI-Tutor.", "Willst du dir das Wort merken? Melde dich an!", "Tritt unserer Lerngemeinschaft bei.", "Deine Sprachreise beginnt hier.", "Log dich ein für mehr Funktionen.",
    "Ich warte auf deine Anmeldung!", "Lass uns Spaß beim Lernen haben.", "Speichere deine Notizen sicher.", "Werde Mitglied für besseres Feedback.", "Hallo! Ich bin hier, um zu helfen.",
    "Bereit, eine neue Sprache zu meistern?", "Melde dich an und werde jeden Tag klüger.", "Ich bin einsam... mach mit!", "Dein persönliches Archiv wartet.", "Verfolge dein Wachstum im Profil.",
    "Der Beitritt ist kostenlos!", "Lass uns heute fleißig lernen.", "Ich habe dir viel beizubringen.", "Speichere deine Lieblingssätze.", "Willkommen Freund! Log dich ein."
  ],
  zh: [
    "我是Study Duck！一起学习吧！", "注册以保存您的每日进度。", "别断了连续记录—现在登录！", "我可以帮你修改日记。", "创建一个免费账户开始吧。",
    "很高兴认识你！我是你的AI导师。", "想记住这个词吗？注册吧！", "加入我们的学习社区。", "你的语言之旅从这里开始。", "登录以解锁更多功能。",
    "我在等你注册哦！", "让学习变得更有趣。", "将笔记安全保存在云端。", "成为会员以获得更好的反馈。", "你好！我来帮你了。",
    "准备好通过新语言了吗？", "注册并每天变聪明一点。", "我好孤单... 加入我吧！", "你的个人档案在等你。", "用个人资料追踪你的成长。",
    "加入是免费的！", "今天也要努力学习。", "我有很多东西要教你。", "保存你最喜欢的句子。", "欢迎朋友！登录以继续。"
  ],
  hi: [
    "मैं स्टडी डक हूँ! चलो साथ में सीखते हैं!", "अपनी प्रगति सुरक्षित करने के लिए साइन अप करें।", "अपना क्रम मत तोड़ो - अभी लॉगिन करो!", "मैं आपकी डायरी ठीक करने में मदद कर सकता हूँ।", "शुरू करने के लिए मुफ्त खाता बनाएँ।",
    "आपसे मिलकर खुशी हुई! मैं आपका AI शिक्षक हूँ।", "इस शब्द को याद रखना चाहते हैं? साइन अप करें!", "हमारे सीखने वालों के समुदाय में शामिल हों।", "आपकी भाषा यात्रा यहाँ शुरू होती है।", "अधिक सुविधाएँ पाने के लिए लॉगिन करें।",
    "मैं आपके साइन अप करने का इंतज़ार कर रहा हूँ!", "चलो सीखने को मजेदार बनाते हैं।", "अपने नोट्स क्लाउड में सुरक्षित रखें।", "बेहतर फीडबैक के लिए सदस्य बनें।", "नमस्ते! मैं मदद करने के लिए यहाँ हूँ।",
    "क्या आप एक नई भाषा में महारत हासिल करने के लिए तैयार हैं?", "साइन अप करें और रोज़ होशियार बनें।", "मैं अकेला हूँ... मेरे साथ जुड़ें!", "आपका व्यक्तिगत संग्रह आपका इंतज़ार कर रहा है।", "प्रोफ़ाइल के साथ अपनी वृद्धि ट्रैक करें।",
    "शामिल होना मुफ़्त है!", "चलो आज कड़ी मेहनत करते हैं।", "मेरे पास आपको सिखाने के लिए बहुत कुछ है।", "अपने पसंदीदा वाक्यों को सहेजें।", "स्वागत है दोस्त! जारी रखने के लिए लॉगिन करें।"
  ],
  pt: [
    "Sou o Study Duck! Vamos aprender juntos!", "Cadastre-se para salvar seu progresso.", "Não perca sua sequência, entre agora!", "Posso ajudar a corrigir seu diário.", "Crie uma conta gratuita para começar.",
    "Prazer! Sou seu tutor de IA.", "Quer lembrar esta palavra? Inscreva-se!", "Junte-se à nossa comunidade.", "Sua jornada linguística começa aqui.", "Faça login para mais recursos.",
    "Estou esperando você se inscrever!", "Vamos tornar o aprendizado divertido.", "Mantenha suas anotações seguras.", "Seja membro para melhor feedback.", "Olá! Estou aqui para ajudar.",
    "Pronto para dominar um novo idioma?", "Inscreva-se e fique mais inteligente.", "Estou sozinho... junte-se a mim!", "Seu arquivo pessoal aguarda.", "Acompanhe seu crescimento.",
    "É grátis participar!", "Vamos estudar bastante hoje.", "Tenho muito a te ensinar.", "Salve suas frases favoritas.", "Bem-vindo amigo! Entre para continuar."
  ],
  ru: [
    "Я Study Duck! Давай учиться!", "Зарегистрируйся, чтобы сохранить прогресс.", "Не теряй серию — войди сейчас!", "Я помогу исправить твой дневник.", "Создай бесплатный аккаунт.",
    "Приятно познакомиться! Я твой AI-репетитор.", "Хочешь запомнить это слово? Регистрируйся!", "Присоединяйся к нашему сообществу.", "Твой языковой путь начинается здесь.", "Войди, чтобы открыть больше функций.",
    "Я жду твоей регистрации!", "Давай сделаем учебу веселой.", "Храни заметки в облаке безопасно.", "Стань участником для лучшей обратной связи.", "Привет! Я здесь, чтобы помочь.",
    "Готов освоить новый язык?", "Регистрируйся и становись умнее.", "Мне одиноко... присоединяйся!", "Твой личный архив ждет тебя.", "Отслеживай свой рост в профиле.",
    "Присоединиться бесплатно!", "Давай усердно учиться сегодня.", "Мне есть чему тебя научить.", "Сохраняй любимые фразы.", "Добро пожаловать, друг! Войди, чтобы продолжить."
  ],
  ar: [
    "أنا بطة الدراسة! لنتعلم معًا!", "سجل لحفظ تقدمك اليومي.", "لا تفقد حماسك - سجل الدخول الآن!", "يمكنني مساعدتك في تصحيح مذكراتك.", "أنشئ حسابًا مجانيًا للبدء.",
    "سعيد بلقائك! أنا معلمك الذكي.", "تريد تذكر هذه الكلمة؟ سجل الآن!", "انضم إلى مجتمع المتعلمين لدينا.", "رحلتك اللغوية تبدأ هنا.", "سجل الدخول لفتح المزيد من الميزات.",
    "أنا في انتظار تسجيلك!", "لنجعل التعلم ممتعًا.", "احفظ ملاحظاتك بأمان في السحابة.", "كن عضوًا للحصول على ملاحظات أفضل.", "مرحبًا! أنا هنا للمساعدة.",
    "جاهز لإتقان لغة جديدة؟", "سجل وكن أكثر ذكاءً كل يوم.", "أشعر بالوحدة... انضم إلي!", "أرشيفك الشخصي بانتظارك.", "تتبع نموك من خلال ملفك الشخصي.",
    "الانضمام مجاني!", "لندرس بجد اليوم.", "لدي الكثير لأسلمك إياه.", "احفظ جملك المفضلة.", "أهلاً يا صديقي! سجل الدخول للمتابعة."
  ],
  bn: [
    "আমি স্টাডি ডাক! আসুন একসাথে শিখি!", "আপনার দৈনিক অগ্রগতি সংরক্ষণ করতে সাইন আপ করুন।", "আপনার ধারাবাহিকতা হারাবেন না—এখনই লগ ইন করুন!", "আমি আপনার ডায়েরি ঠিক করতে সাহায্য করতে পারি।", "শুরু করতে একটি বিনামূল্যে অ্যাকাউন্ট তৈরি করুন।",
    "আপনার সাথে দেখা করে ভালো লাগল! আমি আপনার এআই টিউটর।", "এই শব্দটি মনে রাখতে চান? সাইন আপ করুন!", "আমাদের শিক্ষার্থীদের সম্প্রদায়ে যোগ দিন।", "আপনার ভাষা শেখার যাত্রা এখানেই শুরু হয়।", "আরও বৈশিষ্ট্য আনলক করতে লগ ইন করুন।",
    "আমি আপনার সাইন আপ করার অপেক্ষায় আছি!", "আসুন শেখাকে মজাদার করি।", "আপনার নোটগুলি ক্লাউডে নিরাপদে রাখুন।", "আরও ভালো ফিডব্যাক পেতে সদস্য হন।", "হ্যালো! আমি সাহায্য করতে এখানে আছি।",
    "একটি নতুন ভাষা আয়ত্ত করতে প্রস্তুত?", "সাইন আপ করুন এবং প্রতিদিন আরও স্মার্ট হন।", "আমি একা... আমার সাথে যোগ দিন!", "আপনার ব্যক্তিগত আর্কাইভ অপেক্ষা করছে।", "প্রোফাইলের মাধ্যমে আপনার বৃদ্ধি ট্র্যাক করুন।",
    "যোগ দেওয়া বিনামূল্যে!", "আসুন আজ কঠোর অধ্যয়ন করি।", "আপনাকে শেখানোর মতো আমার অনেক কিছু আছে।", "আপনার প্রিয় বাক্য সংরক্ষণ করুন।", "স্বাগতম বন্ধু! চালিয়ে যেতে লগ ইন করুন।"
  ],
  id: [
    "Aku Study Duck! Ayo belajar bareng!", "Daftar untuk simpan progresmu.", "Jangan putus streakmu—login sekarang!", "Aku bisa bantu koreksi diarymu.", "Buat akun gratis untuk mulai.",
    "Salam kenal! Aku tutor AI-mu.", "Mau ingat kata ini? Daftar yuk!", "Gabung komunitas pelajar kami.", "Perjalanan bahasamu mulai di sini.", "Login untuk fitur lebih banyak.",
    "Aku nunggu kamu daftar nih!", "Ayo bikin belajar jadi seru.", "Simpan catatanmu aman di cloud.", "Jadi member buat feedback lebih baik.", "Halo! Aku di sini buat bantu.",
    "Siap menguasai bahasa baru?", "Daftar dan jadi makin pintar tiap hari.", "Aku kesepian... temani aku dong!", "Arsip pribadimu sudah menunggu.", "Lacak pertumbuhanmu di profil.",
    "Gabungnya gratis lho!", "Ayo belajar giat hari ini.", "Banyak yang mau aku ajarkan.", "Simpan kalimat favoritmu.", "Halo teman! Login untuk lanjut."
  ],
  th: [
    "ฉันคือ Study Duck! มาเรียนด้วยกันเถอะ!", "ลงทะเบียนเพื่อบันทึกความคืบหน้า", "อย่าให้ขาดช่วง—ล็อกอินเลย!", "ฉันช่วยแก้ไดอารี่ให้เธอได้นะ", "สร้างบัญชีฟรีเพื่อเริ่มต้น",
    "ยินดีที่ได้รู้จัก! ฉันคือติวเตอร์ AI ของคุณ", "อยากจำคำนี้ไหม? ลงทะเบียนสิ!", "เข้าร่วมชุมชนผู้เรียนของเรา", "การเดินทางทางภาษาของคุณเริ่มที่นี่", "ล็อกอินเพื่อปลดล็อกฟีเจอร์เพิ่ม",
    "ฉันรอเธอลงทะเบียนอยู่นะ!", "เรามาทำให้การเรียนสนุกกันเถอะ", "เก็บโน้ตไว้อย่างปลอดภัยบนคลาวด์", "เป็นสมาชิกเพื่อรับคำแนะนำที่ดีกว่า", "สวัสดี! ฉันมาเพื่อช่วย",
    "พร้อมเก่งภาษาใหม่หรือยัง?", "ลงทะเบียนแล้วเก่งขึ้นทุกวัน", "ฉันเหงาจัง... มาอยู่เป็นเพื่อนหน่อย!", "คลังความรู้ส่วนตัวรอเธออยู่", "ติดตามการเติบโตด้วยโปรไฟล์",
    "เข้าร่วมฟรีนะ!", "วันนี้มาตั้งใจเรียนกันเถอะ", "ฉันมีอะไรจะสอนเธอเยอะเลย", "บันทึกประโยคโปรดของคุณไว้", "สวัสดีเพื่อนยาก! ล็อกอินเพื่อไปต่อ"
  ],
  tr: [
    "Ben Study Duck! Hadi birlikte öğrenelim!", "İlerlemeni kaydetmek için kaydol.", "Serini bozma—hemen giriş yap!", "Günlüğünü düzeltmene yardım edebilirim.", "Başlamak için ücretsiz hesap oluştur.",
    "Tanıştığımıza memnun oldum! Ben AI öğretmeninim.", "Bu kelimeyi hatırlamak ister misin? Kaydol!", "Öğrenci topluluğumuza katıl.", "Dil yolculuğun burada başlıyor.", "Daha fazla özellik için giriş yap.",
    "Kaydolmanı bekliyorum!", "Öğrenmeyi eğlenceli hale getirelim.", "Notlarını bulutta güvenle sakla.", "Daha iyi geri bildirim için üye ol.", "Merhaba! Yardım etmek için buradayım.",
    "Yeni bir dilde ustalaşmaya hazır mısın?", "Kaydol ve her gün daha zeki ol.", "Yalnızım... bana katıl!", "Kişisel arşivin seni bekliyor.", "Gelişimini profilinle takip et.",
    "Katılmak ücretsiz!", "Bugün sıkı çalışalım.", "Sana öğretecek çok şeyim var.", "Favori cümlelerini kaydet.", "Hoş geldin dostum! Devam etmek için giriş yap."
  ],
  vi: [
    "Tôi là Study Duck! Cùng học nhé!", "Đăng ký để lưu tiến độ hàng ngày.", "Đừng để mất chuỗi—đăng nhập ngay!", "Tôi có thể giúp sửa nhật ký cho bạn.", "Tạo tài khoản miễn phí để bắt đầu.",
    "Rất vui được gặp! Tôi là gia sư AI.", "Muốn nhớ từ này không? Đăng ký nhé!", "Tham gia cộng đồng người học.", "Hành trình ngôn ngữ bắt đầu ở đây.", "Đăng nhập để mở khóa tính năng.",
    "Tôi đang đợi bạn đăng ký đấy!", "Hãy biến việc học thành niềm vui.", "Lưu ghi chú an toàn trên đám mây.", "Trở thành thành viên để nhận phản hồi tốt hơn.", "Xin chào! Tôi ở đây để giúp.",
    "Sẵn sàng làm chủ ngôn ngữ mới chưa?", "Đăng ký và thông minh hơn mỗi ngày.", "Tôi cô đơn quá... tham gia cùng tôi đi!", "Kho lưu trữ cá nhân đang chờ bạn.", "Theo dõi sự phát triển qua hồ sơ.",
    "Tham gia miễn phí mà!", "Hôm nay hãy học chăm chỉ nhé.", "Tôi có nhiều điều để dạy bạn lắm.", "Lưu lại những câu bạn thích.", "Chào bạn! Đăng nhập để tiếp tục."
  ],
  ur: [
    "میں سٹڈی ڈک ہوں! چلو ساتھ سیکھتے ہیں۔", "اپنی پیشرفت محفوظ کرنے کے لیے سائن اپ کریں۔", "اپنا تسلسل مت توڑیں—ابھی لاگ ان کریں!", "میں آپ کی ڈائरी درست کرنے میں مدد کر سکتا ہوں۔", "شروع کرنے کے لیے مفت اکاؤنٹ بنائیں۔",
    "آپ سے مل کر خوشی ہوئی! میں آپ کا AI ٹیوٹر ہوں۔", "اس لفظ کو یاد رکھنا چاہتے ہیں؟ سائن اپ کریں!", "ہماری سیکھنے والوں کی کمیونٹی میں شامل ہوں۔", "آپ کا زبان کا سفر یہاں شروع ہوتا ہے۔", "مزید خصوصیات کے لیے لاگ ان کریں۔",
    "میں آپ کے سائن اپ کا انتظار کر رہا ہوں!", "آؤ سیکھنے کو مزیدار بنائیں۔", "اپنے نوٹس کلاؤڈ میں محفوظ رکھیں۔", "بہتر فیڈ بیک کے لیے ممبر بنیں۔", "ہیلو! میں مدد کے لیے یہاں ہوں۔",
    "نئی زبان میں مہارت حاصل کرنے کے لیے تیار؟", "سائن اپ کریں اور روزانہ ذہین بنیں۔", "میں اکیلا ہوں... میرے ساتھ شامل ہوں!", "آپ کا ذاتی آرکائیو آپ کا منتظر ہے۔", "پروفائل کے ساتھ اپنی ترقی ٹریک کریں۔",
    "شامل ہونا مفت ہے!", "چلو آج سخت مطالعہ کرتے ہیں۔", "میرے پاس آپ کو سکھانے کے لیے بہت کچھ ہے۔", "اپنے پسندیدہ جملے محفوظ کریں۔", "خوش آمدید دوست! جاری رکھنے کے لیے لاگ ان کریں۔"
  ],
  ne: [
    "म स्टडी डक हुँ! सँगै सिकौं!", "आफ्नो प्रगति सुरक्षित गर्न साइन अप गर्नुहोस्।", "आफ्नो लर्निङ स्ट्रीक नतोड्नुहोस्—अहिले लगइन गर्नुहोस्!", "म तपाइँको डायरी सच्याउन मद्दत गर्न सक्छु।", "सुरु गर्न नि: शुल्क खाता बनाउनुहोस्।",
    "तपाईंलाई भेटेर खुसी लाग्यो! म तपाइँको AI शिक्षक हुँ।", "यो शब्द सम्झना चाहनुहुन्छ? साइन अप गर्नुहोस्!", "हाम्रो सिक्नेहरूको समुदायमा सामेल हुनुहोस्।", "तपाइँको भाषा यात्रा यहाँ सुरु हुन्छ।", "थप सुविधाहरू अनलक गर्न लगइन गर्नुहोस्।",
    "म तपाइँको साइन अपको प्रतीक्षा गर्दैछु!", "सिक्ने प्रक्रियालाई रमाइलो बनाऔं।", "आफ्ना नोटहरू क्लाउडमा सुरक्षित राख्नुहोस्।", "राम्रो प्रतिक्रियाको लागि सदस्य बन्नुहोस्।", "नमस्ते! म मद्दत गर्न यहाँ छु।",
    "नयाँ भाषामा पोख्त हुन तयार हुनुहुन्छ?", "साइन अप गर्नुहोस् र हरेक दिन जान्ने बन्नुहोस्।", "म एक्लो छु... मलाई साथ दिनुहोस्!", "तपाइँको व्यक्तिगत अभिलेख पर्खिरहेको छ।", "प्रोफाइल मार्फत आफ्नो वृद्धि ट्र्याक गर्नुहोस्।",
    "सामेल हुन नि: शुल्क छ!", "आज कडा अध्ययन गरौं।", "मसँग तपाइँलाई सिकाउन धेरै कुरा छन्।", "आफ्ना मनपर्ने वाक्यहरू सुरक्षित गर्नुहोस्।", "स्वागत छ साथी! जारी राख्न लगइन गर्नुहोस्।"
  ]
};

function apply() {
  languages.forEach(lang => {
    // Determine language key (handle special mapping if any, though array matches dir)
    const filePath = path.join(dir, `${lang}.json`);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Ensure mascot.guest structure
        if (!content.mascot) content.mascot = {};
        if (!content.mascot.guest) content.mascot.guest = {};
        
        // Use English as fallback if exact lang missing in 'messages' obj
        let msgs = messages[lang] || messages['en'];
        
        // Handle explicit mapping if keys differ slightly or for safety
        if (lang === 'ne' && messages['ne']) msgs = messages['ne']; 

        // Inject 25 messages
        msgs.forEach((msg, idx) => {
           content.mascot.guest[`message_${idx + 1}`] = msg;
        });
        
        // Also ensure guest_welcome is updated to a random one or fixed one if requested?
        // User asked for "guest_welcome" to be 25 various messages.
        // Wait, the request implies "guest_welcome" key itself might act as one, OR we use random.
        // The previous code used `t('home.guest_welcome')`.
        // We should PROBABLY update the code to use `guest.message_X`.
        // But let's also update the legacy `guest_welcome` just in case, or leave it.
        // Actually, we will switch logic to use `guest.message_${random}`.
        
        // Write file
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        console.log(`Updated ${lang}.json with 25 guest messages.`);
        
      } catch (e) {
        console.error(`Error processing ${lang}.json`, e);
      }
    } else {
        console.log(`Skipping ${lang}.json (not found)`);
    }
  });
}

apply();
