export interface Ayah {
  id: number;
  surahId: number;
  numberInSurah: number;
  textArabic: string;
  translationFr: string;
  translationEn?: string;
  translationAr?: string;
  tafsir: string;
  tafsirAr?: string;
  tafsirFr?: string;
  tafsirEn?: string;
}

export const ayahsBySurah: Record<number, Ayah[]> = {
  1: [
    { id: 1, surahId: 1, numberInSurah: 1, textArabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", translationFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", tafsir: "L'ouverture de la sourate et la formule de bénédiction par laquelle commence chaque action du musulman." },
    { id: 2, surahId: 1, numberInSurah: 2, textArabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", translationFr: "Louange à Allah, Seigneur de l'Univers.", tafsir: "Toute louange et gratitude reviennent à Allah, le Créateur et le Sustentateur de tous les mondes." },
    { id: 3, surahId: 1, numberInSurah: 3, textArabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", translationFr: "Le Tout Miséricordieux, le Très Miséricordieux.", tafsir: "Deux attributs divins décrivant l'immensité et la permanence de la miséricorde d'Allah." },
    { id: 4, surahId: 1, numberInSurah: 4, textArabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", translationFr: "Maître du Jour de la Rétribution.", tafsir: "Allah est le seul souverain du Jour du Jugement, où chaque âme sera rétribuée." },
    { id: 5, surahId: 1, numberInSurah: 5, textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translationFr: "C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons secours.", tafsir: "Déclaration d'unicité dans l'adoration et la recherche d'aide exclusivement auprès d'Allah." },
    { id: 6, surahId: 1, numberInSurah: 6, textArabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", translationFr: "Guide-nous dans le droit chemin.", tafsir: "L'invocation essentielle du musulman : être guidé sur la voie droite de l'Islam." },
    { id: 7, surahId: 1, numberInSurah: 7, textArabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", translationFr: "Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.", tafsir: "Précision sur le droit chemin : celui des prophètes, des véridiques et des vertueux." },
  ],
  112: [
    { id: 6220, surahId: 112, numberInSurah: 1, textArabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", translationFr: "Dis : « Il est Allah, Unique. »", tafsir: "L'affirmation fondamentale de l'unicité absolue d'Allah (Tawhid)." },
    { id: 6221, surahId: 112, numberInSurah: 2, textArabic: "ٱللَّهُ ٱلصَّمَدُ", translationFr: "Allah, Le Seul à être imploré pour ce que nous désirons.", tafsir: "As-Samad : Celui vers qui toute la création se tourne dans le besoin, qui n'a besoin de rien." },
    { id: 6222, surahId: 112, numberInSurah: 3, textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translationFr: "Il n'a jamais engendré, n'a pas été engendré non plus.", tafsir: "Négation de toute parenté divine, affirmant la transcendance absolue d'Allah." },
    { id: 6223, surahId: 112, numberInSurah: 4, textArabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ", translationFr: "Et nul n'est égal à Lui.", tafsir: "Rien dans la création ne peut être comparé à Allah, Il est au-delà de toute ressemblance." },
  ],
  113: [
    { id: 6224, surahId: 113, numberInSurah: 1, textArabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", translationFr: "Dis : « Je cherche protection auprès du Seigneur de l'aube naissante. »", tafsir: "Demander protection auprès d'Allah, le Seigneur de la lumière qui fend les ténèbres." },
    { id: 6225, surahId: 113, numberInSurah: 2, textArabic: "مِن شَرِّ مَا خَلَقَ", translationFr: "Contre le mal des êtres qu'Il a créés.", tafsir: "Protection contre tout mal provenant de la création." },
    { id: 6226, surahId: 113, numberInSurah: 3, textArabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translationFr: "Contre le mal de l'obscurité quand elle s'approfondit.", tafsir: "La nuit et ses dangers, moment où les forces du mal s'activent." },
    { id: 6227, surahId: 113, numberInSurah: 4, textArabic: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ", translationFr: "Contre le mal de celles qui soufflent sur les nœuds.", tafsir: "Protection contre la sorcellerie et les pratiques occultes." },
    { id: 6228, surahId: 113, numberInSurah: 5, textArabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translationFr: "Et contre le mal de l'envieux quand il envie.", tafsir: "Protection contre la jalousie et le mauvais œil." },
  ],
  114: [
    { id: 6229, surahId: 114, numberInSurah: 1, textArabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", translationFr: "Dis : « Je cherche protection auprès du Seigneur des hommes. »", tafsir: "S'adresser à Allah en tant que Seigneur, Roi et Divinité de l'humanité." },
    { id: 6230, surahId: 114, numberInSurah: 2, textArabic: "مَلِكِ ٱلنَّاسِ", translationFr: "Le Souverain des hommes.", tafsir: "Allah est le Roi véritable de toute l'humanité." },
    { id: 6231, surahId: 114, numberInSurah: 3, textArabic: "إِلَـٰهِ ٱلنَّاسِ", translationFr: "Dieu des hommes.", tafsir: "Le seul digne d'adoration parmi les hommes." },
    { id: 6232, surahId: 114, numberInSurah: 4, textArabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", translationFr: "Contre le mal du mauvais conseiller, furtif.", tafsir: "Le chuchoteur qui se retire quand Allah est invoqué." },
    { id: 6233, surahId: 114, numberInSurah: 5, textArabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", translationFr: "Celui qui souffle le mal dans les poitrines des hommes.", tafsir: "Satan qui insuffle les pensées mauvaises dans le cœur des gens." },
    { id: 6234, surahId: 114, numberInSurah: 6, textArabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", translationFr: "Qu'il soit parmi les djinns ou parmi les hommes.", tafsir: "Le mal peut venir des djinns comme des humains." },
  ],
  2: [
    { id: 8, surahId: 2, numberInSurah: 1, textArabic: "الٓمٓ", translationFr: "Alif, Lam, Mim.", tafsir: "Lettres lumineuses (Huruf al-Muqatta'at) dont la signification exacte est connue d'Allah seul." },
    { id: 9, surahId: 2, numberInSurah: 2, textArabic: "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", translationFr: "C'est le Livre au sujet duquel il n'y a aucun doute, c'est un guide pour les pieux.", tafsir: "Le Coran est exempt de tout doute et constitue une guidance pour ceux qui craignent Allah." },
    { id: 10, surahId: 2, numberInSurah: 3, textArabic: "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ", translationFr: "Ceux qui croient à l'invisible et accomplissent la Salat et dépensent de ce que Nous leur avons attribué.", tafsir: "Les caractéristiques des pieux : foi en l'invisible, prière et générosité." },
    { id: 11, surahId: 2, numberInSurah: 4, textArabic: "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ", translationFr: "Ceux qui croient à ce qui t'a été descendu et à ce qui a été descendu avant toi et qui croient fermement à la vie future.", tafsir: "La foi englobe toutes les révélations divines et la certitude de l'au-delà." },
    { id: 12, surahId: 2, numberInSurah: 5, textArabic: "أُو۟لَـٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ", translationFr: "Ceux-là sont sur le bon chemin de leur Seigneur, et ce sont eux qui réussissent.", tafsir: "Ceux qui possèdent ces qualités sont guidés et réussiront dans cette vie et dans l'au-delà." },
  ],
  36: [
    { id: 3500, surahId: 36, numberInSurah: 1, textArabic: "يسٓ", translationFr: "Ya-Sin.", tafsir: "Lettres mystérieuses qui ouvrent cette sourate, souvent appelée le cœur du Coran." },
    { id: 3501, surahId: 36, numberInSurah: 2, textArabic: "وَٱلْقُرْءَانِ ٱلْحَكِيمِ", translationFr: "Par le Coran plein de sagesse.", tafsir: "Allah jure par le Coran, soulignant sa sagesse et sa perfection." },
    { id: 3502, surahId: 36, numberInSurah: 3, textArabic: "إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ", translationFr: "Tu es certes du nombre des messagers.", tafsir: "Confirmation de la mission prophétique de Muhammad ﷺ." },
    { id: 3503, surahId: 36, numberInSurah: 4, textArabic: "عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ", translationFr: "Sur un chemin droit.", tafsir: "Le Prophète ﷺ est sur la voie droite, la voie de la guidance divine." },
    { id: 3504, surahId: 36, numberInSurah: 5, textArabic: "تَنزِيلَ ٱلْعَزِيزِ ٱلرَّحِيمِ", translationFr: "C'est la révélation du Puissant, du Miséricordieux.", tafsir: "Le Coran est une révélation de Celui qui est à la fois Tout-Puissant et infiniment Miséricordieux." },
  ],
};

export const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

export function toArabicNumber(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d)] || d).join('');
}
