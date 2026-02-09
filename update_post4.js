
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scripts', 'blog-data-part6.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Define new content for Post 4 (Movies No Subtitles)
const newContentMap = {
  EN: `
        <article>
          <p>You’re watching *Squid Game*. You feel like you’re learning Korean. But if I turn off the subtitles, can you understand what they said? No. You were reading English, not listening to Korean.</p>
          <h2>The Subtitle Crutch</h2>
          <p>When subtitles are on, your brain chooses the path of least resistance: reading. It ignores the audio. You aren't training your ears; you're training your speed-reading skills.</p>
          <h2>The "Comprehensible Input" Trap</h2>
          <p>Stephen Krashen says we need input we can understand. But if the <em>understanding</em> comes from the text, the audio becomes background noise. To learn <strong>listening</strong>, the understanding must come from the <strong>sound</strong> (and context).</p>
          <h2>The Solution: The 3-Step Method</h2>
          <ol>
            <li><strong>Watch with Subs (L1):</strong> Understand the plot.</li>
            <li><strong>Watch with Subs (L2):</strong> Connect sounds to words.</li>
            <li><strong>Watch Raw (No Subs):</strong> This is where the magic happens. Your brain <em>must</em> listen to survive.</li>
          </ol>
          <h2>Conclusion</h2>
          <p>It’s painful at first. You will feel lost. But that struggle is your brain rewiring itself to process foreign sounds. Embrace the confusion.</p>
        </article>
      `,
  KO: `
        <article>
          <p>당신은 *오징어 게임*을 보고 있습니다. 한국어를 배우고 있다고 느끼죠. 하지만 자막을 끄면 그들이 무슨 말을 했는지 알아들을 수 있나요? 아니요. 당신은 한국어를 듣는 게 아니라 영어를 읽고 있었습니다.</p>
          <h2>자막이라는 목발</h2>
          <p>자막이 켜져 있으면 뇌는 가장 저항이 적은 경로인 '읽기'를 선택합니다. 오디오는 무시하죠. 당신은 귀를 훈련하는 게 아니라 속독 기술을 훈련하고 있는 겁니다.</p>
          <h2>'이해 가능한 입력'의 함정</h2>
          <p>스티븐 크라센은 우리가 이해할 수 있는 입력이 필요하다고 말합니다. 하지만 <em>이해</em>가 텍스트에서 나온다면, 오디오는 배경 소음이 됩니다. <strong>듣기</strong>를 배우려면, 이해는 <strong>소리</strong>(와 문맥)에서 나와야 합니다.</p>
          <h2>해결책: 3단계 방법</h2>
          <ol>
            <li><strong>자막과 함께 보기 (L1):</strong> 줄거리를 이해하세요.</li>
            <li><strong>자막과 함께 보기 (L2):</strong> 소리와 단어를 연결하세요.</li>
            <li><strong>생으로 보기 (자막 없음):</strong> 여기서 마법이 일어납니다. 당신의 뇌는 살아남기 위해 <em>들어야만</em> 합니다.</li>
          </ol>
          <h2>결론</h2>
          <p>처음에는 고통스럽습니다. 길을 잃은 기분이 들 겁니다. 하지만 그 투쟁이야말로 당신의 뇌가 외국어 소리를 처리하도록 재배선되는 과정입니다. 혼란을 받아들이세요.</p>
        </article>
      `,
  JA: `
        <article>
          <p>あなたは『イカゲーム』を見ています。韓国語を学んでいるような気分になります。でも字幕を消したら、彼らが何と言ったか理解できますか？いいえ。あなたは韓国語を聞いていたのではなく、英語を読んでいたのです。</p>
          <h2>字幕という松葉杖</h2>
          <p>字幕がオンになっていると、脳は最も抵抗の少ない道、「読むこと」を選びます。音声は無視されます。あなたは耳を鍛えているのではなく、速読スキルを鍛えているのです。</p>
          <h2>「理解可能なインプット」の罠</h2>
          <p>スティーブン・クラッシェンは、理解できるインプットが必要だと言います。しかし、<em>理解</em>がテキストから来るなら、音声は背景ノイズになります。<strong>リスニング</strong>を学ぶには、理解は<strong>音</strong>（と文脈）から来なければなりません。</p>
          <h2>解決策：3ステップ法</h2>
          <ol>
            <li><strong>字幕ありで見る（L1）：</strong> プロットを理解する。</li>
            <li><strong>字幕ありで見る（L2）：</strong> 音と単語を結びつける。</li>
            <li><strong>生で見る（字幕なし）：</strong> ここで魔法が起こります。あなたの脳は生き残るために<em>聞かなければ</em>なりません。</li>
          </ol>
          <h2>結論</h2>
          <p>最初は苦痛です。迷子になったように感じるでしょう。しかし、その葛藤こそが、外国語の音声を処理するために脳が再配線されている過程なのです。混乱を受け入れましょう。</p>
        </article>
      `,
  ZH: `
        <article>
          <p>你正在看《鱿鱼游戏》。你觉得自己正在学习韩语。但是如果我关掉字幕，你能听懂他们在说什么吗？不。你在读英语，而不是听韩语。</p>
          <h2>字幕的拐杖</h2>
          <p>当字幕开启时，你的大脑会选择阻力最小的路径：阅读。它会忽略音频。你不是在训练你的耳朵；你是在训练你的速读技能。</p>
          <h2>“可理解输入”的陷阱</h2>
          <p>斯蒂芬·克拉申说我们需要我们能理解的输入。但如果<em>理解</em>来自文本，音频就变成了背景噪音。要学习<strong>听力</strong>，理解必须来自<strong>声音</strong>（和语境）。</p>
          <h2>解决方案：三步法</h2>
          <ol>
            <li><strong>带字幕观看（L1）：</strong> 理解情节。</li>
            <li><strong>带字幕观看（L2）：</strong> 将声音与单词联系起来。</li>
            <li><strong>生肉观看（无字幕）：</strong> 这就是奇迹发生的地方。你的大脑为了生存<em>必须</em>去听。</li>
          </ol>
          <h2>结论</h2>
          <p>起初很痛苦。你会感到迷失。但那种挣扎正是你的大脑重新连接以处理外语声音的过程。拥抱困惑。</p>
        </article>
      `,
  ES: `
        <article>
          <p>Estás viendo *El juego del calamar*. Sientes que estás aprendiendo coreano. Pero si apago los subtítulos, ¿puedes entender lo que dijeron? No. Estabas leyendo inglés, no escuchando coreano.</p>
          <h2>La muleta de los subtítulos</h2>
          <p>Cuando los subtítulos están activados, tu cerebro elige el camino de menor resistencia: leer. Ignora el audio. No estás entrenando tus oídos; estás entrenando tus habilidades de lectura rápida.</p>
          <h2>La trampa de la "Entrada Comprensible"</h2>
          <p>Stephen Krashen dice que necesitamos una entrada que podamos entender. Pero si la <em>comprensión</em> proviene del texto, el audio se convierte en ruido de fondo. Para aprender a <strong>escuchar</strong>, la comprensión debe provenir del <strong>sonido</strong> (y el contexto).</p>
          <h2>La Solución: El Método de 3 Pasos</h2>
          <ol>
            <li><strong>Ver con subtítulos (L1):</strong> Entiende la trama.</li>
            <li><strong>Ver con subtítulos (L2):</strong> Conecta sonidos con palabras.</li>
            <li><strong>Ver sin editar (Sin subtítulos):</strong> Aquí es donde ocurre la magia. Tu cerebro <em>debe</em> escuchar para sobrevivir.</li>
          </ol>
          <h2>Conclusión</h2>
          <p>Al principio es doloroso. Te sentirás perdido. Pero esa lucha es tu cerebro recableándose para procesar sonidos extranjeros. Acepta la confusión.</p>
        </article>
      `,
  FR: `
        <article>
          <p>Vous regardez *Squid Game*. Vous avez l'impression d'apprendre le coréen. Mais si je désactive les sous-titres, pouvez-vous comprendre ce qu'ils ont dit ? Non. Vous lisiez l'anglais, vous n'écoutiez pas le coréen.</p>
          <h2>La béquille des sous-titres</h2>
          <p>Lorsque les sous-titres sont activés, votre cerveau choisit la voie de la moindre résistance : la lecture. Il ignore l'audio. Vous n'entraînez pas vos oreilles ; vous entraînez vos compétences en lecture rapide.</p>
          <h2>Le piège de l'"Entrée Compréhensible"</h2>
          <p>Stephen Krashen dit que nous avons besoin d'une entrée que nous pouvons comprendre. Mais si la <em>compréhension</em> vient du texte, l'audio devient un bruit de fond. Pour apprendre à <strong>écouter</strong>, la compréhension doit venir du <strong>son</strong> (et du contexte).</p>
          <h2>La Solution : La Méthode en 3 Étapes</h2>
          <ol>
            <li><strong>Regarder avec sous-titres (L1) :</strong> Comprendre l'intrigue.</li>
            <li><strong>Regarder avec sous-titres (L2) :</strong> Connecter les sons aux mots.</li>
            <li><strong>Regarder brut (Sans sous-titres) :</strong> C'est là que la magie opère. Votre cerveau <em>doit</em> écouter pour survivre.</li>
          </ol>
          <h2>Conclusion</h2>
          <p>C'est douloureux au début. Vous vous sentirez perdu. Mais cette lutte est votre cerveau qui se recâble pour traiter les sons étrangers. Embrassez la confusion.</p>
        </article>
      `,
  DE: `
        <article>
          <p>Du schaust *Squid Game*. Du hast das Gefühl, Koreanisch zu lernen. Aber wenn ich die Untertitel ausschalte, kannst du verstehen, was sie gesagt haben? Nein. Du hast Englisch gelesen, nicht Koreanisch gehört.</p>
          <h2>Die Untertitel-Krücke</h2>
          <p>Wenn Untertitel eingeschaltet sind, wählt dein Gehirn den Weg des geringsten Widerstands: Lesen. Es ignoriert das Audio. Du trainierst nicht deine Ohren; du trainierst deine Schnelllesefähigkeiten.</p>
          <h2>Die "Verständlicher Input"-Falle</h2>
          <p>Stephen Krashen sagt, wir brauchen Input, den wir verstehen können. Aber wenn das <em>Verständnis</em> aus dem Text kommt, wird das Audio zu Hintergrundgeräuschen. Um <strong>Hören</strong> zu lernen, muss das Verständnis aus dem <strong>Klang</strong> (und dem Kontext) kommen.</p>
          <h2>Die Lösung: Die 3-Schritte-Methode</h2>
          <ol>
            <li><strong>Mit Untertiteln schauen (L1):</strong> Die Handlung verstehen.</li>
            <li><strong>Mit Untertiteln schauen (L2):</strong> Klänge mit Wörtern verbinden.</li>
            <li><strong>Roh schauen (Keine Untertitel):</strong> Hier passiert die Magie. Dein Gehirn <em>muss</em> zuhören, um zu überleben.</li>
          </ol>
          <h2>Fazit</h2>
          <p>Es ist anfangs schmerzhaft. Du wirst dich verloren fühlen. Aber dieser Kampf ist dein Gehirn, das sich neu verdrahtet, um fremde Klänge zu verarbeiten. Umarme die Verwirrung.</p>
        </article>
      `,
  TH: `
        <article>
          <p>คุณกำลังดู *Squid Game* คุณรู้สึกเหมือนกำลังเรียนภาษาเกาหลี แต่ถ้าฉันปิดซับไตเติ้ล คุณจะเข้าใจสิ่งที่พวกเขาพูดไหม? ไม่ครับ คุณกำลังอ่านภาษาอังกฤษ ไม่ได้ฟังภาษาเกาหลี</p>
          <h2>ไม้ค้ำยันที่เรียกว่าซับไตเติ้ล</h2>
          <p>เมื่อเปิดซับไตเติ้ล สมองของคุณจะเลือกเส้นทางที่ต้านทานน้อยที่สุด: การอ่าน มันละเลยเสียง คุณไม่ได้ฝึกหูของคุณ; คุณกำลังฝึกทักษะการอ่านเร็วของคุณ</p>
          <h2>กับดัก "ข้อมูลที่เข้าใจได้"</h2>
          <p>Stephen Krashen บอกว่าเราต้องการข้อมูลที่เราเข้าใจได้ แต่ถ้า <em>ความเข้าใจ</em> มาจากข้อความ เสียงจะกลายเป็นเสียงรบกวนพื้นหลัง เพื่อเรียนรู้การ<strong>ฟัง</strong> ความเข้าใจต้องมาจาก<strong>เสียง</strong> (และบริบท)</p>
          <h2>ทางแก้: วิธี 3 ขั้นตอน</h2>
          <ol>
            <li><strong>ดูพร้อมซับ (L1):</strong> เข้าใจพล็อตเรื่อง</li>
            <li><strong>ดูพร้อมซับ (L2):</strong> เชื่อมโยงเสียงกับคำ</li>
            <li><strong>ดูแบบดิบๆ (ไม่มีซับ):</strong> นี่คือที่ที่เวทมนตร์เกิดขึ้น สมองของคุณ <em>ต้อง</em> ฟังเพื่อความอยู่รอด</li>
          </ol>
          <h2>บทสรุป</h2>
          <p>มันเจ็บปวดในตอนแรก คุณจะรู้สึกหลงทาง แต่ความดิ้นรนนั้นคือการที่สมองของคุณกำลังเชื่อมต่อใหม่เพื่อประมวลผลเสียงต่างประเทศ โอบกอดความสับสนนั้นไว้ครับ</p>
        </article>
      `,
  VI: `
        <article>
          <p>Bạn đang xem *Squid Game*. Bạn cảm thấy như mình đang học tiếng Hàn. Nhưng nếu tôi tắt phụ đề, bạn có hiểu họ nói gì không? Không. Bạn đang đọc tiếng Anh, không phải nghe tiếng Hàn.</p>
          <h2>Cái nạng Phụ đề</h2>
          <p>Khi bật phụ đề, não của bạn chọn con đường ít kháng cự nhất: đọc. Nó bỏ qua âm thanh. Bạn không đang rèn luyện đôi tai của mình; bạn đang rèn luyện kỹ năng đọc nhanh của mình.</p>
          <h2>Cái bẫy "Đầu vào Dễ hiểu"</h2>
          <p>Stephen Krashen nói rằng chúng ta cần đầu vào mà chúng ta có thể hiểu được. Nhưng nếu <em>sự hiểu biết</em> đến từ văn bản, âm thanh sẽ trở thành tiếng ồn nền. Để học <strong>nghe</strong>, sự hiểu biết phải đến từ <strong>âm thanh</strong> (và ngữ cảnh).</p>
          <h2>Giải pháp: Phương pháp 3 Bước</h2>
          <ol>
            <li><strong>Xem với Phụ đề (L1):</strong> Hiểu cốt truyện.</li>
            <li><strong>Xem với Phụ đề (L2):</strong> Kết nối âm thanh với từ ngữ.</li>
            <li><strong>Xem thô (Không phụ đề):</strong> Đây là nơi phép màu xảy ra. Bộ não của bạn <em>phải</em> nghe để tồn tại.</li>
          </ol>
          <h2>Kết luận</h2>
          <p>Lúc đầu thật đau đớn. Bạn sẽ cảm thấy lạc lõng. Nhưng cuộc đấu tranh đó là bộ não của bạn đang tự điều chỉnh để xử lý những âm thanh lạ. Hãy đón nhận sự bối rối.</p>
        </article>
      `,
  ID: `
        <article>
          <p>Anda sedang menonton *Squid Game*. Anda merasa seperti sedang belajar bahasa Korea. Tapi jika saya mematikan subtitle, bisakah Anda mengerti apa yang mereka katakan? Tidak. Anda membaca bahasa Inggris, bukan mendengarkan bahasa Korea.</p>
          <h2>Tongkat Penyangga Subtitle</h2>
          <p>Saat subtitle aktif, otak Anda memilih jalan yang paling sedikit hambatannya: membaca. Ia mengabaikan audio. Anda tidak melatih telinga Anda; Anda melatih keterampilan membaca cepat Anda.</p>
          <h2>Jebakan "Input yang Dapat Dipahami"</h2>
          <p>Stephen Krashen mengatakan kita membutuhkan input yang dapat kita pahami. Tapi jika <em>pemahaman</em> berasal dari teks, audio menjadi kebisingan latar belakang. Untuk belajar <strong>mendengarkan</strong>, pemahaman harus berasal dari <strong>suara</strong> (dan konteks).</p>
          <h2>Solusi: Metode 3 Langkah</h2>
          <ol>
            <li><strong>Tonton dengan Subtitle (L1):</strong> Pahami alur ceritanya.</li>
            <li><strong>Tonton dengan Subtitle (L2):</strong> Hubungkan suara dengan kata-kata.</li>
            <li><strong>Tonton Mentah (Tanpa Subtitle):</strong> Di sinilah keajaiban terjadi. Otak Anda <em>harus</em> mendengarkan untuk bertahan hidup.</li>
          </ol>
          <h2>Kesimpulan</h2>
          <p>Awalnya menyakitkan. Anda akan merasa tersesat. Tapi perjuangan itu adalah otak Anda yang sedang menyambungkan kembali dirinya untuk memproses suara asing. Rangkullah kebingungan itu.</p>
        </article>
      `,
  PT: `
        <article>
          <p>Você está assistindo *Round 6*. Você sente que está aprendendo coreano. Mas se eu desligar as legendas, você consegue entender o que eles disseram? Não. Você estava lendo inglês, não ouvindo coreano.</p>
          <h2>A Muleta da Legenda</h2>
          <p>Quando as legendas estão ligadas, seu cérebro escolhe o caminho de menor resistência: ler. Ele ignora o áudio. Você não está treinando seus ouvidos; você está treinando suas habilidades de leitura dinâmica.</p>
          <h2>A Armadilha da "Entrada Compreensível"</h2>
          <p>Stephen Krashen diz que precisamos de entrada que possamos entender. Mas se a <em>compreensão</em> vem do texto, o áudio se torna ruído de fundo. Para aprender a <strong>ouvir</strong>, a compreensão deve vir do <strong>som</strong> (e contexto).</p>
          <h2>A Solução: O Método de 3 Passos</h2>
          <ol>
            <li><strong>Assistir com Legendas (L1):</strong> Entenda o enredo.</li>
            <li><strong>Assistir com Legendas (L2):</strong> Conecte sons a palavras.</li>
            <li><strong>Assistir Puro (Sem Legendas):</strong> É aqui que a mágica acontece. Seu cérebro <em>deve</em> ouvir para sobreviver.</li>
          </ol>
          <h2>Conclusão</h2>
          <p>É doloroso no começo. Você se sentirá perdido. Mas essa luta é seu cérebro se reconfigurando para processar sons estrangeiros. Abrace a confusão.</p>
        </article>
      `,
  TR: `
        <article>
          <p>*Squid Game* izliyorsunuz. Korece öğrendiğinizi hissediyorsunuz. Ama altyazıları kapatırsam, ne dediklerini anlayabilir misiniz? Hayır. İngilizce okuyordunuz, Korece dinlemiyordunuz.</p>
          <h2>Altyazı Koltuk Değneği</h2>
          <p>Altyazılar açık olduğunda, beyniniz en az dirençli yolu seçer: okumak. Sesi görmezden gelir. Kulaklarınızı eğitmiyorsunuz; hızlı okuma becerilerinizi eğitiyorsunuz.</p>
          <h2>"Anlaşılabilir Girdi" Tuzağı</h2>
          <p>Stephen Krashen, anlayabileceğimiz girdiye ihtiyacımız olduğunu söylüyor. Ama <em>anlama</em> metinden geliyorsa, ses arka plan gürültüsü olur. <strong>Dinlemeyi</strong> öğrenmek için, anlayış <strong>sesten</strong> (ve bağlamdan) gelmelidir.</p>
          <h2>Çözüm: 3 Adımlı Yöntem</h2>
          <ol>
            <li><strong>Altyazılı İzle (L1):</strong> Konuyu anla.</li>
            <li><strong>Altyazılı İzle (L2):</strong> Sesleri kelimelere bağla.</li>
            <li><strong>Ham İzle (Altyazısız):</strong> Sihrin gerçekleştiği yer burasıdır. Beyniniz hayatta kalmak için <em>dinlemelidir</em>.</li>
          </ol>
          <h2>Sonuç</h2>
          <p>Başlangıçta acı vericidir. Kaybolmuş hissedeceksiniz. Ama bu mücadele, beyninizin yabancı sesleri işlemek için kendini yeniden yapılandırmasıdır. Karmaşayı kucaklayın.</p>
        </article>
      `,
  AR: `
        <article>
          <p>أنت تشاهد *Squid Game*. تشعر وكأنك تتعلم الكورية. ولكن إذا أطفأت الترجمة، هل يمكنك فهم ما قالوه؟ لا. كنت تقرأ الإنجليزية، وليس تستمع إلى الكورية.</p>
          <h2>عكاز الترجمة</h2>
          <p>عندما تكون الترجمة قيد التشغيل، يختار دماغك المسار الأقل مقاومة: القراءة. يتجاهل الصوت. أنت لا تدرب أذنيك؛ أنت تدرب مهارات القراءة السريعة لديك.</p>
          <h2>فخ "المدخلات المفهومة"</h2>
          <p>يقول ستيفن كراشين أننا بحاجة إلى مدخلات يمكننا فهمها. ولكن إذا كان <em>الفهم</em> يأتي من النص، يصبح الصوت ضوضاء خلفية. لتعلم <strong>الاستماع</strong>، يجب أن يأتي الفهم من <strong>الصوت</strong> (والسياق).</p>
          <h2>الحل: طريقة الخطوات الثلاث</h2>
          <ol>
            <li><strong>شاهد مع ترجمة (L1):</strong> افهم الحبكة.</li>
            <li><strong>شاهد مع ترجمة (L2):</strong> اربط الأصوات بالكلمات.</li>
            <li><strong>شاهد خام (بدون ترجمة):</strong> هنا يحدث السحر. <em>يجب</em> على دماغك الاستماع للبقاء على قيد الحياة.</li>
          </ol>
          <h2>الخاتمة</h2>
          <p>إنه مؤلم في البداية. ستشعر بالضياع. لكن هذا النضال هو إعادة توصيل دماغك لنفسه لمعالجة الأصوات الأجنبية. تقبل الارتباك.</p>
        </article>
      `,
  HI: `
        <article>
          <p>आप *Squid Game* देख रहे हैं। आपको लगता है कि आप कोरियाई सीख रहे हैं। लेकिन अगर मैं उपशीर्षक बंद कर दूँ, तो क्या आप समझ सकते हैं कि उन्होंने क्या कहा? नहीं। आप अंग्रेजी पढ़ रहे थे, कोरियाई सुन नहीं रहे थे।</p>
          <h2>उपशीर्षक बैसाखी</h2>
          <p>जब उपशीर्षक चालू होते हैं, तो आपका मस्तिष्क सबसे कम प्रतिरोध का रास्ता चुनता है: पढ़ना। यह ऑडियो की उपेक्षा करता है। आप अपने कानों को प्रशिक्षित नहीं कर रहे हैं; आप अपने गति-पढ़ने के कौशल को प्रशिक्षित कर रहे हैं।</p>
          <h2>"बोधगम्य इनपुट" जाल</h2>
          <p>स्टीफन क्रैशन का कहना है कि हमें ऐसे इनपुट की आवश्यकता है जिसे हम समझ सकें। लेकिन अगर <em>समझ</em> पाठ से आती है, तो ऑडियो पृष्ठभूमि शोर बन जाता है। <strong>सुनना</strong> सीखने के लिए, समझ <strong>ध्वनि</strong> (और संदर्भ) से आनी चाहिए।</p>
          <h2>समाधान: 3-चरणीय विधि</h2>
          <ol>
            <li><strong>उपशीर्षक के साथ देखें (L1):</strong> कथानक को समझें।</li>
            <li><strong>उपशीर्षक के साथ देखें (L2):</strong> ध्वनियों को शब्दों से जोड़ें।</li>
            <li><strong>कच्चा देखें (कोई उपशीर्षक नहीं):</strong> यहीं जादू होता है। आपके मस्तिष्क को जीवित रहने के लिए <em>सुनना</em> होगा।</li>
          </ol>
          <h2>निष्कर्ष</h2>
          <p>यह शुरू में दर्दनाक है। आप खोया हुआ महसूस करेंगे। लेकिन वह संघर्ष आपके मस्तिष्क का विदेशी ध्वनियों को संसाधित करने के लिए खुद को फिर से तार-तार करना है। भ्रम को गले लगाओ।</p>
        </article>
      `,
  RU: `
        <article>
          <p>Вы смотрите *Игру в кальмара*. Вам кажется, что вы учите корейский. Но если я выключу субтитры, сможете ли вы понять, что они сказали? Нет. Вы читали по-английски, а не слушали по-корейски.</p>
          <h2>Костыль субтитров</h2>
          <p>Когда субтитры включены, ваш мозг выбирает путь наименьшего сопротивления: чтение. Он игнорирует аудио. Вы не тренируете уши; вы тренируете навыки скорочтения.</p>
          <h2>Ловушка «понятного ввода»</h2>
          <p>Стивен Крашен говорит, что нам нужен ввод, который мы можем понять. Но если <em>понимание</em> исходит из текста, аудио становится фоновым шумом. Чтобы научиться <strong>слушать</strong>, понимание должно исходить из <strong>звука</strong> (и контекста).</p>
          <h2>Решение: 3-шаговый метод</h2>
          <ol>
            <li><strong>Смотреть с субтитрами (L1):</strong> Понять сюжет.</li>
            <li><strong>Смотреть с субтитрами (L2):</strong> Связать звуки со словами.</li>
            <li><strong>Смотреть в оригинале (Без субтитров):</strong> Здесь происходит магия. Ваш мозг <em>должен</em> слушать, чтобы выжить.</li>
          </ol>
          <h2>Заключение</h2>
          <p>Сначала это больно. Вы будете чувствовать себя потерянным. Но эта борьба — это перестройка вашего мозга для обработки иностранных звуков. Примите замешательство.</p>
        </article>
      `,
  BN: `
        <article>
          <p>আপনি *স্কুইড গেম* দেখছেন। আপনার মনে হচ্ছে আপনি কোরিয়ান শিখছেন। কিন্তু আমি যদি সাবটাইটেল বন্ধ করে দিই, তবে তারা কী বলেছিল তা কি আপনি বুঝতে পারবেন? না। আপনি ইংরেজি পড়ছিলেন, কোরিয়ান শুনছিলেন না।</p>
          <h2>সাবটাইটেল ক্রাচ</h2>
          <p>যখন সাবটাইটেল চালু থাকে, তখন আপনার মস্তিষ্ক সবচেয়ে কম প্রতিরোধের পথ বেছে নেয়: পড়া। এটি অডিও উপেক্ষা করে। আপনি আপনার কানকে প্রশিক্ষণ দিচ্ছেন না; আপনি আপনার দ্রুত পড়ার দক্ষতাকে প্রশিক্ষণ দিচ্ছেন।</p>
          <h2>"বোধগম্য ইনপুট" ফাঁদ</h2>
          <p>স্টিফেন ক্রাশেন বলেছেন যে আমাদের এমন ইনপুট দরকার যা আমরা বুঝতে পারি। কিন্তু যদি <em>বোঝা</em> পাঠ্য থেকে আসে, তবে অডিওটি পটভূমির শব্দ হয়ে যায়। <strong>শোনা</strong> শিখতে, বোঝা অবশ্যই <strong>শব্দ</strong> (এবং প্রসঙ্গ) থেকে আসতে হবে।</p>
          <h2>সমাধান: ৩-ধাপ পদ্ধতি</h2>
          <ol>
            <li><strong>সাব সহ দেখুন (L1):</strong> প্লট বুঝুন।</li>
            <li><strong>সাব সহ দেখুন (L2):</strong> শব্দের সাথে শব্দ সংযুক্ত করুন।</li>
            <li><strong>র দেখুন (কোন সাব নেই):</strong> এখানেই জাদু ঘটে। আপনার মস্তিষ্ককে বেঁচে থাকার জন্য <em>শুনতে</em> হবে।</li>
          </ol>
          <h2>উপসংহার</h2>
          <p>প্রথমে এটি বেদনাদায়ক। আপনি হারিয়ে যাওয়া অনুভব করবেন। কিন্তু সেই সংগ্রাম হল আপনার মস্তিষ্ক বিদেশী শব্দ প্রক্রিয়া করার জন্য নিজেকে পুনরায় তারযুক্ত করা। বিভ্রান্তিকে আলিঙ্গন করুন।</p>
        </article>
      `,
  UR: `
        <article>
          <p>آپ *Squid Game* دیکھ رہے ہیں۔ آپ کو لگتا ہے کہ آپ کورین سیکھ رہے ہیں۔ لیکن اگر میں سب ٹائٹلز بند کر دوں تو کیا آپ سمجھ سکتے ہیں کہ انہوں نے کیا کہا؟ نہیں۔ آپ انگریزی پڑھ رہے تھے، کورین سن نہیں رہے تھے۔</p>
          <h2>سب ٹائٹل بیساکھی</h2>
          <p>جب سب ٹائٹلز آن ہوتے ہیں، تو آپ کا دماغ کم سے کم مزاحمت کا راستہ منتخب کرتا ہے: پڑھنا۔ یہ آڈیو کو نظر انداز کرتا ہے۔ آپ اپنے کانوں کو تربیت نہیں دے رہے ہیں؛ آپ اپنی اسپیڈ ریڈنگ کی مہارت کو تربیت دے رہے ہیں۔</p>
          <h2>"قابل فہم ان پٹ" جال</h2>
          <p>اسٹیفن کرشین کا کہنا ہے کہ ہمیں ایسے ان پٹ کی ضرورت ہے جسے ہم سمجھ سکیں۔ لیکن اگر <em>سمجھ</em> متن سے آتی ہے، تو آڈیو پس منظر کا شور بن جاتا ہے۔ <strong>سننا</strong> سیکھنے کے لیے، سمجھ <strong>آواز</strong> (اور سیاق و سباق) سے آنی چاہیے۔</p>
          <h2>حل: 3-مرحلہ طریقہ</h2>
          <ol>
            <li><strong>سبز کے ساتھ دیکھیں (L1):</strong> پلاٹ کو سمجھیں۔</li>
            <li><strong>سبز کے ساتھ دیکھیں (L2):</strong> آوازوں کو الفاظ سے جوڑیں۔</li>
            <li><strong>خام دیکھیں (کوئی سبز نہیں):</strong> یہیں جادو ہوتا ہے۔ آپ کے دماغ کو زندہ رہنے کے لیے <em>سننا</em> ہوگا۔</li>
          </ol>
          <h2>نتیجہ</h2>
          <p>یہ شروع میں تکلیف دہ ہے۔ آپ کھویا ہوا محسوس کریں گے۔ لیکن وہ جدوجہد آپ کے دماغ کا غیر ملکی آوازوں پر عمل کرنے کے لیے خود کو دوبارہ وائر کرنا ہے۔ الجھن کو گلے لگائیں۔</p>
        </article>
      `,
  NE: `
        <article>
          <p>तपाईं *Squid Game* हेर्दै हुनुहुन्छ। तपाईंलाई लाग्छ कि तपाईं कोरियाली सिक्दै हुनुहुन्छ। तर यदि मैले उपशीर्षकहरू बन्द गरेँ भने, के तपाईंले उनीहरूले के भने भनेर बुझ्न सक्नुहुन्छ? होइन। तपाईं अंग्रेजी पढ्दै हुनुहुन्थ्यो, कोरियाली सुन्दै हुनुहुन्न थियो।</p>
          <h2>उपशीर्षक बैसाखी</h2>
          <p>जब उपशीर्षकहरू अन हुन्छन्, तपाईंको दिमागले कम्तिमा प्रतिरोधको बाटो रोज्छ: पढ्ने। यसले अडियोलाई बेवास्ता गर्छ। तपाईं आफ्नो कानलाई तालिम दिइरहनुभएको छैन; तपाईं आफ्नो गति-पढ्ने कौशललाई तालिम दिइरहनुभएको छ।</p>
          <h2>"बोधगम्य इनपुट" पासो</h2>
          <p>स्टीफन क्र्यासेन भन्छन् कि हामीलाई इनपुट चाहिन्छ जुन हामीले बुझ्न सक्छौं। तर यदि <em>बुझाइ</em> पाठबाट आउँछ भने, अडियो पृष्ठभूमि शोर बन्छ। <strong>सुन्न</strong> सिक्नको लागि, बुझाइ <strong>ध्वनि</strong> (र सन्दर्भ) बाट आउनुपर्छ।</p>
          <h2>समाधान: ३-चरण विधि</h2>
          <ol>
            <li><strong>सब्ससँग हेर्नुहोस् (L1):</strong> कथानक बुझ्नुहोस्।</li>
            <li><strong>सब्ससँग हेर्नुहोस् (L2):</strong> ध्वनिहरूलाई शब्दहरूसँग जोड्नुहोस्।</li>
            <li><strong>काँचो हेर्नुहोस् (कुनै सब्स छैन):</strong> यहीं जादु हुन्छ। तपाईंको दिमागले बाँच्नको लागि <em>सुन्नै पर्छ</em>।</li>
          </ol>
          <h2>निष्कर्ष</h2>
          <p>यो सुरुमा पीडादायी छ। तपाईं हराएको महसुस गर्नुहुनेछ। तर त्यो संघर्ष भनेको तपाईंको दिमागले विदेशी ध्वनिहरू प्रशोधन गर्न आफैलाई पुन: तार गर्नु हो। भ्रमलाई अँगाल्नुहोस्।</p>
        </article>
      `,
  SI: `
        <article>
          <p>ඔබ *Squid Game* නරඹමින් සිටී. ඔබ කොරියානු භාෂාව ඉගෙන ගන්නා බව ඔබට හැඟේ. නමුත් මම උපසිරැසි ක්‍රියා විරහිත කළහොත්, ඔවුන් පැවසූ දේ ඔබට තේරුම් ගත හැකිද? නැත. ඔබ ඉංග්‍රීසි කියවමින් සිටියා මිස කොරියානු භාෂාවට සවන් දුන්නේ නැත.</p>
          <h2>උපසිරැසි කිහිලිකරුව</h2>
          <p>උපසිරැසි ක්‍රියාත්මක වන විට, ඔබේ මොළය අවම ප්‍රතිරෝධයේ මාවත තෝරා ගනී: කියවීම. එය ශ්‍රව්‍ය නොසලකා හරියි. ඔබ ඔබේ කන් පුහුණු කරන්නේ නැත; ඔබ ඔබේ වේගයෙන් කියවීමේ කුසලතා පුහුණු කරයි.</p>
          <h2>"තේරුම් ගත හැකි ආදාන" උගුල</h2>
          <p>Stephen Krashen පවසන්නේ අපට තේරුම් ගත හැකි ආදානය අවශ්‍ය බවයි. නමුත් <em>තේරුම් ගැනීම</em> පැමිණෙන්නේ පෙළෙන් නම්, ශ්‍රව්‍ය පසුබිම් ශබ්දයක් බවට පත්වේ. <strong>සවන්දීම</strong> ඉගෙන ගැනීමට, අවබෝධය <strong>ශබ්දයෙන්</strong> (සහ සන්දර්භය) පැමිණිය යුතුය.</p>
          <h2>විසඳුම: පියවර 3 ක්‍රමය</h2>
          <ol>
            <li><strong>උපසිරැසි සමඟ නරඹන්න (L1):</strong> කතාව තේරුම් ගන්න.</li>
            <li><strong>උපසිරැසි සමඟ නරඹන්න (L2):</strong> ශබ්ද වචනවලට සම්බන්ධ කරන්න.</li>
            <li><strong>Raw නරඹන්න (උපසිරැසි නැත):</strong> මැජික් සිදු වන්නේ මෙතැනයි. ඔබේ මොළයට ජීවත් වීමට <em>සවන් දීමට</em> සිදුවේ.</li>
          </ol>
          <h2>නිගමනය</h2>
          <p>එය මුලදී වේදනාකාරී ය. ඔබට අතරමං වූ බවක් දැනෙනු ඇත. නමුත් එම අරගලය විදේශීය ශබ්ද සැකසීම සඳහා ඔබේ මොළය නැවත සකස් කිරීමයි. ව්යාකූලත්වය වැළඳ ගන්න.</p>
        </article>
      `,
  SW: `
        <article>
          <p>Unatazama *Squid Game*. Unahisi kama unajifunza Kikorea. Lakini nikizima manukuu, unaweza kuelewa walichosema? Hapana. Ulikuwa unasoma Kiingereza, husikilizi Kikorea.</p>
          <h2>Haina ya Manukuu</h2>
          <p>Manukuu yamewashwa, ubongo wako huchagua njia ya upinzani mdogo: kusoma. Inapuuza sauti. Hufunzi masikio yako; unafunza ujuzi wako wa kusoma kwa kasi.</p>
          <h2>Mtego wa "Ingizo Inayoeleweka"</h2>
          <p>Stephen Krashen anasema tunahitaji mchango tunaoweza kuelewa. Lakini ikiwa <em>uelewa</em> unatokana na maandishi, sauti inakuwa kelele ya chinichini. Ili kujifunza <strong>kusikiliza</strong>, uelewa lazima utoke kwa <strong>sauti</strong> (na muktadha).</p>
          <h2>Suluhisho: Mbinu ya Hatua 3</h2>
          <ol>
            <li><strong>Tazama na Subs (L1):</strong> Elewa njama.</li>
            <li><strong>Tazama na Subs (L2):</strong> Unganisha sauti na maneno.</li>
            <li><strong>Tazama Ghafi (Hakuna Subs):</strong> Hapa ndipo maajabu hufanyika. Ubongo wako <em>lazima</em> usikilize ili kuishi.</li>
          </ol>
          <h2>Hitimisho</h2>
          <p>Inauma mwanzoni. Utahisi kupotea. Lakini pambano hilo ni ubongo wako kujirekebisha ili kuchakata sauti za kigeni. Kubali mkanganyiko.</p>
        </article>
      `
};

// 2. Replace constant definitions (POST_PARTNER -> POST_NO_SUBTITLES)
for (const [lang, newContent] of Object.entries(newContentMap)) {
  const oldVarName = `const POST_PARTNER_CONTENT_${lang}`;
  const newVarName = `const POST_NO_SUBTITLES_CONTENT_${lang}`;
  
  // Regex to find the old variable definition and replace it with the new one
  const regex = new RegExp(`${oldVarName} = \`[\\s\\S]*?\`;`, 'g');
  
  if (regex.test(content)) {
    content = content.replace(regex, `${newVarName} = \`${newContent}\`;`);
    console.log(`Replaced ${oldVarName} with ${newVarName}`);
  } else {
    console.warn(`Warning: Could not find ${oldVarName}`);
  }
}

// 3. Update the blog post object in the array
// We look for the object with id: "find-language-partner"
const postObjectRegex = /{\s*id: "find-language-partner"[\s\S]*?content: \{[\s\S]*?\},[\s\S]*?updatedAt: new Date\("2024-02-12"\)\s*},/g;

const newPostObject = `{
      id: "movies-no-subtitles",
      title: { 
        en: "How to Actually Learn with Movies (Stop Reading Subtitles)", 
        ko: "영화로 진짜 배우는 법 (자막 좀 그만 읽으세요)",
        ja: "映画で実際に学ぶ方法（字幕を読むのをやめて）",
        zh: "如何真正通过电影学习（停止阅读字幕）",
        es: "Cómo aprender realmente con películas (Deja de leer subtítulos)",
        fr: "Comment apprendre vraiment avec des films (Arrêtez de lire les sous-titres)",
        de: "Wie man mit Filmen wirklich lernt (Hör auf, Untertitel zu lesen)",
        th: "วิธีเรียนกับหนังให้ได้ผลจริง (เลิกอ่านซับไตเติ้ล)",
        vi: "Cách thực sự học với phim (Ngừng đọc phụ đề)",
        id: "Cara Benar-benar Belajar dengan Film (Berhenti Membaca Subtitle)",
        pt: "Como realmente aprender com filmes (Pare de ler legendas)",
        tr: "Filmlerle Gerçekten Nasıl Öğrenilir (Altyazıları Okumayı Bırakın)",
        ar: "كيف تتعلم بالفعل مع الأفلام (توقف عن قراءة الترجمة)",
        hi: "फिल्मों के साथ वास्तव में कैसे सीखें (उपशीर्षक पढ़ना बंद करें)",
        ru: "Как на самом деле учиться по фильмам (Престаньте читать субтитры)",
        bn: "সিনেমার মাধ্যমে আসলে কীভাবে শিখবেন (সাবটাইটেল পড়া বন্ধ করুন)",
        ur: "فلموں کے ساتھ واقعی کیسے سیکھیں (سب ٹائٹلز پڑھنا بند کریں)",
        ne: "चलचित्रहरूसँग वास्तवमा कसरी सिक्ने (उपशीर्षकहरू पढ्न बन्द गर्नुहोस्)",
        si: "චිත්‍රපට සමඟ ඇත්තෙන්ම ඉගෙන ගන්නේ කෙසේද (උපසිරැසි කියවීම නවත්වන්න)",
        sw: "Jinsi ya Kujifunza Kweli na Sinema (Acha Kusoma Manukuu)"
      },
      excerpt: { 
        en: "Subtitles are a crutch. Learn why they kill your progress and how to train your ears.", 
        ko: "자막은 목발입니다. 왜 그것이 당신의 발전을 죽이는지, 그리고 귀를 훈련하는 법을 알아보세요.",
        ja: "字幕は松葉杖です。なぜそれが進歩を妨げるのか、そして耳を鍛える方法を学びましょう。",
        zh: "字幕是拐杖。了解为什么它们会扼杀你的进步以及如何训练你的耳朵。",
        es: "Los subtítulos son una muleta. Aprende por qué matan tu progreso y cómo entrenar tus oídos.",
        fr: "Les sous-titres sont une béquille. Découvrez pourquoi ils tuent vos progrès et comment entraîner vos oreilles.",
        de: "Untertitel sind eine Krücke. Lerne, warum sie deinen Fortschritt töten und wie du deine Ohren trainierst.",
        th: "ซับไตเติ้ลคือไม้ค้ำยัน เรียนรู้ว่าทำไมมันถึงฆ่าความก้าวหน้าของคุณและวิธีฝึกหูของคุณ",
        vi: "Phụ đề là cái nạng. Tìm hiểu lý do tại sao chúng giết chết sự tiến bộ của bạn và cách rèn luyện đôi tai.",
        id: "Subtitle adalah tongkat penyangga. Pelajari mengapa mereka membunuh kemajuan Anda dan cara melatih telinga Anda.",
        pt: "Legendas são uma muleta. Aprenda por que elas matam seu progresso e como treinar seus ouvidos.",
        tr: "Altyazılar bir koltuk değneğidir. Neden ilerlemenizi öldürdüklerini ve kulaklarınızı nasıl eğiteceğinizi öğrenin.",
        ar: "الترجمات هي عكاز. تعلم لماذا تقتل تقدمك وكيف تدرب أذنيك.",
        hi: "उपशीर्षक एक बैसाखी हैं। जानें कि वे आपकी प्रगति को क्यों मारते हैं और अपने कानों को कैसे प्रशिक्षित करें।",
        ru: "Субтитры — это костыль. Узнайте, почему они убивают ваш прогресс и как тренировать уши.",
        bn: "সাবটাইটেল একটি ক্রাচ। জানুন কেন তারা আপনার অগ্রগতি হত্যা করে এবং কীভাবে আপনার কানকে প্রশিক্ষণ দেবেন।",
        ur: "سب ٹائٹلز ایک بیساکھی ہیں۔ جانیں کہ وہ آپ کی ترقی کو کیوں مارتے ہیں اور اپنے کانوں کو کیسے تربیت دیں۔",
        ne: "उपशीर्षकहरू एक वैशाखी हुन्। जान्नुहोस् किन तिनीहरूले तपाईंको प्रगतिलाई मार्छन् र कसरी तपाईंको कानलाई तालिम दिने।",
        si: "උපසිරැසි යනු කිහිලිකරුවකි. ඒවා ඔබේ දියුණුව විනාශ කරන්නේ ඇයි සහ ඔබේ කන් පුහුණු කරන්නේ කෙසේද යන්න ඉගෙන ගන්න।",
        sw: "Manukuu ni haina. Jifunze kwa nini yanaua maendeleo yako na jinsi ya kufunza masikio yako."
      },
      content: { 
         en: POST_NO_SUBTITLES_CONTENT_EN,
         ko: POST_NO_SUBTITLES_CONTENT_KO,
         ja: POST_NO_SUBTITLES_CONTENT_JA,
         zh: POST_NO_SUBTITLES_CONTENT_ZH,
         es: POST_NO_SUBTITLES_CONTENT_ES,
         fr: POST_NO_SUBTITLES_CONTENT_FR,
         de: POST_NO_SUBTITLES_CONTENT_DE,
         th: POST_NO_SUBTITLES_CONTENT_TH,
         vi: POST_NO_SUBTITLES_CONTENT_VI,
         id: POST_NO_SUBTITLES_CONTENT_ID,
         pt: POST_NO_SUBTITLES_CONTENT_PT,
         tr: POST_NO_SUBTITLES_CONTENT_TR,
         ar: POST_NO_SUBTITLES_CONTENT_AR,
         hi: POST_NO_SUBTITLES_CONTENT_HI,
         ru: POST_NO_SUBTITLES_CONTENT_RU,
         bn: POST_NO_SUBTITLES_CONTENT_BN,
         ur: POST_NO_SUBTITLES_CONTENT_UR,
         ne: POST_NO_SUBTITLES_CONTENT_NE,
         si: POST_NO_SUBTITLES_CONTENT_SI,
         sw: POST_NO_SUBTITLES_CONTENT_SW
      },
      coverImage: "/assets/blog/find_language_partner.png",
      author: "James Yoon",
      tags: ["Listening", "Immersion", "Methods"],
      published: true,
      createdAt: new Date("2024-02-12"),
      updatedAt: new Date("2024-02-12")
   },`;

if (postObjectRegex.test(content)) {
  content = content.replace(postObjectRegex, newPostObject);
  console.log('Replaced blog post object');
} else {
  console.warn('Warning: Could not find blog post object to replace');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Post 4 update complete.');
