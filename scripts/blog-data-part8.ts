
import { BlogPost } from "../src/domain/blog";

// ==========================================
// Post 1: The Toxic Myth of 'Fluency in 3 Months'
// ==========================================
const POST_MYTH_EN = `
<article>
  <p>If you search for language tips on YouTube, you are bombarded with: <em>"How I learned Spanish in 7 days"</em>, <em>"Fluent in 3 months"</em>.</p>
  <p>These titles are not just misleading; they are toxic. They set you up for failure before you even start.</p>

  <h2>The Reality Math (FSI Scale)</h2>
  <p>The US Foreign Service Institute (FSI) has trained diplomats for decades. Here is their data for an English speaker to reach "Professional Working Proficiency" (S-3/R-3):</p>
  <ul>
    <li><strong>Group 1 (Spanish, French):</strong> ~600 class hours.</li>
    <li><strong>Group 4 (Korean, Japanese, Arabic):</strong> ~2,200 class hours.</li>
  </ul>
  <p>If you study 1 hour a day, 600 hours is nearly <strong>2 years</strong>. 2,200 hours is <strong>6 years</strong>.</p>

  <h2>Why "Fluency" is a Trap</h2>
  <p>"Fluency" is an abstract, moving goalpost. When you start, you think fluency means "Ordering a beer". When you can order a beer, you think it means "Understanding the news". You never feel fluent.</p>

  <h2>Reframing the Goal</h2>
  <p>Stop chasing "Fluency". Chase <strong>Milestones</strong>.</p>
  <ul>
    <li>Month 1: Can introduce myself.</li>
    <li>Month 3: Can survive travel situations.</li>
    <li>Month 6: Can hold a 15-minute conversation.</li>
  </ul>
  <p>Enjoy the journey. If you rush to the finish line, you'll miss the scenery.</p>

  <hr />
  <h2>FAQ: Common Questions</h2>
  <h3>Q: Can I really not learn fast? What about immersion programs?</h3>
  <p><strong>A:</strong> Total immersion (living in the country, 8 hours/day) <em>is</em> faster. But "3 months" usually assumes 8-10 hours a day. If you have a job, this is impossible. Be realistic with *your* hours.</p>

  <h3>Q: What is the fastest valid method?</h3>
  <p><strong>A:</strong> Comprehensive Input + Spaced Repetition (Anki) + High Intensity. But even then, for a hard language, expect 1-2 years for true fluency.</p>
</article>
`;

const POST_MYTH_KO = `
<article>
  <p>유튜브에서 언어 학습 팁을 검색하면 <em>"7일 만에 스페인어 마스터하기"</em>, <em>"3개월 만에 원어민 되기"</em> 같은 영상이 쏟아집니다.</p>
  <p>이런 제목들은 사기일 뿐만 아니라 유해합니다. 시작하기도 전에 실패를 예약하는 셈입니다.</p>

  <h2>현실의 수학 (FSI 척도)</h2>
  <p>미국 국무부(FSI) 데이터에 따르면, 영어 화자가 '전문 업무 가능 수준'에 도달하는 시간은 다음과 같습니다:</p>
  <ul>
    <li><strong>1그룹 (스페인어, 프랑스어):</strong> 약 600시간.</li>
    <li><strong>4그룹 (한국어, 일본어, 아랍어):</strong> 약 2,200시간.</li>
  </ul>
  <p>하루 1시간씩 공부하면 600시간은 <strong>2년</strong>, 2,200시간은 <strong>6년</strong>입니다.</p>

  <h2>'유창함'의 함정</h2>
  <p>'유창함'은 계속 움직이는 골대입니다. 처음엔 맥주 주문이 목표였지만, 달성하면 뉴스 이해가 목표가 됩니다. 당신은 영원히 유창하지 않다고 느낄 것입니다.</p>

  <h2>목표 재설정</h2>
  <p>유창함을 쫓지 말고 <strong>마일스톤</strong>을 쫓으세요.</p>
  <ul>
    <li>1개월: 자기소개.</li>
    <li>3개월: 여행 생존 회화.</li>
    <li>6개월: 15분 대화 지속.</li>
  </ul>

  <hr />
  <h2>FAQ: 자주 묻는 질문</h2>
  <h3>Q: 정말 빨리 배울 순 없나요? 몰입 프로그램은요?</h3>
  <p><strong>A:</strong> 하루 8시간씩 현지에서 사는 '완전 몰입'은 빠릅니다. 하지만 '3개월 완성'은 보통 하루 10시간 공부를 전제로 합니다. 직장이 있다면 불가능합니다. 현실적인 계획을 세우세요.</p>

  <h3>Q: 가장 빠른 검증된 방법은 무엇인가요?</h3>
  <p><strong>A:</strong> 대량 입력(Input) + 간격 반복(Anki) + 고강도 학습입니다. 그래도 어려운 언어라면 진정한 유창함까지 1~2년은 잡아야 합니다.</p>
</article>
`;

const POST_MYTH_JA = `<article><p>「3ヶ月でペラペラ」は嘘です。FSIのデータでは日本語習得に2200時間かかります。1日1時間なら6年です。「流暢さ」というゴールのないマラソンではなく、「自己紹介」「旅行会話」というマイルストーンを目指しましょう。<hr /><h3>FAQ</h3><p><strong>Q: 早く学ぶ方法は？</strong><br>A: 完全な没入（1日8時間）なら早いです。しかし働きながらなら、現実的には数年かかります。</p></article>`;
const POST_MYTH_ZH = `<article><p>别信“3个月流利”。FSI数据显示掌握一门语言需600-2200小时。不要追求抽象的“流利”，要设定具体里程碑。享受过程。<hr /><h3>FAQ</h3><p><strong>Q: 能不能快点学？</strong><br>A: 除非你全职学习（每天8小时），否则“3个月”是不可能的。现实一点。</p></article>`;
const POST_MYTH_ES = `<article><p>El mito de "fluidez en 3 meses" es tóxico. FSI dice 600-2200 horas. Persigue hitos, no la "fluidez".<hr /><h3>FAQ</h3><p><strong>Q: ¿Algún método rápido?</strong><br>A: Inmersión total (8h/día). Si trabajas, sé realista: tomará años.</p></article>`;
const POST_MYTH_FR = `<article><p>Le mythe de "courant en 3 mois" est toxique. FSI dit 600-2200 heures. Chassez les étapes, pas la fluidité.<hr /><h3>FAQ</h3><p><strong>Q: Peut-on apprendre vite ?</strong><br>A: Seulement avec une immersion totale (8h/jour). Sinon, comptez en années.</p></article>`;
const POST_MYTH_DE = `<article><p>"Fließend in 3 Monaten" ist eine Lüge. FSI sagt 600-2200 Stunden. Setze Meilensteine.<hr /><h3>FAQ</h3><p><strong>Q: Geht es schneller?</strong><br>A: Nur mit Vollzeit-Lernen. Sei realistisch.</p></article>`;
const POST_MYTH_RU = `<article><p>Миф о "3 месяцах" токсичен. FSI: 600-2200 часов. Ставьте цели-вехи.<hr /><h3>FAQ</h3><p><strong>Q: Можно ли быстрее?</strong><br>A: Только при полном погружении (8 часов в день).</p></article>`;
const POST_MYTH_PT = `<article><p>O mito de 3 meses é tóxico. FSI: 600-2200 horas. Persiga marcos.<hr /><h3>FAQ</h3><p><strong>Q: Existe método rápido?</strong><br>A: Imersão total (8h/dia). Caso contrário, leva anos.</p></article>`;
const POST_MYTH_TR = `<article><p>"3 ayda akıcı" bir yalandır. FSI: 600-2200 saat. Kilometre taşlarını hedefleyin.<hr /><h3>FAQ</h3><p><strong>Q: Hızlanabilir miyim?</strong><br>A: Sadece tam daldırma (günde 8 saat) ile. Gerçekçi olun.</p></article>`;
const POST_MYTH_AR = `<article><p>خرافة "3 أشهر" سامة. FSI: 600-2200 ساعة. طارد المعالم.<hr /><h3>FAQ</h3><p><strong>س: هل يمكن التعلم بسرعة؟</strong><br>ج: فقط بالانغماس الكلي (8 ساعات/يوم).</p></article>`;
const POST_MYTH_HI = `<article><p>"3 महीने में धाराप्रवाह" एक झूठ है। FSI: 600-2200 घंटे। मील के पत्थर का पीछा करें.<hr /><h3>FAQ</h3><p><strong>प्र: क्या तेजी से सीखा जा सकता है?</strong><br>उ: केवल पूर्ण विसर्जन (8 घंटे/दिन) के साथ।</p></article>`;
const POST_MYTH_BN = `<article><p>"৩ মাসে অনর্গল" একটি মিথ্যা। FSI: ৬০০-২২০০ ঘণ্টা। মাইলফলক অনুসরণ করুন।<hr /><h3>FAQ</h3><p><strong>প্র: দ্রুত শেখা কি সম্ভব?</strong><br>উ: শুধুমাত্র পূর্ণ নিমজ্জন (দিনে ৮ ঘণ্টা) দিয়ে।</p></article>`;
const POST_MYTH_UR = `<article><p>"3 ماہ میں روانی" ایک جھوٹ ہے۔ FSI: 600-2200 گھنٹے۔ سنگ میل کا پیچھا کریں۔<hr /><h3>FAQ</h3><p><strong>سوال: کیا تیزی سے سیکھا جا سکتا ہے؟</strong><br>جواب: صرف مکمل وسرجن (8 گھنٹے/دن) کے ساتھ۔</p></article>`;
const POST_MYTH_NE = `<article><p>"३ महिनामा धाराप्रवाह" झूट हो। FSI: ६००-२२०० घण्टा। माइलस्टोनहरू पछ्याउनुहोस्।<hr /><h3>FAQ</h3><p><strong>प्र: के छिटो सिक्न सकिन्छ?</strong><br>उ: केवल पूर्ण विसर्जन (दिनको ८ घण्टा) संग।</p></article>`;
const POST_MYTH_TH = `<article><p>"คล่องใน 3 เดือน" คือเรื่องโกหก FSI: 600-2200 ชั่วโมง ให้ตั้งเป้าหมายเป็นระยะ<hr /><h3>FAQ</h3><p><strong>Q: เรียนเร็วๆ ได้ไหม?</strong><br>A: ได้ถ้าเรียนวันละ 8 ชั่วโมง ถ้าทำงานไปด้วย ต้องใช้เวลาหลายปี</p></article>`;
const POST_MYTH_VI = `<article><p>"Trôi chảy trong 3 tháng" là dối trá. FSI: 600-2200 giờ. Hãy theo đuổi các cột mốc.<hr /><h3>FAQ</h3><p><strong>H: Có thể học nhanh không?</strong><br>Đ: Chỉ khi đắm mình hoàn toàn (8 giờ/ngày).</p></article>`;
const POST_MYTH_ID = `<article><p>"Lancar dalam 3 bulan" adalah bohong. FSI: 600-2200 jam. Kejar pencapaian.<hr /><h3>FAQ</h3><p><strong>T: Bisakah belajar cepat?</strong><br>J: Hanya dengan imersi total (8 jam/hari).</p></article>`;


// ==========================================
// Post 3: Why Grammar is Useless Without Culture
// ==========================================
const POST_CULTURE_EN = `
<article>
  <p>You can memorize every grammar rule in the textbook and still fail to communicate. Why? Because <strong>Language is Culture</strong>.</p>

  <h2>The "Direct Translation" Trap</h2>
  <p>If you ask a Korean <em>"Did you eat?"</em> (밥 먹었어?), you aren't asking about calories. You are saying "Hello, how are you?". Interpreting it literally ("Yes, I ate a sandwich") makes you sound robotic and cold.</p>

  <h2>Hierarchy & Honorifics</h2>
  <p>In many Asian languages (Korean, Japanese), grammar changes entirely based on who you are talking to.
  <ul>
    <li>To a friend: "Eat."</li>
    <li>To a boss: "Please honorably consume."</li>
  </ul>
  <p>If you use the dictionary form to your boss, you might get fired. Grammar books engage the logic brain; culture engages the emotion brain.</p>

  <h2>Conclusion</h2>
  <p>Stop treating language like code to be deciphered. Treat it like a key to a new world. Watch their dramas. Eat their food. Understand <em>why</em> they say what they say.</p>

  <hr />
  <h2>FAQ: Culture First</h2>
  <h3>Q: How can I learn culture if I can't travel there?</h3>
  <p><strong>A:</strong> Travel is not required. Watch TV shows, but don't just watch the plot. Watch how people greet each other, how they pour drinks, how they sit. Culture is in the details.</p>

  <h3>Q: Doesn't grammar matter at all?</h3>
  <p><strong>A:</strong> Grammar is the skeleton. Culture is the flesh and soul. You need both, but a skeleton without a soul is just a dead body. Don't obsess over rules; obsess over context.</p>
</article>
`;

const POST_CULTURE_KO = `
<article>
  <p>교과서에 나오는 모든 문법 규칙을 외우고도 소통에 실패할 수 있습니다. 왜냐하면 <strong>언어는 곧 문화</strong>이기 때문입니다.</p>

  <h2>"직역"의 함정</h2>
  <p>한국인에게 <em>"밥 먹었어?"</em>라고 묻는 것은 칼로리 섭취 여부를 묻는 게 아닙니다. "안녕, 잘 지내?"라는 인사입니다. 이걸 문자 그대로 해석해서 "응, 샌드위치 먹었어"라고 답하면 로봇처럼 차갑게 들릴 수 있습니다.</p>

  <h2>위계질서와 존댓말</h2>
  <p>많은 아시아 언어(한국어, 일본어)에서는 상대방에 따라 문법이 완전히 바뀝니다.
  <ul>
    <li>친구에게: "먹어."</li>
    <li>상사에게: "진지 드십시오."</li>
  </ul>
  <p>상사에게 사전형(반말)을 쓴다면 해고당할지도 모릅니다. 문법책은 논리의 뇌를 깨우지만, 문화는 감정의 뇌를 깨웁니다.</p>

  <h2>결론</h2>
  <p>언어를 해독해야 할 암호처럼 대하지 마세요. 새로운 세상으로 가는 열쇠로 대하세요. 그들의 드라마를 보고, 그들의 음식을 드세요. 그들이 <em>왜</em> 그렇게 말하는지를 이해하세요.</p>

  <hr />
  <h2>FAQ: 문화 우선주의</h2>
  <h3>Q: 여행을 못 가는데 문화를 어떻게 배우나요?</h3>
  <p><strong>A:</strong> 여행은 필수가 아닙니다. 드라마를 볼 때 스토리만 보지 마세요. 사람들이 어떻게 인사하는지, 술을 어떻게 따르는지, 어떻게 앉는지 관찰하세요. 문화는 디테일에 있습니다.</p>

  <h3>Q: 문법은 전혀 중요하지 않나요?</h3>
  <p><strong>A:</strong> 문법은 뼈대입니다. 문화는 살과 영혼입니다. 둘 다 필요하지만, 영혼 없는 뼈대는 시체일 뿐입니다. 규칙에 집착하지 말고 맥락에 집착하세요.</p>
</article>
`;

const POST_CULTURE_JA = `<article><p>文法だけでは不十分です。例えば「ご飯食べた？」は挨拶です。直訳はロボットです。<hr /><h3>FAQ</h3><p><strong>Q: 旅行せずに文化を学ぶには？</strong><br>A: ドラマの細部（お辞儀、食事作法）を観察してください。</p></article>`;
const POST_CULTURE_ZH = `<article><p>语言即文化。光背语法是不够的。敬语反映了社会等级。<hr /><h3>FAQ</h3><p><strong>Q: 不去那个国家怎么学文化？</strong><br>A: 观察剧集中的细节，而不仅仅是剧情。</p></article>`;
const POST_CULTURE_ES = `<article><p>El idioma es cultura. La gramática no basta. Aprende el contexto.<hr /><h3>FAQ</h3><p><strong>Q: ¿Cómo aprendo cultura sin viajar?</strong><br>A: Observa los detalles en películas y series.</p></article>`;
const POST_CULTURE_FR = `<article><p>La langue est culture. La grammaire ne suffit pas.<hr /><h3>FAQ</h3><p><strong>Q: Comment apprendre la culture sans voyager ?</strong><br>A: Observez les détails dans les séries télévisées.</p></article>`;
const POST_CULTURE_DE = `<article><p>Sprache ist Kultur. Grammatik reicht nicht.<hr /><h3>FAQ</h3><p><strong>Q: Wie lerne ich Kultur ohne Reisen?</strong><br>A: Beobachte Details in Filmen.</p></article>`;
const POST_CULTURE_RU = `<article><p>Язык — это культура. Грамматики недостаточно.<hr /><h3>FAQ</h3><p><strong>Q: Как учить культуру без путешествий?</strong><br>A: Наблюдайте за деталями в фильмах.</p></article>`;
const POST_CULTURE_PT = `<article><p>Língua é cultura. Gramática não basta.<hr /><h3>FAQ</h3><p><strong>Q: Como aprender cultura sem viajar?</strong><br>A: Observe detalhes em filmes.</p></article>`;
const POST_CULTURE_TR = `<article><p>Dil kültürdür. Gramer yetmez.<hr /><h3>FAQ</h3><p><strong>Q: Seyahat etmeden kültür nasıl öğrenilir?</strong><br>A: Filmlerdeki detayları izleyin.</p></article>`;
const POST_CULTURE_AR = `<article><p>اللغة ثقافة. القواعد لا تكفي.<hr /><h3>FAQ</h3><p><strong>س: كيف تتعلم الثقافة دون السفر؟</strong><br>ج: شاهد التفاصيل في الأفلام.</p></article>`;
const POST_CULTURE_HI = `<article><p>भाषा संस्कृति है। व्याकरण काफी नहीं है.<hr /><h3>FAQ</h3><p><strong>प्र: यात्रा के बिना संस्कृति कैसे सीखें?</strong><br>उ: फिल्मों में विवरण देखें।</p></article>`;
const POST_CULTURE_BN = `<article><p>ভাষা হলো সংস্কৃতি। ব্যাকরণ যথেষ্ট নয়।<hr /><h3>FAQ</h3><p><strong>প্র: ভ্রমণ না করে সংস্কৃতি কীভাবে শিখব?</strong><br>উ: সিনেমার বিস্তারিত পর্যবেক্ষণ করুন।</p></article>`;
const POST_CULTURE_UR = `<article><p>زبان ثقافت ہے۔ گرامر کافی نہیں ہے۔<hr /><h3>FAQ</h3><p><strong>سوال: سفر کے بغیر ثقافت کیسے سیکھیں؟</strong><br>جواب: فلموں میں تفصیلات دیکھیں۔</p></article>`;
const POST_CULTURE_NE = `<article><p>भाषा संस्कृति हो। व्याकरण पर्याप्त छैन।<hr /><h3>FAQ</h3><p><strong>प्र: यात्रा नगरी संस्कृति कसरी सिक्ने?</strong><br>उ: चलचित्रहरूमा विवरणहरू हेर्नुहोस्।</p></article>`;
const POST_CULTURE_TH = `<article><p>ภาษาคือวัฒนธรรม ไวยากรณ์ไม่พอ<hr /><h3>FAQ</h3><p><strong>Q: เรียนวัฒนธรรมโดยไม่ต้องเดินทางอย่างไร?</strong><br>A: สังเกตรายละเอียดในภาพยนตร์</p></article>`;
const POST_CULTURE_VI = `<article><p>Ngôn ngữ là Văn hóa. Ngữ pháp là không đủ.<hr /><h3>FAQ</h3><p><strong>H: Làm thế nào để học văn hóa mà không cần đi du lịch?</strong><br>Đ: Quan sát các chi tiết trong phim.</p></article>`;
const POST_CULTURE_ID = `<article><p>Bahasa adalah Budaya. Tata bahasa tidak cukup.<hr /><h3>FAQ</h3><p><strong>T: Bagaimana belajar budaya tanpa bepergian?</strong><br>J: Amati detail dalam film.</p></article>`;


// ==========================================
// Post 4: Street Smart vs. Book Smart
// ==========================================
const POST_SLANG_EN = `
<article>
  <p>You study for 3 years. You go to the country. You speak perfect textbook grammar. And people laugh at you. Why? Because you sound like a 19th-century novel.</p>

  <h2>The Register Scale</h2>
  <p>Language has "Register" (Politeness/Formality levels). Using the wrong one is social suicide.</p>
  <ul>
    <li><strong>Too Formal:</strong> Saying "How do you do, sir?" to a teenager at a party. Result: You are weird.</li>
    <li><strong>Too Casual:</strong> Saying "What's up, bro?" to a police officer. Result: You are disrespectful.</li>
  </ul>

  <h2>The "Textbook Bubble"</h2>
  <p>Textbooks teach you the "Safe Middle". But real life happens at the edges.</p>
  <p><strong>Scenario: Answering "How are you?"</strong></p>
  <ul>
    <li>Textbook: "I am fine, thank you. And you?" (Robotic)</li>
    <li>Reality: "Good, you?", "Not bad.", "Tired." (Natural)</li>
  </ul>

  <hr />
  <h2>FAQ: Slang Strategy</h2>
  <h3>Q: When should I start learning slang?</h3>
  <p><strong>A:</strong> Wait until you are Intermediate (B1/B2). If you use slang with bad grammar, you sound ridiculous. Scale: Master "Polite" first, then add "Casual" spice.</p>

  <h3>Q: Can I use what I hear in rap music?</h3>
  <p><strong>A:</strong> Be very careful. Rap often uses hyper-specific, sometimes aggressive slang that is inappropriate for daily life. Don't call your boss "homie".</p>
</article>
`;

const POST_SLANG_KO = `
<article>
  <p>3년을 공부했습니다. 현지에 갔습니다. 완벽한 교과서 문법을 구사했습니다. 그런데 사람들이 비웃습니다. 왜일까요? 당신이 19세기 소설책처럼 말하기 때문입니다.</p>

  <h2>레지스터(Register) 척도</h2>
  <p>언어에는 "격식 등급(Register)"이 있습니다. 잘못 쓰면 사회적 자살행위입니다.</p>
  <ul>
    <li><strong>너무 격식:</strong> 파티에서 10대에게 "안녕하십니까, 선생님?"이라고 하기. 결과: 이상한 사람 취급받음.</li>
    <li><strong>너무 캐주얼:</strong> 경찰관에게 "안녕, 형제여?"라고 하기. 결과: 무례한 사람 취급받음.</li>
  </ul>

  <h2>"교과서 거품"</h2>
  <p>교과서는 "안전한 중간지대"만 가르칩니다. 하지만 진짜 삶은 양극단에서 일어납니다.</p>

  <hr />
  <h2>FAQ: 슬랭 전략</h2>
  <h3>Q: 언제부터 슬랭을 배워야 하나요?</h3>
  <p><strong>A:</strong> 중급(B1/B2)이 될 때까지 기다리세요. 문법이 엉망인데 슬랭을 쓰면 우스꽝스럽습니다. 순서: "정중한 표현"을 마스터한 뒤 "캐주얼"을 양념으로 치세요.</p>

  <h3>Q: 랩 가사에 나오는 말을 써도 되나요?</h3>
  <p><strong>A:</strong> 매우 조심하세요. 힙합은 일상생활에 부적합한 공격적이거나 특수한 슬랭을 많이 씁니다. 상사에게 "Yo homie"라고 하지 마세요.</p>
</article>
`;

const POST_SLANG_JA = `<article><p>教科書通りだとロボットみたいです。TPO（Register）が大事です。<hr /><h3>FAQ</h3><p><strong>Q: スラングはいつ学ぶべき？</strong><br>A: 中級になってからです。下手な日本語でスラングを使うと変な人に見えます。</p></article>`;
const POST_SLANG_ZH = `<article><p>书本语 vs 口语。不要说得像古装剧一样。注意语境。<hr /><h3>FAQ</h3><p><strong>Q: 什么时候学俚语？</strong><br>A: 中级以后。先学好礼貌用语，否则会显得很滑稽。</p></article>`;
const POST_SLANG_ES = `<article><p>No hables como un libro de texto. Entiende el registro.<hr /><h3>FAQ</h3><p><strong>Q: ¿Cuándo aprender jerga?</strong><br>A: Espera al nivel intermedio. Primero domina lo formal.</p></article>`;
const POST_SLANG_FR = `<article><p>Ne parlez pas comme un livre. Comprenez le registre.<hr /><h3>FAQ</h3><p><strong>Q: Quand apprendre l'argot ?</strong><br>A: Attendez le niveau intermédiaire. Maîtrisez d'abord le poli.</p></article>`;
const POST_SLANG_DE = `<article><p>Sprich nicht wie ein Buch. Verstehe das Register.<hr /><h3>FAQ</h3><p><strong>Q: Wann Slang lernen?</strong><br>A: Ab Mittelstufe. Erst höflich, dann locker.</p></article>`;
const POST_SLANG_RU = `<article><p>Не говорите как учебник. Понимайте регистр.<hr /><h3>FAQ</h3><p><strong>Q: Когда учить сленг?</strong><br>A: С среднего уровня. Сначала вежливость.</p></article>`;
const POST_SLANG_PT = `<article><p>Não fale como um livro. Entenda o registro.<hr /><h3>FAQ</h3><p><strong>Q: Quando aprender gírias?</strong><br>A: No nível intermediário. Primeiro o polido.</p></article>`;
const POST_SLANG_TR = `<article><p>Kitap gibi konuşma. Kaydı anla.<hr /><h3>FAQ</h3><p><strong>Q: Argo ne zaman öğrenilmeli?</strong><br>A: Orta seviyede. Önce kibar dili öğren.</p></article>`;
const POST_SLANG_AR = `<article><p>لا تتحدث ككتاب. افهم السجل.<hr /><h3>FAQ</h3><p><strong>س: متى تتعلم العامية؟</strong><br>ج: في المستوى المتوسط. أتقن التهذيب أولاً.</p></article>`;
const POST_SLANG_HI = `<article><p>किताब की तरह न बोलें। रजिस्टर को समझें।<hr /><h3>FAQ</h3><p><strong>प्र: कठबोली कब सीखें?</strong><br>उ: इंटरमीडिएट स्तर पर। पहले शिष्टाचार सीखें।</p></article>`;
const POST_SLANG_BN = `<article><p>বইয়ের মতো কথা বলবেন না। রেজিস্টার বুঝুন।<hr /><h3>FAQ</h3><p><strong>প্র: কখন স্ল্যাং শিখব?</strong><br>উ: ইন্টারমিডিয়েট স্তরে। আগে ভদ্রতা শিখুন।</p></article>`;
const POST_SLANG_UR = `<article><p>کتاب کی طرح نہ بولیں۔ رجسٹر کو سمجھیں۔<hr /><h3>FAQ</h3><p><strong>سوال: سلینگ کب سیکھیں؟</strong><br>جواب: انٹرمیڈیٹ سطح پر۔ پہلے شائستگی سیکھیں۔</p></article>`;
const POST_SLANG_NE = `<article><p>किताब जस्तो नबोल्नुहोस्। रजिस्टर बुझ्नुहोस्।<hr /><h3>FAQ</h3><p><strong>प्र: अपशब्द कहिले सिक्ने?</strong><br>उ: मध्यवर्ती स्तरमा। पहिले शिष्टाचार सिक्नुहोस्।</p></article>`;
const POST_SLANG_TH = `<article><p>อย่าพูดเหมือนตำรา เข้าใจระดับภาษา<hr /><h3>FAQ</h3><p><strong>Q: ควรเริ่มเรียนสแลงเมื่อไหร่?</strong><br>A: รอระดับกลาง (Intermediate) ให้แม่นคำสุภาพก่อน</p></article>`;
const POST_SLANG_VI = `<article><p>Đừng nói như sách giáo khoa. Hiểu ngữ vực.<hr /><h3>FAQ</h3><p><strong>H: Khi nào nên học tiếng lóng?</strong><br>Đ: Đợi đến trình độ trung cấp. Hãy thành thạo lịch sự trước.</p></article>`;
const POST_SLANG_ID = `<article><p>Jangan bicara seperti buku teks. Pahami register.<hr /><h3>FAQ</h3><p><strong>T: Kapan belajar bahasa gaul?</strong><br>J: Tunggu sampai tingkat menengah. Kuasai sopan santun dulu.</p></article>`;


// ==========================================
// EXPORT
// ==========================================
export const BLOG_POSTS_PART_8: BlogPost[] = [
  {
    id: "fluency-myth-3-months",
    title: {
      en: "The Toxic Myth of 'Fluency in 3 Months'",
      ko: "'3개월 만에 원어민 되기'라는 독성 신화",
      ja: "「3ヶ月でペラペラ」という有害な神話",
      zh: "“3个月流利”的有毒神话",
      es: "El Mito Tóxico de la 'Fluidez en 3 Meses'",
      fr: "Le Mythe Toxique de la 'Fluidité en 3 Mois'",
      de: "Der giftige Mythos von 'Fließend in 3 Monaten'",
      ru: "Токсичный миф о 'Свободном владении за 3 месяца'",
      pt: "O Mito Tóxico da 'Fluência em 3 Meses'",
      tr: "'3 Ayda Akıcılık' Zehirli Efsanesi",
      ar: "الأسطورة السامة لـ 'الطلاقة في 3 أشهر'",
      hi: "'3 महीने में प्रवाह' का जहरीला मिथक",
      bn: "'৩ মাসে অনর্গল' এর বিষাক্ত মিথ",
      ur: "'3 ماہ میں روانی' کا زہریلا افسانہ",
      ne: "'३ महिनामा धाराप्रवाह' को विषाक्त मिथक",
      th: "ตำนานที่เป็นพิษของ 'ความคล่องแคล่วใน 3 เดือน'",
      vi: "Huyền thoại độc hại về 'Trôi chảy trong 3 tháng'",
      id: "Mitos Beracun 'Lancar dalam 3 Bulan'"
    },
    excerpt: {
      en: "Why 'Fluent in 3 Months' is a lie, and what realistic progress really looks like according to FSI data.",
      ko: "'3개월 완성'이 왜 거짓말인지, FSI 데이터에 따른 현실적인 진전은 어떤 모습인지 알아봅니다.",
      ja: "なぜ「3ヶ月でペラペラ」は嘘なのか。FSIデータに基づいた現実的な進歩とは。",
      zh: "为什么“3个月流利”是谎言，以及根据FSI数据的现实进步是什么样的。",
      es: "Por qué 'Fluido en 3 Meses' es una mentira, y cómo se ve el progreso realista según datos del FSI.",
      fr: "Pourquoi 'Courant en 3 mois' est un mensonge, et à quoi ressemble un progrès réaliste.",
      de: "Warum 'Fließend in 3 Monaten' eine Lüge ist und wie realistischer Fortschritt aussieht.",
      ru: "Почему 'Свободно за 3 месяца' — это ложь, и как выглядит реальный прогресс.",
      pt: "Por que 'Fluente em 3 Meses' é uma mentira e como é o progresso realista.",
      tr: "'3 Ayda Akıcı' neden bir yalandır ve gerçekçi ilerleme nasıl görünür.",
      ar: "لماذا 'الطلاقة في 3 أشهر' كذبة، وكيف يبدو التقدم الواقعي.",
      hi: "'3 महीने में धाराप्रवाह' झूठ क्यों है, और यथार्थवादी प्रगति कैसी दिखती है।",
      bn: "'৩ মাসে অনর্গল' কেন মিথ্যা, এবং বাস্তবসম্মত অগ্রগতি কেমন দেখায়।",
      ur: "'3 ماہ میں روانی' کیوں جھوٹ ہے، اور حقیقت پسندانہ پیشرفت کیسی دکھتی ہے۔",
      ne: "'३ महिनामा धाराप्रवाह' किन झूट हो, र यथार्थपरक प्रगति कस्तो देखिन्छ।",
      th: "ทำไม 'คล่องใน 3 เดือน' ถึงเป็นเรื่องโกหก และความก้าวหน้าจริงเป็นอย่างไร",
      vi: "Tại sao 'Trôi chảy trong 3 tháng' là dối trá và tiến bộ thực tế trông như thế nào.",
      id: "Mengapa 'Lancar dalam 3 Bulan' adalah kebohongan, dan seperti apa kemajuan yang realistis."
    },
    content: {
      en: POST_MYTH_EN,
      ko: POST_MYTH_KO,
      ja: POST_MYTH_JA,
      zh: POST_MYTH_ZH,
      es: POST_MYTH_ES,
      fr: POST_MYTH_FR,
      de: POST_MYTH_DE,
      ru: POST_MYTH_RU,
      pt: POST_MYTH_PT,
      tr: POST_MYTH_TR,
      ar: POST_MYTH_AR,
      hi: POST_MYTH_HI,
      bn: POST_MYTH_BN,
      ur: POST_MYTH_UR,
      ne: POST_MYTH_NE,
      th: POST_MYTH_TH,
      vi: POST_MYTH_VI,
      id: POST_MYTH_ID
    },
    coverImage: "/assets/blog/myth-fluency.png",
    author: "Dr. Lingua",
    tags: ["Mindset", "Fluency"],
    published: true,
    createdAt: new Date("2026-02-09T10:00:00Z"),
    updatedAt: new Date("2026-02-09T10:00:00Z")
  },

  {
    id: "culture-grammar-useless",
    title: {
      en: "Why Grammar is Useless Without Culture",
      ko: "문화 없이는 문법이 쓸모없는 이유",
      ja: "文化なしでは文法が無意味な理由",
      zh: "为什么没有文化语法就毫无用处",
      es: "Por qué la Gramática es Inútil sin Cultura",
      fr: "Pourquoi la Grammaire est Inutile sans Culture",
      de: "Warum Grammatik ohne Kultur nutzlos ist",
      ru: "Почему Грамматика Бесполезна без Культуры",
      pt: "Por que Gramática é Inútil sem Cultura",
      tr: "Kültür Olmadan Gramer Neden Yararsızdır",
      ar: "لماذا القواعد عديمة الفائدة بدون ثقافة",
      hi: "संस्कृति के बिना व्याकरण बेकार क्यों है",
      bn: "সংস্কৃতি ছাড়া ব্যাকরণ কেন অকেজো",
      ur: "ثقافت کے بغیر گرامر کیوں بیکار ہے",
      ne: "संस्कृति बिना व्याकरण किन बेकार छ",
      th: "ทำไมไวยากรณ์ถึงไร้ประโยชน์ถ้าไม่มีวัฒนธรรม",
      vi: "Tại sao Ngữ pháp lại Vô dụng nếu không có Văn hóa",
      id: "Mengapa Tata Bahasa Tidak Berguna Tanpa Budaya"
    },
    excerpt: {
      en: "Language is not code. It is culture. Understanding hierarchy, nuance, and history is more important than conjugating verbs.",
      ko: "언어는 암호학이 아니라 문화입니다. 동사 활용보다 위계질서, 뉘앙스, 역사를 이해하는 것이 더 중요합니다.",
      ja: "言語は暗号ではなく文化です。動詞の活用よりも、序列、ニュアンス、歴史を理解することの方が重要です。",
      zh: "语言不是代码，是文化。了解等级、细微差别和历史比动词变位更重要。",
      es: "El idioma no es código. Es cultura. Entender la jerarquía es más importante que conjugar.",
      fr: "La langue n'est pas du code. C'est de la culture.",
      de: "Sprache ist kein Code. Sie ist Kultur.",
      ru: "Язык — это не код. Это культура.",
      pt: "Língua não é código. É cultura.",
      tr: "Dil bir kod değildir. Kültürdür.",
      ar: "اللغة ليست شيفرة. إنها ثقافة.",
      hi: "भाषा कोड नहीं है। यह संस्कृति है।",
      bn: "ভাষা কোড নয়। এটা সংস্কৃতি।",
      ur: "زبان کوڈ نہیں ہے۔ یہ ثقافت ہے۔",
      ne: "भाषा कोड होइन। यो संस्कृति हो।",
      th: "ภาษาไม่ใช่รหัส แต่มันคือวัฒนธรรม",
      vi: "Ngôn ngữ không phải là mã. Nó là văn hóa.",
      id: "Bahasa bukan kode. Itu budaya."
    },
    content: {
      en: POST_CULTURE_EN,
      ko: POST_CULTURE_KO,
      ja: POST_CULTURE_JA,
      zh: POST_CULTURE_ZH,
      es: POST_CULTURE_ES,
      fr: POST_CULTURE_FR,
      de: POST_CULTURE_DE,
      ru: POST_CULTURE_RU,
      pt: POST_CULTURE_PT,
      tr: POST_CULTURE_TR,
      ar: POST_CULTURE_AR,
      hi: POST_CULTURE_HI,
      bn: POST_CULTURE_BN,
      ur: POST_CULTURE_UR,
      ne: POST_CULTURE_NE,
      th: POST_CULTURE_TH,
      vi: POST_CULTURE_VI,
      id: POST_CULTURE_ID
    },
    coverImage: "/assets/blog/culture-grammar.png",
    author: "Dr. Lingua",
    tags: ["Culture", "Deep Dive"],
    published: true,
    createdAt: new Date("2026-02-11T10:00:00Z"),
    updatedAt: new Date("2026-02-11T10:00:00Z")
  },
  {
    id: "street-smart-slang",
    title: {
      en: "Street Smart vs. Book Smart: When to Use Slang",
      ko: "실전 회화 vs 교과서 회화: 슬랭은 언제 써야 할까?",
      ja: "実践 vs 教科書：スラングはいつ使うべきか",
      zh: "街头智慧 vs 书本智慧：何时使用俚语",
      es: "Calle vs. Libro: Cuándo Usar Jerga",
      fr: "La Rue vs Les Livres : Quand Utiliser l'Argot",
      de: "Straßenschlau vs. Buchschlau: Wann man Slang benutzt",
      ru: "Уличный ум против Книжного: Когда Использовать Сленг",
      pt: "Esperteza de Rua vs. Livro: Quando Usar Gírias",
      tr: "Sokak Zekası vs Kitap Zekası: Argo Ne Zaman Kullanılır",
      ar: "ذكاء الشارع مقابل ذكاء الكتاب: متى تستخدم العامية",
      hi: "स्ट्रीट स्मार्ट बनाम बुक स्मार्ट: स्लैंग का उपयोग कब करें",
      bn: "রাস্তার স্মার্ট বনাম বইয়ের স্মার্ট: কখন স্ল্যাং ব্যবহার করবেন",
      ur: "اسٹریٹ اسمارٹ بمقابلہ بک اسمارٹ: سلینگ کب استعمال کریں",
      ne: "सडक स्मार्ट बनाम किताब स्मार्ट: कहिले अपशब्द प्रयोग गर्ने",
      th: "ฉลาดทางโลก vs ฉลาดในตำรา: เมื่อไหร่ควรใช้สแลง",
      vi: "Thông minh Đường phố vs Sách vở: Khi nào dùng tiếng lóng",
      id: "Cerdas Jalanan vs Cerdas Buku: Kapan Menggunakan Bahasa Gaul"
    },
    excerpt: {
      en: "Textbooks teach you to sound like a polite robot. Slang makes you sound human. But if you use it wrong, you look silly.",
      ko: "교과서는 예의 바른 로봇처럼 말하는 법을 가르칩니다. 슬랭은 인간답게 들리게 하죠. 하지만 잘못 쓰면 우스워집니다.",
      ja: "教科書は丁寧なロボットのような話し方を教えます。スラングは人間らしさを出しますが、使い間違えると滑稽です。",
      zh: "教科书教你像有礼貌的机器人一样说话。俚语让你听起来像人类。但这需要技巧。",
      es: "Los libros te enseñan a sonar como un robot.",
      fr: "Les livres vous apprennent à parler comme un robot.",
      de: "Bücher bringen dir bei, wie ein Roboter zu klingen.",
      ru: "Учебники учат говорить как робот.",
      pt: "Livros ensinam a falar como robô.",
      tr: "Kitaplar robot gibi konuşmayı öğretir.",
      ar: "الكتب تعلمك التحدث مثل الروبوت.",
      hi: "किताबें आपको रोबोट की तरह बोलना सिखाती हैं।",
      bn: "বই আপনাকে রোবটের মতো কথা বলতে শেখায়।",
      ur: "کتابیں آپ کو روبوٹ کی طرح بولنا سکھاتی ہیں۔",
      ne: "किताबहरूले तपाईंलाई रोबोट जस्तै बोल्न सिकाउँछन्।",
      th: "ตำราสอนให้คุณพูดเหมือนหุ่นยนต์",
      vi: "Sách dạy bạn nói như robot.",
      id: "Buku mengajarimu bicara seperti robot."
    },
    content: {
      en: POST_SLANG_EN,
      ko: POST_SLANG_KO,
      ja: POST_SLANG_JA,
      zh: POST_SLANG_ZH,
      es: POST_SLANG_ES,
      fr: POST_SLANG_FR,
      de: POST_SLANG_DE,
      ru: POST_SLANG_RU,
      pt: POST_SLANG_PT,
      tr: POST_SLANG_TR,
      ar: POST_SLANG_AR,
      hi: POST_SLANG_HI,
      bn: POST_SLANG_BN,
      ur: POST_SLANG_UR,
      ne: POST_SLANG_NE,
      th: POST_SLANG_TH,
      vi: POST_SLANG_VI,
      id: POST_SLANG_ID
    },
    coverImage: "/assets/blog/slang-vs-formal.png",
    author: "Dr. Lingua",
    tags: ["Slang", "Communication"],
    published: true,
    createdAt: new Date("2026-02-12T10:00:00Z"),
    updatedAt: new Date("2026-02-12T10:00:00Z")
  }
];




