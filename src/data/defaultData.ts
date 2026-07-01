/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Subcategory, Question, Rule, TextBlock, AppSettings } from '../types';

export const defaultCategories: Category[] = [
  { id: 'gedrag', name: 'Gedrag', description: 'Zelfregulatie, werkhouding, aansturing en naleving van klassikale regels.' },
  { id: 'taal_communicatie', name: 'Taal & Communicatie', description: 'Mondelinge vaardigheden, begrijpend luisteren, durf en interactie in het Nederlands.' },
  { id: 'sociaal_emotioneel', name: 'Sociaal-emotioneel', description: 'Welbevinden, sociale contacten, zelfbeeld en emotionele weerbaarheid.' },
  { id: 'beschermende_factoren', name: 'Beschermende factoren', description: 'Thuisomgeving, intrinsieke motivatie, vriendschappen en externe ondersteuning.' }
];

export const defaultSubcategories: Subcategory[] = [
  // Gedrag
  { id: 'werkhouding', categoryId: 'gedrag', name: 'Werkhouding & Zelfstandigheid' },
  { id: 'zelfregulatie', categoryId: 'gedrag', name: 'Zelfregulatie & Grenzen' },
  { id: 'zelfreflectie', categoryId: 'gedrag', name: 'Zelfreflectie & Feedback' },
  { id: 'flexibiliteit', categoryId: 'gedrag', name: 'Flexibiliteit & Verandering' },
  { id: 'aanwezigheid', categoryId: 'gedrag', name: 'Aanwezigheid & Betrokkenheid' },
  
  // Taal & Communicatie
  { id: 'taalbegrip', categoryId: 'taal_communicatie', name: 'Taalbegrip & Instructie' },
  { id: 'taalproductie', categoryId: 'taal_communicatie', name: 'Spreekvaardigheid & Productie' },
  { id: 'interactie_durf', categoryId: 'taal_communicatie', name: 'Durf & Communicatieve Interactie' },

  // Sociaal-emotioneel
  { id: 'sociale_relaties', categoryId: 'sociaal_emotioneel', name: 'Sociale Relaties & Contacten' },
  { id: 'emotioneel_welbevinden', categoryId: 'sociaal_emotioneel', name: 'Emotioneel Welbevinden & Zelfbeeld' },
  { id: 'weerbaarheid_coping', categoryId: 'sociaal_emotioneel', name: 'Weerbaarheid & Feedback-coping' },

  // Beschermende factoren
  { id: 'thuisomgeving', categoryId: 'beschermende_factoren', name: 'Thuisfront & Ondersteuning' },
  { id: 'toekomstvisie_motivatie', categoryId: 'beschermende_factoren', name: 'Motivatie & Toekomstperspectief' },
  { id: 'externe_hulp', categoryId: 'beschermende_factoren', name: 'Hulpverlening & Netwerk' }
];

export const defaultQuestions: Question[] = [
  // Gedrag (Likert 1-5)
  {
    id: 'g1',
    text: 'Vindt het lastig om op zijn/haar beurt te wachten.',
    categoryId: 'gedrag',
    subcategoryId: 'zelfregulatie',
    minScore: 1,
    maxScore: 5,
    weight: 1.0,
    reverseScore: true, // 5 (heel lastig) is negatief, dus reverse naar 1 voor score-index
    tags: ['impulsiviteit', 'groepsdynamiek'],
    order: 1
  },
  {
    id: 'g2',
    text: 'Zoekt grenzen op.',
    categoryId: 'gedrag',
    subcategoryId: 'zelfregulatie',
    minScore: 1,
    maxScore: 5,
    weight: 1.5,
    reverseScore: true, // 5 (veel grenzen zoeken) is negatief -> reverse naar 1
    tags: ['grenzen', 'gezag'],
    order: 2
  },
  {
    id: 'g3',
    text: 'Is zich niet bewust van wat hij/zij doet na aangesproken te worden.',
    categoryId: 'gedrag',
    subcategoryId: 'zelfreflectie',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: true,
    tags: ['reflectie', 'bewustwording'],
    order: 3
  },
  {
    id: 'g4',
    text: 'Kan niet omgaan met veranderingen.',
    categoryId: 'gedrag',
    subcategoryId: 'flexibiliteit',
    minScore: 1,
    maxScore: 5,
    weight: 1.0,
    reverseScore: true,
    tags: ['structuur', 'flexibiliteit'],
    order: 4
  },
  {
    id: 'g5',
    text: 'Reageert niet passend op feedback.',
    categoryId: 'gedrag',
    subcategoryId: 'zelfreflectie',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: true,
    tags: ['feedback', 'weerstand'],
    order: 5
  },
  {
    id: 'g6',
    text: 'Moeite om zelf te beginnen aan een taak.',
    categoryId: 'gedrag',
    subcategoryId: 'werkhouding',
    minScore: 1,
    maxScore: 5,
    weight: 1.0,
    reverseScore: true,
    tags: ['taakinitiatie', 'zelfstandigheid'],
    order: 6
  },
  {
    id: 'g7',
    text: 'Veel aansturing nodig.',
    categoryId: 'gedrag',
    subcategoryId: 'werkhouding',
    minScore: 1,
    maxScore: 5,
    weight: 1.3,
    reverseScore: true,
    tags: ['begeleiding', 'werkhouding'],
    order: 7
  },
  {
    id: 'g8',
    text: 'Vergeet spullen vaak.',
    categoryId: 'gedrag',
    subcategoryId: 'werkhouding',
    minScore: 1,
    maxScore: 5,
    weight: 0.8,
    reverseScore: true,
    tags: ['organisatie', 'materialen'],
    order: 8
  },
  {
    id: 'g9',
    text: 'Volgt klassikale afspraken en regels.',
    categoryId: 'gedrag',
    subcategoryId: 'zelfregulatie',
    minScore: 1,
    maxScore: 5,
    weight: 1.0,
    reverseScore: false, // 5 (altijd regels volgen) is positief, dus GEEN reverse
    tags: ['regels', 'coöperatie'],
    order: 9
  },
  {
    id: 'g10',
    text: 'Komt regelmatig niet opdagen.',
    categoryId: 'gedrag',
    subcategoryId: 'aanwezigheid',
    minScore: 1,
    maxScore: 5,
    weight: 1.5,
    reverseScore: true,
    tags: ['absenteïsme', 'betrokkenheid'],
    order: 10
  },
  {
    id: 'g11',
    text: 'Is er ontwikkeling zichtbaar?',
    categoryId: 'gedrag',
    subcategoryId: 'werkhouding',
    minScore: 1,
    maxScore: 5,
    weight: 1.5,
    reverseScore: false, // 5 is veel ontwikkeling (positief)
    tags: ['groei', 'potentieel'],
    order: 11
  },

  // Taal & Communicatie
  {
    id: 't1',
    text: 'Begrijpt eenvoudige, mondelinge instructies in het Nederlands.',
    categoryId: 'taal_communicatie',
    subcategoryId: 'taalbegrip',
    minScore: 1,
    maxScore: 5,
    weight: 1.5,
    reverseScore: false,
    tags: ['begrip', 'luisteren'],
    order: 12
  },
  {
    id: 't2',
    text: 'Kan zich in het Nederlands mondeling verstaanbaar maken over alledaagse onderwerpen.',
    categoryId: 'taal_communicatie',
    subcategoryId: 'taalproductie',
    minScore: 1,
    maxScore: 5,
    weight: 1.5,
    reverseScore: false,
    tags: ['spreken', 'woordenschat'],
    order: 13
  },
  {
    id: 't3',
    text: 'Durft vragen te stellen als hij/zij een uitleg of taak niet begrijpt.',
    categoryId: 'taal_communicatie',
    subcategoryId: 'interactie_durf',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: false,
    tags: ['durf', 'assertiviteit'],
    order: 14
  },
  {
    id: 't4',
    text: 'Heeft moeite met het begrijpen van geschreven teksten en opdrachten.',
    categoryId: 'taal_communicatie',
    subcategoryId: 'taalbegrip',
    minScore: 1,
    maxScore: 5,
    weight: 1.0,
    reverseScore: true, // 5 (veel moeite) is negatief -> reverse
    tags: ['lezen', 'begrijpend-lezen'],
    order: 15
  },
  {
    id: 't5',
    text: 'Maakt actief gebruik van non-verbale communicatie of vertaalhulpmiddelen om zich verstaanbaar te maken.',
    categoryId: 'taal_communicatie',
    subcategoryId: 'interactie_durf',
    minScore: 1,
    maxScore: 5,
    weight: 1.0,
    reverseScore: false,
    tags: ['coping', 'hulpmiddelen'],
    order: 16
  },
  {
    id: 't6',
    text: 'Luistert actief naar de docent en klasgenoten en toont interactiebehoefte.',
    categoryId: 'taal_communicatie',
    subcategoryId: 'interactie_durf',
    minScore: 1,
    maxScore: 5,
    weight: 1.1,
    reverseScore: false,
    tags: ['luisterhouding', 'interactie'],
    order: 17
  },

  // Sociaal-emotioneel
  {
    id: 's1',
    text: 'Maakt gemakkelijk en positief contact met groepsgenoten.',
    categoryId: 'sociaal_emotioneel',
    subcategoryId: 'sociale_relaties',
    minScore: 1,
    maxScore: 5,
    weight: 1.3,
    reverseScore: false,
    tags: ['vriendschap', 'socialisatie'],
    order: 18
  },
  {
    id: 's2',
    text: 'Vertoont faalangstig of extreem onzeker gedrag bij toetsen of nieuwe opdrachten.',
    categoryId: 'sociaal_emotioneel',
    subcategoryId: 'emotioneel_welbevinden',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: true, // 5 (veel angst) is ongunstig -> reverse
    tags: ['faalangst', 'zelfbeeld'],
    order: 19
  },
  {
    id: 's3',
    text: 'Kan eigen emoties (zoals boosheid of verdriet) op een sociaal geaccepteerde manier uiten en reguleren.',
    categoryId: 'sociaal_emotioneel',
    subcategoryId: 'emotioneel_welbevinden',
    minScore: 1,
    maxScore: 5,
    weight: 1.4,
    reverseScore: false,
    tags: ['emotieregulatie', 'stabiliteit'],
    order: 20
  },
  {
    id: 's4',
    text: 'Trekt zich vaak terug uit de groep en is stil/afwezig tijdens sociale momenten.',
    categoryId: 'sociaal_emotioneel',
    subcategoryId: 'sociale_relaties',
    minScore: 1,
    maxScore: 5,
    weight: 1.1,
    reverseScore: true, // 5 (veel terugtrekken) -> reverse
    tags: ['isolatie', 'introversie'],
    order: 21
  },
  {
    id: 's5',
    text: 'Heeft een realistisch en voldoende positief zelfbeeld.',
    categoryId: 'sociaal_emotioneel',
    subcategoryId: 'emotioneel_welbevinden',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: false,
    tags: ['zelfbeeld', 'zelfvertrouwen'],
    order: 22
  },
  {
    id: 's6',
    text: 'Reageert overgevoelig of met boosheid op correcties of onvoldoendes.',
    categoryId: 'sociaal_emotioneel',
    subcategoryId: 'weerbaarheid_coping',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: true,
    tags: ['weerbaarheid', 'frustratie'],
    order: 23
  },

  // Beschermende factoren
  {
    id: 'b1',
    text: 'Er is een stabiel, ondersteunend thuisfront aanwezig dat betrokken is bij de schoolloopbaan.',
    categoryId: 'beschermende_factoren',
    subcategoryId: 'thuisomgeving',
    minScore: 1,
    maxScore: 5,
    weight: 1.5,
    reverseScore: false,
    tags: ['thuisfront', 'ouders'],
    order: 24
  },
  {
    id: 'b2',
    text: 'De student heeft een duidelijke toekomstvisie, dromen of sterke intrinsieke motivatie.',
    categoryId: 'beschermende_factoren',
    subcategoryId: 'toekomstvisie_motivatie',
    minScore: 1,
    maxScore: 5,
    weight: 1.3,
    reverseScore: false,
    tags: ['motivatie', 'toekomst'],
    order: 25
  },
  {
    id: 'b3',
    text: 'De student heeft steunende, positieve vriendschappen (binnen of buiten school).',
    categoryId: 'beschermende_factoren',
    subcategoryId: 'thuisomgeving',
    minScore: 1,
    maxScore: 5,
    weight: 1.1,
    reverseScore: false,
    tags: ['vrienden', 'steun'],
    order: 26
  },
  {
    id: 'b4',
    text: 'Er is sprake van actieve externe begeleiding, voogdijondersteuning of specialistische hulpverlening indien nodig.',
    categoryId: 'beschermende_factoren',
    subcategoryId: 'externe_hulp',
    minScore: 1,
    maxScore: 5,
    weight: 1.2,
    reverseScore: false,
    tags: ['zorg', 'extern-netwerk'],
    order: 27
  },
  {
    id: 'b5',
    text: 'De student beschikt over gezonde coping-mechanismen bij tegenslagen en toont veerkracht.',
    categoryId: 'beschermende_factoren',
    subcategoryId: 'toekomstvisie_motivatie',
    minScore: 1,
    maxScore: 5,
    weight: 1.4,
    reverseScore: false,
    tags: ['veerkracht', 'coping'],
    order: 28
  }
];

export const defaultTextBlocks: TextBlock[] = [
  // Profielschets
  {
    id: 'tb_prof_gedrag_laag',
    title: 'Zorgelijk Gedragsprofiel',
    categoryId: 'gedrag',
    type: 'Profielschets',
    content: 'De student vertoont aanzienlijke uitdagingen op het gebied van gedrag en zelfregulatie in de klas. Er is vaak sprake van impulsiviteit, moeite met het accepteren van grenzen en een beperkt inzicht in het eigen aandeel bij incidenten. De werkhouding is momenteel wisselvallig en er is veel directe aansturing nodig om tot taakuitvoering over te gaan.',
    active: true
  },
  {
    id: 'tb_prof_gedrag_hoog',
    title: 'Positief Gedragsprofiel',
    categoryId: 'gedrag',
    type: 'Profielschets',
    content: 'De student laat een stabiel en meewerkend gedragsprofiel zien. Hij/zij houdt zich goed aan de klassikale afspraken, werkt zelfstandig en reageert constructief op aanwijzingen en feedback van de docent.',
    active: true
  },
  {
    id: 'tb_prof_taal_laag',
    title: 'Grote Taalbarrière',
    categoryId: 'taal_communicatie',
    type: 'Profielschets',
    content: 'Op het gebied van de Nederlandse taal is er sprake van een forse barrière. De student begrijpt mondelinge basisinstructies nog onvoldoende en vindt het lastig om zich in alledaagse situaties verstaanbaar te maken. Dit belemmert zowel de vakinhoudelijke voortgang als de sociale integratie.',
    active: true
  },
  {
    id: 'tb_prof_taal_hoog',
    title: 'Goede Taalvaardigheid',
    categoryId: 'taal_communicatie',
    type: 'Profielschets',
    content: 'De student beschikt over een prima functioneel niveau van het Nederlands. Hij of zij begrijpt instructies vlot, spreekt met voldoende zelfvertrouwen en durft zelfstandig vragen te stellen ter verduidelijking.',
    active: true
  },
  {
    id: 'tb_prof_socem_laag',
    title: 'Kwetsbaar Sociaal-Emotioneel',
    categoryId: 'sociaal_emotioneel',
    type: 'Profielschets',
    content: 'Sociaal-emotioneel gezien bevindt de student zich in een kwetsbare positie. Er zijn signalen van faalangst, een negatief zelfbeeld of sociale isolatie. De student trekt zich regelmatig terug en vindt het spannend om verbinding te maken met groepsgenoten.',
    active: true
  },
  {
    id: 'tb_prof_socem_hoog',
    title: 'Veerkrachtig Sociaal-Emotioneel',
    categoryId: 'sociaal_emotioneel',
    type: 'Profielschets',
    content: 'De student maakt een sociaal-emotioneel stabiele indruk. Hij/zij maakt makkelijk contact met leeftijdsgenoten, reguleert emoties op een passende manier en beschikt over een gezond dosis zelfvertrouwen.',
    active: true
  },
  {
    id: 'tb_prof_besch_laag',
    title: 'Zorgelijke Omgevingsfactoren',
    categoryId: 'beschermende_factoren',
    type: 'Profielschets',
    content: 'Er is sprake van een kwetsbaar steunsysteem buiten school. De beschermende factoren (zoals thuisbetrokkenheid, een stabiel sociaal netwerk of gezonde coping) zijn minimaal, waardoor de student gevoeliger is voor schoolse en emotionele uitval.',
    active: true
  },
  {
    id: 'tb_prof_besch_hoog',
    title: 'Sterke Beschermende Factoren',
    categoryId: 'beschermende_factoren',
    type: 'Profielschets',
    content: 'De student wordt ondersteund door een krachtig netwerk van beschermende factoren. Zowel een betrokken thuisfront, een sterke eigen motivatie als gezonde coping-mechanismen dragen bij aan een hoge veerkracht bij tegenslag.',
    active: true
  },

  // Handelingsadvies
  {
    id: 'tb_hand_gedrag_laag',
    title: 'Structuur en Begrenzing',
    categoryId: 'gedrag',
    type: 'Handelingsadvies',
    content: '1. **Voorspelbare structuur**: Bied een strak dagschema en baken taken visueel af. Veranderingen vooraf individueel aankondigen.\n2. **Begrenzing**: Spreek de student direct, rustig en neutraal aan bij grensoverschrijdend gedrag. Herhaal de klassenafspraak.\n3. **Korte succeservaringen**: Verdeel opdrachten in kleine deeltaken en geef direct positieve feedback bij het succesvol afronden van een deeltaak.',
    active: true
  },
  {
    id: 'tb_hand_taal_laag',
    title: 'Visuele en Fysieke Ondersteuning',
    categoryId: 'taal_communicatie',
    type: 'Handelingsadvies',
    content: '1. **Visualiseer**: Ondersteun gesproken instructies met afbeeldingen, schema\'s en demonstraties.\n2. **Controleer begrip**: Vraag de student niet "begrijp je het?", maar laat hem/haar in eigen woorden (of met behulp van vertaling) laten zien wat de bedoeling is.\n3. **Pre-teaching**: Bied sleutelbegrippen voorafgaand aan de les aan.',
    active: true
  },
  {
    id: 'tb_hand_socem_laag',
    title: 'Faalangstreductie & Verbinding',
    categoryId: 'sociaal_emotioneel',
    type: 'Handelingsadvies',
    content: '1. **Fouten mogen maken**: Benadruk het leerproces in plaats van het eindresultaat. Creëer een veilige sfeer door fouten openlijk te normaliseren.\n2. **Duo-werk**: Koppel de student bij groepsopdrachten doelbewust aan een milde, sociaal vaardige klasgenoot om de drempel tot interactie te verlagen.\n3. **Laagdrempelige succesmomenten**: Geef de student taken waarvan je zeker weet dat hij/zij ze succesvol kan afronden om het zelfvertrouwen op te bouwen.',
    active: true
  },
  {
    id: 'tb_hand_besch_laag',
    title: 'Systeemgerichte Aanpak',
    categoryId: 'beschermende_factoren',
    type: 'Handelingsadvies',
    content: '1. **Versterk het contact met thuis**: Plan een laagdrempelig kennismakingsgesprek (met tolk) om samenwerking te bespreken, los van incidenten.\n2. **Focus op de toekomst**: Ga in gesprek over de dromen en doelen van de student om de intrinsieke motivatie en hoop te stimuleren.\n3. **Signaleer tijdig**: Documenteer stemmingswisselingen of absenteïsme nauwkeurig om snel op te kunnen schalen.',
    active: true
  },

  // Reflectiestimulering
  {
    id: 'tb_refl_gedrag_laag',
    title: 'Reflectie op Gedrag en Triggering',
    categoryId: 'gedrag',
    type: 'Reflectiestimulering',
    content: '* Op welke specifieke momenten in de week (tijdstip, vak, groepsgrootte) escaleert het gedrag het snelst? Wat is de gemeenschappelijke factor?\n* Hoe reageert de student als je fysiek dichtbij hem/haar staat tijdens het geven van een waarschuwing versus wanneer je dit vanaf een afstand doet?',
    active: true
  },
  {
    id: 'tb_refl_taal_laag',
    title: 'Reflectie op Communicatieve Durf',
    categoryId: 'taal_communicatie',
    type: 'Reflectiestimulering',
    content: '* Maakt de student meer contact in een 1-op-1 setting dan in de grote groep? Hoe kunnen we dit 1-op-1 contact vaker inzetten om de spreekdurf te stimuleren?\n* Welke non-verbale signalen geeft de student af wanneer hij/zij de draad van het verhaal kwijtraakt?',
    active: true
  },
  {
    id: 'tb_refl_socem_laag',
    title: 'Reflectie op Emotionele Behoefte',
    categoryId: 'sociaal_emotioneel',
    type: 'Reflectiestimulering',
    content: '* Welke reactie van de docent (troosten, negeren, structuur bieden) helpt de student het snelst te kalmeren bij overprikkeling of faalangst?\n* Vraagt de student op indirecte wijze (bijvoorbeeld door storend gedrag of juist extreme stilte) om negatieve of positieve aandacht?',
    active: true
  },

  // Advies vervolgstappen
  {
    id: 'tb_stappen_gedrag_laag',
    title: 'Meldpunt & Individueel Plan',
    categoryId: 'gedrag',
    type: 'Advies vervolgstappen',
    content: '1. **Individueel gedragscontract**: Stel samen met de student 2 heldere, positief geformuleerde doelen op (bijv. "Ik steek mijn hand op als ik wat wil zeggen"). Koppel hier een wekelijkse evaluatie aan.\n2. **Inschakelen IB/Zorgcoördinator**: Bespreek de casus in het interne ondersteuningsteam indien er binnen 3 weken geen gedragsverbetering zichtbaar is.',
    active: true
  },
  {
    id: 'tb_stappen_taal_laag',
    title: 'Taaldiagnostiek & NT2-Remediëring',
    categoryId: 'taal_communicatie',
    type: 'Advies vervolgstappen',
    content: '1. **Taal-intake afnemen**: Laat een NT2-specialist een gerichte niveautoets (mondeling en schriftelijk) afnemen om hiaten op te sporen.\n2. **Inzet NT2-leerlijn**: Richt een individueel traject of extra ondersteuningsuur in gericht op functionele woordenschat en spreekdurf.',
    active: true
  },
  {
    id: 'tb_stappen_socem_laag',
    title: 'Zorgoverleg & Faalangsttraining',
    categoryId: 'sociaal_emotioneel',
    type: 'Advies vervolgstappen',
    content: '1. **Faalangstreductietraining**: Meld de student aan voor een weerbaarheids- of faalangsttraining (zoals "Rots en Water" of een vergelijkbaar aanbod binnen de school).\n2. **Warme overdracht/Maatschappelijk Werk**: Overweeg de inzet van schoolmaatschappelijk werk om te verkennen of onderliggende trauma\'s of migratiegerelateerde stress een rol spelen.',
    active: true
  },
  {
    id: 'tb_stappen_besch_laag',
    title: 'Systeem- en Netwerkgesprek',
    categoryId: 'beschermende_factoren',
    type: 'Advies vervolgstappen',
    content: '1. **Multidisciplinair Overleg (MDO)**: Organiseer op korte termijn een overleg met de ouders/voogd, mentor, intern begeleider en eventuele externe hulpverleners om de neuzen dezelfde kant op te krijgen.\n2. **Verbinden aan vrijetijdsbesteding**: Onderzoek of de student toegeleid kan worden naar een sportclub of buurtactiviteit om het gezonde sociale netwerk buiten school te vergroten.',
    active: true
  }
];

export const defaultRules: Rule[] = [
  {
    id: 'rule_gedrag_laag_hand',
    name: 'Gedragsproblemen - Behoefte aan structuur',
    type: 'Handelingsadvies',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_g_1',
        type: 'category',
        targetId: 'gedrag',
        operator: '<',
        value: 60
      }
    ],
    resultTextBlockIds: ['tb_hand_gedrag_laag'],
    active: true
  },
  {
    id: 'rule_gedrag_laag_prof',
    name: 'Zorgelijk gedrag - Profielschets',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_g_2',
        type: 'category',
        targetId: 'gedrag',
        operator: '<',
        value: 50
      }
    ],
    resultTextBlockIds: ['tb_prof_gedrag_laag'],
    active: true
  },
  {
    id: 'rule_gedrag_hoog_prof',
    name: 'Constructief gedrag - Profielschets',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_g_3',
        type: 'category',
        targetId: 'gedrag',
        operator: '>=',
        value: 70
      }
    ],
    resultTextBlockIds: ['tb_prof_gedrag_hoog'],
    active: true
  },
  {
    id: 'rule_taal_laag_hand',
    name: 'Taalachterstand - Handelingsadvies',
    type: 'Handelingsadvies',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_t_1',
        type: 'category',
        targetId: 'taal_communicatie',
        operator: '<',
        value: 55
      }
    ],
    resultTextBlockIds: ['tb_hand_taal_laag'],
    active: true
  },
  {
    id: 'rule_taal_laag_prof',
    name: 'Taalachterstand - Profielschets',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_t_2',
        type: 'category',
        targetId: 'taal_communicatie',
        operator: '<',
        value: 50
      }
    ],
    resultTextBlockIds: ['tb_prof_taal_laag'],
    active: true
  },
  {
    id: 'rule_taal_hoog_prof',
    name: 'Taalsterkte - Profielschets',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_t_3',
        type: 'category',
        targetId: 'taal_communicatie',
        operator: '>=',
        value: 75
      }
    ],
    resultTextBlockIds: ['tb_prof_taal_hoog'],
    active: true
  },
  {
    id: 'rule_socem_laag_hand',
    name: 'Sociaal-emotioneel kwetsbaar - Handelingsadvies',
    type: 'Handelingsadvies',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_s_1',
        type: 'category',
        targetId: 'sociaal_emotioneel',
        operator: '<',
        value: 60
      }
    ],
    resultTextBlockIds: ['tb_hand_socem_laag'],
    active: true
  },
  {
    id: 'rule_socem_laag_prof',
    name: 'Sociaal-emotioneel kwetsbaar - Profiel',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_s_2',
        type: 'category',
        targetId: 'sociaal_emotioneel',
        operator: '<',
        value: 50
      }
    ],
    resultTextBlockIds: ['tb_prof_socem_laag'],
    active: true
  },
  {
    id: 'rule_socem_hoog_prof',
    name: 'Sociaal-emotioneel stabiel - Profiel',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_s_3',
        type: 'category',
        targetId: 'sociaal_emotioneel',
        operator: '>=',
        value: 75
      }
    ],
    resultTextBlockIds: ['tb_prof_socem_hoog'],
    active: true
  },
  {
    id: 'rule_besch_laag_hand',
    name: 'Zorgelijke omgeving - Handelingsadvies',
    type: 'Handelingsadvies',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_b_1',
        type: 'category',
        targetId: 'beschermende_factoren',
        operator: '<',
        value: 55
      }
    ],
    resultTextBlockIds: ['tb_hand_besch_laag'],
    active: true
  },
  {
    id: 'rule_besch_laag_prof',
    name: 'Zorgelijke omgeving - Profielschets',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_b_2',
        type: 'category',
        targetId: 'beschermende_factoren',
        operator: '<',
        value: 50
      }
    ],
    resultTextBlockIds: ['tb_prof_besch_laag'],
    active: true
  },
  {
    id: 'rule_besch_hoog_prof',
    name: 'Omgeving sterkte - Profielschets',
    type: 'Profielschets',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_b_3',
        type: 'category',
        targetId: 'beschermende_factoren',
        operator: '>=',
        value: 75
      }
    ],
    resultTextBlockIds: ['tb_prof_besch_hoog'],
    active: true
  },

  // Reflectie-regels
  {
    id: 'rule_refl_gedrag',
    name: 'Gedragsproblemen - Reflectiebehoefte',
    type: 'Reflectiestimulering',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_rg_1',
        type: 'category',
        targetId: 'gedrag',
        operator: '<',
        value: 65
      }
    ],
    resultTextBlockIds: ['tb_refl_gedrag_laag'],
    active: true
  },
  {
    id: 'rule_refl_taal',
    name: 'Taalbarrière - Reflectiebehoefte',
    type: 'Reflectiestimulering',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_rt_1',
        type: 'category',
        targetId: 'taal_communicatie',
        operator: '<',
        value: 60
      }
    ],
    resultTextBlockIds: ['tb_refl_taal_laag'],
    active: true
  },
  {
    id: 'rule_refl_socem',
    name: 'Sociaal-emotioneel - Reflectiebehoefte',
    type: 'Reflectiestimulering',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_rs_1',
        type: 'category',
        targetId: 'sociaal_emotioneel',
        operator: '<',
        value: 65
      }
    ],
    resultTextBlockIds: ['tb_refl_socem_laag'],
    active: true
  },

  // Vervolgstappen-regels
  {
    id: 'rule_stappen_gedrag',
    name: 'Zorgwekkend gedrag - Actie vereist',
    type: 'Advies vervolgstappen',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_sg_1',
        type: 'category',
        targetId: 'gedrag',
        operator: '<',
        value: 50
      }
    ],
    resultTextBlockIds: ['tb_stappen_gedrag_laag'],
    active: true
  },
  {
    id: 'rule_stappen_taal',
    name: 'Zorgwekkende taalachterstand - Diagnostiek',
    type: 'Advies vervolgstappen',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_st_1',
        type: 'category',
        targetId: 'taal_communicatie',
        operator: '<',
        value: 45
      }
    ],
    resultTextBlockIds: ['tb_stappen_taal_laag'],
    active: true
  },
  {
    id: 'rule_stappen_socem',
    name: 'Zorgwekkend sociaal-emotioneel - Interventie',
    type: 'Advies vervolgstappen',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_ss_1',
        type: 'category',
        targetId: 'sociaal_emotioneel',
        operator: '<',
        value: 50
      }
    ],
    resultTextBlockIds: ['tb_stappen_socem_laag'],
    active: true
  },
  {
    id: 'rule_stappen_besch',
    name: 'Zorgwekkende leefomgeving - Systeemgesprek',
    type: 'Advies vervolgstappen',
    logicalOperator: 'AND',
    conditions: [
      {
        id: 'cond_sb_1',
        type: 'category',
        targetId: 'beschermende_factoren',
        operator: '<',
        value: 45
      }
    ],
    resultTextBlockIds: ['tb_stappen_besch_laag'],
    active: true
  }
];

export const defaultSettings: AppSettings = {
  pdfSettings: {
    primaryColor: '#1e3a8a', // Blue 900
    secondaryColor: '#0f766e', // Teal 700
    showGraphs: true,
    headerTitle: 'Rapportage Profiel & Handelingsadvies',
    schoolName: 'Internationale Schakelklas (ISK)'
  },
  testMode: false
};

export const defaultAnalyses: any[] = [
  {
    id: 'mock_analysis_1',
    studentName: 'Casus 1',
    profile: {
      name: 'Casus 1',
      age: 16,
      timeInNL: '1-3 jaar',
      timeInEducation: '1-2 jaar',
      homeSituation: 'Woont bij ouders',
      schoolHistory: 'Voortgezet onderwijs'
    },
    answers: {
      g1: 4, g2: 4, g3: 4, g4: 3, g5: 3, g6: 4, g7: 4, g8: 5, g9: 2, g10: 1, g11: 3,
      t1: 2, t2: 2, t3: 2, t4: 4, t5: 3, t6: 3,
      s1: 2, s2: 4, s3: 2, s4: 4, s5: 2, s6: 4,
      b1: 4, b2: 3, b3: 2, b4: 1, b5: 2
    },
    categoryScores: {
      gedrag: { rawScore: 23, maxPossible: 55, percentage: 38 },
      taal_communicatie: { rawScore: 13, maxPossible: 30, percentage: 41 },
      sociaal_emotioneel: { rawScore: 11, maxPossible: 30, percentage: 34 },
      beschermende_factoren: { rawScore: 17, maxPossible: 25, percentage: 64 }
    },
    generatedReport: {
      Profielschets: ['tb_prof_gedrag_laag', 'tb_prof_taal_laag', 'tb_prof_socem_laag'],
      Handelingsadvies: ['tb_hand_gedrag_laag', 'tb_hand_taal_laag', 'tb_hand_socem_laag'],
      Reflectiestimulering: ['tb_refl_gedrag_laag', 'tb_refl_taal_laag', 'tb_refl_socem_laag'],
      'Advies vervolgstappen': ['tb_stappen_gedrag_laag', 'tb_stappen_taal_laag', 'tb_stappen_socem_laag']
    },
    customNotes: 'Amir is een gemotiveerde jongen, maar de taalbarrière en faalangst zitten hem enorm in de weg. Thuis is er wel steun, maar weinig kennis van het Nederlandse onderwijssysteem.',
    createdAt: '2026-06-25T14:30:00.000Z'
  }
];
