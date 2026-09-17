import type { QuestionCategory, QuizQuestion } from '../types/quiz';

export const categoryIntroductions: Record<QuestionCategory, string> = {
  general: 'Partiamo dall’atmosfera e da come far nascere una conversazione naturale.',
  food: 'Ora scopriamo cosa potremmo mangiare insieme.',
  venue: 'Infine, lasciamo spazio alla sorpresa del posto giusto.',
};

export const questions: readonly QuizQuestion[] = [
  {
    id: 'date-energy',
    category: 'general',
    prompt: 'Che energia ti piacerebbe per questo appuntamento?',
    options: [
      {
        id: 'cozy',
        label: 'Tranquilla',
        reaction: 'La copertina immaginaria ha già chiesto di non essere disturbata.',
      },
      {
        id: 'playful',
        label: 'Mentale',
        reaction: 'La curiosità uccise il gatto, intercambiamo pensieri',
      },
      {
        id: 'spontaneous',
        label: 'Spontanea e diretta',
        reaction: 'Modalità permalosa disattivata con cautela.',
      },
      {
        id: 'creative',
        label: 'Elegante',
        reaction: 'La sorpresa ha controllato di avere buone maniere prima di arrivare.',
      },
    ],
  },
  {
    id: 'conversation-style',
    category: 'general',
    prompt: 'Cosa rende una conversazione più naturale?',
    options: [
      {
        id: 'shared-activity',
        label: 'Avere qualcosa da fare insieme',
        reaction: 'Due mani occupate e zero interrogatori: il dettaglio è registrato.',
      },
      {
        id: 'quiet-table',
        label: 'Un posto tranquillo per parlare',
        reaction: 'Il tavolino tranquillo sta già facendo finta di non ascoltare.',
      },
      {
        id: 'go-with-flow',
        label: 'Vedere dove porta la serata',
        reaction: 'La serata ha ricevuto una bussola, ma senza obbligo di usarla.',
      },
      {
        id: 'curious-questions',
        label: 'Scambiarci domande curiose',
        reaction: 'Le domande interessanti hanno promesso di non chiedere i documenti.',
      },
    ],
  },
  {
    id: 'date-pace',
    category: 'general',
    prompt: 'Che ritmo immagini per l’appuntamento?',
    options: [
      {
        id: 'unhurried',
        label: 'Divertente',
        reaction: 'Il cronometro ha ricevuto una serata libera e ne è molto felice.',
      },
      {
        id: 'balanced',
        label: 'Con un programma leggero ',
        reaction: 'Il programma ha lasciato spazio agli imprevisti più simpatici.',
      },
      {
        id: 'open-ended',
        label: 'Vediamo come va, passo dopo passo',
        reaction: 'Ogni passo ha ricevuto il permesso di scegliere il successivo.',
      },
      {
        id: 'brisk',
        label: 'Vivace, con qualche tappa',
        reaction: 'Le tappe hanno messo scarpe comode e un programma molto elastico.',
      },
    ],
  },
  {
    id: 'shared-curiosity',
    category: 'general',
    prompt: 'Cosa accende più facilmente la curiosità?',
    options: [
      {
        id: 'local-stories',
        label: 'Scoprire storie',
        reaction: 'Una strada poco conosciuta ha già preparato il suo aneddoto migliore.',
      },
      {
        id: 'mini-game',
        label: 'Un piccolo gioco o una sfida leggera',
        reaction: 'La sfida ha promesso di restare leggera e di non tenere il punteggio.',
      },
      {
        id: 'people-watching',
        label: 'Guardarsi negli occhi',
        reaction: 'Occhio che non vede cuore che non duole',
      },
      {
        id: 'learn-something',
        label: 'Imparare qualcosa di nuovo insieme',
        reaction: 'Una curiosità nuova ha già aperto il quaderno, senza fare interrogazioni.',
      },
    ],
  },
  {
    id: 'atmosphere-detail',
    category: 'general',
    prompt: 'Quale piccolo dettaglio fa subito atmosfera?',
    options: [
      {
        id: 'soft-light',
        label: 'Una luce morbida',
        reaction:
          'Una luce gentile fa già molto; il tuo sorriso, quando arriva, non deve fare altro.',
      },
      {
        id: 'good-playlist',
        label: 'Una playlist azzeccata',
        reaction: 'La playlist sta ripassando i suoi brani migliori senza fare la diva.',
      },
      {
        id: 'genuine-smile',
        label: 'Un sorriso spontaneo',
        reaction:
          'Un sorriso spontaneo ha il superpotere di rendere semplice anche il primo brindisi.',
      },
      {
        id: 'fresh-flowers',
        label: 'Un dettaglio colorato sul tavolo',
        reaction: 'Il dettaglio colorato ha scelto di fare scena con una discrezione studiata.',
      },
    ],
  },

  {
    id: 'food-direction',
    category: 'food',
    prompt: 'Come gestiamo il cibo?',
    options: [
      {
        id: 'favorite',
        label: 'Scegliamo un comfort food',
        reaction: 'Un comfort food immaginario si è sentito finalmente molto apprezzato.',
      },
      {
        id: 'new',
        label: 'Proviamo qualcosa di nuovo',
        reaction: 'Una spezia sconosciuta ha fatto un piccolo inchino.',
      },
      {
        id: 'leave-it-to-me',
        label: 'Ci penso io: sarà una sorpresa',
        reaction: 'Attenzione a farlo pensare troppo che finisce la ram e il rum',
        skipsCategory: true,
      },
      {
        id: 'market-stroll',
        label: 'Facciamo scegliere anche alla passeggiata',
        reaction: 'La passeggiata ha consultato il menu e si è detta pronta a collaborare.',
      },
    ],
  },
  {
    id: 'food-format',
    category: 'food',
    prompt: 'Che tipo di esperienza a tavola preferisci?',
    options: [
      {
        id: 'sit-down',
        label: 'Seduti con calma',
        reaction: 'La sedia immaginaria ha prenotato il diritto di stare comoda.',
      },
      {
        id: 'casual',
        label: 'Informale e senza programmi',
        reaction: 'Il dress code ha appena dichiarato sciopero, con piena approvazione.',
      },
      {
        id: 'shareable',
        label: 'Qualcosa da condividere',
        reaction: 'Una forchetta in più è stata informata della sua futura missione.',
      },
      {
        id: 'counter-seat',
        label: 'Qualcosa al bancone',
        reaction: 'Il bancone ha lucidato il posto migliore senza vantarsi troppo.',
      },
    ],
  },
  {
    id: 'food-flavour',
    category: 'food',
    prompt: 'Quale direzione di sapori ti incuriosisce?',
    options: [
      {
        id: 'familiar',
        label: 'Sapori conosciuti e rassicuranti',
        reaction: 'Il developer ama la cucina peruviana non deluderlo.',
      },
      {
        id: 'spiced',
        label: 'Qualcosa di speziato e vivace',
        reaction: 'Dopo mi darai una carammella anzi un HALLS.',
      },
      {
        id: 'fresh',
        label: 'Qualcosa di fresco e leggero',
        reaction: 'Fresco e leggero come il mojito, mi viene in mente solo il gelato  ',
      },
      {
        id: 'comforting',
        label: 'Acqua e Sapone',
        reaction: 'Covid mode. Se hai fatto Pfizer, complimenti qualcosa in comune',
      },
    ],
  },
  {
    id: 'food-ordering',
    category: 'food',
    prompt: 'Come ti piace scegliere dal menu?',
    options: [
      {
        id: 'one-each',
        label: 'Ognuno sceglie il suo preferito',
        reaction: 'Due piatti hanno iniziato una conoscenza cordiale a distanza.',
      },
      {
        id: 'shared-plates',
        label: 'Prendiamo più cose da condividere',
        reaction: 'Le porzioni condivise stanno già negoziando una divisione molto democratica.',
      },
      {
        id: 'ask-staff',
        label: 'Chiediamo consiglio a chi conosce il posto',
        reaction: 'Il consiglio della casa ha lucidato il grembiule per l’occasione.',
      },
      {
        id: 'daily-special',
        label: 'Ci lasciamo tentare dal piatto del giorno',
        reaction: 'Il piatto del giorno ha fatto un inchino molto ben calibrato.',
      },
    ],
  },
  {
    id: 'food-sweet-finish',
    category: 'food',
    prompt: 'E per il finale dolce?',
    options: [
      {
        id: 'must-have-dessert',
        label: 'Il dolce è parte del piano',
        reaction: 'Il dessert ha applaudito con un cucchiaino molto composto.',
      },
      {
        id: 'see-after',
        label: 'Meglio salato',
        reaction: 'Il dolce è appena diventato geloso.',
      },
      {
        id: 'walk-with-gelato',
        label: 'Meglio qualcosa da prendere passeggiando',
        reaction: 'Un gelato immaginario ha già scelto il lato meno pericoloso della coppetta.',
      },
      {
        id: 'coffee-finish',
        label: 'Niente dolce',
        reaction: 'La glicemia ringrazia.',
      },
    ],
  },

  {
    id: 'venue-atmosphere',
    category: 'venue',
    prompt: 'Che tipo di posto ti ispira?',
    options: [
      {
        id: 'calm',
        label: 'Tranquillo',
        reaction: 'Una lampada soffusa ha abbassato il volume con molta discrezione.',
      },
      {
        id: 'lively',
        label: 'Con un po’ di atmosfera',
        reaction: 'Una playlist immaginaria ha fatto un cenno, senza esagerare.',
      },
      {
        id: 'leave-it-to-me',
        label: 'Ci penso io: sarà una sorpresa',
        reaction: 'Il posto preferisce tenere il segreto ancora per un momento.',
        skipsCategory: true,
      },
      {
        id: 'characterful',
        label: 'Con un po’ di personalità',
        reaction: 'Il posto ha sistemato due dettagli eccentrici, poi si è dato un contegno.',
      },
    ],
  },
  {
    id: 'venue-distance',
    category: 'venue',
    prompt: 'Quanto lontano ci spingiamo?',
    options: [
      {
        id: 'nearby',
        label: 'Restiamo nei dintorni',
        reaction: 'La mappa ha tirato un sospiro di sollievo e ha chiuso una piega.',
      },
      {
        id: 'worth-trip',
        label: 'Viaggio al estero',
        reaction: 'Quando si ha la realta alterata. attenzione agli impulsi emotivi ',
      },
      {
        id: 'surprise-distance',
        label: 'Una sorpresa',
        reaction: 'La bussola immaginaria gira con entusiasmo molto composto.',
      },
      {
        id: 'scenic-route',
        label: 'Facciamo un giro per Roma',
        reaction: 'La vista ha ripassato il panorama per non farsi trovare impreparata.',
      },
    ],
  },

  {
    id: 'venue-setting',
    category: 'venue',
    prompt: 'Che tipo di spazio preferisci?',
    options: [
      {
        id: 'indoor',
        label: 'Un interno accogliente',
        reaction: 'Un angolo comodo ha sistemato i cuscini con orgoglio professionale.',
      },
      {
        id: 'outdoors',
        label: 'All’aperto',
        reaction: 'L’aria aperta ha controllato le previsioni e incrociato le dita.',
      },
      {
        id: 'window-seat',
        label: 'Vicino a una finestra',
        reaction: 'La finestra ha promesso una vista discreta, senza rubare la conversazione.',
      },
      {
        id: 'courtyard',
        label: 'In un cortile o giardino',
        reaction: 'Il cortile ha spazzato due foglie e ha lasciato fare al resto.',
      },
    ],
  },
  {
    id: 'venue-sound',
    category: 'venue',
    prompt: 'Che colonna sonora ci sta meglio?',
    options: [
      {
        id: 'background-music',
        label: 'Musica di sottofondo',
        reaction: 'La musica ha abbassato il volume per lasciare spazio alle parole.',
      },
      {
        id: 'lively-buzz',
        label: 'Movimento intorno',
        reaction: 'Il brusio ha promesso energia, ma senza trasformarsi in un concerto.',
      },
      {
        id: 'near-silence',
        label: 'Quasi silenzio',
        reaction: 'Il silenzio ha preparato una sedia comoda e nessuna domanda obbligatoria.',
      },
      {
        id: 'live-acoustic',
        label: 'Qualche nota dal vivo',
        reaction: 'Due accordi hanno promesso di non mettersi al centro della conversazione.',
      },
    ],
  },
  {
    id: 'venue-ending',
    category: 'venue',
    prompt: 'Come immagini la chiusura della serata?',
    options: [
      {
        id: 'short-and-sweet',
        label: 'Breve ma fatta bene',
        reaction: 'Anche una serata breve può lasciare un bel segnalibro.',
      },
      {
        id: 'linger',
        label: 'Con il tempo di restare ancora un po’',
        reaction: 'Il tavolo ha chiesto un minuto in più, con educazione impeccabile.',
      },
      {
        id: 'follow-mood',
        label: 'Seguiamo il momento',
        reaction:
          'La tua presenza sa rendere accogliente anche un posto semplice, senza chiedere nulla alla serata.',
      },
      {
        id: 'night-walk',
        label: 'Come i vecchi',
        reaction: 'La passeggiata serale ha preparato un epilogo senza fretta.',
      },
    ],
  },
];
