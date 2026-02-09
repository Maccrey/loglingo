
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scripts', 'blog-data-part6.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  ES: `
        <article>
          <p>Terminaste el árbol del búho de Duolingo. Tienes una racha de 500 días. Pero, ¿puedes pedir un café en París sin entrar en pánico? Probablemente no.</p>
          <h2>La trampa de la gamificación</h2>
          <p>Las aplicaciones como Duolingo te permiten sentir que estás aprendiendo sin aprender realmente. Optimizan para el <strong>compromiso</strong>, no para la fluidez. Traducir "El oso come una manzana" no es lo mismo que tener una conversación.</p>
          <h2>Niveles CEFR: Las métricas reales</h2>
          <p>La verdadera competencia lingüística se mide por la escala CEFR (A1 a C2).</p>
          <ul>
            <li><strong>A1-A2 (Turista):</strong> Puedes sobrevivir. "¿Dónde está el baño?"</li>
            <li><strong>B1-B2 (Independiente):</strong> Puedes trabajar y tener amigos. Aquí es donde vive la fluidez.</li>
            <li><strong>C1-C2 (Maestría):</strong> Puedes escribir trabajos académicos.</li>
          </ul>
          <h2>Cómo escapar de la aplicación</h2>
          <p>Usa aplicaciones para vocabulario, pero deja de tratarlas como el plato principal. Para llegar a B1, necesitas hablar con humanos y consumir medios reales. Borra la aplicación si es tu único método.</p>
        </article>
      `,
  FR: `
        <article>
          <p>Vous avez fini l'arbre du hibou Duolingo. Vous avez une série de 500 jours. Mais pouvez-vous commander un café à Paris sans paniquer ? Probablement pas.</p>
          <h2>Le piège de la ludification</h2>
          <p>Les applications comme Duolingo vous permettent de vous sentir comme si vous appreniez sans vraiment apprendre. Elles optimisent pour l'<strong>engagement</strong>, pas pour la fluidité. Traduire "L'ours mange une pomme" n'est pas la même chose qu'avoir une conversation.</p>
          <h2>Niveaux CECR : Les vraies métriques</h2>
          <p>La vraie compétence linguistique est mesurée par l'échelle CECR (A1 à C2).</p>
          <ul>
            <li><strong>A1-A2 (Touriste) :</strong> Vous pouvez survivre. "Où sont les toilettes ?"</li>
            <li><strong>B1-B2 (Indépendant) :</strong> Vous pouvez travailler et avoir des amis. C'est là que vit la fluidité.</li>
            <li><strong>C1-C2 (Maîtrise) :</strong> Vous pouvez écrire des articles académiques.</li>
          </ul>
          <h2>Comment échapper à l'application</h2>
          <p>Utilisez des applications pour le vocabulaire, mais arrêtez de les traiter comme le plat principal. Pour atteindre le niveau B1, vous devez parler à des humains et consommer de vrais médias. Supprimez l'application si c'est votre seule méthode.</p>
        </article>
      `,
  DE: `
        <article>
          <p>Du hast den Duolingo-Eulenbaum beendet. Du hast einen 500-Tage-Streak. Aber kannst du in Paris einen Kaffee bestellen, ohne in Panik zu geraten? Wahrscheinlich nicht.</p>
          <h2>Die Gamification-Falle</h2>
          <p>Apps wie Duolingo geben dir das Gefühl, zu lernen, ohne tatsächlich zu lernen. Sie optimieren auf <strong>Engagement</strong>, nicht auf Fließendkeit. "Der Bär isst einen Apfel" zu übersetzen ist nicht dasselbe wie eine Unterhaltung zu führen.</p>
          <h2>GER-Niveaus: Die wahren Metriken</h2>
          <p>Echte Sprachkompetenz wird anhand der GER-Skala (A1 bis C2) gemessen.</p>
          <ul>
            <li><strong>A1-A2 (Tourist):</strong> Du kannst überleben. "Wo ist die Toilette?"</li>
            <li><strong>B1-B2 (Selbstständig):</strong> Du kannst arbeiten und Freunde haben. Hier lebt die Fließendkeit.</li>
            <li><strong>C1-C2 (Meisterschaft):</strong> Du kannst akademische Arbeiten schreiben.</li>
          </ul>
          <h2>Wie man der App entkommt</h2>
          <p>Nutze Apps für Vokabeln, aber betrachte sie nicht mehr als Hauptgericht. Um B1 zu erreichen, musst du mit Menschen sprechen und echte Medien konsumieren. Lösche die App, wenn sie deine einzige Methode ist.</p>
        </article>
      `,
  TH: `
        <article>
          <p>คุณทำต้นไม้นกฮูก Duolingo เสร็จแล้ว คุณมีสถิติต่อเนื่อง 500 วัน แต่คุณสั่งกาแฟในปารีสโดยไม่ตื่นตระหนกได้ไหม? อาจจะไม่ได้ครับ</p>
          <h2>กับดักของเกม</h2>
          <p>แอปอย่าง Duolingo ทำให้คุณรู้สึกว่ากำลังเรียนรู้โดยไม่ได้เรียนรู้จริงๆ พวกเขาปรับให้เหมาะสมเพื่อ<strong>การมีส่วนร่วม</strong> ไม่ใช่ความคล่องแคล่ว การแปล "หมีกินแอปเปิ้ล" ไม่เหมือนกับการสนทนาครับ</p>
          <h2>ระดับ CEFR: ตัวชี้วัดที่แท้จริง</h2>
          <p>ความสามารถทางภาษาที่แท้จริงวัดด้วยระดับ CEFR (A1 ถึง C2) ครับ</p>
          <ul>
            <li><strong>A1-A2 (นักท่องเที่ยว):</strong> คุณเอาตัวรอดได้ "ห้องน้ำอยู่ที่ไหน?"</li>
            <li><strong>B1-B2 (อิสระ):</strong> คุณทำงานและมีเพื่อนได้ นี่คือจุดที่ความคล่องแคล่วอยู่ครับ</li>
            <li><strong>C1-C2 (เชี่ยวชาญ):</strong> คุณเขียนบทความวิชาการได้ครับ</li>
          </ul>
          <h2>วิธีหนีจากแอป</h2>
          <p>ใช้แอปเพื่อคำศัพท์ แต่เลิกปฏิบัติกับมันเหมือนจานหลัก เพื่อไปถึง B1 คุณต้องคุยกับมนุษย์และเสพสื่อจริง ลบแอปถ้ามันเป็นวิธีเดียวของคุณครับ</p>
        </article>
      `,
  VI: `
        <article>
          <p>Bạn đã hoàn thành cây cú Duolingo. Bạn có chuỗi 500 ngày. Nhưng bạn có thể gọi cà phê ở Paris mà không hoảng loạn không? Chắc là không.</p>
          <h2>Cái bẫy Gamification</h2>
          <p>Các ứng dụng như Duolingo cho phép bạn cảm thấy như mình đang học mà không thực sự học. Họ tối ưu hóa cho <strong>sự tương tác</strong>, không phải sự trôi chảy. Dịch "Con gấu ăn quả táo" không giống như đang trò chuyện.</p>
          <h2>Cấp độ CEFR: Số liệu thực tế</h2>
          <p>Trình độ ngôn ngữ thực sự được đo bằng thang đo CEFR (A1 đến C2).</p>
          <ul>
            <li><strong>A1-A2 (Khách du lịch):</strong> Bạn có thể tồn tại. "Nhà vệ sinh ở đâu?"</li>
            <li><strong>B1-B2 (Độc lập):</strong> Bạn có thể làm việc và có bạn bè. Đây là nơi sự trôi chảy tồn tại.</li>
            <li><strong>C1-C2 (Thành thạo):</strong> Bạn có thể viết các bài báo học thuật.</li>
          </ul>
          <h2>Cách thoát khỏi ứng dụng</h2>
          <p>Sử dụng ứng dụng cho từ vựng, nhưng đừng coi chúng là món chính. Để đạt B1, bạn cần nói chuyện với con người và tiêu thụ phương tiện truyền thông thực tế. Xóa ứng dụng nếu đó là phương pháp duy nhất của bạn.</p>
        </article>
      `,
  ID: `
        <article>
          <p>Anda menyelesaikan pohon burung hantu Duolingo. Anda memiliki rekor 500 hari. Tapi bisakah Anda memesan kopi di Paris tanpa panik? Mungkin tidak.</p>
          <h2>Jebakan Gamifikasi</h2>
          <p>Aplikasi seperti Duolingo memungkinkan Anda merasa seperti sedang belajar tanpa benar-benar belajar. Mereka mengoptimalkan <strong>keterlibatan</strong>, bukan kefasihan. Menerjemahkan "Beruang memakan apel" tidak sama dengan melakukan percakapan.</p>
          <h2>Tingkat CEFR: Metrik Nyata</h2>
          <p>Kemahiran bahasa yang sebenarnya diukur dengan skala CEFR (A1 hingga C2).</p>
          <ul>
            <li><strong>A1-A2 (Turis):</strong> Anda bisa bertahan. "Di mana kamar mandi?"</li>
            <li><strong>B1-B2 (Mandiri):</strong> Anda bisa bekerja dan punya teman. Di sinilah kefasihan hidup.</li>
            <li><strong>C1-C2 (Penguasaan):</strong> Anda bisa menulis makalah akademis.</li>
          </ul>
          <h2>Cara Melarikan Diri dari Aplikasi</h2>
          <p>Gunakan aplikasi untuk kosakata, tapi berhenti memperlakukannya sebagai hidangan utama. Untuk mencapai B1, Anda perlu berbicara dengan manusia dan mengonsumsi media nyata. Hapus aplikasi jika itu satu-satunya metode Anda.</p>
        </article>
      `,
  PT: `
        <article>
          <p>Você terminou a árvore da coruja do Duolingo. Você tem uma ofensiva de 500 dias. Mas você consegue pedir um café em Paris sem entrar em pânico? Provavelmente não.</p>
          <h2>A Armadilha da Gamificação</h2>
          <p>Aplicativos como o Duolingo permitem que você sinta que está aprendendo sem realmente aprender. Eles otimizam para <strong>engajamento</strong>, não fluência. Traduzir "O urso come uma maçã" não é o mesmo que ter uma conversa.</p>
          <h2>Níveis CEFR: As Métricas Reais</h2>
          <p>A verdadeira proficiência no idioma é medida pela escala CEFR (A1 a C2).</p>
          <ul>
            <li><strong>A1-A2 (Turista):</strong> Você pode sobreviver. "Onde fica o banheiro?"</li>
            <li><strong>B1-B2 (Independente):</strong> Você pode trabalhar e ter amigos. É aqui que vive a fluência.</li>
            <li><strong>C1-C2 (Domínio):</strong> Você pode escrever artigos acadêmicos.</li>
          </ul>
          <h2>Como Escapar do Aplicativo</h2>
          <p>Use aplicativos para vocabulário, mas pare de tratá-los como o prato principal. Para chegar ao B1, você precisa falar com humanos e consumir mídia real. Exclua o aplicativo se for seu único método.</p>
        </article>
      `,
  TR: `
        <article>
          <p>Duolingo baykuş ağacını bitirdin. 500 günlük serin var. Ama Paris'te panik yapmadan kahve sipariş edebilir misin? Muhtemelen hayır.</p>
          <h2>Oyunlaştırma Tuzağı</h2>
          <p>Duolingo gibi uygulamalar, aslında öğrenmeden öğreniyormuşsun gibi hissetmeni sağlar. Akıcılık için değil, <strong>etkileşim</strong> için optimize ederler. "Ayı elma yer" cümlesini çevirmek, sohbet etmekle aynı şey değildir.</p>
          <h2>CEFR Seviyeleri: Gerçek Ölçümler</h2>
          <p>Gerçek dil yeterliliği CEFR ölçeği (A1 - C2) ile ölçülür.</p>
          <ul>
            <li><strong>A1-A2 (Turist):</strong> Hayatta kalabilirsin. "Tuvalet nerede?"</li>
            <li><strong>B1-B2 (Bağımsız):</strong> Çalışabilir ve arkadaş edinebilirsin. Akıcılığın yaşadığı yer burasıdır.</li>
            <li><strong>C1-C2 (Ustalık):</strong> Akademik makaleler yazabilirsin.</li>
          </ul>
          <h2>Uygulamadan Nasıl Kaçılır</h2>
          <p>Kelime bilgisi için uygulamaları kullan, ama onlara ana yemek muamelesi yapmayı bırak. B1'e ulaşmak için insanlarla konuşman ve gerçek medya tüketmen gerekir. Tek yöntemin buysa uygulamayı sil.</p>
        </article>
      `,
  AR: `
        <article>
          <p>لقد أنهيت شجرة بومة Duolingo. لديك سلسلة 500 يوم. ولكن هل يمكنك طلب قهوة في باريس دون ذعر؟ على الأرجح لا.</p>
          <h2>فخ التلعيب (Gamification)</h2>
          <p>تسمح لك تطبيقات مثل Duolingo بالشعور بأنك تتعلم دون أن تتعلم بالفعل. إنها مصممة من أجل <strong>المشاركة</strong>، وليس الطلاقة. ترجمة "الدب يأكل تفاحة" ليس مثل إجراء محادثة.</p>
          <h2>مستويات CEFR: المقاييس الحقيقية</h2>
          <p>تُقاس الكفاءة اللغوية الحقيقية بمقياس CEFR (من A1 إلى C2).</p>
          <ul>
            <li><strong>A1-A2 (سائح):</strong> يمكنك البقاء على قيد الحياة. "أين الحمام؟"</li>
            <li><strong>B1-B2 (مستقل):</strong> يمكنك العمل وتكوين صداقات. هذا هو المكان الذي تعيش فيه الطلاقة.</li>
            <li><strong>C1-C2 (إتقان):</strong> يمكنك كتابة أوراق بحثية أكاديمية.</li>
          </ul>
          <h2>كيف تهرب من التطبيق</h2>
          <p>استخدم التطبيقات للمفردات، ولكن توقف عن معاملتها كوجبة رئيسية. للوصول إلى B1، تحتاج إلى التحدث مع البشر واستهلاك وسائط حقيقية. احذف التطبيق إذا كان هو طريقتك الوحيدة.</p>
        </article>
      `,
  HI: `
        <article>
          <p>आपने Duolingo उल्लू का पेड़ पूरा कर लिया है। आपके पास 500 दिनों का स्ट्रीक है। लेकिन क्या आप पेरिस में बिना घबराए कॉफी ऑर्डर कर सकते हैं? शायद नहीं।</p>
          <h2>गेमिफिकेशन का जाल</h2>
          <p>Duolingo जैसे ऐप्स आपको यह महसूस कराते हैं कि आप वास्तव में सीखे बिना सीख रहे हैं। वे प्रवाह के लिए नहीं, बल्कि <strong>जुड़ाव (engagement)</strong> के लिए अनुकूलित हैं। "भालू सेब खाता है" का अनुवाद करना बातचीत करने जैसा नहीं है।</p>
          <h2>CEFR स्तर: असली मेट्रिक्स</h2>
          <p>असली भाषा दक्षता CEFR पैमाने (A1 से C2) द्वारा मापी जाती है।</p>
          <ul>
            <li><strong>A1-A2 (पर्यटक):</strong> आप जीवित रह सकते हैं। "बाथरूम कहाँ है?"</li>
            <li><strong>B1-B2 (स्वतंत्र):</strong> आप काम कर सकते हैं और दोस्त बना सकते हैं। यहीं प्रवाह रहता है।</li>
            <li><strong>C1-C2 (महारत):</strong> आप अकादमिक पेपर लिख सकते हैं।</li>
          </ul>
          <h2>ऐप से कैसे बचें</h2>
          <p>शब्दावली के लिए ऐप्स का उपयोग करें, लेकिन उन्हें मुख्य पाठ्यक्रम के रूप में मानना बंद करें। B1 तक पहुँचने के लिए, आपको इंसानों से बात करने और असली मीडिया का उपभोग करने की आवश्यकता है। अगर यह आपका एकमात्र तरीका है तो ऐप को डिलीट कर दें।</p>
        </article>
      `,
  RU: `
        <article>
          <p>Вы закончили дерево совы Duolingo. У вас 500-дневная серия. Но сможете ли вы заказать кофе в Париже без паники? Вероятно, нет.</p>
          <h2>Ловушка геймификации</h2>
          <p>Приложения, такие как Duolingo, позволяют вам чувствовать, что вы учитесь, не учась на самом деле. Они оптимизированы для <strong>вовлеченности</strong>, а не для беглости. Перевод фразы «Медведь ест яблоко» — это не то же самое, что и разговор.</p>
          <h2>Уровни CEFR: Реальные метрики</h2>
          <p>Настоящее владение языком измеряется по шкале CEFR (от A1 до C2).</p>
          <ul>
            <li><strong>A1-A2 (Турист):</strong> Вы можете выжить. «Где туалет?»</li>
            <li><strong>B1-B2 (Независимый):</strong> Вы можете работать и иметь друзей. Здесь живет беглость.</li>
            <li><strong>C1-C2 (Мастерство):</strong> Вы можете писать научные статьи.</li>
          </ul>
          <h2>Как сбежать из приложения</h2>
          <p>Используйте приложения для словарного запаса, но перестаньте относиться к ним как к основному блюду. Чтобы достичь уровня B1, вам нужно говорить с людьми и потреблять реальный контент. Удалите приложение, если это ваш единственный метод.</p>
        </article>
      `,
  BN: `
        <article>
          <p>আপনি Duolingo পেঁচার গাছ শেষ করেছেন। আপনার ৫০০ দিনের স্ট्रीক আছে। কিন্তু আপনি কি প্যারিসে আতঙ্কিত না হয়ে কফি অর্ডার করতে পারেন? সম্ভবত না।</p>
          <h2>গেমফিকেশনের ফাঁদ</h2>
          <p>Duolingo-এর মতো অ্যাপগুলি আপনাকে মনে করায় যে আপনি শিখছেন, আসলে না শিখেই। তারা <strong>এনগেজমেন্ট</strong>-এর, সাবলীলতার জন্য নয়। "ভালুক আপেল খায়" অনুবাদ করা আর কথোপকথন করা এক নয়।</p>
          <h2>CEFR স্তর: আসল পরিমাপ</h2>
          <p>আসল ভাষার দক্ষতা CEFR স্কেল (A1 থেকে C2) দ্বারা পরিমাপ করা হয়।</p>
          <ul>
            <li><strong>A1-A2 (পর্যটক):</strong> আপনি বেঁচে থাকতে পারবেন। "বাথরুম কোথায়?"</li>
            <li><strong>B1-B2 (স্বাধীন):</strong> আপনি কাজ করতে পারেন এবং বন্ধু বানাতে পারেন। এখানেই সাবলীলতা থাকে।</li>
            <li><strong>C1-C2 (দক্ষতা):</strong> আপনি একাডেমিক কাগজ লিখতে পারেন।</li>
          </ul>
          <h2>অ্যাপ থেকে পালানোর উপায়</h2>
          <p>শব্দভাণ্ডারের জন্য অ্যাপ ব্যবহার করুন, কিন্তু সেগুলিকে প্রধান খাবার হিসেবে মনে করা বন্ধ করুন। B1 এ পৌঁছাতে, আপনাকে মানুষের সাথে কথা বলতে হবে এবং আসল মিডিয়া ব্যবহার করতে হবে। অ্যাপটি যদি আপনার একমাত্র পদ্ধতি হয় তবে এটি মুছে ফেলুন।</p>
        </article>
      `,
  UR: `
        <article>
          <p>آپ نے Duolingo الو کا درخت مکمل کر لیا ہے۔ آپ کے پاس 500 دن کی اسٹریک ہے۔ لیکن کیا آپ پیرس میں گھبرائے بغیر کافی کا آرڈر دے سکتے ہیں? شاید نہیں۔</p>
          <h2>گیمفیکیشن کا جال</h2>
          <p>Duolingo جیسی ایپس آپ کو یہ محسوس کرنے دیتی ہیں کہ آپ سیکھ رہے ہیں بغیر اصل میں سیکھے۔ وہ <strong>مصروفیت</strong> کے لیے موزوں ہیں، روانی کے لیے نہیں۔ "ریچھ سیب کھاتا ہے" کا ترجمہ کرنا گفتگو کرنے جیسا نہیں ہے۔</p>
          <h2>CEFR لیولز: اصل میٹرکس</h2>
          <p>حقیقی زبان کی مہارت CEFR پیمانے (A1 سے C2) سے ناپی جاتی ہے۔</p>
          <ul>
            <li><strong>A1-A2 (سیاح):</strong> آپ زندہ رہ سکتے ہیں۔ "باتھ روم کہاں ہے؟"</li>
            <li><strong>B1-B2 (آزاد):</strong> آپ کام کر سکتے ہیں اور دوست بنا سکتے ہیں۔ یہیں روانی رہتی ہے۔</li>
            <li><strong>C1-C2 (مہارت):</strong> آپ تعلیمی مقالے لکھ سکتے ہیں۔</li>
          </ul>
          <h2>ایپ سے کیسے بچیں</h2>
          <p>الفاظ کے لیے ایپس کا استعمال کریں، لیکن انہیں مین کورس سمجھنا بند کریں۔ B1 تک پہنچنے کے لیے، آپ کو انسانوں سے بات کرنے اور اصلی میڈیا استعمال کرنے کی ضرورت ہے۔ ایپ کو ڈیلیٹ کر دیں اگر یہ آپ کا واحد طریقہ ہے۔</p>
        </article>
      `,
  NE: `
        <article>
          <p>तपाईंले Duolingo उल्लूको रूख पूरा गर्नुभयो। तपाईंसँग ५०० दिनको स्ट्रिक छ। तर के तपाईं पेरिसमा नडराइकन कफी अर्डर गर्न सक्नुहुन्छ? सायद सक्नुहुन्न।</p>
          <h2>गेमिफिकेशनको पासो</h2>
          <p>Duolingo जस्ता एपहरूले तपाईंलाई वास्तवमा नसिकिकन सिक्सिरहेको महसुस गराउँछन्। तिनीहरू <strong>संलग्नता</strong> को लागि अप्टिमाइज गर्छन्, प्रवाहको लागि होइन। "भालुले स्याउ खान्छ" अनुवाद गर्नु कुराकानी गर्नु जस्तै होइन।</p>
          <h2>CEFR स्तरहरू: वास्तविक मेट्रिक्स</h2>
          <p>वास्तविक भाषा दक्षता CEFR मापन (A1 देखि C2) द्वारा मापन गरिन्छ।</p>
          <ul>
            <li><strong>A1-A2 (पर्यटक):</strong> तपाईं बाँच्न सक्नुहुन्छ। "शौचालय कहाँ छ?"</li>
            <li><strong>B1-B2 (स्वतन्त्र):</strong> तपाईं काम गर्न र साथीहरू बनाउन सक्नुहुन्छ। यहाँ प्रवाह रहन्छ।</li>
            <li><strong>C1-C2 (निपुणता):</strong> तपाईं शैक्षिक पेपरहरू लेख्न सक्नुहुन्छ।</li>
          </ul>
          <h2>एपबाट कसरी बच्ने</h2>
          <p>शब्दावलीको लागि एपहरू प्रयोग गर्नुहोस्, तर तिनीहरूलाई मुख्य भोजनको रूपमा व्यवहार गर्न बन्द गर्नुहोस्। B1 पुग्न, तपाईंले मानिसहरूसँग कुरा गर्नुपर्छ र वास्तविक मिडिया उपभोग गर्नुपर्छ। यदि यो तपाईंको एकमात्र विधि हो भने एप हटाउनुहोस्।</p>
        </article>
      `,
  SI: `
        <article>
          <p>ඔබ Duolingo බකමූණ ගස අවසන් කළා. ඔබට දින 500ක අඛණ්ඩ වාර්තාවක් ඇත. නමුත් ඔබට පැරිසියේදී කලබල නොවී කෝපි එකක් ඇණවුම් කළ හැකිද? බොහෝ විට නොහැක.</p>
          <h2>Gamification උගුල</h2>
          <p>Duolingo වැනි යෙදුම් ඔබට ඇත්ත වශයෙන්ම ඉගෙන නොගෙන ඉගෙන ගන්නා බවක් දැනීමට ඉඩ සලසයි. ඔවුන් ප්‍රශස්ත කරන්නේ <strong>සම්බන්ධතාවය</strong> සඳහා මිස, චතුරභාවය සඳහා නොවේ. "වලහා ඇපල් ගෙඩියක් කයි" පරිවර්තනය කිරීම සංවාදයක් පැවැත්වීම හා සමාන නොවේ.</p>
          <h2>CEFR මට්ටම්: සැබෑ මිමි</h2>
          <p>සැබෑ භාෂා ප්‍රවීණතාවය CEFR පරිමාණයෙන් (A1 සිට C2 දක්වා) මනිනු ලැබේ.</p>
          <ul>
            <li><strong>A1-A2 (සංචාරක):</strong> ඔබට ජීවත් විය හැක. "වැසිකිළිය කොහෙද?"</li>
            <li><strong>B1-B2 (ස්වාධීන):</strong> ඔබට වැඩ කිරීමට සහ මිතුරන් ඇති කර ගත හැක. චතුරභාවය ඇත්තේ මෙතනය.</li>
            <li><strong>C1-C2 (ප්‍රවීණත්වය):</strong> ඔබට ශාස්ත්‍රීය ලිපි ලියන්න පුළුවන්.</li>
          </ul>
          <h2>යෙදුමෙන් ගැලවෙන්නේ කෙසේද</h2>
          <p>වචන මාලාව සඳහා යෙදුම් භාවිතා කරන්න, නමුත් ඒවා ප්‍රධාන ආහාර වේල ලෙස සැලකීම නවත්වන්න. B1 වෙත ළඟා වීමට, ඔබ මිනිසුන් සමඟ කතා කළ යුතු අතර සැබෑ මාධ්‍ය පරිභෝජනය කළ යුතුය. එය ඔබගේ එකම ක්‍රමය නම් යෙදුම මකා දමන්න.</p>
        </article>
      `,
  SW: `
        <article>
          <p>Umemaliza mti wa bundi wa Duolingo. Una mfululizo wa siku 500. Lakini je, unaweza kuagiza kahawa mjini Paris bila hofu? Pengine hapana.</p>
          <h2>Mtego wa Gamification</h2>
          <p>Programu kama Duolingo hukuruhusu kuhisi kama unajifunza bila kujifunza kweli. Wanaboresha kwa ajili ya <strong>ushiriki</strong>, si ufasaha. Kutafsiri "Dubu anakula tufaha" si sawa na kufanya mazungumzo.</p>
          <h2>Viwango vya CEFR: Vipimo Halisi</h2>
          <p>Umahiri halisi wa lugha hupimwa na kipimo cha CEFR (A1 hadi C2).</p>
          <ul>
            <li><strong>A1-A2 (Mtalii):</strong> Unaweza kuishi. "Choo kiko wapi?"</li>
            <li><strong>B1-B2 (Huru):</strong> Unaweza kufanya kazi na kuwa na marafiki. Hapa ndipo ufasaha unaishi.</li>
            <li><strong>C1-C2 (Umahiri):</strong> Unaweza kuandika makala za kitaaluma.</li>
          </ul>
          <h2>Jinsi ya Kutoroka Programu</h2>
          <p>Tumia programu kwa msamiati, lakini acha kuzichukulia kama chakula kikuu. Ili kufikia B1, unahitaji kuzungumza na binadamu na kutumia vyombo vya habari halisi. Futa programu ikiwa ni njia yako pekee.</p>
        </article>
      `
};

for (const [lang, newContent] of Object.entries(replacements)) {
  const variableName = `POST_SMART_CONTENT_${lang}`;
  // Regex matches: const POST_SMART_CONTENT_ES = `[any content]`;
  // We use [\s\S]*? for non-greedy match across lines
  const regex = new RegExp(`const ${variableName} = \`[\\s\\S]*?\`;`, 'g');
  
  if (!regex.test(content)) {
    console.warn(`Warning: Could not find definition for ${variableName}`);
    continue;
  }
  
  content = content.replace(regex, `const ${variableName} = \`${newContent}\`;`);
  console.log(`Updated ${variableName}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File update complete.');
