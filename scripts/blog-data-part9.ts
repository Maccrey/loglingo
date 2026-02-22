
import { BlogPost } from "../src/domain/blog";

// ==========================================
// Post 1: Why You Should Fail Faster
// ==========================================
const POST_FAIL_EN = `
<article>
  <p>If you aren't making mistakes, you aren't learning. The biggest obstacle to fluency is the fear of sounding stupid.</p>
  <h2>The "Baby" Method</h2>
  <p>Babies don't study grammar. They babble. They make mistakes. They get corrected. And they learn. Be like a baby.</p>
  <h2>Action Plan</h2>
  <ul>
    <li>Speak before you are ready.</li>
    <li>Embrace corrections.</li>
    <li>Laugh at your errors.</li>
  </ul>
</article>
`;
const POST_FAIL_KO = `
<article>
  <p>실수를 하지 않는다면 배우고 있는 게 아닙니다. 유창함의 가장 큰 적은 바보처럼 보일까 봐 두려워하는 마음입니다.</p>
  <h2>"아기" 방식</h2>
  <p>아기들은 문법을 공부하지 않습니다. 옹알이를 하고, 틀리고, 교정받으며 배웁니다. 아기가 되세요.</p>
  <h2>실천 계획</h2>
  <ul>
    <li>준비되기 전에 말하세요.</li>
    <li>교정을 환영하세요.</li>
    <li>실수를 비웃어 넘기세요.</li>
  </ul>
</article>
`;
const POST_FAIL_JA = `<article><p>間違いを恐れてはいけません。赤ちゃんのように失敗から学びましょう。<hr /><h2>アクションプラン</h2><ul><li>準備ができる前に話す。</li><li>訂正を受け入れる。</li><li>間違いを笑い飛ばす。</li></ul></article>`;
const POST_FAIL_ZH = `<article><p>如果不犯错，你就学不到东西。像婴儿一样学习。<hr /><h2>行动计划</h2><ul><li>在准备好之前就开口。</li><li>接受纠正。</li><li>嘲笑自己的错误。</li></ul></article>`;
const POST_FAIL_ES = `<article><p>Si no te equivocas, no aprendes. Sé como un bebé.<hr /><h2>Plan de Acción</h2><ul><li>Habla antes de estar listo.</li><li>Acepta correcciones.</li><li>Ríete de tus errores.</li></ul></article>`;
const POST_FAIL_FR = `<article><p>Si vous ne faites pas d'erreurs, vous n'apprenez pas.<hr /><h2>Plan d'Action</h2><ul><li>Parlez avant d'être prêt.</li><li>Acceptez les corrections.</li><li>Riez de vos erreurs.</li></ul></article>`;
const POST_FAIL_DE = `<article><p>Wer keine Fehler macht, lernt nicht. Sei wie ein Baby.<hr /><h2>Aktionsplan</h2><ul><li>Sprich, bevor du bereit bist.</li><li>Akzeptiere Korrekturen.</li><li>Lache über deine Fehler.</li></ul></article>`;
const POST_FAIL_RU = `<article><p>Если вы не ошибаетесь, вы не учитесь. Будьте как дети.<hr /><h2>План действий</h2><ul><li>Говорите до того, как будете готовы.</li><li>Принимайте исправления.</li><li>Смейтесь над своими ошибками.</li></ul></article>`;
const POST_FAIL_PT = `<article><p>Se você não erra, não aprende. Seja como um bebê.<hr /><h2>Plano de Ação</h2><ul><li>Fale antes de estar pronto.</li><li>Aceite correções.</li><li>Ria dos seus erros.</li></ul></article>`;
const POST_FAIL_TR = `<article><p>Hata yapmıyorsanız öğrenmiyorsunuz demektir. Bebek gibi olun.<hr /><h2>Eylem Planı</h2><ul><li>Hazır olmadan konuşun.</li><li>Düzeltmeleri kabul edin.</li><li>Hatalarınıza gülün.</li></ul></article>`;
const POST_FAIL_AR = `<article><p>إذا لم تخطئ، فلن تتعلم. كن مثل الطفل.<hr /><h2>خطة العمل</h2><ul><li>تحدث قبل أن تكون مستعدًا.</li><li>تقبل التصحيحات.</li><li>اضحك على أخطائك.</li></ul></article>`;
const POST_FAIL_HI = `<article><p>यदि आप गलतियाँ नहीं कर रहे हैं, तो आप सीख नहीं रहे हैं। बच्चे की तरह बनें।<hr /><h2>कार्य योजना</h2><ul><li>तैयार होने से पहले बोलें।</li><li>सुधारों को अपनाएं।</li><li>अपनी गलतियों पर हंसें।</li></ul></article>`;
const POST_FAIL_BN = `<article><p>আপনি যদি ভুল না করেন তবে আপনি শিখছেন না। শিশুর মতো হোন।<hr /><h2>কর্ম পরিকল্পনা</h2><ul><li>প্রস্তুত হওয়ার আগে কথা বলুন।</li><li>সংশোধন গ্রহণ করুন।</li><li>নিজের ভুল নিয়ে হাসুন।</li></ul></article>`;
const POST_FAIL_UR = `<article><p>اگر آپ غلطیاں نہیں کر رہے ہیں تو آپ سیکھ نہیں رہے ہیں۔ بچے کی طرح بنیں۔<hr /><h2>عمل کا منصوبہ</h2><ul><li>تیار ہونے سے پہلے بولیں۔</li><li>اصلاحات کو قبول کریں۔</li><li>اپنی غلطیوں پر ہنسیں۔</li></ul></article>`;
const POST_FAIL_NE = `<article><p>यदि तपाईं गल्ती गरिरहनुभएको छैन भने, तपाईं सिकिरहनुभएको छैन। बच्चा जस्तै हुनुहोस्।<hr /><h2>कार्य योजना</h2><ul><li>तयार हुनु अघि बोल्नुहोस्।</li><li>सुधारहरू स्वीकार गर्नुहोस्।</li><li>आफ्ना गल्तीहरूमा हाँस्नुहोस्।</li></ul></article>`;
const POST_FAIL_TH = `<article><p>ถ้าไม่ผิดก็ไม่รู้ เป็นเหมือนเด็กทารก<hr /><h2>แผนปฏิบัติการ</h2><ul><li>พูดก่อนที่จะพร้อม</li><li>ยอมรับการแก้ไข</li><li>หัวเราะให้กับความผิดพลาด</li></ul></article>`;
const POST_FAIL_VI = `<article><p>Nếu bạn không mắc lỗi, bạn không học được gì cả. Hãy như một đứa trẻ.<hr /><h2>Kế hoạch hành động</h2><ul><li>Nói trước khi bạn sẵn sàng.</li><li>Chấp nhận sửa lỗi.</li><li>Cười vào những sai lầm của bạn.</li></ul></article>`;
const POST_FAIL_ID = `<article><p>Jika Anda tidak membuat kesalahan, Anda tidak belajar. Jadilah seperti bayi.<hr /><h2>Rencana Aksi</h2><ul><li>Bicaralah sebelum Anda siap.</li><li>Terima koreksi.</li><li>Tertawakan kesalahan Anda.</li></ul></article>`;
;

// ==========================================
// Post 2: Create Your Own Immersion Bubble
// ==========================================
const POST_IMMERSION_EN = `
<article>
  <p>You don't need a plane ticket to immerse yourself. You need to change your environment.</p>
  <h2>The "Bubble" Strategy</h2>
  <p>Turn your home into a mini-foreign country.</p>
  <ul>
    <li><strong>Phone:</strong> Change language settings to your target language.</li>
    <li><strong>Home:</strong> Put sticky notes on every object (Fridge = Kühlschrank).</li>
    <li><strong>Audio:</strong> Play foreign radio in the background 24/7.</li>
  </ul>
  <p>If you can't go to the country, bring the country to you.</p>
</article>
`;
const POST_IMMERSION_KO = `
<article>
  <p>몰입하기 위해 비행기표가 필요한 건 아닙니다. 환경을 바꾸면 됩니다.</p>
  <h2>"버블" 전략</h2>
  <p>집을 작은 외국으로 만드세요.</p>
  <ul>
    <li><strong>휴대폰:</strong> 언어 설정을 목표 언어로 바꾸세요.</li>
    <li><strong>집:</strong> 모든 사물에 포스트잇을 붙이세요 (냉장고 = Refrigerator).</li>
    <li><strong>오디오:</strong> 외국 라디오를 24시간 틀어놓으세요.</li>
  </ul>
  <p>외국에 갈 수 없다면, 외국을 집으로 가져오세요.</p>
</article>
`;
const POST_IMMERSION_JA = `<article><p>留学しなくても没入環境は作れます。<hr /><h2>バブル戦略</h2><ul><li>スマホの言語設定を変える。</li><li>家中に付箋を貼る。</li><li>常に外国語のラジオを流す。</li></ul></article>`;
const POST_IMMERSION_ZH = `<article><p>你不需要机票也能沉浸其中。改变你的环境。<hr /><h2>气泡策略</h2><ul><li>更改手机语言设置。</li><li>在所有物品上贴便利贴。</li><li>全天候播放外语广播。</li></ul></article>`;
const POST_IMMERSION_ES = `<article><p>No necesitas viajar. Cambia tu entorno.<hr /><h2>Estrategia Burbuja</h2><ul><li>Cambia el idioma de tu móvil.</li><li>Pon notas adhesivas en todo.</li><li>Escucha radio extranjera 24/7.</li></ul></article>`;
const POST_IMMERSION_FR = `<article><p>Pas besoin de voyager. Changez votre environnement.<hr /><h2>Stratégie Bulle</h2><ul><li>Changez la langue du téléphone.</li><li>Mettez des post-its partout.</li><li>Écoutez la radio étrangère.</li></ul></article>`;
const POST_IMMERSION_DE = `<article><p>Du brauchst kein Flugticket. Ändere deine Umgebung.<hr /><h2>Blasen-Strategie</h2><ul><li>Ändere die Handysprache.</li><li>Klebe Notizen überall hin.</li><li>Höre fremdes Radio.</li></ul></article>`;
const POST_IMMERSION_RU = `<article><p>Вам не нужен билет на самолет. Измените среду.<hr /><h2>Стратегия пузыря</h2><ul><li>Смените язык телефона.</li><li>Наклейте стикеры повсюду.</li><li>Слушайте радио 24/7.</li></ul></article>`;
const POST_IMMERSION_PT = `<article><p>Não precisa viajar. Mude seu ambiente.<hr /><h2>Estratégia Bolha</h2><ul><li>Mude o idioma do celular.</li><li>Cole post-its em tudo.</li><li>Ouça rádio estrangeira.</li></ul></article>`;
const POST_IMMERSION_TR = `<article><p>Uçak biletine ihtiyacınız yok. Ortamınızı değiştirin.<hr /><h2>Balon Stratejisi</h2><ul><li>Telefon dilini değiştir.</li><li>Her yere not yapıştır.</li><li>Yabancı radyo dinle.</li></ul></article>`;
const POST_IMMERSION_AR = `<article><p>لا تحتاج تذكرة طائرة. غير بيئتك.<hr /><h2>استراتيجية الفقاعة</h2><ul><li>غير لغة الهاتف.</li><li>ضع ملصقات على كل شيء.</li><li>استمع للراديو الأجنبي.</li></ul></article>`;
const POST_IMMERSION_HI = `<article><p>आपको हवाई जहाज के टिकट की जरूरत नहीं है। अपना वातावरण बदलें।<hr /><h2>बुलबुला रणनीति</h2><ul><li>फोन की भाषा बदलें।</li><li>हर चीज पर चिपचिपा नोट लगाएं।</li><li>विदेशी रेडियो सुनें।</li></ul></article>`;
const POST_IMMERSION_BN = `<article><p>আপনার প্লেনের টিকিটের প্রয়োজন নেই। আপনার পরিবেশ পরিবর্তন করুন।<hr /><h2>বুদবুদ কৌশল</h2><ul><li>ফোনের ভাষা পরিবর্তন করুন।</li><li>সবকিছুতে স্টিকি নোট লাগান।</li><li>বিদেশী রেডিও শুনুন।</li></ul></article>`;
const POST_IMMERSION_UR = `<article><p>آپ کو ہوائی جہاز کے ٹکٹ کی ضرورت نہیں ہے۔ اپنا ماحول تبدیل کریں۔<hr /><h2>بلبلہ حکمت عملی</h2><ul><li>فون کی زبان تبدیل کریں۔</li><li>ہر چیز پر چسپاں نوٹ لگائیں۔</li><li>غیر ملکی ریڈیو سنیں۔</li></ul></article>`;
const POST_IMMERSION_NE = `<article><p>तपाईंलाई प्लेन टिकट चाहिँदैन। आफ्नो वातावरण परिवर्तन गर्नुहोस्।<hr /><h2>बुलबुले रणनीति</h2><ul><li>फोनको भाषा परिवर्तन गर्नुहोस्।</li><li>सबै कुरामा स्टिकी नोट टाँस्नुहोस्।</li><li>विदेशी रेडियो सुन्नुहोस्।</li></ul></article>`;
const POST_IMMERSION_TH = `<article><p>ไม่ต้องบินไปต่างประเทศ แค่เปลี่ยนสิ่งแวดล้อม<hr /><h2>กลยุทธ์ฟองสบู่</h2><ul><li>เปลี่ยนภาษาในมือถือ</li><li>แปะโพสต์อิททั่วบ้าน</li><li>เปิดวิทยุต่างประเทศทิ้งไว้</li></ul></article>`;
const POST_IMMERSION_VI = `<article><p>Bạn không cần vé máy bay. Hãy thay đổi môi trường của bạn.<hr /><h2>Chiến lược Bong bóng</h2><ul><li>Đổi ngôn ngữ điện thoại.</li><li>Dán giấy nhớ lên mọi thứ.</li><li>Nghe đài nước ngoài 24/7.</li></ul></article>`;
const POST_IMMERSION_ID = `<article><p>Anda tidak butuh tiket pesawat. Ubah lingkungan Anda.<hr /><h2>Strategi Gelembung</h2><ul><li>Ubah bahasa ponsel.</li><li>Tempel catatan di mana-mana.</li><li>Dengarkan radio asing.</li></ul></article>`;

// ==========================================
// Post 3: The Polyglot Mindset: 80/20 Rule
// ==========================================
const POST_MINDSET_EN = `
<article>
  <p>Don't try to learn everything. The dictionary has 100,000 words. You only need 1,000 to speak.</p>
  <h2>The Pareto Principle</h2>
  <p>80% of daily conversation comes from 20% of the vocabulary. Focus on high-frequency words first.</p>
  <h2>Stop Learning "Photosynthesis"</h2>
  <p>Learn "Bathroom", "Hungry", "Help". Ignore the rest until you are ready.</p>
</article>
`;
const POST_MINDSET_KO = `
<article>
  <p>모든 걸 배우려 하지 마세요. 사전에는 10만 단어가 있지만, 말하는 데는 1,000단어면 충분합니다.</p>
  <h2>파레토 법칙</h2>
  <p>일상 대화의 80%는 상위 20% 어휘에서 나옵니다. 빈도가 높은 단어부터 배우세요.</p>
  <h2>"광합성"은 나중에 배우세요</h2>
  <p>"화장실", "배고파", "도와줘"를 먼저 배우세요. 나머지는 준비될 때까지 무시하세요.</p>
</article>
`;
const POST_MINDSET_JA = `<article><p>辞書の全単語は不要です。日常会話の8割は基礎単語で成り立ちます。<hr /><h2>80:20の法則</h2><p>「光合成」より先に「トイレ」を覚えましょう。頻出単語に集中してください。</p></article>`;
const POST_MINDSET_ZH = `<article><p>不要试图学完所有单词。日常对话只需要1000个词。<hr /><h2>二八定律</h2><p>先学高频词。别先学“光合作用”，先学“厕所”。</p></article>`;
const POST_MINDSET_ES = `<article><p>No aprendas todo. El 80% de la charla viene del 20% del vocabulario.<hr /><h2>Principio de Pareto</h2><p>Aprende "Baño" antes que "Fotosíntesis". Prioriza.</p></article>`;
const POST_MINDSET_FR = `<article><p>N'apprenez pas tout. 1000 mots suffisent.<hr /><h2>Principe de Pareto</h2><p>Apprenez "Toilettes" avant "Photosynthèse". Priorisez.</p></article>`;
const POST_MINDSET_DE = `<article><p>Lerne nicht alles. 1000 Wörter reichen.<hr /><h2>Pareto-Prinzip</h2><p>Lerne "Toilette" vor "Photosynthese". Priorisiere.</p></article>`;
const POST_MINDSET_RU = `<article><p>Не учите все. 1000 слов достаточно.<hr /><h2>Принцип Парето</h2><p>Учите «Туалет» раньше «Фотосинтеза». Расставляйте приоритеты.</p></article>`;
const POST_MINDSET_PT = `<article><p>Não aprenda tudo. 1000 palavras bastam.<hr /><h2>Princípio de Pareto</h2><p>Aprenda "Banheiro" antes de "Fotossíntese".</p></article>`;
const POST_MINDSET_TR = `<article><p>Her şeyi öğrenmeyin. 1000 kelime yeter.<hr /><h2>Pareto İlkesi</h2><p>"Fotosentez"den önce "Tuvalet"i öğrenin.</p></article>`;
const POST_MINDSET_AR = `<article><p>لا تتعلم كل شيء. 1000 كلمة تكفي.<hr /><h2>مبدأ باريتو</h2><p>تعلم "مرحاض" قبل "التمثيل الضوئي".</p></article>`;
const POST_MINDSET_HI = `<article><p>सब कुछ मत सीखो। 1000 शब्द काफी हैं।<hr /><h2>पेरेटो सिद्धांत</h2><p>"प्रकाश संश्लेषण" से पहले "शौचालय" सीखें।</p></article>`;
const POST_MINDSET_BN = `<article><p>সব শিখবেন না। ১০০০ শব্দ যথেষ্ট।<hr /><h2>প্যারেটো নীতি</h2><p>"সালোকসংশ্লেষণ" এর আগে "টয়লেট" শিখুন।</p></article>`;
const POST_MINDSET_UR = `<article><p>سب کچھ مت سیکھیں۔ 1000 الفاظ کافی ہیں۔<hr /><h2>پریٹو کا اصول</h2><p>"فوٹو سنتھیسس" سے پہلے "ٹوائلٹ" سیکھیں۔</p></article>`;
const POST_MINDSET_NE = `<article><p>सबै कुरा नसिक्नुहोस्। १००० शब्द पर्याप्त छन्।<hr /><h2>पैरेटो सिद्धान्त</h2><p>"प्रकाश संश्लेषण" भन्दा पहिले "शौचालय" सिक्नुहोस्।</p></article>`;
const POST_MINDSET_TH = `<article><p>อย่าเรียนทุกคำ แค่ 1000 คำก็พอ<hr /><h2>กฎ 80/20</h2><p>เรียนคำว่า "ห้องน้ำ" ก่อน "การสังเคราะห์แสง"</p></article>`;
const POST_MINDSET_VI = `<article><p>Đừng học tất cả. 1000 từ là đủ.<hr /><h2>Nguyên tắc Pareto</h2><p>Học "Nhà vệ sinh" trước "Quang hợp".</p></article>`;
const POST_MINDSET_ID = `<article><p>Jangan pelajari semuanya. 1000 kata cukup.<hr /><h2>Prinsip Pareto</h2><p>Pelajari "Kamar mandi" sebelum "Fotosintesis".</p></article>`;

// ==========================================
// EXPORT
// ==========================================
export const BLOG_POSTS_PART_9: BlogPost[] = [
  {
    id: "fail-faster",
    title: {
      en: "Why You Should Fail Faster",
      ko: "더 빨리 실패해야 하는 이유",
      ja: "もっと早く失敗すべき理由",
      zh: "为什么你应该更快失败",
      es: "Por qué Deberías Fracasar Más Rápido",
      fr: "Pourquoi Vous Devriez Échouer Plus Vite",
      de: "Warum du schneller scheitern solltest",
      ru: "Почему нужно терпеть неудачи быстрее",
      pt: "Por que Você Deve Falhar Mais Rápido",
      tr: "Neden Daha Hızlı Başarısız Olmalısınız",
      ar: "لماذا يجب أن تفشل أسرع",
      hi: "आपको तेजी से क्यों असफल होना चाहिए",
      bn: "কেন আপনার দ্রুত ব্যর্থ হওয়া উচিত",
      ur: "آپ کو تیزی سے کیوں ناکام ہونا چاہئے",
      ne: "किन तपाईं छिटो असफल हुनुपर्छ",
      th: "ทำไมคุณควรล้มเหลวให้เร็วขึ้น",
      vi: "Tại sao bạn nên thất bại nhanh hơn",
      id: "Mengapa Anda Harus Gagal Lebih Cepat"
    },
    excerpt: {
      en: "Mistakes are not the enemy. They are the map. The barrier to fluency is the fear of looking stupid.",
      ko: "실수는 적이 아닙니다. 지도입니다. 유창함의 장벽은 바보처럼 보일까 봐 두려워하는 마음입니다.",
      ja: "間違いは敵ではありません。地図です。",
      zh: "错误不是敌人，是地图。",
      es: "Los errores no son el enemigo.",
      fr: "Les erreurs ne sont pas l'ennemi.",
      de: "Fehler sind nicht der Feind.",
      ru: "Ошибки — это не враг.",
      pt: "Erros não são o inimigo.",
      tr: "Hatalar düşman değildir.",
      ar: "الأخطاء ليست العدو.",
      hi: "गलतियाँ दुश्मन नहीं हैं।",
      bn: "ভুল শত্রু নয়।",
      ur: "غلطیاں دشمن نہیں ہیں۔",
      ne: "गल्तीहरू शत्रु होइनन्।",
      th: "ความผิดพลาดไม่ใช่ศัตรู",
      vi: "Sai lầm không phải là kẻ thù.",
      id: "Kesalahan bukan musuh."
    },
    content: {
      en: POST_FAIL_EN,
      ko: POST_FAIL_KO,
      ja: POST_FAIL_JA,
      zh: POST_FAIL_ZH,
      es: POST_FAIL_ES,
      fr: POST_FAIL_FR,
      de: POST_FAIL_DE,
      ru: POST_FAIL_RU,
      pt: POST_FAIL_PT,
      tr: POST_FAIL_TR,
      ar: POST_FAIL_AR,
      hi: POST_FAIL_HI,
      bn: POST_FAIL_BN,
      ur: POST_FAIL_UR,
      ne: POST_FAIL_NE,
      th: POST_FAIL_TH,
      vi: POST_FAIL_VI,
      id: POST_FAIL_ID
    },
    coverImage: "/assets/blog/nano-banana-mistakes.png",
    author: "Nano Banana",
    tags: ["Mindset", "Beginner"],
    published: true,
    createdAt: new Date("2026-02-13T10:00:00Z"),
    updatedAt: new Date("2026-02-13T10:00:00Z")
  },
  {
    id: "immersion-bubble",
    title: {
      en: "Create Your Own Immersion Bubble",
      ko: "나만의 몰입 버블 만들기",
      ja: "自分だけの没入バブルを作る",
      zh: "创造你自己的沉浸气泡",
      es: "Crea tu Propia Burbuja de Inmersión",
      fr: "Créez Votre Propre Bulle d'Immersion",
      de: "Erschaffe deine eigene Immersionsblase",
      ru: "Создайте Свой Пузырь Погружения",
      pt: "Crie Sua Própria Bolha de Imersão",
      tr: "Kendi Daldırma Balonunuzu Yaratın",
      ar: "اصنع فقاعة الانغماس الخاصة بك",
      hi: "अपना खुद का विसर्जन बुलबुला बनाएं",
      bn: "আপনার নিজস্ব নিমজ্জন বুদবুদ তৈরি করুন",
      ur: "اپنا خود کا انغماس بلبلہ بنائیں",
      ne: "आफ्नै विसर्जन बुलबुले सिर्जना गर्नुहोस्",
      th: "สร้างฟองสบู่แห่งการเรียนรู้ของตัวเอง",
      vi: "Tạo Bong bóng Đắm mình của Riêng bạn",
      id: "Buat Gelembung Imersi Anda Sendiri"
    },
    excerpt: {
      en: "You don't need a plane ticket. You need sticky notes. How to hack your environment for maximum learning.",
      ko: "비행기표는 필요 없습니다. 포스트잇이 필요합니다. 학습 효과를 극대화하기 위해 환경을 해킹하는 법.",
      ja: "航空券は不要です。付箋が必要です。",
      zh: "不需要机票。只需要便利贴。",
      es: "No necesitas un billete de avión. Necesitas notas adhesivas.",
      fr: "Pas besoin de billet d'avion. Il vous faut des post-its.",
      de: "Du brauchst kein Flugticket. Du brauchst Haftnotizen.",
      ru: "Вам не нужен билет на самолет. Вам нужны стикеры.",
      pt: "Não precisa de passagem aérea. Precisa de post-its.",
      tr: "Uçak biletine gerek yok. Yapışkan notlara ihtiyacınız var.",
      ar: "لا تحتاج تذكرة طائرة. تحتاج ملصقات.",
      hi: "आपको विमान टिकट की आवश्यकता नहीं है। आपको चिपचिपा नोट चाहिए।",
      bn: "বিমান টিকিটের দরকার নেই। স্টিকি নোট দরকার।",
      ur: "آپ کو جہاز کے ٹکٹ کی ضرورت نہیں ہے۔ آپ کو چسپاں نوٹ کی ضرورت ہے۔",
      ne: "हवाइजहाजको टिकट चाहिँदैन। स्टिकी नोट चाहिन्छ।",
      th: "ไม่ต้องใช้ตั๋วเครื่องบิน แค่ใช้โพสต์อิท",
      vi: "Bạn không cần vé máy bay. Bạn cần giấy nhớ.",
      id: "Tiket pesawat tidak perlu. Butuh catatan tempel."
    },
    content: {
      en: POST_IMMERSION_EN,
      ko: POST_IMMERSION_KO,
      ja: POST_IMMERSION_JA,
      zh: POST_IMMERSION_ZH,
      es: POST_IMMERSION_ES,
      fr: POST_IMMERSION_FR,
      de: POST_IMMERSION_DE,
      ru: POST_IMMERSION_RU,
      pt: POST_IMMERSION_PT,
      tr: POST_IMMERSION_TR,
      ar: POST_IMMERSION_AR,
      hi: POST_IMMERSION_HI,
      bn: POST_IMMERSION_BN,
      ur: POST_IMMERSION_UR,
      ne: POST_IMMERSION_NE,
      th: POST_IMMERSION_TH,
      vi: POST_IMMERSION_VI,
      id: POST_IMMERSION_ID
    },
    coverImage: "/assets/blog/nano-banana-immersion.png",
    author: "Nano Banana",
    tags: ["Immersion", "Hacks"],
    published: true,
    createdAt: new Date("2026-02-14T10:00:00Z"),
    updatedAt: new Date("2026-02-14T10:00:00Z")
  },
  {
    id: "polyglot-mindset-8020",
    title: {
      en: "The Polyglot Mindset: 80/20 Rule",
      ko: "다국어 구사자의 마인드셋: 80/20 법칙",
      ja: "ポリグロットのマインドセット：80:20の法則",
      zh: "多语种思维：二八定律",
      es: "Mentalidad Políglota: Regla 80/20",
      fr: "L'Esprit Polyglotte : Règle 80/20",
      de: "Das Polyglot-Mindset: 80/20-Regel",
      ru: "Мышление Полиглота: Правило 80/20",
      pt: "Mentalidade Poliglota: Regra 80/20",
      tr: "Çok Dillilik Zihniyeti: 80/20 Kuralı",
      ar: "عقلية متعدد اللغات: قاعدة 80/20",
      hi: "बहुभाषी मानसिकता: 80/20 नियम",
      bn: "বহুভাষী মানসিকতা: ৮০/২০ নিয়ম",
      ur: "کثیر لسانی ذہنیت: 80/20 اصول",
      ne: "बहुभाषी मानसिकता: ८०/२० नियम",
      th: "แนวคิดคนเก่งภาษา: กฎ 80/20",
      vi: "Tư duy Đa ngôn ngữ: Quy tắc 80/20",
      id: "Pola Pikir Poliglot: Aturan 80/20"
    },
    excerpt: {
      en: "Stop trying to learn everything. Focus on the 20% of words that give 80% of the results.",
      ko: "모든 것을 배우려 하지 마세요. 결과의 80%를 만드는 20%의 단어에 집중하세요.",
      ja: "全てを学ぼうとしないでください。重要な20%に集中しましょう。",
      zh: "别想学会所有东西。专注于那重要的20%。",
      es: "No intentes aprender todo. Enfócate en el 20%.",
      fr: "N'essayez pas de tout apprendre. Concentrez-vous sur les 20%.",
      de: "Versuche nicht, alles zu lernen. Konzentriere dich auf die 20%.",
      ru: "Не пытайтесь выучить все. Сосредоточьтесь на 20%.",
      pt: "Não tente aprender tudo. Foque nos 20%.",
      tr: "Her şeyi öğrenmeye çalışmayın. %20'ye odaklanın.",
      ar: "لا تحاول تعلم كل شيء. ركز على الـ 20%.",
      hi: "सब कुछ सीखने की कोशिश मत करो। 20% पर ध्यान दें।",
      bn: "সব কিছু শেখার চেষ্টা করবেন না। ২০% এর উপর ফোকাস করুন।",
      ur: "سب کچھ سیکھنے کی کوشش نہ کریں۔ 20% پر توجہ دیں۔",
      ne: "सबै कुरा सिक्ने प्रयास नगर्नुहोस्। २०% मा ध्यान दिनुहोस्।",
      th: "อย่าพยายามเรียนทุกอย่าง โฟกัสที่ 20% ที่สำคัญ",
      vi: "Đừng cố học tất cả. Tập trung vào 20% quan trọng.",
      id: "Jangan mencoba mempelajari semuanya. Fokus pada 20%."
    },
    content: {
      en: POST_MINDSET_EN,
      ko: POST_MINDSET_KO,
      ja: POST_MINDSET_JA,
      zh: POST_MINDSET_ZH,
      es: POST_MINDSET_ES,
      fr: POST_MINDSET_FR,
      de: POST_MINDSET_DE,
      ru: POST_MINDSET_RU,
      pt: POST_MINDSET_PT,
      tr: POST_MINDSET_TR,
      ar: POST_MINDSET_AR,
      hi: POST_MINDSET_HI,
      bn: POST_MINDSET_BN,
      ur: POST_MINDSET_UR,
      ne: POST_MINDSET_NE,
      th: POST_MINDSET_TH,
      vi: POST_MINDSET_VI,
      id: POST_MINDSET_ID
    },
    coverImage: "/assets/blog/nano-banana-mindset.png",
    author: "Nano Banana",
    tags: ["Strategy", "Efficiency"],
    published: true,
    createdAt: new Date("2026-02-15T10:00:00Z"),
    updatedAt: new Date("2026-02-15T10:00:00Z")
  }
];
