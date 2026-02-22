
import { BlogPost } from "../src/domain/blog";

// ==========================================
// Post 1: Why You Still Sound Like a Tourist (Shadowing)
// ==========================================
const POST_SHADOWING_EN = `
<article>
  <p>Reading aloud makes you good at reading aloud. Shadowing makes you good at speaking.</p>
  <h2>The Difference</h2>
  <p>Reading is passive. Shadowing is active mimicking. You copy the speed, the emotion, and the melody.</p>
  <h2>How to Shadow</h2>
  <ol>
    <li>Find audio with a transcript.</li>
    <li>Listen once without speaking.</li>
    <li>Listen again and repeat instantly (0.5 seconds behind).</li>
  </ol>
  <p>It feels weird. That means it's working.</p>
</article>
`;
const POST_SHADOWING_KO = `
<article>
  <p>소리 내어 읽기는 낭독 실력만 늘려줍니다. 쉐도잉은 말하기 실력을 늘려줍니다.</p>
  <h2>차이점</h2>
  <p>읽기는 수동적입니다. 쉐도잉은 능동적인 모방입니다. 속도, 감정, 멜로디까지 따라 하세요.</p>
  <h2>쉐도잉 방법</h2>
  <ol>
    <li>스크립트가 있는 오디오를 찾으세요.</li>
    <li>말하지 말고 한 번 들으세요.</li>
    <li>다시 들으며 즉시 따라 말하세요 (0.5초 뒤에서).</li>
  </ol>
  <p>어색하게 느껴진다면, 제대로 하고 있는 겁니다.</p>
</article>
`;
const POST_SHADOWING_JA = `<article><p>音読は音読上手になるだけ。シャドーイングは会話上手になります。<hr /><h2>やり方</h2><ol><li>スクリプト付きの音声を探す。</li><li>まずは聞く。</li><li>0.5秒遅れて真似する。</li></ol></article>`;
const POST_SHADOWING_ZH = `<article><p>朗读只会让你擅长朗读。影子跟读让你擅长口语。<hr /><h2>如何跟读</h2><ol><li>找带文本的音频。</li><li>先听一遍。</li><li>延迟0.5秒模仿。</li></ol></article>`;
const POST_SHADOWING_ES = `<article><p>Leer en voz alta no es hablar. El Shadowing sí.<hr /><h2>Cómo hacerlo</h2><ol><li>Busca audio con texto.</li><li>Escucha primero.</li><li>Repite al instante (0.5s después).</li></ol></article>`;
const POST_SHADOWING_FR = `<article><p>Lire à haute voix n'est pas parler. Le Shadowing, si.<hr /><h2>Comment faire</h2><ol><li>Trouvez un audio avec texte.</li><li>Écoutez d'abord.</li><li>Répétez instantanément.</li></ol></article>`;
const POST_SHADOWING_DE = `<article><p>Laut vorlesen ist nicht Sprechen. Shadowing schon.<hr /><h2>Anleitung</h2><ol><li>Audio mit Text suchen.</li><li>Erst zuhören.</li><li>Sofort nachsprechen.</li></ol></article>`;
const POST_SHADOWING_RU = `<article><p>Чтение вслух — это не разговор. Теневой повтор — да.<hr /><h2>Как делать</h2><ol><li>Найдите аудио с текстом.</li><li>Послушайте.</li><li>Повторяйте с задержкой 0.5с.</li></ol></article>`;
const POST_SHADOWING_PT = `<article><p>Ler em voz alta não é falar. Shadowing sim.<hr /><h2>Como fazer</h2><ol><li>Ache áudio com texto.</li><li>Escute primeiro.</li><li>Repita instantaneamente.</li></ol></article>`;
const POST_SHADOWING_TR = `<article><p>Sesli okumak konuşmak değildir. Gölgelemek öyledir.<hr /><h2>Nasıl Yapılır</h2><ol><li>Metinli ses bulun.</li><li>Önce dinleyin.</li><li>Anında tekrarlayın.</li></ol></article>`;
const POST_SHADOWING_AR = `<article><p>القراءة بصوت عالٍ ليست تحدثاً. التظليل هو التحدث.<hr /><h2>كيف تفعل ذلك</h2><ol><li>جد صوتاً مع نص.</li><li>استمع أولاً.</li><li>كرر فوراً.</li></ol></article>`;
const POST_SHADOWING_HI = `<article><p>जोर से पढ़ना बोलना नहीं है। शैडोइंग बोलना है।<hr /><h2>कैसे करें</h2><ol><li>टेक्स्ट के साथ ऑडियो खोजें।</li><li>पहले सुनें।</li><li>तुरंत दोहराएं।</li></ol></article>`;
const POST_SHADOWING_BN = `<article><p>জোরে পড়া কথা বলা নয়। শ্যাডোইং কথা বলা।<hr /><h2>কিভাবে করবেন</h2><ol><li>টেক্সট সহ অডিও খুঁজুন।</li><li>প্রথমে শুনুন।</li><li>তদনুসারে পুনরাবৃত্তি করুন।</li></ol></article>`;
const POST_SHADOWING_UR = `<article><p>اونچی آواز میں پڑھنا بولنا نہیں ہے۔ شیڈونگ بولنا ہے۔<hr /><h2>کیسے کریں</h2><ol><li>ٹیکسٹ کے ساتھ آڈیو تلاش کریں۔</li><li>پہلے سنیں۔</li><li>فوری طور پر دہرائیں۔</li></ol></article>`;
const POST_SHADOWING_NE = `<article><p>ठूलो स्वरले पढ्नु बोल्नु होइन। स्याडोइङ बोल्नु हो।<hr /><h2>कसरी गर्ने</h2><ol><li>टेक्स्ट सहित अडियो खोज्नुहोस्।</li><li>पहिले सुन्नुहोस्।</li><li>तुरुन्तै दोहोर्याउनुहोस्।</li></ol></article>`;
const POST_SHADOWING_TH = `<article><p>การอ่านออกเสียงไม่ใช่การพูด Shadowing คือการพูด<hr /><h2>วิธีทำ</h2><ol><li>หาไฟล์เสียงที่มีบท</li><li>ฟังก่อนหนึ่งรอบ</li><li>พูดตามทันที (ช้ากว่า 0.5 วิ)</li></ol></article>`;
const POST_SHADOWING_VI = `<article><p>Đọc to không phải là nói. Shadowing mới là nói.<hr /><h2>Cách thực hiện</h2><ol><li>Tìm âm thanh có văn bản.</li><li>Nghe trước.</li><li>Lặp lại ngay lập tức.</li></ol></article>`;
const POST_SHADOWING_ID = `<article><p>Membaca keras bukan berbicara. Shadowing adalah berbicara.<hr /><h2>Cara Melakukan</h2><ol><li>Cari audio dengan teks.</li><li>Dengarkan dulu.</li><li>Ulangi seketika (terlambat 0.5 detik).</li></ol></article>`;

// ==========================================
// Post 2: Stop Speaking So Much (Input Hypothesis)
// ==========================================
const POST_INPUT_EN = `
<article>
  <p>You cannot output what you haven't input. Speaking doesn't help you learn grammar; listening does.</p>
  <h2>Krashen's Hypothesis</h2>
  <p>Stephen Krashen proved that we acquire language in only one way: by understanding messages.</p>
  <h2>The Silent Period</h2>
  <p>Don't force speaking. Listen until your brain overflows with patterns. Speaking will emerge naturally, like a result.</p>
</article>
`;
const POST_INPUT_KO = `
<article>
  <p>입력하지 않은 것은 출력할 수 없습니다. 말하기는 문법 학습에 도움이 안 됩니다. 듣기가 도움이 됩니다.</p>
  <h2>크라센의 가설</h2>
  <p>스티븐 크라센은 우리가 언어를 습득하는 유일한 방법은 '메시지를 이해하는 것'뿐임을 증명했습니다.</p>
  <h2>침묵의 기간</h2>
  <p>말하기를 강요하지 마세요. 뇌가 패턴으로 넘쳐날 때까지 들으세요. 말하기는 결과처럼 자연스럽게 터져 나올 것입니다.</p>
</article>
`;
const POST_INPUT_JA = `<article><p>インプットがないとアウトプットはできません。<hr /><h2>クラッシェンの仮説</h2><p>言語習得の唯一の方法は「理解可能なインプット」です。話すことより聞くことを優先してください。</p></article>`;
const POST_INPUT_ZH = `<article><p>没有输入就没有输出。<hr /><h2>克拉申假说</h2><p>习得语言的唯一途径是“可理解的输入”。先听，直到大脑充满模式。</p></article>`;
const POST_INPUT_ES = `<article><p>No puedes sacar lo que no has metido. Escucha más.<hr /><h2>Hipótesis de Krashen</h2><p>Solo aprendemos entendiendo mensajes. No fuerces el habla. Escucha hasta que el cerebro se desborde.</p></article>`;
const POST_INPUT_FR = `<article><p>Pas de sortie sans entrée. Écoutez plus.<hr /><h2>Hypothèse de Krashen</h2><p>On n'apprend qu'en comprenant des messages. Ne forcez pas la parole. Écoutez d'abord.</p></article>`;
const POST_INPUT_DE = `<article><p>Kein Output ohne Input. Hör mehr zu.<hr /><h2>Krashens Hypothese</h2><p>Wir lernen nur, indem wir verstehen. Erzwinge das Sprechen nicht. Höre zu.</p></article>`;
const POST_INPUT_RU = `<article><p>Нет вывода без ввода. Слушайте больше.<hr /><h2>Гипотеза Крашена</h2><p>Мы учимся, только понимая сообщения. Не заставляйте себя говорить. Слушайте.</p></article>`;
const POST_INPUT_PT = `<article><p>Sem entrada, sem saída. Escute mais.<hr /><h2>Hipótese de Krashen</h2><p>Só aprendemos compreendendo mensagens. Não force a fala. Escute.</p></article>`;
const POST_INPUT_TR = `<article><p>Girdi olmadan çıktı olmaz. Daha fazla dinleyin.<hr /><h2>Krashen Hipotezi</h2><p>Sadece mesajları anlayarak öğreniriz. Konuşmayı zorlamayın. Dinleyin.</p></article>`;
const POST_INPUT_AR = `<article><p>لا مخرجات بدون مدخلات. استمع أكثر.<hr /><h2>فرضية كراشين</h2><p>نتعلم فقط من خلال فهم الرسائل. لا تجبر نفسك على التحدث. استمع.</p></article>`;
const POST_INPUT_HI = `<article><p>इनपुट के बिना कोई आउटपुट नहीं। अधिक सुनें।<hr /><h2>क्रेशन की परिकल्पना</h2><p>हम केवल संदेशों को समझकर सीखते हैं। बोलने के लिए मजबूर न करें। सुनें।</p></article>`;
const POST_INPUT_BN = `<article><p>ইনপুট ছাড়া আউটপুট নেই। আরও শুনুন।<hr /><h2>ক্রাশেনের হাইপোথিসিস</h2><p>আমরা কেবল বার্তা বুঝেই শিখি। কথা বলতে বাধ্য করবেন না। শুনুন।</p></article>`;
const POST_INPUT_UR = `<article><p>ان پٹ کے بغیر کوئی آؤٹ پٹ نہیں۔ زیادہ سنیں۔<hr /><h2>کریشن کا مفروضہ</h2><p>ہم صرف پیغامات کو سمجھ کر سیکھتے ہیں۔ بولنے پر مجبور نہ ہوں۔ سنیں۔</p></article>`;
const POST_INPUT_NE = `<article><p>इनपुट बिना आउटपुट हुँदैन। धेरै सुन्नुहोस्।<hr /><h2>क्रेसनको परिकल्पना</h2><p>हामी सन्देशहरू बुझेर मात्र सिक्छौं। बोल्न कर नगर्नुहोस्। सुन्नुहोस्।</p></article>`;
const POST_INPUT_TH = `<article><p>ไม่มี Input ก็ไม่มี Output ฟังให้เยอะเข้าไว้<hr /><h2>ทฤษฎีของ Krashen</h2><p>เราเรียนรู้จากการเข้าใจสารเท่านั้น อย่าฝืนพูด ฟังจนกว่าสมองจะจำรูปแบบได้</p></article>`;
const POST_INPUT_VI = `<article><p>Không có đầu vào thì không có đầu ra. Hãy nghe nhiều hơn.<hr /><h2>Giả thuyết Krashen</h2><p>Chúng ta chỉ học bằng cách hiểu thông điệp. Đừng ép nói. Hãy nghe.</p></article>`;
const POST_INPUT_ID = `<article><p>Tidak ada output tanpa input. Dengarkan lebih banyak.<hr /><h2>Hipotesis Krashen</h2><p>Kita belajar hanya dengan memahami pesan. Jangan memaksakan bicara. Dengarkan.</p></article>`;

// ==========================================
// Post 3: How to Survive Your First Language Exchange
// ==========================================
const POST_SOCIAL_EN = `
<article>
  <p>Everyone is terrified of their first conversation. Here is how to not die.</p>
  <h2>Script Your Intro</h2>
  <p>Don't improvise. Memorize 3 sentences: Who you are, why you are learning, and what you do.</p>
  <h2>The Question Hack</h2>
  <p>If you get stuck, ask a question. "How about you?" "What do you think?" Keep the ball in their court.</p>
  <p>Remember: They are nervous too.</p>
</article>
`;
const POST_SOCIAL_KO = `
<article>
  <p>누구나 첫 대화를 무서워합니다. 여기 살아남는 법이 있습니다.</p>
  <h2>자기소개를 대본으로 만드세요</h2>
  <p>즉흥적으로 하지 마세요. 3문장을 암기하세요: 나는 누구인지, 왜 배우는지, 무슨 일을 하는지.</p>
  <h2>질문 해킹</h2>
  <p>말문이 막히면 질문하세요. "당신은 어때요?" "어떻게 생각하세요?" 공을 상대방에게 넘기세요.</p>
  <p>기억하세요: 그들도 긴장하고 있습니다.</p>
</article>
`;
const POST_SOCIAL_JA = `<article><p>最初の会話は誰でも怖いものです。<hr /><h2>台本を作る</h2><p>アドリブは禁止。自己紹介の3文を暗記しましょう。</p><h2>質問ハック</h2><p>詰まったら質問。「あなたはどう？」。ボールを相手に渡しましょう。</p></article>`;
const POST_SOCIAL_ZH = `<article><p>每个人都害怕第一次对话。<hr /><h2>写脚本</h2><p>不要即兴发挥。背下3句话：你是谁，为什么学，做什么工作。</p><h2>提问技巧</h2><p>卡住时就提问。确保持球权在对方手里。</p></article>`;
const POST_SOCIAL_ES = `<article><p>Todos temen la primera charla.<hr /><h2>Guioniza tu Intro</h2><p>Memoriza 3 frases. No improvises.</p><h2>El Truco de la Pregunta</h2><p>Si te atascas, pregunta "¿Y tú?".</p></article>`;
const POST_SOCIAL_FR = `<article><p>Tout le monde a peur de la première conversation.<hr /><h2>Scénarisez votre intro</h2><p>Mémorisez 3 phrases.</p><h2>L'astuce de la question</h2><p>Si vous bloquez, demandez "Et toi ?".</p></article>`;
const POST_SOCIAL_DE = `<article><p>Jeder hat Angst vorm ersten Gespräch.<hr /><h2>Skripte dein Intro</h2><p>Lerne 3 Sätze auswendig.</p><h2>Der Frage-Hack</h2><p>Wenn du stotterst, frag "Und du?".</p></article>`;
const POST_SOCIAL_RU = `<article><p>Все боятся первого разговора.<hr /><h2>Напишите сценарий</h2><p>Выучите 3 фразы.</p><h2>Хак с вопросом</h2><p>Если застряли, спросите «А ты?».</p></article>`;
const POST_SOCIAL_PT = `<article><p>Todos temem a primeira conversa.<hr /><h2>Roteirize sua Intro</h2><p>Memorize 3 frases.</p><h2>O Truque da Pergunta</h2><p>Se travar, pergunte "E você?".</p></article>`;
const POST_SOCIAL_TR = `<article><p>Herkes ilk konuşmadan korkar.<hr /><h2>Girişini Senaryolaştır</h2><p>3 cümleyi ezberle.</p><h2>Soru Hilesi</h2><p>Takılırsan, "Ya sen?" diye sor.</p></article>`;
const POST_SOCIAL_AR = `<article><p>الجميع يخشى المحادثة الأولى.<hr /><h2>اكتب سيناريو لمقدمتك</h2><p>احفظ 3 جمل.</p><h2>خدعة السؤال</h2><p>إذا تعثرت، اسأل "ماذا عنك؟".</p></article>`;
const POST_SOCIAL_HI = `<article><p>हर कोई पहली बातचीत से डरता है।<hr /><h2>अपने परिचय की स्क्रिप्ट लिखें</h2><p>3 वाक्य याद करें।</p><h2>प्रश्न हैक</h2><p>यदि आप फंस जाते हैं, तो पूछें "और आप?"।</p></article>`;
const POST_SOCIAL_BN = `<article><p>সবাই প্রথম কথোপকথনে ভয় পায়।<hr /><h2>আপনার পরিচিতির স্ক্রিপ্ট লিখুন</h2><p>৩টি বাক্য মুখস্থ করুন।</p><h2>প্রশ্ন হ্যাক</h2><p>আটকে গেলে জিজ্ঞাসা করুন "আর আপনি?"।</p></article>`;
const POST_SOCIAL_UR = `<article><p>ہر کوئی پہلی گفتگو سے ڈرتا ہے۔<hr /><h2>اپنے تعارف کا اسکرپٹ لکھیں</h2><p>3 جملے یاد کریں۔</p><h2>سوال ہیک</h2><p>اگر آپ پھنس جائیں تو پوچھیں "اور آپ؟"۔</p></article>`;
const POST_SOCIAL_NE = `<article><p>सबैजना पहिलो कुराकानीमा डराउँछन्।<hr /><h2>आफ्नो परिचयको स्क्रिप्ट लेख्नुहोस्</h2><p>३ वाक्य कण्ठ गर्नुहोस्।</p><h2>प्रश्न ह्याक</h2><p>यदि तपाईं अड्किनुभयो भने, सोध्नुहोस् "तपाईं नि?"।</p></article>`;
const POST_SOCIAL_TH = `<article><p>ทุกคนกลัวการคุยครั้งแรก<hr /><h2>เขียนบทแนะนำตัว</h2><p>ท่องให้ขึ้นใจ 3 ประโยค อย่าด้นสด</p><h2>เทคนิคการถาม</h2><p>ถ้าคิดไม่ออก ให้ถามกลับว่า "แล้วคุณล่ะ?"</p></article>`;
const POST_SOCIAL_VI = `<article><p>Ai cũng sợ cuộc trò chuyện đầu tiên.<hr /><h2>Kịch bản giới thiệu</h2><p>Học thuộc 3 câu.</p><h2>Mẹo đặt câu hỏi</h2><p>Nếu bí, hãy hỏi "Còn bạn?".</p></article>`;
const POST_SOCIAL_ID = `<article><p>Semua orang takut percakapan pertama.<hr /><h2>Tulis Naskah Intro</h2><p>Hafalkan 3 kalimat.</p><h2>Trik Pertanyaan</h2><p>Jika macet, tanya "Bagaimana denganmu?".</p></article>`;

// ==========================================
// EXPORT
// ==========================================
export const BLOG_POSTS_PART_10: BlogPost[] = [
  {
    id: "shadowing-technique",
    title: {
      en: "Why You Still Sound Like a Tourist (Shadowing)",
      ko: "당신이 여전히 관광객처럼 말하는 이유 (쉐도잉)",
      ja: "なぜあなたはまだ観光客のように聞こえるのか (シャドーイング)",
      zh: "为什么你听起来还像个游客 (影子跟读)",
      es: "Por qué todavía suenas como un turista (Shadowing)",
      fr: "Pourquoi vous sonnez encore comme un touriste (Shadowing)",
      de: "Warum du immer noch wie ein Tourist klingst (Shadowing)",
      ru: "Почему вы все еще звучите как турист (Теневой повтор)",
      pt: "Por que você ainda soa como um turista (Shadowing)",
      tr: "Neden Hala Turist Gibi Konuşuyorsunuz (Gölgeleme)",
      ar: "لماذا لا تزال تبدو كسائح (التظليل)",
      hi: "आप अभी भी एक पर्यटक की तरह क्यों लगते हैं (शैडोइंग)",
      bn: "কেন আপনাকে এখনও পর্যটকের মতো শোনাচ্ছে (শ্যাডোইং)",
      ur: "آپ اب بھی سیاح کی طرح کیوں لگتے ہیں (شیڈونگ)",
      ne: "तपाईं अझै पर्यटक जस्तै किन सुन्नुहुन्छ (स्याडोइङ)",
      th: "ทำไมคุณยังพูดเหมือนนักท่องเที่ยว (Shadowing)",
      vi: "Tại sao bạn vẫn nghe như khách du lịch (Shadowing)",
      id: "Mengapa Anda Masih Terdengar Seperti Turis (Shadowing)"
    },
    excerpt: {
      en: "Reading aloud is not speaking. To sound native, you need to mimic, not just read. Enter the Shadowing technique.",
      ko: "소리 내어 읽는 것은 말하기가 아닙니다. 원어민처럼 들리려면 단순히 읽는 게 아니라 모방해야 합니다. 쉐도잉 기법을 소개합니다.",
      ja: "音読は会話ではありません。ネイティブのように聞こえるには模倣が必要です。",
      zh: "朗读不是说话。要听起来像母语者，你需要模仿。",
      es: "Leer en voz alta no es hablar. Necesitas imitar.",
      fr: "Lire à haute voix n'est pas parler. Vous devez imiter.",
      de: "Laut vorlesen ist nicht Sprechen. Du musst nachahmen.",
      ru: "Чтение вслух — это не разговор. Нужно подражать.",
      pt: "Ler em voz alta não é falar. Você precisa imitar.",
      tr: "Sesli okumak konuşmak değildir. Taklit etmelisiniz.",
      ar: "القراءة بصوت عال ليست تحدثاً. تحتاج أن تقلد.",
      hi: "जोर से पढ़ना बोलना नहीं है। आपको नकल करने की जरूरत है।",
      bn: "জোরে পড়া কথা বলা নয়। আপনাকে অনুকরণ করতে হবে।",
      ur: "اونچی آواز میں پڑھنا بولنا نہیں ہے۔ آپ کو نقل کرنے کی ضرورت ہے۔",
      ne: "ठूलो स्वरले पढ्नु बोल्नु होइन। तपाईंले नक्कल गर्नुपर्छ।",
      th: "การอ่านออกเสียงไม่ใช่การพูด ถ้าอยากเสียงเหมือนเจ้าของภาษา ต้องเลียนแบบ",
      vi: "Đọc to không phải là nói. Bạn cần bắt chước.",
      id: "Membaca keras bukan berbicara. Anda perlu meniru."
    },
    content: {
      en: POST_SHADOWING_EN,
      ko: POST_SHADOWING_KO,
      ja: POST_SHADOWING_JA,
      zh: POST_SHADOWING_ZH,
      es: POST_SHADOWING_ES,
      fr: POST_SHADOWING_FR,
      de: POST_SHADOWING_DE,
      ru: POST_SHADOWING_RU,
      pt: POST_SHADOWING_PT,
      tr: POST_SHADOWING_TR,
      ar: POST_SHADOWING_AR,
      hi: POST_SHADOWING_HI,
      bn: POST_SHADOWING_BN,
      ur: POST_SHADOWING_UR,
      ne: POST_SHADOWING_NE,
      th: POST_SHADOWING_TH,
      vi: POST_SHADOWING_VI,
      id: POST_SHADOWING_ID
    },
    coverImage: "/assets/blog/nano-banana-shadowing.png",
    author: "Nano Banana",
    tags: ["Speaking", "Technique"],
    published: true,
    createdAt: new Date("2026-02-16T10:00:00Z"),
    updatedAt: new Date("2026-02-16T10:00:00Z")
  },
  {
    id: "input-hypothesis",
    title: {
      en: "Stop Speaking So Much (Input Hypothesis)",
      ko: "그만 좀 말하세요 (입력 가설)",
      ja: "そんなに話すのはやめなさい (インプット仮説)",
      zh: "别再说那么多了 (输入假说)",
      es: "Deja de Hablar Tanto (Hipótesis del Input)",
      fr: "Arrêtez de Parler Autant (Hypothèse de l'Entrée)",
      de: "Hör auf, so viel zu reden (Input-Hypothese)",
      ru: "Перестаньте так много говорить (Гипотеза ввода)",
      pt: "Pare de Falar Tanto (Hipótese de Input)",
      tr: "Bu Kadar Çok Konuşmayı Bırak (Girdi Hipotezi)",
      ar: "توقف عن التحدث كثيراً (فرضية المدخلات)",
      hi: "इतना बोलना बंद करो (इनपुट परिकल्पना)",
      bn: "এত কথা বলা বন্ধ করুন (ইনপুট হাইপোথিসিস)",
      ur: "اتنا بولنا بند کریں (ان پٹ مفروضہ)",
      ne: "यति धेरै बोल्न बन्द गर्नुहोस् (इनपुट परिकल्पना)",
      th: "หยุดพูดเยอะได้แล้ว (ทฤษฎี Input)",
      vi: "Ngừng nói quá nhiều (Giả thuyết đầu vào)",
      id: "Berhenti Bicara Terlalu Banyak (Hipotesis Input)"
    },
    excerpt: {
      en: "You cannot bleed if you don't drink. You cannot speak if you don't listen. Why 'Silent Period' is crucial.",
      ko: "마시지 않으면 피를 흘릴 수 없습니다. 듣지 않으면 말할 수 없습니다. '침묵의 기간'이 중요한 이유.",
      ja: "飲まなければ血は出ません。聞かなければ話せません。",
      zh: "不喝水就流不出血。不听就说不出话。",
      es: "No puedes sangrar si no bebes. No puedes hablar si no escuchas.",
      fr: "Vous ne pouvez pas saigner si vous ne buvez pas. Écoutez d'abord.",
      de: "Du kannst nicht bluten, wenn du nicht trinkst. Hör zu.",
      ru: "Вы не можете истекать кровью, если не пьете. Слушайте.",
      pt: "Não pode sangrar se não beber. Escute primeiro.",
      tr: "İçmezsen kanayamazsın. Dinlemezsen konuşamazsın.",
      ar: "لا يمكنك النزيف إذا لم تشرب. لا يمكنك التحدث إذا لم تستمع.",
      hi: "यदि आप पीते नहीं हैं तो आप खून नहीं बहा सकते। पहले सुनें।",
      bn: "পান না করলে রক্তপাত হয় না। না শুনলে বলা যায় না।",
      ur: "اگر آپ پیتے نہیں ہیں تو آپ خون نہیں بہا سکتے۔ اگر آپ نہیں سنتے تو آپ بول نہیں سکتے۔",
      ne: "यदि तपाईं पिउनुहुन्न भने रगत बगाउन सक्नुहुन्न। नसुनी बोल्न सकिँदैन।",
      th: "ถ้าไม่ดื่มน้ำก็ไม่มีเลือด ถ้าไม่ฟังก็พูดไม่ได้",
      vi: "Bạn không thể chảy máu nếu không uống. Đừng nói nếu chưa nghe.",
      id: "Anda tidak bisa berdarah jika tidak minum. Jangan bicara jika tidak mendengarkan."
    },
    content: {
      en: POST_INPUT_EN,
      ko: POST_INPUT_KO,
      ja: POST_INPUT_JA,
      zh: POST_INPUT_ZH,
      es: POST_INPUT_ES,
      fr: POST_INPUT_FR,
      de: POST_INPUT_DE,
      ru: POST_INPUT_RU,
      pt: POST_INPUT_PT,
      tr: POST_INPUT_TR,
      ar: POST_INPUT_AR,
      hi: POST_INPUT_HI,
      bn: POST_INPUT_BN,
      ur: POST_INPUT_UR,
      ne: POST_INPUT_NE,
      th: POST_INPUT_TH,
      vi: POST_INPUT_VI,
      id: POST_INPUT_ID
    },
    coverImage: "/assets/blog/nano-banana-listening.png",
    author: "Nano Banana",
    tags: ["Listening", "Science"],
    published: true,
    createdAt: new Date("2026-02-17T10:00:00Z"),
    updatedAt: new Date("2026-02-17T10:00:00Z")
  },
  {
    id: "language-exchange-tips",
    title: {
      en: "How to Survive Your First Language Exchange",
      ko: "첫 언어 교환에서 살아남는 법",
      ja: "初めての言語交換で生き残る方法",
      zh: "如何在第一次语言交换中生存",
      es: "Cómo Sobrevivir a tu Primer Intercambio",
      fr: "Comment Survivre à Votre Premier Échange Linguistique",
      de: "Wie du deinen ersten Sprachaustausch überlebst",
      ru: "Как выжить в первом языковом обмене",
      pt: "Como Sobreviver ao Seu Primeiro Intercâmbio",
      tr: "İlk Dil Değişiminizde Nasıl Hayatta Kalırsınız",
      ar: "كيف تنجو من تبادلك اللغوي الأول",
      hi: "अपने पहले भाषा विनिमय में कैसे जीवित रहें",
      bn: "আপনার প্রথম ভাষা বিনিময় কিভাবে বেঁচে থাকবেন",
      ur: "اپنے پہلے زبان کے تبادلے میں کیسے زندہ رہیں",
      ne: "तपाईंको पहिलो भाषा विनिमयमा कसरी बच्ने",
      th: "วิธีเอาตัวรอดในการแลกเปลี่ยนภาษาครั้งแรก",
      vi: "Cách sống sót trong buổi trao đổi ngôn ngữ đầu tiên",
      id: "Cara Bertahan di Pertukaran Bahasa Pertama Anda"
    },
    excerpt: {
      en: "Awkward silence. Sweaty palms. Forgetting your name. Here is a simple script to handle your first conversation comfortably.",
      ko: "어색한 침묵. 땀에 젖은 손바닥. 이름 까먹기. 첫 대화를 편안하게 이끌어갈 간단한 대본이 여기 있습니다.",
      ja: "気気まずい沈黙。手汗。名前を忘れる。最初の会話を乗り切るための台本です。",
      zh: "尴尬的沉默。手心出汗。这有个简单的脚本帮你度过。",
      es: "Silencio incómodo. Aquí tienes un guion simple.",
      fr: "Silence gênant. Voici un script simple.",
      de: "Peinliches Schweigen. Hier ist ein einfaches Skript.",
      ru: "Неловкое молчание. Вот простой сценарий.",
      pt: "Silêncio constrangedor. Aqui está um roteiro simples.",
      tr: "Garip sessizlik. İşte basit bir senaryo.",
      ar: "صمت محرج. إليك سيناريو بسيط.",
      hi: "अजीब खामोशी। यहाँ एक सरल स्क्रिप्ट है।",
      bn: "অস্বস্তিকর নীরবতা। এখানে একটি সহজ স্ক্রিপ্ট আছে।",
      ur: "عجیب خاموشی. یہاں ایک سادہ اسکرپٹ ہے۔",
      ne: "अप्ठ्यारो मौनता। यहाँ एक साधारण स्क्रिप्ट छ।",
      th: "ความเงียบที่น่าอึดอัด นี่คือบทพูดง่ายๆ ที่ช่วยคุณได้",
      vi: "Sự im lặng ngượng ngùng. Đây là kịch bản đơn giản.",
      id: "Keheningan yang canggung. Ini naskah sederhana."
    },
    content: {
      en: POST_SOCIAL_EN,
      ko: POST_SOCIAL_KO,
      ja: POST_SOCIAL_JA,
      zh: POST_SOCIAL_ZH,
      es: POST_SOCIAL_ES,
      fr: POST_SOCIAL_FR,
      de: POST_SOCIAL_DE,
      ru: POST_SOCIAL_RU,
      pt: POST_SOCIAL_PT,
      tr: POST_SOCIAL_TR,
      ar: POST_SOCIAL_AR,
      hi: POST_SOCIAL_HI,
      bn: POST_SOCIAL_BN,
      ur: POST_SOCIAL_UR,
      ne: POST_SOCIAL_NE,
      th: POST_SOCIAL_TH,
      vi: POST_SOCIAL_VI,
      id: POST_SOCIAL_ID
    },
    coverImage: "/assets/blog/nano-banana-social.png",
    author: "Nano Banana",
    tags: ["Social", "Confidence"],
    published: true,
    createdAt: new Date("2026-02-18T10:00:00Z"),
    updatedAt: new Date("2026-02-18T10:00:00Z")
  }
];
