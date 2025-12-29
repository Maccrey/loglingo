export const TRIAL_SAMPLES: Record<string, string> = {
  en: "I goes to school yesterday and met my friend.", // Error: goes -> went
  ko: "나는 어제 학교에 갑니다 그리고 친구를 만났어요.", // Error: Tense mismatch (갑니다 -> 갔습니다/갔고)
  ja: "私は昨日学校に行きます、そして友達に会いました。", // Error: Tense mismatch (行きます -> 行きました/行って)
  zh: "我昨天去学校，看我的朋友。", // Error: "看" -> "见" or grammar structure improvement
  es: "Yo ir a la escuela ayer y ver a mi amigo.", // Error: Infinitive verbs
  fr: "Je aller à l'école hier et voir mon ami.", // Error: Infinitive verbs
  de: "Ich gehen zur Schule gestern und sehen mein Freund.", // Error: Infinitive verbs/Word order
  ru: "Я идти в школу вчера и видеть мой друг.", // Error: Infinitive verbs
  it: "Io andare a scuola ieri e vedere mio amico.", // Error: Infinitive verbs
  pt: "Eu ir para a escola ontem e ver meu amigo.", // Error: Infinitive verbs
  nl: "Ik gaan naar school gisteren en zien mijn vriend.", // Error: Infinitive verbs
  pl: "Ja iść do szkoły wczoraj i widzieć mój przyjaciel.", // Error: Infinitive verbs
  tr: "Ben dün okula gitmek ve arkadaşımı görmek.", // Error: Infinitive verbs
  vi: "Tôi đi đến trường hôm qua và gặp bạn tôi.", // Already okay but simple enough for AI to polish or errors could be introduced if needed. Let's make it slightly awkward: "Tôi đã đi học hôm qua nhưng tôi không làm bài tập."
  id: "Saya pergi ke sekolah kemarin dan melihat teman saya.", // Simple sentence
  th: "ฉันไปโรงเรียนเมื่อวานและเห็นเพื่อนของฉัน", // Simple sentence
  ar: "أنا يذهب إلى المدرسة أمس ورأيت صديقي.", // Error: 'goes' (present) instead of 'went' (past)
  hi: "मैं कल स्कूल जाता हूँ और अपने दोस्त को देखा।", // Error: 'goes' (present) instead of 'went' (past)
};

export const DEFAULT_SAMPLE = "I goes to school yesterday.";
