const exam = new Date('2026-10-18T13:00:00-03:00');
const LS='oab47-const-v2';
let state=JSON.parse(localStorage.getItem(LS)||'{"done":{},"errors":[],"scores":[],"notes":[],"guideStage":0,"guideChoice":"","guideFinished":false,"reviews":[]}');
function save(){persistDaySession();localStorage.setItem(LS,JSON.stringify(state));renderProgress();}

const days=[
 {date:'06/10',iso:'2026-10-06',title:'Diagnóstico + ADPF na prática',focus:'Aprender fazendo, com Vade aberto',tasks:['Concluir sessão guiada','Localizar 4 fundamentos no Vade','Fazer anotação de memória','Responder revisão ativa']},
 {date:'07/10',iso:'2026-10-07',title:'Mandado de Segurança + Ação Popular',focus:'Cabimento, legitimidade e pedidos',tasks:['Sessão guiada MS','Lei 12.016/09 no Vade','Sessão guiada Ação Popular','4 discursivas oficiais referenciadas']},
 {date:'08/10',iso:'2026-10-08',title:'MI + Habeas Data',focus:'Distinguir remédios constitucionais',tasks:['MI: CF + Lei 13.300/16','HD: CF + Lei 9.507/97','Quadro de diferenças','1 peça reduzida']},
 {date:'09/10',iso:'2026-10-09',title:'ADI, ADC, ADO e ADPF',focus:'Controle concentrado',tasks:['Art. 102 e 103 CF','Lei 9.868/99','Lei 9.882/99','20 identificações rápidas']},
 {date:'10/10',iso:'2026-10-10',title:'Controle de constitucionalidade',focus:'Competência, objeto e efeitos',tasks:['Difuso x concentrado','Legitimados art. 103','Cautelar e modulação','4 discursivas']},
 {date:'11/10',iso:'2026-10-11',title:'RE + Reclamação',focus:'Recursos e competência',tasks:['CF art. 102 III','CPC art. 988','CPC 1.029+','1 peça reduzida']},
 {date:'12/10',iso:'2026-10-12',title:'Direitos fundamentais',focus:'Discursivas',tasks:['Art. 5º','Nacionalidade','Direitos políticos','20 questões']},
 {date:'13/10',iso:'2026-10-13',title:'Estado e Poderes',focus:'Federalismo e competências',tasks:['Arts. 18–36','Competências','Processo legislativo','4 discursivas']},
 {date:'14/10',iso:'2026-10-14',title:'DIA 1 — Espelho universal + remédios constitucionais',focus:'Dominar a estrutura única e distinguir MS, MI, HD e Ação Popular',tasks:['Decorar espelho universal','MS + MI','HD + Ação Popular','Vade: localizar leis em até 60s','1 peça completa sem copiar'],blocks:[['08:00–09:00','Espelho universal','Memorizar a ordem: endereçamento → parte → peça/fundamento → fatos → cabimento/competência/legitimidade/prazo → direito → urgência → pedidos → fechamento.'],['09:10–11:10','Mandado de Segurança + Mandado de Injunção','Gatilhos, competência, legitimidade, prazo, fundamentos e pedidos. Fazer rascunho universal dos dois.'],['11:20–12:20','Vade Mecum — remédios','CF art. 5º, LXIX a LXXIII + Leis 12.016/09, 13.300/16, 9.507/97 e 4.717/65. Treinar localização.'],['14:00–16:00','Habeas Data + Ação Popular','Distinguir gatilhos e montar 2 esqueletos reduzidos usando o mesmo espelho.'],['16:15–17:00','Identificação rápida','20 mini-casos: descobrir peça + fundamento + competência antes de olhar resposta.'],['19:00–21:00','Peça completa','Redigir 1 peça do zero com Vade e corrigir pelo checklist universal.']]},
 {date:'15/10',iso:'2026-10-15',title:'DIA 2 — Controle concentrado + Constituição essencial',focus:'ADI, ADC, ADO, ADPF + artigos constitucionais que mais geram tese',tasks:['ADI/ADC/ADO/ADPF','CF arts. 102–103','Direitos fundamentais','Federação/competências','Processo legislativo','4 discursivas'],blocks:[['08:00–10:00','ADI + ADC','Objeto, legitimados, competência, cautelar, pedidos e diferenças.'],['10:10–12:00','ADO + ADPF','Omissão objetiva x MI; subsidiariedade da ADPF; Lei 9.868/99 e Lei 9.882/99.'],['14:00–15:20','Direitos fundamentais','Art. 5º + nacionalidade + direitos políticos. Treinar resposta: conclusão → regra → artigo → aplicação.'],['15:30–17:00','Federação e competências','CF arts. 18, 21–24, 25 e 30. Material x legislativa; União x Estado x Município.'],['17:10–18:00','Poderes e processo legislativo','CF arts. 44–69, art. 84, art. 97 e noções de reserva de plenário.'],['19:00–21:00','Treino FGV','4 discursivas + 2 esqueletos de peça concentrada. Corrigir ponto por ponto.']]},
 {date:'16/10',iso:'2026-10-16',title:'DIA 3 — Recursos + simulado completo',focus:'RE, Reclamação e execução de uma prova inteira em tempo real',tasks:['RE + Reclamação','Revisão de competência','Simulado 5h','Correção pelo espelho','Caderno de erros'],blocks:[['08:00–09:30','Recurso Extraordinário','CF art. 102, III + CPC 1.029 e seguintes; cabimento, repercussão geral e estrutura.'],['09:40–10:40','Reclamação','CPC art. 988 + hipóteses constitucionais; diferenciar de RE.'],['10:50–11:30','Revisão pré-simulado','Espelho universal + gatilhos das 10 peças + endereçamentos principais.'],['13:00–18:00','SIMULADO REAL','1 peça + 4 questões, Vade permitido, sem consultar respostas. Reservar 20 min finais para revisão.'],['19:00–20:00','Correção objetiva','Espelho FGV: marcar perda por peça, artigo, tese, pedido, competência ou tempo.'],['20:00–20:30','Caderno de erros','Transformar cada perda relevante em uma regra de uma linha para revisar amanhã.']]},
 {date:'17/10',iso:'2026-10-17',title:'DIA 4 — Revisão final + velocidade no Vade',focus:'Consolidar tudo, corrigir fraquezas e chegar descansado',tasks:['Corrigir erros do simulado','Mapa das 10 peças','Vade em velocidade','4 respostas curtas','Checklist da prova','Encerrar cedo'],blocks:[['08:00–09:30','Erros do simulado','Refazer apenas o que perdeu ponto. Não estudar tema novo.'],['09:40–10:40','Mapa das peças','MS, MI, HD, Ação Popular, ADI, ADC, ADO, ADPF, RE e Reclamação: gatilho + artigo + competência.'],['10:50–11:40','Corrida no Vade','Localizar 15 dispositivos/leis em até 60 segundos cada.'],['14:00–15:00','Constituição essencial','Art. 5º; 18; 21–24; 30; 37; 59–69; 84; 97; 102–103; 125 §2º.'],['15:10–16:10','Discursivas finais','4 respostas em formato FGV: conclusão + regra + artigo + aplicação.'],['16:20–17:00','Checklist da peça universal','Competência, legitimidade, cabimento, prazo, fatos, teses, urgência, pedidos e fechamento.'],['17:00 em diante','Preparar material e descansar','Documento, canetas, Vade permitido, água/lanche. Nada de conteúdo pesado à noite.']]}
];

const pieces=[
 ['Mandado de Segurança','Direito líquido e certo + prova pré-constituída + ato/omissão de autoridade.','CF art. 5º, LXIX/LXX • Lei 12.016/09'],
 ['Ação Popular','Cidadão contra ato lesivo ao patrimônio público, moralidade, meio ambiente ou patrimônio histórico-cultural.','CF art. 5º, LXXIII • Lei 4.717/65'],
 ['Mandado de Injunção','Omissão normativa inviabiliza direito/liberdade/prerrogativa constitucional.','CF art. 5º, LXXI • Lei 13.300/16'],
 ['Habeas Data','Acesso/retificação de dado pessoal em banco público ou de caráter público.','CF art. 5º, LXXII • Lei 9.507/97'],
 ['ADI','Lei/ato normativo federal ou estadual pós-CF em controle abstrato.','CF arts. 102, I, a e 103 • Lei 9.868/99'],
 ['ADC','Confirmação da constitucionalidade de lei/ato normativo federal.','CF arts. 102, I, a e 103 • Lei 9.868/99'],
 ['ADO','Omissão inconstitucional em controle objetivo.','CF art. 103, §2º • Lei 9.868/99'],
 ['ADPF','Lesão a preceito fundamental; inclui hipóteses como normas pré-constitucionais, observada subsidiariedade.','CF art. 102, §1º • Lei 9.882/99'],
 ['Recurso Extraordinário','Decisão de única/última instância nas hipóteses constitucionais.','CF art. 102, III • CPC arts. 1.029+'],
 ['Reclamação','Preservar competência/autoridade de decisões nas hipóteses legais.','CPC art. 988']
];


const universalExamples={
 '1. Endereçamento':{
  intro:'O endereçamento depende de quem praticou o ato, da competência e da peça. Primeiro descubra o órgão competente; só depois escreva.',
  examples:[
   ['MS contra autoridade municipal/estadual','Excelentíssimo Senhor Doutor Juiz de Direito da ___ Vara da Fazenda Pública da Comarca de ______.'],
   ['MS contra autoridade federal, quando a competência for da Justiça Federal','Excelentíssimo Senhor Doutor Juiz Federal da ___ Vara Federal da Seção Judiciária de ______.'],
   ['ADI / ADC / ADO / ADPF no STF','Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal.'],
   ['Recurso Extraordinário','Excelentíssimo Senhor Desembargador Presidente do Tribunal de Justiça do Estado de ______. (petição de interposição, conforme o caso)'],
   ['Reclamação ao STF','Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal.']
  ],
  alert:'Não decore um único endereçamento. A FGV pode mudar a autoridade, o ente ou o órgão competente. Use o exemplo como molde e confirme a competência no enunciado.'
 },
 '2. Partes e legitimidade':{
  intro:'Mostre quem ajuíza/impetra, contra quem e por que essa pessoa ou entidade pode usar aquela peça.',
  examples:[
   ['Mandado de Segurança','FULANO DE TAL, nacionalidade, estado civil, profissão, portador do CPF nº..., residente..., por seu advogado, vem, com fundamento no art. 5º, LXIX, da CF e na Lei 12.016/09, impetrar MANDADO DE SEGURANÇA em face de ato do SECRETÁRIO ______.'],
   ['Ação Popular','FULANO DE TAL, cidadão, conforme título eleitoral anexo, por seu advogado, vem propor AÇÃO POPULAR...'],
   ['ADI/ADC/ADO/ADPF','PARTIDO POLÍTICO ______, com representação no Congresso Nacional, por seu advogado, vem propor ______, com fundamento nos arts. 102 e 103 da CF...']
  ],
  alert:'Sempre procure no enunciado a qualidade que gera legitimidade: cidadão, partido com representação no Congresso, confederação sindical, autoridade coatora etc.'
 },
 '3. Cabimento':{
  intro:'Aqui você explica por que aquela peça é exatamente a adequada para o problema apresentado.',
  examples:[
   ['MS','O presente Mandado de Segurança é cabível porque o ato da autoridade coatora viola direito líquido e certo do impetrante, demonstrável por prova pré-constituída, não se tratando de hipótese de habeas corpus ou habeas data.'],
   ['ADPF','A presente ADPF é cabível porque se busca evitar lesão a preceito fundamental decorrente de ato do Poder Público, inexistindo outro meio eficaz de sanar a lesividade.'],
   ['MI','O Mandado de Injunção é cabível porque a ausência de norma regulamentadora inviabiliza o exercício do direito constitucional assegurado ao impetrante.']
  ],
  alert:'Cabimento = fato do enunciado + requisito jurídico da peça. Não escreva apenas “é cabível nos termos do artigo X”.'
 },
 '4. Fatos essenciais':{
  intro:'Conte somente o necessário para o julgador entender o problema jurídico. Normalmente bastam 1 a 3 parágrafos curtos.',
  examples:[
   ['Exemplo','O Estado Alfa editou a Lei nº X disciplinando matéria reservada constitucionalmente à União. Com base nessa lei, o Secretário Estadual aplicou multa ao impetrante. O ato foi documentado e produz efeitos imediatos.']
  ],
  alert:'Não copie o enunciado inteiro. Se um fato não muda competência, cabimento, fundamento ou pedido, provavelmente pode ser resumido.'
 },
 '5. Fundamentação geral':{
  intro:'Abra a tese com a regra constitucional mais ampla que organiza o caso.',
  examples:[
   ['Supremacia da Constituição','A Constituição ocupa posição hierarquicamente superior no ordenamento, razão pela qual os atos normativos infraconstitucionais devem observar as competências e limitações nela estabelecidas.'],
   ['Separação dos Poderes','Nos termos do art. 2º da CF, são independentes e harmônicos entre si os Poderes Legislativo, Executivo e Judiciário, sendo vedada interferência incompatível com a repartição constitucional de funções.'],
   ['Administração Pública','A atuação administrativa deve observar os princípios da legalidade, impessoalidade, moralidade, publicidade e eficiência, previstos no art. 37, caput, da CF.']
  ],
  alert:'O fundamento geral prepara a resposta, mas normalmente não basta sozinho para pontuar tudo. Depois venha com o dispositivo específico.'
 },
 '6. Fundamentação específica':{
  intro:'Agora cite a regra que resolve exatamente o ponto discutido e aplique-a ao fato.',
  examples:[
   ['Competência privativa da União','A matéria é de competência legislativa privativa da União, conforme o art. 22, inciso ___, da CF. Como a lei estadual disciplinou justamente essa matéria, há vício formal de competência.'],
   ['Livre iniciativa','A restrição também viola a livre iniciativa, fundamento da ordem econômica previsto no art. 170 da CF, pois impede o exercício lícito da atividade sem base constitucional válida.'],
   ['Meio ambiente','Nos termos do art. 225 da CF, todos têm direito ao meio ambiente ecologicamente equilibrado, incumbindo ao Poder Público e à coletividade o dever de protegê-lo.']
  ],
  alert:'Na prova, procure o inciso/parágrafo exato. É comum a FGV separar pontos entre a tese correta e a indicação precisa do dispositivo.'
 },
 '7. Tutela urgente, se houver':{
  intro:'Só peça liminar/tutela se o caso trouxer urgência ou risco concreto e a peça permitir.',
  examples:[
   ['MS','Estão presentes os requisitos para a concessão da medida liminar, pois a fundamentação demonstra a relevância do direito invocado e a manutenção do ato impugnado poderá causar dano de difícil reparação. Requer-se, portanto, a suspensão imediata dos efeitos do ato coator.'],
   ['Controle concentrado','Diante da relevância da matéria e do risco de continuidade dos efeitos da norma impugnada, requer-se a concessão da medida cautelar, nos termos da legislação específica.']
  ],
  alert:'Use os requisitos da lei da própria peça. Evite copiar uma fórmula de tutela do CPC quando houver regra específica.'
 },
 '8. Pedidos':{
  intro:'Transforme cada fundamento importante em um pedido objetivo. Use itens para não esquecer nenhum.',
  examples:[
   ['MS','a) concessão da medida liminar; b) notificação da autoridade coatora para prestar informações; c) ciência ao órgão de representação judicial da pessoa jurídica interessada; d) oitiva do Ministério Público; e) ao final, concessão definitiva da segurança para afastar o ato impugnado.'],
   ['ADI','a) concessão da cautelar, se cabível; b) requisição de informações; c) manifestação do AGU e do PGR, quando aplicável; d) ao final, declaração de inconstitucionalidade da norma impugnada.']
  ],
  alert:'Antes de fechar a peça, compare mentalmente “fundamento ↔ pedido”. Se você desenvolveu uma tese importante e não pediu a consequência correspondente, pode perder pontos.'
 },
 '9. Fechamento':{
  intro:'Finalize com os elementos formais que a peça exigir e evite inventar dados que o enunciado não forneceu.',
  examples:[
   ['Modelo','Diante do exposto, pede deferimento.\nLocal, data.\nAdvogado(a)\nOAB nº ______.'],
   ['Valor da causa, quando cabível','Dá-se à causa o valor de R$ ______, para efeitos legais.']
  ],
  alert:'Se o enunciado não trouxer nome, OAB, local ou data, use espaços/reticências ou a forma neutra normalmente aceita em treino. Não invente informações.'
 }
};

const universalSkeleton=[
 ['1. Endereçamento','Identifique primeiro o órgão competente. Escreva o endereçamento somente depois de fechar competência e peça.'],
 ['2. Partes e legitimidade','Quem pede? Contra quem? Qual dispositivo dá legitimidade ativa e passiva?'],
 ['3. Cabimento','Explique o gatilho do instrumento e conecte-o ao fato. Nunca deixe apenas o número do artigo.'],
 ['4. Fatos essenciais','Resuma só os fatos juridicamente relevantes, sem recontar todo o enunciado.'],
 ['5. Fundamentação geral','Abra com a moldura constitucional: supremacia da Constituição, direitos fundamentais, separação dos Poderes, federalismo, princípios da Administração ou outro eixo realmente ligado ao caso.'],
 ['6. Fundamentação específica','Localize a regra exata que resolve a controvérsia: competência, direito fundamental, iniciativa legislativa, requisito do remédio, objeto do controle etc.'],
 ['7. Tutela urgente, se houver','Demonstre os requisitos próprios da medida liminar/tutela usando os fatos concretos do enunciado.'],
 ['8. Pedidos','Cada fundamento importante deve desembocar em pedido compatível com a peça.'],
 ['9. Fechamento','Valor da causa quando cabível, local/data, advogado(a) e OAB. Revise competência, legitimidade, cabimento e pedidos.']
];

// Modelos completos carregados de pieces_complete.js

const foundationLayers=[
 {title:'1. Supremacia da Constituição',law:'Estrutura do sistema constitucional + dispositivo específico violado',tip:'Use como fundamento geral: a norma inferior não pode contrariar a Constituição. Em seguida, cite a regra constitucional exata que foi violada. Não pare na expressão “supremacia da Constituição”.'},
 {title:'2. Separação dos Poderes',law:'CF art. 2º',tip:'Útil em processo legislativo, competências institucionais, interferência indevida entre Poderes e funções típicas/atípicas.'},
 {title:'3. Simetria constitucional',law:'Use a norma constitucional-modelo aplicável ao caso (ex.: arts. 29, 60, 61 etc.)',tip:'É princípio construído a partir do desenho constitucional. Na prova, ancore a resposta no dispositivo concreto que deve ser reproduzido ou observado por Estados/Municípios.'},
 {title:'4. Federação e repartição de competências',law:'CF arts. 18, 21, 22, 23, 24, 25, 29 e 30',tip:'Pergunte sempre: qual ente? qual matéria? competência material ou legislativa? privativa, comum, concorrente ou local?'},
 {title:'5. Direitos e garantias fundamentais',law:'CF art. 5º + arts. 6º a 17 conforme o tema',tip:'Localize liberdade, igualdade, associação, devido processo, prova ilícita, remédios constitucionais, nacionalidade e direitos políticos.'},
 {title:'6. Administração Pública',law:'CF art. 37, caput e parágrafos',tip:'LEGALIDADE, IMPESSOALIDADE, MORALIDADE, PUBLICIDADE e EFICIÊNCIA são fundamentos gerais recorrentes; depois ligue ao vício específico.'},
 {title:'7. Cláusulas pétreas',law:'CF art. 60, §4º',tip:'Use quando houver emenda ou proposta de emenda atingindo federação, voto, separação dos Poderes ou direitos e garantias individuais.'},
 {title:'8. Ordem econômica e livre iniciativa',law:'CF art. 170 e parágrafo único',tip:'Útil em restrições estatais à atividade econômica; combine com competência e legalidade específica.'},
 {title:'9. Direitos sociais',law:'CF arts. 6º a 11; educação arts. 205+; saúde arts. 196+',tip:'Quando o caso envolver prestação social, identifique o direito e a norma constitucional específica, evitando fundamentação abstrata demais.'},
 {title:'10. Meio ambiente',law:'CF art. 225',tip:'É direito constitucional com deveres do Poder Público e da coletividade. Em Ação Popular, compare também com CF art. 5º, LXXIII.'}
];

const vadeAtlas=[
 {group:'Núcleo constitucional',items:[['Princípios fundamentais','CF arts. 1º a 4º'],['Direitos fundamentais','CF art. 5º'],['Direitos sociais','CF arts. 6º a 11'],['Nacionalidade','CF arts. 12 e 13'],['Direitos políticos','CF arts. 14 a 16'],['Federação','CF arts. 18 a 36'],['Administração Pública','CF arts. 37 a 41'],['Processo legislativo','CF arts. 59 a 69'],['STF e controle','CF arts. 102 e 103'],['Controle estadual','CF art. 125, §2º'],['Ordem econômica','CF art. 170'],['Educação','CF arts. 205+'],['Meio ambiente','CF art. 225']]},
 {group:'Remédios constitucionais',items:[['Mandado de Segurança','CF art. 5º, LXIX/LXX ↔ Lei 12.016/09'],['Ação Popular','CF art. 5º, LXXIII ↔ Lei 4.717/65'],['Mandado de Injunção','CF art. 5º, LXXI ↔ Lei 13.300/16'],['Habeas Data','CF art. 5º, LXXII ↔ Lei 9.507/97']]},
 {group:'Controle concentrado',items:[['ADI/ADC','CF arts. 102, I, a, e 103 ↔ Lei 9.868/99'],['ADO','CF art. 103, §2º ↔ Lei 9.868/99, arts. 12-A+'],['ADPF','CF art. 102, §1º ↔ Lei 9.882/99, arts. 1º e 4º, §1º']]},
 {group:'Recursos e competência',items:[['Recurso Extraordinário','CF art. 102, III ↔ CPC arts. 1.029+'],['Repercussão geral','CPC art. 1.035'],['Reclamação','CPC art. 988; conferir CF art. 103-A, §3º e Lei 11.417/06 quando houver súmula vinculante']]}
];

const pastBank=[
 {exam:'46º EOU • 2026',piece:'ADPF',themes:'Norma estadual pré-CF/88; competência municipal; direito civil; desapropriação; subsidiariedade.',url:'https://oab.fgv.br/arq/649/219541_OAB%2046%20-%20PADR%C3%83O%20DE%20RESPOSTA%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL.pdf',tip:'Gatilho: norma anterior à CF/88 + controle concentrado perante STF → testar ADPF e subsidiariedade.'},
 {exam:'45º EOU • 2026',piece:'Mandado de Segurança',themes:'Lei municipal sobre atividade nuclear; competência da União; livre iniciativa; ato concreto de Secretário.',url:'https://oab.fgv.br/arq/648/370758_OAB%2045%20-%20PADR%C3%83O%20DE%20RESPOSTA%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL.pdf',tip:'Exemplo perfeito do método geral + específico: supremacia/ordem constitucional → competência da União → livre iniciativa → MS contra ato concreto.'},
 {exam:'44º EOU • 2025',piece:'Ação Popular',themes:'Moralidade, impessoalidade, eficiência/economicidade, lesão ao patrimônio público e licitação.',url:'https://oab.fgv.br/arq/647/296637_OAB44%20-%20B003%20%28DIREITO%20CONSTITUCIONAL%29%20-%20GABARITO%20PUBLICA%C3%87%C3%83O.pdf',tip:'Gatilho: cidadão + ato lesivo/moralidade + necessidade de instrução probatória + proteção do patrimônio público.'},
 {exam:'43º EOU • 2025',piece:'Mandado de Segurança',themes:'Lei municipal invadindo competência privativa da União; liberdade de associação; multa vinculada ao salário mínimo.',url:'https://oab.fgv.br/arq/646/1409692_OAB%2043%20-%20GABARITO%20JUSTIFICADO%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL_2.pdf',tip:'A inconstitucionalidade da lei é fundamento incidental; a peça continua sendo MS porque existe ato concreto de autoridade e prova pré-constituída.'},
 {exam:'42º EOU • 2025',piece:'Reclamação',themes:'Súmula vinculante; precatório; honorários alimentares; esgotamento administrativo; tutela de evidência.',url:'https://oab.fgv.br/arq/645/1225075_OAB%2042%20-%20GABARITO%20JUSTIFICADO%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL.pdf',tip:'Gatilho: ato que afronta súmula vinculante + hipótese própria de reclamação; atenção ao art. 988 do CPC.'}
];


const recentQuestionThemes={
 '46º EOU • 2026':['Q1 — competência municipal, preferência entre brasileiros, igualdade/impessoalidade','Q2 — iniciativa do Presidente, emenda parlamentar com aumento de despesa e promulgação','Q3 — nacionalidade brasileira nata e extradição','Q4 — símbolos municipais e controle concentrado no Tribunal de Justiça'],
 '45º EOU • 2026':['Q1 — distinções entre brasileiros, locomoção e cabotagem por embarcações estrangeiras','Q2 — legitimidade da Ação Popular e reserva de lei complementar para inelegibilidades','Q3 — prova ilícita, intimidade/sigilo de dados e prerrogativa parlamentar','Q4 — ADI durante vacatio legis e interpretação conforme a Constituição'],
 '44º EOU • 2025':['Q1 — iniciativa popular municipal e iniciativa privativa para remuneração de servidores','Q2 — direitos do preso: comunicação do local e identificação dos responsáveis pela prisão','Q3 — reforma da Lei Orgânica, simetria e ADPF contra norma municipal','Q4 — radiodifusão (União) e ordenação territorial (Município)'],
 '43º EOU • 2025':['Q1 — subsídio de vereadores e competência da Câmara Municipal','Q2 — liberdade provisória e subsidiariedade da ADPF quando cabe ADI','Q3 — interesse local, livre iniciativa e livre concorrência','Q4 — delegação de competência federal e competência recursal do TRF'],
 '42º EOU • 2025':['Q1 — liberdade de expressão, vedação à censura e direito de petição','Q2 — Mandado de Injunção versus ADO','Q3 — competência material da União e competência originária do STF','Q4 — intervenção estadual em Município por dívida fundada']
};

const allOfficialEditions=[{"label":"46º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=649"},{"label":"45º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=648"},{"label":"44º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=647"},{"label":"43º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=646"},{"label":"42º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=645"},{"label":"41º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=644"},{"label":"40º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=643"},{"label":"39º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=642"},{"label":"38º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=641"},{"label":"37º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=640"},{"label":"36º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=639"},{"label":"35º EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=638"},{"label":"XXXIV EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=637"},{"label":"XXXIII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=636"},{"label":"XXXII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=635"},{"label":"XXXI EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=634"},{"label":"XXX EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=633"},{"label":"XXIX EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=632"},{"label":"XXVIII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=631"},{"label":"XXVII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=630"},{"label":"XXVI EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=629"},{"label":"XXV EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=628"},{"label":"XXIV EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=627"},{"label":"XXIII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=626"},{"label":"XXII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=625"},{"label":"XXI EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=624"},{"label":"XX EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=621"},{"label":"XIX EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=620"},{"label":"XVIII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=617"},{"label":"XVII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=616"},{"label":"XVI EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=615"},{"label":"XV EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=513"},{"label":"XIV EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=461"},{"label":"XIII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=421"},{"label":"XII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=382"},{"label":"XI EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=336"},{"label":"X EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=303"},{"label":"IX EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=270"},{"label":"VIII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=240"},{"label":"VII EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=168"},{"label":"VI EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=165"},{"label":"V EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=163"},{"label":"IV EXAME DE ORDEM UNIFICADO","url":"https://oab.fgv.br/home.aspx?key=157"},{"label":"EXAME DE ORDEM UNIFICADO 2010.3","url":"https://oab.fgv.br/home.aspx?key=134"},{"label":"EXAME DE ORDEM UNIFICADO 2010.2","url":"https://oab.fgv.br/home.aspx?key=112"}];

const historicalArchive={name:'Arquivo oficial completo FGV/OAB',url:'https://oab.fgv.br/Default.aspx',note:'A página oficial reúne os exames anteriores, do atual aos Exames Unificados mais antigos. Use o banco abaixo como índice orientado e o arquivo oficial para ampliar o treino.'};

const official={
 exam46:'https://oab.fgv.br/arq/649/519639_OAB46%20-%20B003%20(DIREITO%20CONSTITUCIONAL).pdf',
 answer43:'https://oab.fgv.br/arq/646/1409692_OAB%2043%20-%20GABARITO%20JUSTIFICADO%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL_2.pdf'
};

const guide={
 source:'46º Exame de Ordem — Constitucional — FGV',
 sourceUrl:official.exam46,
 title:'Treino guiado 01 — descubra a peça com o Vade na mão',
 summary:'Um partido político com representação no Congresso quer levar ao STF, em controle concentrado, uma lei estadual editada em 1984 e confrontá-la com a Constituição de 1988. A lei continua formalmente em vigor e voltará a ser exigida.',
 choices:['ADI','ADC','ADPF','Mandado de Segurança'],
 correct:'ADPF',
 why:'A norma é anterior à Constituição de 1988. No controle concentrado perante o STF, esse é um forte gatilho para ADPF, desde que atendidos os requisitos legais, inclusive a subsidiariedade.',
 vade:[
  ['1','Constituição Federal','Abra o art. 102, §1º','Leia até entender qual instrumento constitucional está previsto ali.'],
  ['2','Lei 9.882/1999','Abra o art. 1º e seu parágrafo único','Procure a hipótese envolvendo controvérsia constitucional sobre ato normativo anterior à Constituição.'],
  ['3','Lei 9.882/1999','Abra o art. 4º, §1º','Leia a regra da subsidiariedade: a ADPF não é usada quando houver outro meio eficaz.'],
  ['4','Constituição Federal','Abra o art. 103, VIII','Confirme a legitimidade do partido político com representação no Congresso Nacional.']
 ],
 notebook:[
  'NORMA PRÉ-CF/88 + controle concentrado no STF → lembre de ADPF.',
  'Sempre verificar subsidiariedade: Lei 9.882/99, art. 4º, §1º.',
  'Partido com representação no Congresso: legitimado do art. 103, VIII, CF.',
  'Na prova, fundamento + explicação valem mais do que apenas jogar o número do artigo.'
 ],
 memory:[
  ['Qual peça tende a caber para discutir, no STF e em controle concentrado, norma anterior à CF/88?','ADPF'],
  ['Onde está a subsidiariedade da ADPF?','Lei 9.882/99, art. 4º, §1º'],
  ['Qual dispositivo da CF prevê a ADPF?','CF, art. 102, §1º'],
  ['Partido com representação no Congresso é legitimado em qual artigo?','CF, art. 103, VIII']
 ]
};


function makeDailyGuide(overrides){return {...guide,source:'Material guiado do dia',sourceUrl:'',...overrides};}
const dailyGuides={
 '2026-10-07':makeDailyGuide({
  title:'Treino guiado — Mandado de Segurança',prompt:'Qual é o instrumento mais adequado?',
  summary:'Uma pessoa sofre ato ilegal de autoridade pública que viola direito líquido e certo, comprovável de plano, sem hipótese de habeas corpus ou habeas data.',
  choices:['Mandado de Segurança','Ação Popular','Mandado de Injunção','ADPF'],correct:'Mandado de Segurança',
  why:'Direito líquido e certo, prova pré-constituída e ato de autoridade apontam para Mandado de Segurança.',
  vade:[['1','Constituição Federal','Art. 5º, LXIX','Localize a garantia do mandado de segurança individual.'],['2','Lei 12.016/2009','Art. 1º','Confira a hipótese de cabimento.'],['3','Lei 12.016/2009','Art. 6º','Observe os elementos essenciais da petição.'],['4','Lei 12.016/2009','Art. 23','Revise o prazo decadencial de 120 dias.']],
  notebook:['MS protege direito líquido e certo não amparado por HC ou HD.','Exige prova pré-constituída.','A autoridade coatora precisa ser corretamente identificada.','Atenção ao prazo de 120 dias.'],
  memory:[['Qual o núcleo do MS?','Direito líquido e certo + prova pré-constituída + ato/omissão de autoridade.'],['Qual o prazo legal mais lembrado?','120 dias.'],['Onde está a garantia constitucional?','CF, art. 5º, LXIX.'],['Qual a lei do MS?','Lei 12.016/2009.']]
 }),
 '2026-10-08':makeDailyGuide({
  title:'Treino guiado — Mandado de Injunção + Habeas Data',prompt:'Qual é o instrumento principal no caso?',
  summary:'Uma prerrogativa prevista na Constituição não pode ser exercida porque falta a norma regulamentadora necessária para torná-la efetiva.',
  choices:['Mandado de Injunção','Habeas Data','Mandado de Segurança','ADI'],correct:'Mandado de Injunção',
  why:'Omissão normativa que inviabiliza o exercício de direito, liberdade ou prerrogativa constitucional é o gatilho clássico do Mandado de Injunção.',
  vade:[['1','Constituição Federal','Art. 5º, LXXI','Leia a previsão constitucional do MI.'],['2','Lei 13.300/2016','Art. 2º','Confira a hipótese de cabimento.'],['3','Lei 13.300/2016','Art. 3º','Revise legitimidade ativa e passiva.'],['4','Constituição Federal','Art. 5º, LXXII','Compare com o Habeas Data para não confundir.']],
  notebook:['MI: falta de norma regulamentadora inviabiliza direito constitucional.','HD: acesso ou retificação de dados pessoais em registros públicos ou de caráter público.','Na prova, diferencie omissão normativa de negativa de acesso a informação pessoal.','Lei do MI: 13.300/2016; Lei do HD: 9.507/1997.'],
  memory:[['Qual o gatilho do MI?','Omissão normativa que impede direito constitucional.'],['Qual o artigo do MI na CF?','Art. 5º, LXXI.'],['Qual o núcleo do HD?','Conhecer ou retificar dados pessoais.'],['Qual a lei do MI?','Lei 13.300/2016.']]
 }),
 '2026-10-09':makeDailyGuide({
  title:'Treino guiado — ADI, ADC, ADO e ADPF',prompt:'Qual ação de controle concentrado é a principal?',
  summary:'Uma lei estadual posterior à Constituição é impugnada em tese perante o STF por legitimado do art. 103, por incompatibilidade direta com a Constituição Federal.',
  choices:['ADI','ADC','ADO','ADPF'],correct:'ADI',
  why:'Lei ou ato normativo federal ou estadual posterior à Constituição, impugnado em controle abstrato perante o STF, aponta para ADI.',
  vade:[['1','Constituição Federal','Art. 102, I, a','Veja a competência originária do STF.'],['2','Constituição Federal','Art. 103','Revise os legitimados.'],['3','Lei 9.868/1999','Arts. 2º e seguintes','Localize a disciplina da ADI/ADC.'],['4','Lei 9.882/1999','Art. 4º, §1º','Compare a subsidiariedade da ADPF.']],
  notebook:['ADI: controle abstrato de lei/ato normativo federal ou estadual.','ADC: busca confirmação da constitucionalidade de norma federal.','ADO: combate omissão inconstitucional.','ADPF: proteção de preceito fundamental com subsidiariedade.'],
  memory:[['Qual ação tende a impugnar lei estadual pós-CF em tese?','ADI.'],['Onde estão os legitimados?','CF, art. 103.'],['Qual lei disciplina ADI e ADC?','Lei 9.868/1999.'],['Qual ação exige atenção à subsidiariedade?','ADPF.']]
 }),
 '2026-10-10':makeDailyGuide({
  title:'Treino guiado — Controle de constitucionalidade',prompt:'Qual técnica de controle está sendo usada?',
  summary:'Em um processo concreto, a parte sustenta que a norma aplicável ao seu caso é incompatível com a Constituição e pede que ela não seja aplicada naquela controvérsia.',
  choices:['Controle difuso','Controle concentrado','ADC','ADO'],correct:'Controle difuso',
  why:'A discussão surge incidentalmente em caso concreto, característica do controle difuso.',
  vade:[['1','Constituição Federal','Art. 97','Revise a cláusula de reserva de plenário.'],['2','Constituição Federal','Art. 102, III','Relacione controle difuso e recurso extraordinário.'],['3','Constituição Federal','Art. 52, X','Revise a competência do Senado no modelo constitucional.'],['4','Constituição Federal','Arts. 102 e 103','Compare com o controle concentrado.']],
  notebook:['Difuso nasce em caso concreto e de forma incidental.','Concentrado discute a norma em tese.','Reserva de plenário: art. 97 da CF.','Sempre identifique competência, objeto e efeitos.'],
  memory:[['Caso concreto + questão incidental indica qual controle?','Difuso.'],['Qual artigo traz reserva de plenário?','CF, art. 97.'],['Quem julga ADI no plano federal?','STF.'],['Qual artigo reúne legitimados do controle abstrato?','CF, art. 103.']]
 }),
 '2026-10-11':makeDailyGuide({
  title:'Treino guiado — Recurso Extraordinário + Reclamação',prompt:'Qual instrumento é o mais adequado?',
  summary:'Após decisão de única ou última instância, a controvérsia envolve questão constitucional enquadrável nas hipóteses do art. 102, III, da Constituição.',
  choices:['Recurso Extraordinário','Reclamação','Mandado de Segurança','ADI'],correct:'Recurso Extraordinário',
  why:'O art. 102, III, da Constituição disciplina as hipóteses de Recurso Extraordinário ao STF.',
  vade:[['1','Constituição Federal','Art. 102, III','Leia as hipóteses do RE.'],['2','CPC','Art. 1.029','Revise as regras gerais dos recursos excepcionais.'],['3','CPC','Art. 1.035','Reveja repercussão geral.'],['4','CPC','Art. 988','Compare com as hipóteses de Reclamação.']],
  notebook:['RE exige questão constitucional nas hipóteses do art. 102, III.','Repercussão geral merece atenção.','Reclamação tem hipóteses próprias no art. 988 do CPC.','Não confunda sucedâneo recursal com reclamação.'],
  memory:[['Onde estão as hipóteses do RE?','CF, art. 102, III.'],['Qual dispositivo do CPC inicia a disciplina dos recursos excepcionais?','Art. 1.029.'],['Onde está a repercussão geral?','CPC, art. 1.035.'],['Onde está a Reclamação no CPC?','Art. 988.']]
 }),
 '2026-10-12':makeDailyGuide({
  title:'Treino guiado — Direitos fundamentais',prompt:'Qual caminho de revisão é mais eficiente hoje?',
  summary:'O foco do dia é reconhecer rapidamente direitos e garantias fundamentais, nacionalidade e direitos políticos, sempre ligando cada resposta ao dispositivo constitucional correspondente.',
  choices:['Identificar o direito e localizar o artigo','Ler toda a Constituição sem questões','Memorizar apenas números de artigos','Ignorar a fundamentação'],correct:'Identificar o direito e localizar o artigo',
  why:'Na 2ª fase, reconhecimento do instituto somado à fundamentação constitucional é mais útil do que memorização isolada.',
  vade:[['1','Constituição Federal','Art. 5º','Revise direitos e garantias fundamentais.'],['2','Constituição Federal','Arts. 12 e 13','Revise nacionalidade.'],['3','Constituição Federal','Arts. 14 a 16','Revise direitos políticos.'],['4','Constituição Federal','Art. 60, §4º','Relacione direitos e garantias com limites ao poder de reforma.']],
  notebook:['Sempre responda: instituto + dispositivo + aplicação ao caso.','Art. 5º é o centro da revisão de direitos fundamentais.','Nacionalidade e direitos políticos aparecem em blocos próprios.','Evite decorar artigo sem saber explicar a regra.'],
  memory:[['Onde começa o núcleo dos direitos e garantias fundamentais?','CF, art. 5º.'],['Onde está nacionalidade?','CF, arts. 12 e 13.'],['Onde estão direitos políticos?','CF, arts. 14 a 16.'],['Qual técnica de resposta usar?','Instituto + dispositivo + aplicação ao caso.']]
 }),
 '2026-10-13':makeDailyGuide({
  title:'Treino guiado — Estado e Poderes',prompt:'Qual método deve guiar a resolução?',
  summary:'O treino reúne federação, competências constitucionais, intervenção e processo legislativo, exigindo primeiro identificar o ente ou Poder competente.',
  choices:['Identificar competência antes de concluir','Começar pelo pedido sem fundamento','Escolher o ente por intuição','Memorizar só jurisprudência'],correct:'Identificar competência antes de concluir',
  why:'Questões de organização do Estado e dos Poderes normalmente exigem localizar primeiro a regra constitucional de competência.',
  vade:[['1','Constituição Federal','Arts. 18 a 36','Revise organização do Estado e intervenção.'],['2','Constituição Federal','Arts. 21 a 24','Compare competências da União e competências legislativas.'],['3','Constituição Federal','Arts. 44 a 69','Revise processo legislativo.'],['4','Constituição Federal','Arts. 76 a 91','Revise estrutura do Executivo.']],
  notebook:['Antes de responder, identifique ente, matéria e competência.','Diferencie competência material e legislativa.','No processo legislativo, observe iniciativa e quórum.','Federalismo costuma ser resolvido pela leitura combinada dos artigos de competência.'],
  memory:[['Qual o primeiro passo em questão federativa?','Identificar ente, matéria e competência.'],['Onde estão competências legislativas concorrentes?','CF, art. 24.'],['Onde começa o processo legislativo?','CF, art. 59.'],['Qual faixa constitucional trata da organização do Estado?','Arts. 18 a 36.']]
 }),
 '2026-10-14':makeDailyGuide({title:'DIA 1 — Espelho universal + remédios constitucionais',prompt:'Qual é a missão de hoje?',summary:'Hoje você fixa uma única estrutura universal e aprende a adaptar essa mesma estrutura aos quatro remédios: Mandado de Segurança, Mandado de Injunção, Habeas Data e Ação Popular.',choices:['Dominar o espelho universal e adaptar aos quatro remédios','Decorar quatro peças palavra por palavra','Ler legislação sem montar rascunho','Fazer apenas questões sem peça'],correct:'Dominar o espelho universal e adaptar aos quatro remédios',why:'Com poucos dias, a forma mais segura é automatizar uma estrutura única e trocar apenas os elementos específicos de cada peça.',vade:[['1','Constituição Federal','Art. 5º, LXIX a LXXIII','Localize MS, MI, HD e Ação Popular.'],['2','Lei 12.016/09','Arts. 1º, 6º, 7º, 12 e 23','MS: cabimento, autoridade, liminar, MP e 120 dias.'],['3','Lei 13.300/16','Arts. 2º, 3º, 5º, 7º e 8º','MI: omissão, legitimidade, informações, MP e solução da mora.'],['4','Leis 9.507/97 e 4.717/65','Dispositivos de cabimento e legitimidade','HD e Ação Popular.']],notebook:['Decorar a ordem do espelho universal, não uma peça inteira.','MS = ato/omissão de autoridade + direito líquido e certo + prova pronta.','MI = falta de norma regulamentadora impede direito constitucional.','HD = dados pessoais; Ação Popular = cidadão + ato lesivo.','Antes de redigir: peça + fundamento + competência + legitimidade + prazo.'],memory:[['Qual estrutura devo decorar?','Endereçamento → parte → peça/fundamento → fatos → cabimento/competência/legitimidade/prazo → direito → urgência → pedidos → fechamento.'],['Qual a diferença rápida entre MS e MI?','MS combate ato/omissão concreta de autoridade; MI combate falta de norma que inviabiliza direito constitucional.'],['Qual o gatilho do HD?','Acesso ou retificação de dados pessoais em registro público ou de caráter público.'],['Quem propõe Ação Popular?','Cidadão.']] }),
 '2026-10-15':makeDailyGuide({title:'DIA 2 — Controle concentrado + Constituição essencial',prompt:'Qual é a prioridade de hoje?',summary:'Hoje você domina ADI, ADC, ADO e ADPF e revisa os blocos constitucionais que mais viram tese em peça e discursiva.',choices:['Distinguir as quatro ações e revisar os artigos-âncora','Estudar apenas jurisprudência','Decorar modelos sem entender objeto','Ignorar competências constitucionais'],correct:'Distinguir as quatro ações e revisar os artigos-âncora',why:'Controle concentrado exige acertar objeto, legitimidade e competência; as discursivas exigem localizar rapidamente o artigo constitucional específico.',vade:[['1','Constituição Federal','Arts. 102 e 103','STF, competência e legitimados.'],['2','Lei 9.868/99','ADI, ADC e ADO','Cabimento, procedimento, cautelar e efeitos.'],['3','Lei 9.882/99','ADPF','Cabimento e subsidiariedade.'],['4','Constituição Federal','Arts. 5º; 18; 21–24; 30; 37; 59–69; 84; 97; 125 §2º','Blocos de tese para discursivas.']],notebook:['ADI: lei/ato federal ou estadual pós-CF em controle abstrato.','ADC: confirmação de constitucionalidade de norma federal.','ADO: omissão inconstitucional em controle objetivo.','ADPF: preceito fundamental + subsidiariedade; útil para norma pré-CF.','Discursiva FGV = conclusão + regra + artigo + aplicação.'],memory:[['Onde estão os legitimados do controle concentrado?','CF, art. 103.'],['Qual ação confirma constitucionalidade de lei federal?','ADC.'],['Qual ação objetiva combate omissão inconstitucional?','ADO.'],['Qual requisito marcante da ADPF?','Subsidiariedade.']] }),
 '2026-10-16':makeDailyGuide({title:'DIA 3 — Recursos + simulado completo',prompt:'Qual é a meta de hoje?',summary:'Fechar RE e Reclamação pela manhã e, à tarde, executar uma prova completa de cinco horas usando somente o Vade permitido, como no dia real.',choices:['Revisar recursos e fazer simulado real','Aprender peça nova durante o simulado','Consultar resposta durante a execução','Fazer sem controlar tempo'],correct:'Revisar recursos e fazer simulado real',why:'O simulado é o teste final da estrutura universal, da velocidade no Vade e da administração do tempo.',vade:[['1','Constituição Federal','Art. 102, III','Hipóteses de Recurso Extraordinário.'],['2','CPC','Arts. 1.029 e seguintes','Estrutura e processamento dos recursos excepcionais.'],['3','CPC','Art. 988','Hipóteses de Reclamação.'],['4','Espelho universal','Checklist mental','Aplicar antes de redigir a peça do simulado.']],notebook:['RE exige decisão judicial e hipótese do art. 102, III.','Reclamação: testar art. 988 do CPC e eventual súmula vinculante/precedente.','No simulado: 15 min de triagem + esqueleto antes de escrever.','Reservar 20 min finais para revisão.','Depois, classificar cada perda: peça, competência, artigo, tese, pedido ou tempo.'],memory:[['Qual artigo-âncora do RE?','CF, art. 102, III.'],['Onde estão as hipóteses de Reclamação?','CPC, art. 988.'],['Quanto reservar no fim do simulado?','Cerca de 20 minutos.'],['O que fazer antes de redigir a peça?','Montar o rascunho universal e fechar competência, cabimento e pedidos.']] }),
 '2026-10-17':makeDailyGuide({title:'DIA 4 — Revisão final + velocidade no Vade',prompt:'Qual é a conduta correta na véspera?',summary:'Hoje você corrige apenas os erros do simulado, percorre todas as peças pelo espelho universal, faz localização rápida no Vade e encerra o estudo cedo.',choices:['Consolidar, localizar rápido e descansar','Inserir conteúdo pesado novo','Fazer dois simulados completos','Trocar toda a estratégia'],correct:'Consolidar, localizar rápido e descansar',why:'Na véspera, ganho vem de reduzir erros conhecidos e chegar descansado, não de aumentar volume de conteúdo.',vade:[['1','Mapa das 10 peças','Gatilho + artigo + competência','Reconhecer cada uma em segundos.'],['2','Constituição Federal','Artigos-âncora','5º; 18; 21–24; 30; 37; 59–69; 84; 97; 102–103; 125 §2º.'],['3','Leis específicas','MS, MI, HD, AP, controle concentrado','Treinar 15 localizações em até 60 segundos.'],['4','Checklist de prova','Material permitido','Separar tudo e encerrar cedo.']],notebook:['Refazer só o que perdeu ponto no simulado.','Revisar as 10 peças pelo mesmo espelho universal.','Treinar quatro discursivas curtas no padrão FGV.','Não aprender tema pesado novo.','Preparar material e dormir em horário adequado.'],memory:[['Qual é a meta da véspera?','Consolidar e descansar.'],['Quantas estruturas devo decorar?','Uma: o espelho universal adaptável.'],['Qual fórmula usar nas teses?','Fato + lei + aplicação + conclusão.'],['Qual fórmula usar na discursiva?','Conclusão + regra + artigo + aplicação.']] })
};


const closingPracticeByDay={
 '2026-10-06':{
  label:'ADPF • caso anterior FGV/OAB',source:pastBank[0].url,
  caseText:'Caso adaptado de cobrança anterior: partido político com representação no Congresso pretende provocar o STF contra norma estadual editada antes da Constituição de 1988, ainda capaz de produzir efeitos. A missão é reconhecer a via adequada, demonstrar o preceito fundamental atingido e enfrentar a subsidiariedade.',
  thinking:['Norma pré-CF/88 em controle concentrado é gatilho clássico de ADPF.','Competência: STF, CF art. 102, §1º.','Legitimidade: conferir art. 103 da CF.','Cabimento e subsidiariedade: Lei 9.882/99, arts. 1º e 4º, §1º.'],
  pieceTitle:'Modelo enxuto de ADPF para copiar e memorizar',
  pieceCopy:`Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal.\n\n[LEGITIMADO DO ART. 103 DA CF], por seu advogado, vem propor ARGUIÇÃO DE DESCUMPRIMENTO DE PRECEITO FUNDAMENTAL, com fundamento no art. 102, §1º, da Constituição Federal e na Lei 9.882/99, em face de [ATO/NORMA], pelos fundamentos a seguir.\n\nI — CABIMENTO\nA ADPF é cabível porque o ato do Poder Público provoca lesão a preceito fundamental e a controvérsia envolve norma anterior à Constituição de 1988, nos termos da Lei 9.882/99. Também está presente a subsidiariedade, pois não há outro meio eficaz de sanar a lesividade.\n\nII — FUNDAMENTAÇÃO\nA Constituição ocupa posição superior no ordenamento. No caso, [EXPLICAR O PRECEITO FUNDAMENTAL VIOLADO] e demonstrar a incompatibilidade material da norma com a ordem constitucional vigente.\n\nIII — PEDIDOS\nRequer a concessão de medida liminar, se presentes os requisitos legais, a requisição de informações, as manifestações institucionais cabíveis e, ao final, a procedência da ADPF para afastar a lesão ao preceito fundamental.\n\nTermos em que, pede deferimento.\nLocal e data.\nAdvogado(a) — OAB nº ___.`,
  qa:[
   ['Qual ação tende a ser adequada para discutir, no STF, norma anterior à CF/88 em controle concentrado?','ADPF, porque normas pré-constitucionais podem ser objeto de controvérsia constitucional relevante em ADPF, observada a subsidiariedade. Fundamento: CF, art. 102, §1º, e Lei 9.882/99.'],
   ['O que significa subsidiariedade da ADPF?','A ADPF não deve ser admitida quando houver outro meio eficaz de sanar a lesividade. Fundamento: Lei 9.882/99, art. 4º, §1º.'],
   ['Partido político com representação no Congresso tem legitimidade?','Sim. É legitimado para o controle concentrado nos termos do art. 103, VIII, da Constituição Federal.']
  ]
 },
 '2026-10-07':{
  label:'Mandado de Segurança • 45º/43º EOU',source:pastBank[1].url,
  caseText:'Caso adaptado de padrão recente da FGV: uma lei local disciplina matéria constitucionalmente reservada à União e, com base nela, autoridade administrativa pratica ato concreto contra o particular. Há documentação completa do ato e do direito alegado.',
  thinking:['Ato concreto de autoridade + prova pré-constituída + direito líquido e certo apontam para MS.','A inconstitucionalidade da lei entra como fundamento incidental.','Fundamento geral: supremacia da Constituição/repartição de competências.','Fundamento específico: artigo de competência + direito fundamental ou econômico atingido.'],
  pieceTitle:'Modelo enxuto de Mandado de Segurança',
  pieceCopy:`Excelentíssimo Senhor Doutor Juiz de Direito do Juízo da Fazenda Pública da Comarca X.\n\n[IMPETRANTE], por seu advogado, com fundamento no art. 5º, LXIX, da Constituição Federal e na Lei 12.016/09, impetra MANDADO DE SEGURANÇA contra ato de [AUTORIDADE COATORA].\n\nI — CABIMENTO\nO ato impugnado viola direito líquido e certo demonstrável por prova pré-constituída, não se tratando de hipótese de habeas corpus ou habeas data.\n\nII — DIREITO\nA norma infraconstitucional que sustenta o ato deve respeitar a Constituição. No caso, [ENTE] legislou sobre matéria de competência [DA UNIÃO/OUTRO ENTE], em violação ao art. [___] da CF. O ato concreto, portanto, apoia-se em fundamento incompatível com a Constituição.\n\nIII — LIMINAR\nDiante da relevância do fundamento e do risco de ineficácia da medida final, requer a suspensão imediata dos efeitos do ato coator.\n\nIV — PEDIDOS\nRequer a notificação da autoridade coatora, ciência à pessoa jurídica interessada, oitiva do Ministério Público e, ao final, a concessão definitiva da segurança para afastar o ato impugnado.\n\nTermos em que, pede deferimento.`,
  qa:[
   ['Por que não é ADI se a lei é inconstitucional?','Porque o problema apresentado envolve ato concreto contra um titular determinado. A inconstitucionalidade da lei pode ser arguida incidentalmente no Mandado de Segurança, desde que presentes direito líquido e certo e prova pré-constituída.'],
   ['Qual é a base constitucional do MS individual?','Art. 5º, LXIX, da Constituição Federal.'],
   ['Qual cuidado com prazo deve ser lembrado?','O direito de requerer Mandado de Segurança se extingue em 120 dias da ciência do ato impugnado, conforme art. 23 da Lei 12.016/09.']
  ]
 },
 '2026-10-08':{
  label:'Mandado de Injunção • padrão de questão anterior',source:pastBank[4].url,
  caseText:'Caso adaptado de cobrança da FGV: um direito ou prerrogativa constitucional não pode ser exercido porque o órgão competente ainda não editou a norma regulamentadora necessária.',
  thinking:['Direito constitucional existente + omissão regulamentadora + inviabilidade concreta = MI.','Diferencie de ADO: MI protege situação concreta; ADO é controle objetivo da omissão.','Base: CF art. 5º, LXXI + Lei 13.300/16.'],
  pieceTitle:'Mandado de Injunção completo — modelo preenchido para copiar e memorizar',
  pieceNote:'Este modelo foi preenchido com o estudo baseado no 42º EOU: Cooperativa Alfa, omissão legislativa do Congresso Nacional e competência originária do STF. Aqui o endereçamento já aparece como deve ser escrito. Na prova, memorize a estrutura e substitua apenas os dados que o novo enunciado trouxer.',
  pieceCopy:`Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal.

COOPERATIVA DE GARIMPEIROS ALFA, pessoa jurídica de direito privado, devidamente qualificada no enunciado, por seu advogado, vem, respeitosamente, perante Vossa Excelência, com fundamento no art. 5º, inciso LXXI, e no art. 102, inciso I, alínea q, da Constituição Federal, bem como nos arts. 2º e seguintes da Lei nº 13.300/2016, impetrar MANDADO DE INJUNÇÃO em face da omissão do CONGRESSO NACIONAL, pelos fundamentos a seguir expostos.

I — DO CABIMENTO

A Constituição assegurou às cooperativas de garimpeiros o direito a tratamento específico e mais célere nos processos administrativos relativos à autorização ou concessão para pesquisa e lavra de recursos minerais garimpáveis, condicionando seu pleno exercício à edição de lei regulamentadora.

Decorrido longo período sem a edição da norma necessária, a omissão legislativa impede o exercício concreto do direito constitucional assegurado à Impetrante. Está, portanto, caracterizada a hipótese de cabimento do Mandado de Injunção prevista no art. 5º, inciso LXXI, da Constituição Federal e no art. 2º da Lei nº 13.300/2016.

II — DA COMPETÊNCIA DO SUPREMO TRIBUNAL FEDERAL

Compete ao Supremo Tribunal Federal processar e julgar originariamente o Mandado de Injunção quando a elaboração da norma regulamentadora for atribuição do Congresso Nacional, nos termos do art. 102, inciso I, alínea q, da Constituição Federal.

Como a omissão normativa é imputada ao Congresso Nacional, é competente este Supremo Tribunal Federal.

III — DA OMISSÃO INCONSTITUCIONAL

O Congresso Nacional possui atribuição para editar a norma regulamentadora necessária à plena eficácia do direito constitucional em questão. A ausência da lei torna inviável o exercício do direito assegurado à Impetrante, configurando mora legislativa incompatível com a força normativa da Constituição.

IV — DOS PEDIDOS

Diante do exposto, requer:

a) o recebimento e processamento do presente Mandado de Injunção;

b) a notificação do Congresso Nacional para prestar informações, na forma da Lei nº 13.300/2016;

c) a ciência ao órgão de representação judicial da pessoa jurídica interessada, para que, querendo, ingresse no feito;

d) a oitiva do Ministério Público;

e) ao final, o reconhecimento da mora legislativa e a concessão da injunção, para que seja fixado prazo razoável para a edição da norma regulamentadora e, se necessário, sejam estabelecidas as condições para o exercício do direito constitucional pela Impetrante, nos termos do art. 8º da Lei nº 13.300/2016.

Termos em que,
pede deferimento.

Local e data.
Advogado(a)
OAB nº ___.`,
  qa:[
   ['Qual o gatilho principal do Mandado de Injunção?','A falta total ou parcial de norma regulamentadora que torne inviável o exercício de direito, liberdade ou prerrogativa constitucional.'],
   ['Qual a diferença central entre MI e ADO?','O MI tutela situação concreta de titular impedido de exercer direito; a ADO integra o controle objetivo de constitucionalidade da omissão.'],
   ['Quem figura no polo passivo do MI?','O Poder, órgão ou autoridade com atribuição para editar a norma regulamentadora, conforme art. 3º da Lei 13.300/16.']
  ]
 },
 '2026-10-09':{
  label:'ADI • controle concentrado',source:pastBank[1].url,
  caseText:'Caso adaptado de questão de controle concentrado: lei estadual posterior à Constituição é impugnada em tese perante o STF por legitimado do art. 103, por ofensa direta à Constituição.',
  thinking:['Lei federal/estadual pós-CF + impugnação em tese + STF = testar ADI.','Confirmar legitimidade do art. 103 e pertinência temática quando exigida.','Separar vício formal de vício material.'],
  pieceTitle:'Modelo enxuto de ADI',
  pieceCopy:`Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal.\n\n[LEGITIMADO], com fundamento nos arts. 102, I, a, e 103 da Constituição Federal e na Lei 9.868/99, propõe AÇÃO DIRETA DE INCONSTITUCIONALIDADE em face da Lei [___].\n\nI — LEGITIMIDADE E CABIMENTO\nO requerente integra o rol do art. 103 da CF. A norma impugnada é lei [federal/estadual] posterior à CF e apresenta ofensa direta ao texto constitucional.\n\nII — INCONSTITUCIONALIDADE\nHá vício [FORMAL/MATERIAL] porque [EXPLICAR A REGRA CONSTITUCIONAL VIOLADA] e indicar o dispositivo exato.\n\nIII — CAUTELAR\nPresentes relevância da fundamentação e risco decorrente da manutenção dos efeitos da norma, requer-se medida cautelar, se cabível.\n\nIV — PEDIDOS\nRequer informações, manifestações institucionais cabíveis e, ao final, a declaração de inconstitucionalidade da norma impugnada.\n\nTermos em que, pede deferimento.`,
  qa:[
   ['Qual é o objeto típico da ADI perante o STF?','Lei ou ato normativo federal ou estadual posterior à Constituição, quando houver ofensa direta à CF.'],
   ['Onde estão os legitimados?','No art. 103 da Constituição Federal.'],
   ['Qual diferença de objeto entre ADI e ADC?','A ADI pode impugnar norma federal ou estadual; a ADC tem por objeto lei ou ato normativo federal.']
  ]
 },
 '2026-10-10':{
  label:'Controle de constitucionalidade • caso concreto',source:pastBank[3].url,
  caseText:'Caso adaptado: em processo concreto, a aplicação de uma lei é questionada por incompatibilidade com a Constituição. A questão constitucional surge como fundamento para resolver a causa, e não como objeto autônomo.',
  thinking:['Caso concreto + questão incidental = controle difuso.','Em tribunal, lembrar art. 97 da CF e reserva de plenário.','Se houver decisão final em hipótese do art. 102, III, pode surgir RE.'],
  pieceTitle:'Modelo de tópico constitucional para usar em peça/recurso',
  pieceCopy:`DA INCONSTITUCIONALIDADE INCIDENTAL\n\nA Constituição ocupa posição superior no ordenamento jurídico e vincula toda a legislação infraconstitucional. No caso, a aplicação do art. [___] da Lei [___] conduz a resultado incompatível com o art. [___] da Constituição Federal, porque [EXPLICAR A CONTRADIÇÃO].\n\nPor se tratar de controvérsia surgida em caso concreto, requer-se o reconhecimento incidental da incompatibilidade constitucional e o afastamento da norma na solução desta demanda. Se a declaração ocorrer por tribunal, deve ser observada a cláusula de reserva de plenário do art. 97 da Constituição Federal.`,
  qa:[
   ['O que caracteriza o controle difuso?','A questão constitucional surge incidentalmente em um caso concreto e serve de fundamento para a solução da controvérsia.'],
   ['Qual artigo traz a reserva de plenário?','Art. 97 da Constituição Federal.'],
   ['Qual recurso pode levar questão constitucional ao STF após decisão de única ou última instância?','Recurso Extraordinário, nas hipóteses do art. 102, III, da CF.']
  ]
 },
 '2026-10-11':{
  label:'Recurso Extraordinário / Reclamação • 42º EOU',source:pastBank[4].url,
  caseText:'Caso adaptado de cobrança recente: existe ato/decisão incompatível com súmula vinculante ou autoridade de decisão do tribunal, ao mesmo tempo em que o aluno precisa distinguir Reclamação de Recurso Extraordinário.',
  thinking:['RE pressupõe decisão judicial e hipótese do art. 102, III.','Reclamação tem hipóteses próprias do art. 988 do CPC.','Súmula vinculante é gatilho importante para Reclamação.'],
  pieceTitle:'Modelo enxuto de Reclamação',
  pieceCopy:`Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal.\n\n[RECLAMANTE], por seu advogado, propõe RECLAMAÇÃO, com fundamento no art. 988 do CPC [e art. 103-A, §3º, da CF, quando aplicável], em face de ato de [AUTORIDADE/ÓRGÃO].\n\nI — CABIMENTO\nO ato reclamado viola [COMPETÊNCIA / AUTORIDADE DE DECISÃO / SÚMULA VINCULANTE / DECISÃO EM CONTROLE CONCENTRADO], enquadrando-se na hipótese do art. 988 do CPC.\n\nII — ADERÊNCIA AO PARADIGMA\nHá correspondência entre a questão decidida no paradigma e a situação do ato reclamado, que deixou de observar a orientação vinculante.\n\nIII — PEDIDOS\nRequer medida urgente, se cabível, informações da autoridade reclamada e, ao final, a procedência para cassar ou adequar o ato reclamado ao paradigma vinculante.\n\nTermos em que, pede deferimento.`,
  qa:[
   ['Onde estão as hipóteses de Reclamação?','No art. 988 do CPC.'],
   ['Quando pensar em Recurso Extraordinário?','Quando já houver decisão de única ou última instância enquadrável nas hipóteses do art. 102, III, da CF.'],
   ['A Reclamação pode garantir observância de súmula vinculante?','Sim, nas hipóteses legais; quando for súmula vinculante, também confira o art. 103-A, §3º, da CF e a Lei 11.417/06.']
  ]
 },
 '2026-10-12':{
  label:'Direitos fundamentais • questões recentes',source:pastBank[0].url,
  caseText:'Caso adaptado de questões recentes: o enunciado apresenta restrição estatal a liberdade, igualdade, intimidade, prova, nacionalidade ou direitos políticos e exige uma resposta curta, constitucionalmente fundamentada.',
  thinking:['Identifique primeiro qual direito foi atingido.','Localize o inciso específico, não apenas “art. 5º”.','Responda no formato: Sim/Não + regra + artigo + aplicação.'],
  pieceTitle:'Modelo de fundamentação para direitos fundamentais',
  pieceCopy:`DA VIOLAÇÃO AO DIREITO FUNDAMENTAL\n\nA Constituição assegura [DIREITO] no art. [___], estabelecendo que [EXPLICAR A REGRA COM SUAS PALAVRAS]. No caso, [FATO DO ENUNCIADO] restringe/viola esse direito porque [APLICAÇÃO].\n\nAssim, a medida é [CONSTITUCIONAL/INCONSTITUCIONAL], devendo ser [CONSEQUÊNCIA JURÍDICA].`,
  qa:[
   ['Como responder uma discursiva sobre direito fundamental?','Comece pela conclusão direta, explique a regra constitucional, cite o inciso exato e aplique ao fato.'],
   ['Citar apenas “art. 5º” é suficiente?','Normalmente não. A FGV costuma pontuar a tese jurídica e o dispositivo específico, de modo que a indicação genérica pode deixar pontos de fora.'],
   ['Como diferenciar informação pessoal para Habeas Data?','O HD protege conhecimento/retificação de dados relativos à própria pessoa do impetrante em registros públicos ou de caráter público.']
  ]
 },
 '2026-10-13':{
  label:'Federação e Poderes • competências',source:pastBank[2].url,
  caseText:'Caso adaptado de provas recentes: Estado ou Município edita norma sobre determinada matéria e a questão exige identificar se a competência é da União, comum, concorrente ou de interesse local, além de eventual vício de iniciativa.',
  thinking:['Pergunte: qual ente? qual matéria? executar ou legislar?','Arts. 21/23: competências materiais; 22/24: legislativas.','Município: arts. 29 e 30; processo legislativo: arts. 59 a 69.'],
  pieceTitle:'Modelo de fundamentação sobre competência',
  pieceCopy:`DA INCONSTITUCIONALIDADE FORMAL POR INVASÃO DE COMPETÊNCIA\n\nA Constituição distribui competências entre os entes federativos. A matéria discutida — [MATÉRIA] — encontra-se submetida à competência [PRIVATIVA/CONCORRENTE/LOCAL] prevista no art. [___] da Constituição Federal.\n\nEntretanto, a Lei [estadual/municipal] nº [___] disciplinou diretamente essa matéria, embora o ente não possua competência constitucional para fazê-lo. Há, portanto, inconstitucionalidade formal orgânica por invasão da competência constitucionalmente atribuída a [ENTE COMPETENTE].`,
  qa:[
   ['Como saber se devo olhar art. 21 ou art. 22?','Pergunte se o enunciado fala em executar/prestar uma atividade ou em legislar sobre uma matéria. O art. 21 concentra competências materiais da União; o art. 22, competências legislativas privativas.'],
   ['Onde está a competência municipal de interesse local?','No art. 30, I, da Constituição Federal.'],
   ['Qual princípio ajuda a transportar regras constitucionais de organização para Estados/Municípios?','O princípio da simetria, sempre ancorado na norma constitucional específica que funciona como modelo.']
  ]
 },
 '2026-10-14':{
  label:'Dia 1 • espelho universal + remédios',source:pastBank[0].url,
  caseText:'Treino final dos remédios constitucionais: leia mini-casos e decida entre Mandado de Segurança, Mandado de Injunção, Habeas Data e Ação Popular. Antes de redigir, preencha sempre o mesmo rascunho universal.',
  thinking:['Use o mesmo rascunho universal nos quatro remédios.','Primeiro identifique o gatilho; depois competência, legitimidade e prazo.','Não decore quatro textos diferentes.','Treine a localização das quatro leis no Vade.'],
  pieceTitle:'Esqueleto universal para copiar antes de qualquer peça',
  pieceCopy:`ENDEREÇAMENTO\nQUALIFICAÇÃO / LEGITIMIDADE\nNOME DA PEÇA + FUNDAMENTO DE CABIMENTO\nI — FATOS ESSENCIAIS\nII — CABIMENTO\nIII — FUNDAMENTAÇÃO GERAL\nIV — FUNDAMENTAÇÃO ESPECÍFICA\nV — TUTELA/LIMINAR, SE CABÍVEL\nVI — PEDIDOS\nFECHAMENTO\n\nAntes de escrever, complete ao lado de cada linha o artigo que será usado.`,
  qa:[
   ['Qual a diferença rápida entre MS e MI?','MS protege direito líquido e certo contra ato ou omissão concreta de autoridade; MI enfrenta ausência de norma regulamentadora que inviabiliza direito constitucional.'],
   ['Quando pensar em Habeas Data?','Quando o titular busca conhecer ou retificar dados pessoais em registro público ou de caráter público.'],
   ['Qual é o gatilho da Ação Popular?','Cidadão buscando invalidar ato lesivo ao patrimônio público, moralidade administrativa, meio ambiente ou patrimônio histórico-cultural.']
  ]
 },
 '2026-10-15':{
  label:'Dia 2 • controle concentrado + Constituição essencial',source:pastBank[1].url,
  caseText:'Treine a identificação entre ADI, ADC, ADO e ADPF e, em seguida, responda questões curtas de direitos fundamentais, competências federativas e processo legislativo usando artigo específico.',
  thinking:['Objeto + legitimidade + competência definem a ação concentrada.','Compare MI x ADO e ADI x ADC.','ADPF exige atenção à subsidiariedade.','Depois, use os artigos-âncora da CF para as discursivas.'],
  pieceTitle:'Modelo de reconstrução de trecho perdido',
  pieceCopy:`TÓPICO QUE ERREI: [NOME]\n\nRegra geral: [PRINCÍPIO/EIXO].\nFundamento específico: art. [___] da [CF/LEI].\nAplicação: no caso, [FATO] se enquadra na regra porque [EXPLICAÇÃO].\nConclusão/pedido: por isso, deve ser [CONSEQUÊNCIA].\n\nDepois de escrever de memória, compare com o espelho e marque exatamente o elemento que faltou.`,
  qa:[
   ['Qual ação confirma a constitucionalidade de lei ou ato normativo federal?','ADC. Fundamento central: CF, arts. 102, I, a, e 103, além da Lei 9.868/99.'],
   ['Qual a diferença central entre MI e ADO?','MI tutela situação concreta de titular impedido por falta de norma; ADO integra o controle objetivo da omissão inconstitucional.'],
   ['Qual requisito deve ser lembrado na ADPF?','A subsidiariedade: não deve haver outro meio eficaz de sanar a lesividade, nos termos da Lei 9.882/99.']
  ]
 },
 '2026-10-16':{
  label:'Dia 3 • RE, Reclamação + simulado completo',source:pastBank[2].url,
  caseText:'Pela manhã, diferencie Recurso Extraordinário de Reclamação. À tarde, faça um exame completo em cinco horas: triagem, rascunho universal, Vade, peça, quatro discursivas e revisão final.',
  thinking:['Repita a estratégia que funcionou.','Não invente uma nova técnica na véspera.','Reserve 20 minutos para revisão.'],
  pieceTitle:'Checklist final da peça antes de entregar',
  pieceCopy:`□ Endereçamento compatível com a competência\n□ Legitimidade ativa/passiva correta\n□ Cabimento explicado, não apenas citado\n□ Fatos resumidos\n□ Fundamento geral ligado ao caso\n□ Artigo/inciso específico\n□ Liminar/tutela com requisitos próprios, se cabível\n□ Pedidos completos e coerentes\n□ Fechamento e valor da causa, quando necessário\n□ Sem dados inventados`,
  qa:[
   ['O que comparar entre os dois simulados?','Nota, tempo, erros recorrentes e quantidade de fundamentos/pedidos esquecidos.'],
   ['O que revisar nos minutos finais?','Competência, nome da peça, artigos, pedidos, respostas diretas das discursivas e eventuais omissões.'],
   ['Se a estratégia funcionou, devo mudá-la?','Não. Ajuste apenas o que comprovadamente gerou perda de pontos.']
  ]
 },
 '2026-10-17':{
  label:'Dia 4 • revisão final + velocidade no Vade',source:historicalArchive.url,
  caseText:'Na véspera, percorra as dez peças pelo mesmo espelho universal, faça localização rápida no Vade e refaça somente os erros do simulado. Nada de conteúdo pesado novo.',
  thinking:['Reconhecer peça em segundos.','Localizar artigos-âncora.','Não inserir conteúdo pesado novo.'],
  pieceTitle:'Mapa universal de peça para memorizar',
  pieceCopy:`1. PARA QUEM? → competência / endereçamento.\n2. QUEM PEDE E CONTRA QUEM? → legitimidade.\n3. POR QUE ESTA PEÇA? → cabimento.\n4. O QUE ACONTECEU? → fatos essenciais.\n5. QUAL REGRA GERAL? → princípio/eixo constitucional.\n6. QUAL ARTIGO RESOLVE? → fundamento específico.\n7. PRECISA DE URGÊNCIA? → liminar/tutela.\n8. O QUE QUERO DO JUIZ? → pedidos.\n9. O QUE FALTA? → fechamento e revisão.`,
  qa:[
   ['Ato concreto de autoridade + direito líquido e certo + prova pronta lembra qual peça?','Mandado de Segurança.'],
   ['Omissão normativa que trava direito constitucional concreto lembra qual peça?','Mandado de Injunção.'],
   ['Norma anterior à CF/88 em controle concentrado no STF lembra qual ação?','ADPF, observada a subsidiariedade.'],
   ['Lei estadual pós-CF impugnada em tese no STF por legitimado lembra qual ação?','ADI.']
  ]
 }
};
const completeDailyPieceMap={
 '2026-10-06':'ADPF',
 '2026-10-07':'Mandado de Segurança',
 '2026-10-08':'Mandado de Injunção',
 '2026-10-09':'ADI',
 '2026-10-10':'Recurso Extraordinário',
 '2026-10-11':'Reclamação',
 '2026-10-12':'Habeas Data',
 '2026-10-13':'ADI',
 '2026-10-14':'Ação Popular',
 '2026-10-15':'ADPF',
 '2026-10-16':'Recurso Extraordinário'
};
Object.entries(completeDailyPieceMap).forEach(([iso,name])=>{
 const p=closingPracticeByDay[iso];
 if(!p||!fullPieceModels[name])return;
 p.pieceTitle=`${name} — peça completa para copiar e treinar`;
 p.pieceCopy=fullPieceModels[name];
 p.pieceNote=`Este é um modelo completo e adaptável de ${name}. Na prova, mantenha a estrutura e substitua competência, partes, fatos, fundamentos e pedidos pelos dados do enunciado.`;
});
function closingPractice(){return closingPracticeByDay[currentDay().iso]||closingPracticeByDay['2026-10-17'];}
function copyPracticePiece(){const p=closingPractice();navigator.clipboard?.writeText(p.pieceCopy).then(()=>alert('Modelo copiado. Agora tente reescrever sem olhar para memorizar.')).catch(()=>alert('Selecione o texto do modelo e copie manualmente.'));}
function copyPracticeAnswer(i){const p=closingPractice(),item=p.qa[i];if(!item)return;navigator.clipboard?.writeText(`Pergunta: ${item[0]}\nResposta: ${item[1]}`).then(()=>alert('Pergunta e resposta copiadas.')).catch(()=>alert('Selecione a resposta e copie manualmente.'));}

function studyGuide(){return dailyGuides[currentDay().iso]||guide;}

const affiliateProduct={
 name:'Vade Mecum Saraiva Tradicional — 42ª Edição 2026 (2º semestre)',
 priceHint:'Preço pode variar na Shopee',
 productUrl:'https://shopee.com.br/product/393775679/21197223800',
 affiliateUrl:'',
 note:'Opção de compra para estudo. Antes de usar na prova, confira as regras do edital vigente e se a edição atende ao conteúdo permitido.'
};


const audioSummaries=Object.fromEntries(days.map(d=>[d.iso,{title:d.title,file:`audio/${d.iso}.mp3`} ]));
function audioSummaryControls(iso,compact=false){
 const a=audioSummaries[iso];if(!a)return '';
 const filename=`oab-constitucional-${iso}.mp3`;
 return `<div class="audio-summary-card ${compact?'compact':''}"><div class="audio-summary-head"><span class="audio-icon">🎧</span><span><b>Resumo em áudio</b><small>Narração feminina em português • explicação guiada</small></span></div><audio controls preload="none" src="${a.file}">Seu navegador não suporta áudio HTML5.</audio><div class="audio-summary-actions"><a class="btn secondary linkbtn" href="${a.file}" download="${filename}">Baixar áudio MP3 ↓</a></div></div>`;
}
function audioLibrary(){return days.map(d=>`<details class="audio-day"><summary><span>${d.date}</span> ${d.title}</summary>${audioSummaryControls(d.iso,true)}</details>`).join('');}

function todayKey(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());}
function resolveScheduledDay(iso){return days.find(d=>d.iso===iso)||((iso<days[0].iso)?days[0]:days[days.length-1]);}
function currentDay(){return days.find(d=>d.iso===state.activeDayIso)||resolveScheduledDay(todayKey());}
function taskId(d,i){return `${d.iso}-${i}`;}
function dayVadeId(i){return `${currentDay().iso}-vade-${i}`;}
function persistDaySession(){
 if(!state.activeDayIso)return;
 state.daySessions=state.daySessions||{};
 state.daySessions[state.activeDayIso]={guideStage:Number(state.guideStage)||0,guideChoice:state.guideChoice||'',guideDraft:state.guideDraft||'',guideFinished:!!state.guideFinished};
}
function loadDaySession(iso){
 state.daySessions=state.daySessions||{};
 const x=state.daySessions[iso]||{};
 state.guideStage=Number(x.guideStage)||0;state.guideChoice=x.guideChoice||'';state.guideDraft=x.guideDraft||'';state.guideFinished=!!x.guideFinished;
}
function syncStudyDay(){
 state.daySessions=state.daySessions||{};
 if(!state.daySessionVersion){
  const legacy={guideStage:Number(state.guideStage)||0,guideChoice:state.guideChoice||'',guideDraft:state.guideDraft||'',guideFinished:!!state.guideFinished};
  if(legacy.guideStage||legacy.guideChoice||legacy.guideDraft||legacy.guideFinished)state.daySessions['2026-10-06']=legacy;
  for(let i=0;i<4;i++){if(Object.prototype.hasOwnProperty.call(state.done,`vade-${i}`))state.done[`2026-10-06-vade-${i}`]=state.done[`vade-${i}`];}
  state.daySessionVersion=1;
 }
 const today=todayKey(),scheduled=resolveScheduledDay(today);
 if(!state.activeDayIso||state.lastOpenedDate!==today){state.activeDayIso=scheduled.iso;state.lastOpenedDate=today;}
 loadDaySession(state.activeDayIso);
 localStorage.setItem(LS,JSON.stringify(state));
}
function openStudyDay(iso){persistDaySession();const d=days.find(x=>x.iso===iso);if(!d)return;state.activeDayIso=d.iso;loadDaySession(d.iso);localStorage.setItem(LS,JSON.stringify(state));renderToday();renderSchedule();renderVade();renderQuestions();window.scrollTo({top:0,behavior:'smooth'});}
function changeStudyDay(delta){const i=days.findIndex(d=>d.iso===currentDay().iso),n=Math.max(0,Math.min(days.length-1,i+delta));if(n===i)return;openStudyDay(days[n].iso);}
function nextDayButton(){const i=days.findIndex(d=>d.iso===currentDay().iso);return i<days.length-1?`<button class="btn good" onclick="changeStudyDay(1)">Próximo dia →</button>`:'';}
function renderProgress(){const total=days.reduce((s,d)=>s+d.tasks.length,0);const done=Object.values(state.done).filter(Boolean).length;const pct=Math.round(done/total*100);const el=document.getElementById('progressText');if(el)el.textContent=`Progresso: ${done}/${total} tarefas (${pct}%)`;}
function markToday(i){const d=currentDay();state.done[taskId(d,i)]=true;save();}

function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
if(typeof state.guideDraft!=='string')state.guideDraft='';
if(!state.guideDraft&&Array.isArray(state.notes)){const n=state.notes.find(x=>x.topic==='ADPF — 46º EOU');if(n)state.guideDraft=n.text||'';}

function guideStep(stage){
 const g=studyGuide(),p=closingPractice(),s=Math.max(0,Math.min(8,stage));
 if(s===0)return `<div class="do-now">FAÇA AGORA • PASSO 1 DE 8 • ${currentDay().date}</div><h2>${g.title}</h2><p class="source">${g.sourceUrl?`Material oficial: <a href="${g.sourceUrl}" target="_blank">${g.source} ↗</a>`:`Material do dia: ${currentDay().title}`}</p><div class="casebox"><b>Contexto do treino:</b><p>${g.summary}</p></div><h3>${g.prompt||'Qual é a peça?'}</h3><p class="muted">Escolha uma opção. Depois use <b>Continuar</b> para corrigir.</p><div class="choice-grid">${g.choices.map(c=>`<button class="choice ${state.guideChoice===c?'selected':''}" onclick="choosePiece('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('')}</div>`;
 if(s===1){const ok=state.guideChoice===g.correct;return `<div class="do-now">PASSO 2 DE 8 • CORREÇÃO</div><h2>${ok?'✅ Acertou':'❌ Resposta correta'}: ${g.correct}</h2><p>${g.why}</p><div class="callout"><b>Não memorize só a resposta.</b> Agora confirme a lógica na fonte indicada para este dia.</div>`;}
 if(s===2)return `<div class="do-now">PASSO 3 DE 8 • VADE MECUM / FONTE</div><h2>Abra seu material agora</h2><p class="muted">Faça na ordem abaixo. Você pode abrir a legislação dentro da plataforma e ler o artigo indicado.</p>${g.vade.map((v,i)=>`<div class="vade-step-row"><label class="vade-step"><input type="checkbox" onchange="checkVade(${i},this.checked)" ${state.done[dayVadeId(i)]?'checked':''}><span class="stepnum">${v[0]}</span><span class="vade-step-text"><b>${v[1]}</b><br><strong>${v[2]}</strong><br><span class="muted">${v[3]}</span></span></label>${lawOpenButton(v)}</div>`).join('')}<div id="vadeAdvance">${g.vade.every((_,i)=>state.done[dayVadeId(i)])?`<p class="callout"><b>Etapa concluída.</b> Use <b>Continuar</b> para seguir.</p>`:`<p class="hint">⬆️ Leia a norma e marque os itens deste dia para liberar o botão Continuar.</p>`}</div>`;
 if(s===3)return `<div class="do-now">PASSO 4 DE 8 • ANOTAÇÃO</div><h2>Anote isto no seu caderno de revisão</h2><p class="warning-inline"><b>Não escreva roteiro de peça no Vade.</b> Estas anotações são para seu caderno/arquivo de estudo.</p>${g.notebook.map(x=>`<div class="note-line">✍️ ${x}</div>`).join('')}<textarea id="myNote" rows="4" placeholder="Escreva com suas palavras o que você entendeu. Isso melhora a retenção." oninput="saveGuideDraft(this.value)">${escapeHtml(state.guideDraft)}</textarea><p class="muted smallgap">Seu texto fica salvo separadamente para o dia ${currentDay().date}.</p>`;
 if(s===4)return `<div class="do-now">PASSO 5 DE 8 • MEMÓRIA ATIVA</div><h2>Feche o material e tente lembrar</h2><p class="muted">Clique em cada cartão só depois de responder mentalmente.</p>${g.memory.map((m,i)=>`<details class="flash"><summary>${i+1}. ${m[0]}</summary><p><b>${m[1]}</b></p></details>`).join('')}`;
 if(s===5)return `<div class="do-now">PASSO 6 DE 8 • ESTUDO DE CASO OAB</div><span class="pill">${escapeHtml(p.label)}</span><h2>Veja como o tema aparece na prova</h2><div class="casebox"><b>Caso anterior adaptado para treino:</b><p>${escapeHtml(p.caseText)}</p></div><h3>Como pensar antes de escrever</h3>${p.thinking.map((x,i)=>`<div class="task"><span class="stepnum">${i+1}</span><span>${escapeHtml(x)}</span></div>`).join('')}<p class="muted">O caso foi resumido/adaptado para estudo. A conferência da fonte oficial também abre dentro da plataforma.</p><button class="btn secondary" onclick="openPracticeSource()">Ver fonte oficial aqui</button>`;
 if(s===6)return `<div class="do-now">PASSO 7 DE 8 • PEÇA PRONTA PARA COPIAR E MEMORIZAR</div><h2>${escapeHtml(p.pieceTitle)}</h2>${p.pieceNote?`<div class="casebox piece-context-note"><b>Atenção ao estudo de caso:</b><p>${escapeHtml(p.pieceNote)}</p></div>`:''}<p class="muted">Copie uma vez, leia em voz alta e depois tente reescrever sem olhar. Memorize a ordem da estrutura, não os fatos fixos.</p><div class="copy-model"><pre>${escapeHtml(p.pieceCopy)}</pre></div><div class="practice-piece-actions"><button class="btn good" onclick="copyPracticePiece()">Copiar peça completa</button><button class="btn secondary" onclick="openPracticePiece()">Abrir peça em tela cheia</button></div>`;
 if(s===7)return `<div class="do-now">PASSO 8 DE 8 • QUESTÕES + RESPOSTAS PRONTAS</div><h2>Treine como escreveria no caderno da OAB</h2><p class="muted">Tente responder sem olhar. Em seguida, compare com a resposta-modelo e use o botão para copiar e reescrever.</p>${p.qa.map((q,i)=>`<div class="qa-copy-card"><h3>${i+1}. ${escapeHtml(q[0])}</h3><div class="qa-answer"><b>Resposta pronta para treino:</b><p>${escapeHtml(q[1])}</p></div><button class="btn secondary" onclick="copyPracticeAnswer(${i})">Copiar pergunta + resposta</button></div>`).join('')}<div class="callout"><b>Agora conclua o tópico.</b> O PDF e o áudio entram depois como revisão final do que você já estudou, escreveu e respondeu.</div>`;
 return `<div class="donehero"><div class="checkbig">✓</div><h2>Dia ${currentDay().date} concluído</h2><p>${currentDay().title} foi salvo separadamente e entrou no ciclo de revisão.</p><div class="reviewchips"><span>Revisar amanhã</span><span>+3 dias</span><span>+7 dias</span></div>${audioSummaryControls(currentDay().iso)}<div class="done-actions"><button class="btn good" onclick="generateStudyPDF()">Baixar resumo em PDF</button> <button class="btn secondary" onclick="restartGuide()">Refazer este dia</button> ${nextDayButton()}</div></div>`;
}

function ensurePracticeReader(){
 if(document.getElementById('practiceReaderModal'))return;
 const wrap=document.createElement('div');
 wrap.id='practiceReaderModal';wrap.className='law-reader-modal';wrap.hidden=true;
 wrap.innerHTML=`<div class="law-reader-backdrop" onclick="closePracticeReader()"></div><section class="law-reader-sheet practice-reader-sheet" role="dialog" aria-modal="true" aria-labelledby="practiceReaderTitle"><div class="law-reader-head"><div><span class="pill">DENTRO DA PLATAFORMA</span><h2 id="practiceReaderTitle"></h2></div><div class="practice-reader-tools"><button class="law-reader-fullscreen" onclick="togglePracticeFullscreen()" aria-label="Abrir em tela cheia" title="Tela cheia">⛶</button><button class="law-reader-close" onclick="closePracticeReader()" aria-label="Fechar">×</button></div></div><div id="practiceReaderBody"></div><div class="law-reader-footer"><button class="btn secondary" onclick="togglePracticeFullscreen()">Tela cheia</button><button class="btn good" onclick="closePracticeReader()">Voltar ao estudo</button></div></section>`;
 document.body.appendChild(wrap);
}
function openPracticePiece(){
 ensurePracticeReader();const p=closingPractice(),m=document.getElementById('practiceReaderModal');
 document.getElementById('practiceReaderTitle').textContent=p.pieceTitle;
 document.getElementById('practiceReaderBody').innerHTML=`${p.pieceNote?`<div class="casebox piece-context-note"><b>Atenção:</b><p>${escapeHtml(p.pieceNote)}</p></div>`:''}<div class="copy-model fullscreen"><pre>${escapeHtml(p.pieceCopy)}</pre></div><button class="btn good" onclick="copyPracticePiece()">Copiar peça</button>`;
 m.hidden=false;m.removeAttribute('aria-hidden');document.body.classList.add('modal-open');
}
const practiceSourceByDay={
 '2026-10-06':{edition:'46',pages:[1,2,3],caption:'46º EOU — ADPF: enunciado, gabarito e distribuição dos pontos'},
 '2026-10-07':{edition:'45',pages:[1,2,3],caption:'45º EOU — Mandado de Segurança: enunciado, gabarito e distribuição dos pontos'},
 '2026-10-08':{edition:'42',pages:[5],caption:'42º EOU — Questão 2: Mandado de Injunção e ADO'},
 '2026-10-09':{edition:'45',pages:[6],caption:'45º EOU — Questão 4: controle concentrado / ADI'},
 '2026-10-10':{edition:'43',pages:[5],caption:'43º EOU — Questão 2: ADI x ADPF e subsidiariedade'},
 '2026-10-11':{edition:'42',pages:[1,2,3],caption:'42º EOU — Reclamação: enunciado, gabarito e espelho'},
 '2026-10-12':{edition:'46',pages:[3],caption:'46º EOU — Questão 1: direitos e regras constitucionais'},
 '2026-10-13':{edition:'44',pages:[5,6],caption:'44º EOU — competências, simetria e controle'},
 '2026-10-14':{edition:'46',pages:[1,2,3,4,5,6],caption:'46º EOU — caderno completo para simulado'},
 '2026-10-15':{edition:'45',pages:[1,2,3],caption:'45º EOU — correção ativa pelo espelho'},
 '2026-10-16':{edition:'44',pages:[1,2,3,4,5,6],caption:'44º EOU — caderno completo para simulado'},
 '2026-10-17':{edition:'46',pages:[1,2,3],caption:'46º EOU — revisão final de estrutura e espelho'}
};
let activePracticePdf=null;
function practiceSourceConfig(){return practiceSourceByDay[currentDay().iso]||practiceSourceByDay['2026-10-17'];}
function renderPracticePdf(){
 const host=document.getElementById('practicePdfPages');if(!host||!activePracticePdf)return;
 const cfg=activePracticePdf, pages=cfg.pages||[];
 host.innerHTML=pages.map(n=>`<figure class="practice-pdf-page"><figcaption class="practice-pdf-page-label">Página ${n}</figcaption><img src="official/pages/oab-${escapeHtml(cfg.edition)}-p${n}.webp" alt="Página ${n} da fonte oficial FGV/OAB" loading="lazy" decoding="async"></figure>`).join('');
}
function openPracticeSource(){
 ensurePracticeReader();const p=closingPractice(),m=document.getElementById('practiceReaderModal'),cfg=practiceSourceConfig();activePracticePdf=cfg;
 document.getElementById('practiceReaderTitle').textContent=`Fonte oficial — ${p.label}`;
 document.getElementById('practiceReaderBody').innerHTML=`<div class="casebox practice-case-summary"><b>Caso usado no treino</b><p>${escapeHtml(p.caseText)}</p></div><p class="practice-source-caption">${escapeHtml(cfg.caption)}</p><div class="practice-source-frame practice-pdf-reader"><div id="practicePdfPages" class="practice-pdf-pages"></div></div><p class="muted practice-reader-note">As páginas oficiais são renderizadas dentro do sistema e ajustadas automaticamente à largura do celular.</p>`;
 m.hidden=false;m.removeAttribute('aria-hidden');document.body.classList.add('modal-open');requestAnimationFrame(()=>renderPracticePdf());
}
function togglePracticeFullscreen(){const sheet=document.querySelector('#practiceReaderModal .practice-reader-sheet');if(!sheet)return;const on=sheet.classList.toggle('is-fullscreen');const btn=document.querySelector('#practiceReaderModal .law-reader-fullscreen');if(btn){btn.textContent=on?'↙':'⛶';btn.setAttribute('aria-label',on?'Sair da tela cheia':'Abrir em tela cheia');btn.title=on?'Sair da tela cheia':'Tela cheia';}document.querySelectorAll('#practiceReaderModal .law-reader-footer .btn.secondary').forEach(b=>b.textContent=on?'Sair da tela cheia':'Tela cheia');document.querySelectorAll('#practiceReaderModal .source-fullscreen-btn').forEach(b=>b.textContent=on?'↙ Sair da tela cheia':'⛶ Tela cheia');}
function closePracticeReader(){const m=document.getElementById('practiceReaderModal');if(m){m.hidden=true;m.setAttribute('aria-hidden','true');const sheet=m.querySelector('.practice-reader-sheet');if(sheet)sheet.classList.remove('is-fullscreen');}document.body.classList.remove('modal-open');const home=document.querySelector('#hoje .guide-main');if(home)home.scrollIntoView({block:'start',behavior:'smooth'});}

function guideBlockReason(){
 const g=studyGuide(),s=Math.max(0,Math.min(8,state.guideStage));
 if(s===0&&!state.guideChoice)return 'Escolha uma opção para liberar o botão Continuar.';
 if(s===2&&!g.vade.every((_,i)=>state.done[dayVadeId(i)]))return 'Localize e marque os itens indicados para este dia antes de continuar.';
 if(s===3&&!String(state.guideDraft||'').trim())return 'Escreva ao menos uma frase com suas palavras antes de continuar.';
 return '';
}
function canContinueGuide(){return state.guideStage<8&&!guideBlockReason();}
function guideNav(){
 const s=Math.max(0,Math.min(8,state.guideStage));
 const backDisabled=s===0;
 const can=canContinueGuide();
 const reason=guideBlockReason();
 const nextLabel=s===7?'Concluir tópico →':'Continuar →';
 return `<div class="guide-nav" aria-label="Navegação entre tarefas"><button class="btn secondary guide-prev" onclick="prevGuide()" ${backDisabled?'disabled':''}>← Voltar</button>${s<8?`<button class="btn good guide-next" onclick="continueGuide()" ${can?'':'disabled'}>${nextLabel}</button>`:''}</div><p class="guide-nav-hint" id="guideNavHint">${reason||'&nbsp;'}</p>`;
}

function renderToday(){const d=currentDay(),idx=days.findIndex(x=>x.iso===d.iso);document.getElementById('hoje').innerHTML=`<div class="guide-layout"><div class="card guide-main">${guideStep(state.guideStage)}${guideNav()}</div><aside class="card guide-side"><span class="pill">DIA ${idx+1} DE ${days.length} • ${d.date}</span><h3>Você não precisa decidir o que estudar</h3><p>Ao abrir em uma nova data, o sistema reconhece automaticamente o dia correspondente. Você também pode avançar manualmente.</p><div class="mini-flow"><b>1.</b> Caso → <b>2.</b> Correção → <b>3.</b> Fonte → <b>4.</b> Anotação → <b>5.</b> Memória → <b>6.</b> Caso OAB → <b>7.</b> Peça → <b>8.</b> Questões</div><hr><h3>Objetivo deste dia</h3><p><b>${d.title}</b></p><p class="muted">${d.focus}</p><hr><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn secondary" onclick="changeStudyDay(-1)" ${idx===0?'disabled':''}>← Dia anterior</button><button class="btn secondary" onclick="changeStudyDay(1)" ${idx===days.length-1?'disabled':''}>Próximo dia →</button></div><hr><button class="btn secondary full" onclick="generateStudyPDF()">Gerar PDF do que já estudei</button><div class="smallgap">${state.guideStage>=8?audioSummaryControls(d.iso,true):`<div class="locked-summary">🔒 O resumo em áudio é liberado depois do estudo de caso, da peça e das respostas-modelo.</div>`}</div></aside></div>`;renderProgress();}
function choosePiece(c){state.guideChoice=c;save();renderToday();}
function saveGuideDraft(v){state.guideDraft=v;localStorage.setItem(LS,JSON.stringify(state));if(state.guideStage===3){const b=document.querySelector('.guide-next');if(b)b.disabled=!String(v).trim();const h=document.getElementById('guideNavHint');if(h)h.innerHTML=String(v).trim()?'&nbsp;':'Escreva ao menos uma frase com suas palavras antes de continuar.';}}
function persistGuideDraftFromDom(){const el=document.getElementById('myNote');if(el)saveGuideDraft(el.value);}
function prevGuide(){persistGuideDraftFromDom();state.guideStage=Math.max(0,state.guideStage-1);save();renderToday();window.scrollTo({top:0,behavior:'smooth'});}
function continueGuide(){
 persistGuideDraftFromDom();
 const reason=guideBlockReason();
 if(reason)return alert(reason);
 if(state.guideStage===3)return saveStudyNote();
 if(state.guideStage===7)return finishGuide();
 state.guideStage=Math.min(8,state.guideStage+1);save();renderToday();window.scrollTo({top:0,behavior:'smooth'});
}
function nextGuide(){continueGuide();}
function checkVade(i,checked){state.done[dayVadeId(i)]=checked;if(checked)markToday(1);save();renderToday();}
function saveStudyNote(){
 const txt=String(state.guideDraft||'').trim();
 if(!txt)return alert('Escreva ao menos uma frase com suas palavras antes de continuar.');
 const topic=`${currentDay().title} — ${currentDay().date}`;
 const existing=state.notes.find(n=>n.topic===topic);
 if(existing){existing.text=txt;existing.date=new Date().toLocaleDateString('pt-BR');}
 else state.notes.unshift({date:new Date().toLocaleDateString('pt-BR'),topic,text:txt});
 markToday(2);state.guideStage=4;save();renderToday();window.scrollTo({top:0,behavior:'smooth'});
}
function finishGuide(){state.guideFinished=true;state.guideStage=8;markToday(0);markToday(3);scheduleReviews();save();renderToday();window.scrollTo({top:0,behavior:'smooth'});}
function restartGuide(){state.guideStage=0;state.guideChoice='';state.guideDraft='';state.guideFinished=false;save();renderToday();window.scrollTo({top:0,behavior:'smooth'});}
function scheduleReviews(){const now=new Date(),topic=`${currentDay().title} — ${currentDay().date}`;[1,3,7].forEach(days=>{const d=new Date(now);d.setDate(d.getDate()+days);const iso=d.toISOString().slice(0,10);if(!state.reviews.some(r=>r.topic===topic&&r.due===iso))state.reviews.push({topic,due:iso,done:false});});}



const officialLawLinks={
 'Constituição Federal':'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
 'Lei 12.016/2009':'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm',
 'Lei 12.016/09':'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm',
 'Lei 4.717/1965':'https://www.planalto.gov.br/ccivil_03/leis/l4717.htm',
 'Lei 4.717/65':'https://www.planalto.gov.br/ccivil_03/leis/l4717.htm',
 'Lei 13.300/2016':'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/lei/l13300.htm',
 'Lei 13.300/16':'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/lei/l13300.htm',
 'Lei 9.507/1997':'https://www.planalto.gov.br/ccivil_03/leis/l9507.htm',
 'Lei 9.507/97':'https://www.planalto.gov.br/ccivil_03/leis/l9507.htm',
 'Lei 9.868/1999':'https://www.planalto.gov.br/ccivil_03/leis/l9868.htm',
 'Lei 9.868/99':'https://www.planalto.gov.br/ccivil_03/leis/l9868.htm',
 'Lei 9.882/1999':'https://www.planalto.gov.br/ccivil_03/leis/l9882.htm',
 'Lei 9.882/99':'https://www.planalto.gov.br/ccivil_03/leis/l9882.htm',
 'Lei 11.417/2006':'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11417.htm',
 'Lei 11.417/06':'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11417.htm',
 'CPC':'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm'
};
function officialLawUrl(name){
 const key=Object.keys(officialLawLinks).find(k=>name===k||name.includes(k));
 return key?officialLawLinks[key]:'';
}
function lawOpenButton(v,compact=false){
 if(!officialLawUrl(v[1]))return '';
 const label=compact?'Ler aqui':'Ler artigo aqui';
 const payload=encodeURIComponent(JSON.stringify([v[1],v[2],v[3]||''])).replace(/'/g,'%27');
 return `<button type="button" class="law-open-btn ${compact?'compact':''}" onclick="event.stopPropagation();openLawReaderPayload('${payload}')" aria-label="Ler ${v[1]} ${v[2]} dentro da plataforma">${label}</button>`;
}
function openLawReaderPayload(payload){const [name,ref,purpose]=JSON.parse(decodeURIComponent(payload));openLawReader(name,ref,purpose);}



const lawReaderEntries={
 'Lei 9.882/1999|Art. 1º e seu parágrafo único':{title:'Lei 9.882/1999 — Art. 1º',text:'A arguição prevista no § 1º do art. 102 da Constituição Federal será proposta perante o Supremo Tribunal Federal e terá por objeto evitar ou reparar lesão a preceito fundamental, resultante de ato do Poder Público. O parágrafo único também contempla controvérsia constitucional relevante sobre lei ou ato normativo federal, estadual ou municipal, incluídos os anteriores à Constituição.',meaning:'Define o objeto da ADPF e ajuda a reconhecer duas pistas importantes: ato do Poder Público e controvérsia sobre norma inclusive anterior à Constituição.',fgv:'A FGV costuma usar norma pré-CF/88 ou municipal para diferenciar ADPF de ADI.'},
 'Constituição Federal|Arts. 102 e 103':{title:'CF — Arts. 102 e 103',text:'O art. 102 concentra competências do STF, inclusive controle concentrado e Recurso Extraordinário. O art. 103 reúne os legitimados para as ações de controle abstrato.',meaning:'Leia os dois em conjunto: primeiro pergunte se o STF é competente; depois verifique se quem propõe a ação é legitimado.',fgv:'É um dos cruzamentos mais recorrentes da 2ª fase: competência do STF + legitimidade + objeto da ação.'},
 'Constituição Federal|Art. 5º':{title:'CF — Art. 5º',text:'O art. 5º reúne direitos e garantias fundamentais, incluindo igualdade, legalidade, liberdade, devido processo e os remédios constitucionais. Para este treino, concentre-se no inciso relacionado ao problema apresentado.',meaning:'Não tente decorar o artigo inteiro. Aprenda a localizar rapidamente o direito ou remédio constitucional indicado pelo enunciado.',fgv:'A FGV geralmente cobra o direito específico e o inciso correspondente, com aplicação ao fato. Citar “art. 5º” genericamente costuma ser insuficiente.'},
 'Constituição Federal|Art. 5º, LXIX':{title:'CF — Art. 5º, LXIX',text:'conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público;',meaning:'É a base constitucional do Mandado de Segurança individual. O núcleo é: direito líquido e certo + ato ilegal/abusivo de autoridade + não cabimento de HC ou HD.',fgv:'A FGV costuma cobrar a identificação do MS a partir desses gatilhos e exige que você explique por que o direito é líquido e certo e por que a prova já está pronta.'},
 'Constituição Federal|Art. 5º, LXXI':{title:'CF — Art. 5º, LXXI',text:'conceder-se-á mandado de injunção sempre que a falta de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania;',meaning:'É o gatilho constitucional do Mandado de Injunção: existe um direito constitucional, mas falta norma regulamentadora e, por isso, o direito não consegue ser exercido.',fgv:'A FGV costuma opor MI a ADO. Se a situação é concreta, com titular impedido de exercer um direito por falta de norma, pense primeiro em MI.'},
 'Constituição Federal|Art. 5º, LXXII':{title:'CF — Art. 5º, LXXII',text:'conceder-se-á habeas data: a) para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público; b) para a retificação de dados, quando não se prefira fazê-lo por processo sigiloso, judicial ou administrativo;',meaning:'O Habeas Data serve para conhecer ou corrigir dados pessoais do próprio impetrante em banco de dados público ou de caráter público.',fgv:'A FGV costuma testar se o dado é pessoal do impetrante. Se a pessoa quer informação genérica de interesse público, não é HD.'},
 'Constituição Federal|Art. 102, §1º':{title:'CF — Art. 102, §1º',text:'A arguição de descumprimento de preceito fundamental, decorrente desta Constituição, será apreciada pelo Supremo Tribunal Federal, na forma da lei.',meaning:'É a previsão constitucional da ADPF e fixa o STF como órgão competente.',fgv:'A FGV costuma combinar esse artigo com a Lei 9.882/99 e com a subsidiariedade. Norma pré-constitucional ou municipal em controle concentrado é gatilho frequente.'},
 'Constituição Federal|Art. 102, I, a':{title:'CF — Art. 102, I, a',text:'Compete ao Supremo Tribunal Federal, precipuamente, a guarda da Constituição, cabendo-lhe processar e julgar, originariamente: a ação direta de inconstitucionalidade de lei ou ato normativo federal ou estadual e a ação declaratória de constitucionalidade de lei ou ato normativo federal;',meaning:'É a base da competência originária do STF para ADI e ADC.',fgv:'A FGV cobra muito a diferença de objeto: ADI pode alcançar lei/ato normativo federal ou estadual; ADC tem objeto federal.'},
 'Constituição Federal|Art. 103':{title:'CF — Art. 103',text:'Podem propor a ação direta de inconstitucionalidade e a ação declaratória de constitucionalidade os legitimados previstos nos incisos I a IX do art. 103 da Constituição.',meaning:'Este artigo reúne os legitimados do controle concentrado. Na prova, identifique quem está propondo a ação e verifique se está no rol constitucional.',fgv:'A FGV costuma cobrar legitimidade universal x especial e pertinência temática, especialmente para entidades de classe, confederações, governadores e mesas legislativas.'},
 'Constituição Federal|Art. 103, VIII':{title:'CF — Art. 103, VIII',text:'o partido político com representação no Congresso Nacional;',meaning:'Partido político com representação no Congresso Nacional é legitimado para o controle concentrado.',fgv:'Se o enunciado disser expressamente que o partido tem representação no Congresso, isso normalmente é pista direta de legitimidade.'},
 'Constituição Federal|Art. 97':{title:'CF — Art. 97',text:'Somente pelo voto da maioria absoluta de seus membros ou dos membros do respectivo órgão especial poderão os tribunais declarar a inconstitucionalidade de lei ou ato normativo do Poder Público.',meaning:'É a cláusula de reserva de plenário.',fgv:'A FGV pode cobrar controle difuso em tribunal e a necessidade de observar a reserva de plenário, inclusive em conexão com a Súmula Vinculante 10.'},
 'Constituição Federal|Art. 52, X':{title:'CF — Art. 52, X',text:'Compete privativamente ao Senado Federal suspender a execução, no todo ou em parte, de lei declarada inconstitucional por decisão definitiva do Supremo Tribunal Federal.',meaning:'É a competência constitucional do Senado relacionada à decisão definitiva do STF no controle difuso.',fgv:'A cobrança costuma aparecer ao comparar efeitos do controle difuso e concentrado.'},
 'Constituição Federal|Art. 102, III':{title:'CF — Art. 102, III',text:'Compete ao Supremo Tribunal Federal julgar, mediante recurso extraordinário, as causas decididas em única ou última instância, quando a decisão recorrida se enquadrar nas hipóteses constitucionais das alíneas do inciso III.',meaning:'É a base constitucional do Recurso Extraordinário.',fgv:'A FGV espera que você reconheça que já existe decisão judicial e que a discussão constitucional chega ao STF pela via recursal, não por ação autônoma.'},
 'Constituição Federal|Art. 60, §4º':{title:'CF — Art. 60, §4º',text:'Não será objeto de deliberação a proposta de emenda tendente a abolir: I - a forma federativa de Estado; II - o voto direto, secreto, universal e periódico; III - a separação dos Poderes; IV - os direitos e garantias individuais.',meaning:'São as cláusulas pétreas expressas.',fgv:'A FGV cobra limites materiais ao poder de reforma e costuma exigir a identificação exata do núcleo protegido.'},
 'Lei 13.300/2016|Art. 2º':{title:'Lei 13.300/2016 — Art. 2º',text:'Conceder-se-á mandado de injunção sempre que a falta total ou parcial de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania.',meaning:'A lei repete e detalha o cabimento do MI, inclusive admitindo omissão total ou parcial.',fgv:'A FGV pode pontuar tanto a identificação do MI quanto a explicação de que a omissão normativa inviabiliza concretamente o exercício do direito.'},
 'Lei 13.300/2016|Art. 3º':{title:'Lei 13.300/2016 — Art. 3º',text:'São legitimados para o mandado de injunção, como impetrantes, as pessoas naturais ou jurídicas que se afirmam titulares dos direitos, das liberdades ou das prerrogativas referidos no art. 2º e, como impetrado, o Poder, o órgão ou a autoridade com atribuição para editar a norma regulamentadora.',meaning:'Define legitimidade ativa e passiva do MI.',fgv:'A banca costuma dar pistas sobre quem é titular do direito e qual órgão tem o dever de regulamentar.'},
 'Lei 12.016/2009|Art. 1º':{title:'Lei 12.016/2009 — Art. 1º',text:'Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, sempre que, ilegalmente ou com abuso de poder, qualquer pessoa física ou jurídica sofrer violação ou houver justo receio de sofrê-la por parte de autoridade.',meaning:'É a regra legal central de cabimento do MS.',fgv:'Procure no enunciado: autoridade, ilegalidade/abuso, direito líquido e certo e prova pré-constituída.'},
 'Lei 12.016/2009|Art. 6º':{title:'Lei 12.016/2009 — Art. 6º',text:'A petição inicial deverá preencher os requisitos estabelecidos pela lei processual, será apresentada em 2 (duas) vias com os documentos que instruírem a primeira reproduzidos na segunda e indicará, além da autoridade coatora, a pessoa jurídica que esta integra, à qual se acha vinculada ou da qual exerce atribuições.',meaning:'Orienta elementos formais da petição inicial do MS e a correta identificação da autoridade coatora/pessoa jurídica.',fgv:'A banca pode pontuar a indicação correta da autoridade coatora e da pessoa jurídica interessada.'},
 'Lei 12.016/2009|Art. 23':{title:'Lei 12.016/2009 — Art. 23',text:'O direito de requerer mandado de segurança extinguir-se-á decorridos 120 (cento e vinte) dias, contados da ciência, pelo interessado, do ato impugnado.',meaning:'É o prazo decadencial do MS.',fgv:'Se o enunciado traz datas, verifique imediatamente se existe problema de decadência.'},
 'Lei 9.882/1999|Art. 4º, §1º':{title:'Lei 9.882/1999 — Art. 4º, §1º',text:'Não será admitida arguição de descumprimento de preceito fundamental quando houver qualquer outro meio eficaz de sanar a lesividade.',meaning:'É a regra da subsidiariedade da ADPF.',fgv:'A banca costuma cobrar expressamente a inexistência de outro meio eficaz. Escrever apenas “cabe ADPF” pode deixar ponto na mesa.'},
 'CPC|Art. 1.029':{title:'CPC — Art. 1.029',text:'O recurso extraordinário e o recurso especial, nos casos previstos na Constituição Federal, serão interpostos perante o presidente ou o vice-presidente do tribunal recorrido, em petições distintas que conterão os requisitos legais.',meaning:'É a porta de entrada procedimental do RE e do REsp.',fgv:'Em peça de RE, atenção ao endereçamento/interposição perante o tribunal recorrido e à demonstração do cabimento constitucional.'},
 'CPC|Art. 1.035':{title:'CPC — Art. 1.035',text:'O Supremo Tribunal Federal, em decisão irrecorrível, não conhecerá do recurso extraordinário quando a questão constitucional nele versada não tiver repercussão geral, nos termos deste artigo.',meaning:'A repercussão geral é requisito essencial do RE.',fgv:'A FGV costuma cobrar tópico próprio demonstrando transcendência econômica, política, social ou jurídica da questão constitucional.'},
 'CPC|Art. 988':{title:'CPC — Art. 988',text:'Caberá reclamação da parte interessada ou do Ministério Público para: I - preservar a competência do tribunal; II - garantir a autoridade das decisões do tribunal; III - garantir a observância de enunciado de súmula vinculante e de decisão do STF em controle concentrado; IV - garantir a observância de acórdão proferido em julgamento de incidente de resolução de demandas repetitivas ou de incidente de assunção de competência.',meaning:'É a regra central de cabimento da Reclamação.',fgv:'A banca fornece um ato que afronta competência, decisão vinculante ou precedente enquadrado no artigo. Sua tarefa é ligar o fato à hipótese exata.'},
 'Lei 9.868/1999|Arts. 2º e seguintes':{title:'Lei 9.868/1999 — Art. 2º e sequência',text:'O art. 2º enumera os legitimados para propor ADI. Os artigos seguintes disciplinam petição inicial, informações, manifestações institucionais, cautelar e julgamento.',meaning:'Use este bloco para conferir legitimidade, requisitos da inicial e procedimento da ADI/ADC.',fgv:'A FGV normalmente cobra legitimidade, pertinência temática, objeto da ação e pedidos/cautelar. Na peça, esses pontos precisam aparecer organizados.'},
 'Constituição Federal|Arts. 18 a 36':{title:'CF — Arts. 18 a 36',text:'Este bloco trata da Organização do Estado: Federação, União, Estados, Municípios, Distrito Federal, competências e intervenção.',meaning:'É o mapa principal para questões federativas.',fgv:'Ao ler o enunciado, pergunte: qual ente? qual matéria? competência material ou legislativa? Depois procure arts. 21, 22, 23, 24, 25 e 30.'},
 'Constituição Federal|Arts. 21 a 24':{title:'CF — Arts. 21 a 24',text:'Arts. 21 e 23 tratam principalmente de competências materiais; arts. 22 e 24 tratam de competências legislativas privativas e concorrentes.',meaning:'Esse conjunto é o coração da repartição de competências da União.',fgv:'A banca adora trocar competência material por legislativa. Antes de escolher o artigo, identifique se o enunciado fala em executar uma atividade ou legislar sobre uma matéria.'},
 'Constituição Federal|Arts. 44 a 69':{title:'CF — Arts. 44 a 69',text:'Este bloco abrange o Poder Legislativo federal e o processo legislativo, incluindo espécies normativas, iniciativa, emendas, sanção, veto e promulgação.',meaning:'É o mapa para questões sobre produção das leis.',fgv:'A FGV costuma cobrar iniciativa privativa, aumento de despesa, emendas parlamentares, sanção/veto e simetria nos Estados/Municípios.'},
 'Constituição Federal|Arts. 76 a 91':{title:'CF — Arts. 76 a 91',text:'Este bloco trata do Poder Executivo federal, Presidente e Vice-Presidente da República, atribuições, responsabilidade e órgãos de consulta.',meaning:'Use quando o enunciado discute competências ou responsabilidades do Chefe do Executivo.',fgv:'A banca costuma cruzar art. 84 com processo legislativo, decretos, nomeações e competências privativas.'},
 'Constituição Federal|Arts. 12 e 13':{title:'CF — Arts. 12 e 13',text:'Este bloco trata da nacionalidade brasileira, brasileiros natos e naturalizados, perda/reaquisição e idioma/símbolos nacionais.',meaning:'É o núcleo de nacionalidade.',fgv:'A FGV costuma cobrar cargos privativos de brasileiro nato, extradição e distinções permitidas pela Constituição.'},
 'Constituição Federal|Arts. 14 a 16':{title:'CF — Arts. 14 a 16',text:'Este bloco trata de soberania popular, alistamento e voto, elegibilidade, inelegibilidades e anterioridade eleitoral.',meaning:'É o núcleo constitucional dos direitos políticos.',fgv:'A banca cobra condições de elegibilidade, hipóteses de inelegibilidade e regras de aplicação temporal.'}
};

function normalizeLawRef(ref){return String(ref||'').replace(/^Abra o /i,'').replace(/^art\./i,'Art.').trim();}
function lawReaderKey(name,ref){return `${name}|${normalizeLawRef(ref)}`;}
function getLawReaderEntry(v){
 const exact=lawReaderEntries[lawReaderKey(v[1],v[2])];
 if(exact)return exact;
 return {title:`${v[1]} — ${normalizeLawRef(v[2])}`,text:'Este dispositivo faz parte do bloco indicado no seu roteiro de estudo.',meaning:v[3]||'Leia o dispositivo identificando a regra principal e quem ela protege ou obriga.',fgv:'Na prova, transforme a leitura em uma resposta objetiva: regra jurídica + dispositivo + aplicação ao fato.'};
}
function ensureLawReader(){
 if(document.getElementById('lawReaderModal'))return;
 const wrap=document.createElement('div');
 wrap.id='lawReaderModal';wrap.className='law-reader-modal';wrap.hidden=true;
 wrap.innerHTML=`<div class="law-reader-backdrop" onclick="closeLawReader()"></div><section class="law-reader-sheet" role="dialog" aria-modal="true" aria-labelledby="lawReaderTitle"><div class="law-reader-head"><div><span class="pill">LEITURA DENTRO DA PLATAFORMA</span><h2 id="lawReaderTitle"></h2></div><button class="law-reader-close" onclick="closeLawReader()" aria-label="Fechar">×</button></div><div id="lawReaderBody"></div><div class="law-reader-footer"><button class="btn good" onclick="closeLawReader()">Entendi, voltar ao treino</button></div></section>`;
 document.body.appendChild(wrap);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLawReader();});
}
function openLawReader(name,ref,purpose=''){
 ensureLawReader();
 const v=['',name,ref,purpose],entry=getLawReaderEntry(v),m=document.getElementById('lawReaderModal');
 document.getElementById('lawReaderTitle').textContent=entry.title;
 const broad=/^Arts\.|e seguintes|Art\. 5º$/.test(normalizeLawRef(ref));
 document.getElementById('lawReaderBody').innerHTML=`<div class="law-reader-source"><b>${broad?'Mapa do bloco para leitura':'Texto do dispositivo para leitura'}</b><p>${escapeHtml(entry.text)}</p></div><div class="law-reader-explain"><h3>💡 O que esse artigo quer dizer</h3><p>${escapeHtml(entry.meaning)}</p></div><div class="law-reader-fgv"><h3>🎯 Como a FGV cobra isso</h3><p>${escapeHtml(entry.fgv)}</p></div>${purpose?`<div class="callout"><b>Objetivo deste passo:</b> ${escapeHtml(purpose)}</div>`:''}`;
 m.hidden=false;document.body.classList.add('modal-open');
}
function closeLawReader(){const m=document.getElementById('lawReaderModal');if(m)m.hidden=true;document.body.classList.remove('modal-open');}

function renderSchedule(){
 const active=currentDay().iso;
 const intense=days.filter(d=>d.iso>='2026-10-14');
 const cards=intense.map((d,i)=>{
  const blocks=(d.blocks||[]).map(b=>`<div class="schedule-block"><b>${b[0]}</b><span><strong>${b[1]}</strong><br>${b[2]}</span></div>`).join('');
  return `<div class="schedule-day-card ${d.iso===active?'active':''}"><button class="day ${d.iso===active?'auto-today':''}" style="width:100%;text-align:left;border:0;cursor:pointer" onclick="openStudyDay('${d.iso}')"><div class="date">${d.date}</div><div><b>${d.title}</b><div class="muted">${d.focus}</div></div><span class="module-count">${d.iso===active?'HOJE':(state.daySessions?.[d.iso]?.guideFinished?'✓':'')}</span></button><div class="schedule-task-chips">${d.tasks.map(t=>`<span>${t}</span>`).join('')}</div>${blocks?`<details class="schedule-blocks" ${d.iso===active?'open':''}><summary>Ver horários e tarefas do dia</summary>${blocks}</details>`:''}</div>`;
 }).join('');
 document.getElementById('cronograma').innerHTML=`<div class="card span-12"><span class="pill">4 DIAS FINAIS</span><h2>Plano de 14 a 17 de outubro</h2><p class="muted">Objetivo: passar por todas as peças, fundamentos constitucionais, Vade Mecum, discursivas e um simulado completo sem sacrificar o descanso da véspera.</p><div class="callout"><b>Regra dos quatro dias:</b> estrutura universal todos os dias + Vade aberto + correção ativa. Não estudar peça como texto isolado.</div>${cards}</div>`;
}
function universalPieceMirror(){
 return `EXCELENTÍSSIMO(A) SENHOR(A) [ÓRGÃO/JUÍZO COMPETENTE]\n\n[NOME/QUALIFICAÇÃO DA PARTE], por seu advogado, vem, respeitosamente, à presença de Vossa Excelência, com fundamento em [DISPOSITIVO CONSTITUCIONAL/LEGAL], [PROPOR / IMPETRAR / INTERPOR] a presente\n\n[NOME DA PEÇA]\n\n[em face de / contra / tendo como autoridade / em razão de] [PARTE, AUTORIDADE, ÓRGÃO OU DECISÃO], pelos fatos e fundamentos a seguir.\n\nI — DOS FATOS\nResuma somente os fatos que mudam competência, cabimento, direito ou pedido.\n\nII — DO CABIMENTO, COMPETÊNCIA, LEGITIMIDADE E TEMPESTIVIDADE\nA presente medida é cabível porque [GATILHO DA PEÇA], nos termos de [ARTIGO].\nÉ competente [ÓRGÃO], porque [REGRA DE COMPETÊNCIA + ARTIGO].\nA parte possui legitimidade porque [REGRA + ARTIGO].\nA medida é tempestiva porque [PRAZO / DATA / REGRA], quando houver prazo específico.\n\nIII — DO DIREITO\n\n3.1 — [TESE 1]\nO fato relevante é [FATO]. A Constituição/lei estabelece [REGRA], conforme [ARTIGO]. No caso, [APLICAÇÃO]. Portanto, [CONCLUSÃO].\n\n3.2 — [TESE 2]\nO fato relevante é [FATO]. A Constituição/lei estabelece [REGRA], conforme [ARTIGO]. No caso, [APLICAÇÃO]. Portanto, [CONCLUSÃO].\n\n3.3 — [TESE 3, SE HOUVER]\nO fato relevante é [FATO]. A Constituição/lei estabelece [REGRA], conforme [ARTIGO]. No caso, [APLICAÇÃO]. Portanto, [CONCLUSÃO].\n\nIV — DA MEDIDA URGENTE / LIMINAR [SE COUBER]\nEstão presentes [REQUISITOS ESPECÍFICOS DA PEÇA], porque [FATOS DO ENUNCIADO]. Requer-se [EFEITO URGENTE].\n\nV — DOS PEDIDOS\nDiante do exposto, requer:\na) [PEDIDO PROCESSUAL INICIAL];\nb) [PEDIDO RELACIONADO À TESE 1];\nc) [PEDIDO RELACIONADO À TESE 2];\nd) [LIMINAR/TUTELA, SE CABÍVEL];\ne) ao final, [PROVIMENTO PRINCIPAL DA PEÇA];\nf) [DEMAIS PROVIDÊNCIAS ESPECÍFICAS: informações, MP, citação, intimação etc.].\n\nDiante do exposto, pede deferimento.\n\nLocal..., Data...\n\nADVOGADO(A)...\nOAB...`;
}
function methodScratchTemplate(){
 return `QUEM É O CLIENTE? ______________________________\nQUEM/QUAL ATO GEROU O PROBLEMA? ______________________________\nO QUE O CLIENTE QUER CONSEGUIR? ______________________________\nDIREITO/REGRA VIOLADA: ______________________________\n\nPEÇA: ______________________________\nFUNDAMENTO-ÂNCORA: ______________________________\nCOMPETÊNCIA: ______________________________\nLEGITIMIDADE: ______________________________\nPRAZO/TEMPESTIVIDADE: ______________________________\nURGÊNCIA/LIMINAR: ______________________________\n\nTESE 1 = FATO + ARTIGO + APLICAÇÃO + CONCLUSÃO\n______________________________________________\nTESE 2 = FATO + ARTIGO + APLICAÇÃO + CONCLUSÃO\n______________________________________________\nTESE 3 = FATO + ARTIGO + APLICAÇÃO + CONCLUSÃO\n______________________________________________\n\nPEDIDOS: cada tese precisa gerar uma consequência/pedido.\n1. ____________________________________________\n2. ____________________________________________\n3. ____________________________________________\n\nREVISÃO FINAL: competência → peça → fundamento → teses → artigos → pedidos → fechamento.`;
}
function selectMethodPiece(i){
 if(!pieceTemplates[i])return;
 state.methodPieceIndex=i;
 localStorage.setItem(LS,JSON.stringify(state));
 renderPieces();
}
function saveUniversalMethodDraft(value){
 state.universalMethodDraft=value;
 localStorage.setItem(LS,JSON.stringify(state));
}
function saveUniversalMirrorDraft(value){
 state.universalMirrorDraft=value;
 localStorage.setItem(LS,JSON.stringify(state));
}
function copyUniversalMirror(){
 const text=state.universalMirrorDraft||universalPieceMirror();
 navigator.clipboard?.writeText(text).then(()=>alert('Espelho universal copiado.')).catch(()=>alert('Selecione o espelho e copie manualmente.'));
}
function resetUniversalMirror(){
 delete state.universalMirrorDraft;
 delete state.universalMethodDraft;
 localStorage.setItem(LS,JSON.stringify(state));
 renderPieces();
}
function openMethodPiece(i){
 const el=document.getElementById(`piece-model-${i}`);if(!el)return;
 el.open=true;
 setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),50);
}
function renderPieceMethod(){
 const idx=Math.min(Math.max(Number(state.methodPieceIndex)||0,0),pieceTemplates.length-1);
 const p=pieceTemplates[idx];
 const scratch=state.universalMethodDraft||methodScratchTemplate();
 const mirror=state.universalMirrorDraft||universalPieceMirror();
 const picker=pieceTemplates.map((x,i)=>`<button class="method-piece-btn ${i===idx?'active':''}" onclick="selectMethodPiece(${i})">${escapeHtml(x.name)}</button>`).join('');
 return `<div class="card span-12 method-card"><span class="pill">ESPELHO UNIVERSAL • DECORE UMA ESTRUTURA SÓ</span><h2>Uma peça-base para adaptar a qualquer peça da 2ª fase</h2><p class="muted">O esqueleto mental é sempre o mesmo. O que muda são apenas os campos variáveis: <b>nome da peça, fundamento, competência, legitimidade, prazo, teses, requisitos específicos e pedidos</b>.</p><div class="method-rule"><b>DECORAR:</b> ENDEREÇAMENTO → PARTE → PEÇA + FUNDAMENTO → FATOS → CABIMENTO/COMPETÊNCIA/LEGITIMIDADE/PRAZO → DIREITO → URGÊNCIA → PEDIDOS → FECHAMENTO.</div><div class="universal-mirror-card"><div class="method-step-badge">★</div><h3>📌 Espelho universal para memorizar</h3><p class="muted">Memorize a ordem e as frases de ligação. Tudo que estiver entre <b>[colchetes]</b> é adaptável ao enunciado.</p><textarea class="scratch-pad universal-piece-pad" rows="34" oninput="saveUniversalMirrorDraft(this.value)">${escapeHtml(mirror)}</textarea><div class="method-actions"><button class="btn good" onclick="copyUniversalMirror()">Copiar espelho universal</button><button class="btn secondary" onclick="resetUniversalMirror()">Restaurar modelo</button></div></div><div class="method-grid"><section class="method-stage"><div class="method-step-badge">1</div><h3>🧠 Antes de escrever</h3><p class="muted">Use sempre o mesmo rascunho. Ele serve para qualquer peça.</p><textarea class="scratch-pad" rows="22" oninput="saveUniversalMethodDraft(this.value)">${escapeHtml(scratch)}</textarea></section><section class="method-stage"><div class="method-step-badge">2</div><h3>🔁 O que muda em cada peça</h3><div class="method-piece-picker">${picker}</div><h4>${escapeHtml(p.name)}</h4><p><b>Gatilho:</b><br>${escapeHtml(p.trigger)}</p><p><b>Fundamento:</b><br><span class="law">${escapeHtml(p.base)}</span></p><div class="callout"><b>Ajuste específico:</b><br>${escapeHtml(p.alert)}</div><ol>${p.model.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol></section><section class="method-stage"><div class="method-step-badge">3</div><h3>⚖️ Regra de adaptação</h3><ol class="method-build-list"><li>Mantenha a <b>mesma ordem</b> do espelho universal.</li><li>Troque somente os campos entre <b>[colchetes]</b>.</li><li>Se um bloco não existir naquela peça, <b>retire-o</b> (ex.: liminar ou prazo específico).</li><li>Em recurso, adapte “partes” para recorrente/recorrido e inclua interposição/razões quando exigido.</li><li>Em controle concentrado, adapte polo passivo para órgão/autoridade responsável pela norma e observe o procedimento próprio.</li><li>Cada tese usa: <b>FATO → LEI → APLICAÇÃO → CONCLUSÃO</b>.</li><li>Cada tese importante deve aparecer nos <b>pedidos</b>.</li></ol><button class="btn good full" onclick="openMethodPiece(${idx})">Ver exemplo completo aplicado a ${escapeHtml(p.name)} ↓</button></section></div></div>`;
}

function renderPieces(){
 const skeleton=universalSkeleton.map((x,i)=>{const ex=universalExamples[x[0]];return `<div class="template-step clickable-step"><div class="step-top"><b>${x[0]}</b><span class="step-number">${i+1}</span></div><span>${x[1]}</span><button class="example-btn" onclick="toggleUniversalExample(${i})">Ver exemplo de como fazer</button><div id="universal-example-${i}" class="universal-example" hidden>${ex?`<p class="example-intro">${ex.intro}</p>${ex.examples.map(e=>`<div class="example-box"><b>${e[0]}</b><pre>${e[1]}</pre></div>`).join('')}<div class="warning-inline"><b>Atenção:</b> ${ex.alert}</div>`:''}</div></div>`}).join('');
 const cards=pieceTemplates.map((p,i)=>`<details id="piece-model-${i}" class="piece piece-model"><summary>${p.name} <span class="piece-trigger">${p.trigger}</span></summary><div class="piece-body"><p><span class="law">${p.base}</span></p><div class="callout"><b>Como reconhecer:</b> ${p.alert}</div><h4>Checklist da peça</h4><ol>${p.model.map(x=>`<li>${x}</li>`).join('')}</ol><div class="piece-full-head"><h4>Peça completa — modelo adaptável</h4><button class="example-btn" onclick="copyCompletePiece(${i})">Copiar peça completa</button></div><pre class="complete-piece-text">${p.fullText}</pre><div class="warning-inline"><b>Na prova:</b> adapte competência, partes, fatos, fundamentos e pedidos ao enunciado. Não invente dados que não foram fornecidos.</div></div></details>`).join('');
 document.getElementById('pecas').innerHTML=`<div class="grid">${renderPieceMethod()}<div class="card span-12"><span class="pill">MODELO UNIVERSAL</span><h2>Estrutura que se adapta ao tema</h2><p>Não decore uma peça inteira. Decore a <b>ordem de raciocínio</b>: competência → legitimidade → cabimento → fatos → fundamento geral → fundamento específico → tutela → pedidos.</p><p class="muted">Agora cada etapa é interativa. Clique em <b>“Ver exemplo de como fazer”</b> para abrir modelos prontos de redação e entender como adaptar.</p><div class="template-grid">${skeleton}</div><div class="warning-inline"><b>Importante:</b> estes exemplos são moldes de estudo. A competência, as partes, a fundamentação e os pedidos devem sempre ser adaptados ao enunciado. Não transforme o Vade Mecum em roteiro de peça, porque o edital proíbe marcações/remissões que estruturem peças processuais.</div></div><div class="card span-12"><h2>Modelos por peça</h2><p class="muted">Abra a peça e treine substituindo os fatos, fundamentos e pedidos pelo tema do enunciado.</p>${cards}</div></div>`;
}
function toggleUniversalExample(i){const el=document.getElementById(`universal-example-${i}`);if(!el)return;el.hidden=!el.hidden;const btn=el.previousElementSibling;if(btn)btn.textContent=el.hidden?'Ver exemplo de como fazer':'Fechar exemplo';}
function copyCompletePiece(i){const p=pieceTemplates[i];if(!p?.fullText)return;navigator.clipboard?.writeText(p.fullText).then(()=>alert(`${p.name}: peça completa copiada.`)).catch(()=>alert('Selecione o modelo e copie manualmente.'));}



const constitutionMap=[
 ['Preâmbulo','Antes do art. 1º','Contexto e valores constitucionais; use com cautela, porque a prova normalmente pontua dispositivo normativo específico.'],
 ['Título I — Princípios Fundamentais','Arts. 1º a 4º','Fundamentos da República, separação dos Poderes, objetivos fundamentais e relações internacionais.'],
 ['Título II — Direitos e Garantias Fundamentais','Arts. 5º a 17','Direitos individuais/coletivos, direitos sociais, nacionalidade, direitos políticos e partidos políticos.'],
 ['Título III — Organização do Estado','Arts. 18 a 43','Federação, União, Estados, Municípios, competências e Administração Pública.'],
 ['Título IV — Organização dos Poderes','Arts. 44 a 135','Legislativo, processo legislativo, Executivo, Judiciário e funções essenciais à Justiça.'],
 ['Título V — Defesa do Estado e das Instituições Democráticas','Arts. 136 a 144','Estado de defesa, estado de sítio, Forças Armadas e segurança pública.'],
 ['Título VI — Tributação e Orçamento','Arts. 145 a 169','Sistema tributário, finanças públicas e orçamento.'],
 ['Título VII — Ordem Econômica e Financeira','Arts. 170 a 192','Livre iniciativa, propriedade, intervenção estatal e sistema financeiro.'],
 ['Título VIII — Ordem Social','Arts. 193 a 232','Seguridade social, saúde, educação, cultura, meio ambiente, família e povos indígenas.'],
 ['Título IX — Disposições Constitucionais Gerais','Arts. 233 a 250','Regras constitucionais gerais finais.'],
 ['ADCT','Após o texto permanente','Normas transitórias. Na prova, verifique sempre se o tema possui regra específica no ADCT.']
];

const constitutionHotspots=[
 ['Art. 1º–4º','Princípios fundamentais','Use como moldura geral, nunca como substituto da regra específica.'],
 ['Art. 5º','Direitos e remédios constitucionais','Igualdade, liberdade, devido processo, MS, MI, HD e Ação Popular.'],
 ['Arts. 12–16','Nacionalidade e direitos políticos','Nacionalidade, extradição, elegibilidade/inelegibilidade.'],
 ['Arts. 18, 21–24, 25 e 30','Federação e competências','Um dos blocos mais importantes para Constitucional na FGV.'],
 ['Art. 37','Administração Pública','LIMPE + regras sobre servidores, responsabilidade e acumulação.'],
 ['Arts. 59–69','Processo legislativo','Espécies normativas, iniciativa, emendas, sanção, veto e promulgação.'],
 ['Art. 84','Presidente da República','Competências do Chefe do Executivo federal.'],
 ['Art. 97','Reserva de plenário','Controle difuso nos tribunais.'],
 ['Arts. 102–103','STF e controle concentrado','Competência do STF e legitimados.'],
 ['Art. 125, §2º','Controle estadual','Representação de inconstitucionalidade perante TJ.'],
 ['Art. 170','Ordem econômica','Livre iniciativa e livre concorrência.'],
 ['Arts. 196+, 205+, 225','Saúde, educação e meio ambiente','Direitos sociais específicos que podem virar fundamento direto.']
];

const mirrorRules=[
 ['1. Responda primeiro','Comece com “Sim”, “Não”, “O órgão competente é...” ou “A medida cabível é...”. Não esconda a conclusão.'],
 ['2. Diga a regra em palavras','Explique a tese jurídica que resolve o item. A FGV repete que a mera indicação do artigo não basta.'],
 ['3. Cite o fundamento exato','Depois da tese, indique o artigo, inciso, parágrafo ou lei que sustenta a resposta.'],
 ['4. Aplique ao fato','Mostre por que o fato do enunciado entra naquela regra. Uma frase costuma ser suficiente.'],
 ['5. Feche a conclusão','Se necessário, conclua a consequência jurídica: válido, inválido, competente, incompetente, cabível, incabível etc.']
];

function renderFoundations(){
 const layers=foundationLayers.map(f=>`<div class="foundation-card"><h3>${f.title}</h3><p><span class="law">${f.law}</span></p><p>${f.tip}</p></div>`).join('');
 document.getElementById('fundamentos').innerHTML=`<div class="grid"><div class="card span-8"><span class="pill">MÉTODO FGV</span><h2>Fundamentação em 3 camadas</h2><div class="foundation-flow"><div><b>1. REGRA GERAL</b><span>Qual princípio ou eixo constitucional organiza o caso?</span></div><div><b>2. REGRA ESPECÍFICA</b><span>Qual artigo resolve exatamente a controvérsia?</span></div><div><b>3. APLICAÇÃO</b><span>Explique por que o fato viola/aplica a regra e qual consequência jurídica decorre.</span></div></div><div class="casebox"><b>Exemplo — lei local/estadual invade competência da União + ato concreto de autoridade</b><p><b>Geral:</b> supremacia da Constituição e repartição constitucional de competências. <b>Específica:</b> cite o inciso exato do art. 22 (ou outro dispositivo de competência) correspondente à matéria. <b>Peça:</b> se houver ato concreto, direito líquido e certo e prova pré-constituída, o caminho pode ser Mandado de Segurança; a inconstitucionalidade da lei é arguida incidentalmente. Se o enunciado pedir controle abstrato por legitimado, a peça muda.</p></div><div class="success"><h3>Fórmula de parágrafo</h3><p><b>Regra → fundamento → aplicação → conclusão.</b> Ex.: “A Constituição reserva a matéria à União (...). A lei estadual disciplinou exatamente essa matéria (...). Logo, há vício formal de competência e o ato administrativo nela baseado não pode prevalecer.”</p></div></div><div class="card span-4"><h3>Checklist antes de escrever</h3><label class="task"><input type="checkbox"><span>Quem praticou o ato?</span></label><label class="task"><input type="checkbox"><span>Existe ato concreto ou controle em tese?</span></label><label class="task"><input type="checkbox"><span>Há prova pré-constituída?</span></label><label class="task"><input type="checkbox"><span>Qual ente tem competência?</span></label><label class="task"><input type="checkbox"><span>Qual direito/princípio foi violado?</span></label><label class="task"><input type="checkbox"><span>Qual artigo específico pontua no espelho?</span></label><label class="task"><input type="checkbox"><span>Qual pedido corresponde ao fundamento?</span></label></div><div class="card span-12"><h2>Banco de fundamentos gerais</h2><p class="muted">Use apenas o que tiver ligação real com o caso. Fundamentação geral não substitui a norma específica cobrada pela FGV.</p><div class="foundation-grid">${layers}</div></div></div>`;
}


function renderConstitution(){
 const map=constitutionMap.map(x=>`<div class="constitution-row"><div><b>${x[0]}</b><span>${x[1]}</span></div><p>${x[2]}</p></div>`).join('');
 const hot=constitutionHotspots.map(x=>`<div class="hotspot"><span class="law">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('');
 document.getElementById('constituicao').innerHTML=`<div class="grid"><div class="card span-8"><span class="pill">MAPA DA CONSTITUIÇÃO</span><h2>Entenda onde cada assunto mora</h2><p>Para a 2ª fase, não basta decorar artigos. Você precisa saber <b>em qual parte da Constituição procurar</b>. O mapa abaixo transforma a CF em blocos mentais.</p><div class="constitution-map">${map}</div></div><div class="card span-4"><h3>Como localizar rápido</h3><div class="task"><span>1</span><span><b>Identifique o assunto</b><br><span class="muted">Ex.: competência legislativa.</span></span></div><div class="task"><span>2</span><span><b>Pense no Título</b><br><span class="muted">Organização do Estado.</span></span></div><div class="task"><span>3</span><span><b>Vá ao bloco</b><br><span class="muted">Arts. 21 a 24 e 30.</span></span></div><div class="task"><span>4</span><span><b>Leia o inciso exato</b><br><span class="muted">É o inciso específico que costuma pontuar.</span></span></div><div class="callout"><b>Meta dos próximos 10 dias:</b> conseguir olhar para um tema e saber em segundos em que bloco da Constituição procurar.</div></div><div class="card span-12"><h2>Artigos-âncora para a prova</h2><div class="hotspot-grid">${hot}</div></div></div>`;
}

function renderMirror(){
 const rules=mirrorRules.map(x=>`<div class="mirror-rule"><b>${x[0]}</b><p>${x[1]}</p></div>`).join('');
 document.getElementById('espelho').innerHTML=`<div class="grid"><div class="card span-8"><span class="pill">COMO A FGV DÁ PONTO</span><h2>Responda do jeito do espelho</h2><p>Conferi padrões oficiais recentes de Constitucional. A estrutura recorrente é curta: <b>conclusão direta + tese jurídica + fundamento normativo + aplicação ao caso</b>.</p><div class="mirror-grid">${rules}</div><div class="success"><h3>Modelo universal para discursiva</h3><p><b>A) Não.</b> A Constituição estabelece [regra jurídica]. No caso, [fato relevante] viola essa regra. Portanto, [consequência]. Fundamento: <b>Art. X, inciso Y, da CRFB/88</b>.</p><p><b>B) Sim.</b> [Regra]. Como [aplicação ao fato], é possível [conclusão], nos termos do <b>Art. X</b>.</p></div></div><div class="card span-4"><h3>O que o espelho mostra</h3><p>No 42º EOU, por exemplo, a pontuação foi dividida entre a <b>afirmação jurídica correta</b> e o <b>dispositivo</b>. Em uma questão sobre liberdade de expressão, a tese e a vedação à censura valiam a maior parte do item; a indicação do artigo valia apenas uma fração menor.</p><div class="warning-inline"><b>Consequência prática:</b> escrever só “Art. 5º, IX” perde pontos. Você deve escrever o que o artigo garante ou proíbe.</div><hr><a class="btn full linkbtn" target="_blank" href="https://oab.fgv.br/arq/649/219541_OAB%2046%20-%20PADR%C3%83O%20DE%20RESPOSTA%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL.pdf">Espelho oficial 46º ↗</a><br><a class="btn secondary full linkbtn smallgap" target="_blank" href="https://oab.fgv.br/arq/645/1225075_OAB%2042%20-%20GABARITO%20JUSTIFICADO%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL.pdf">Espelho oficial 42º ↗</a></div><div class="card span-12"><h2>Treino de resposta em 60 segundos</h2><div class="answer-formula"><div><b>PERGUNTA</b><span>“O Município pode legislar sobre isso?”</span></div><div><b>RESPOSTA</b><span>“Sim/Não.”</span></div><div><b>REGRA</b><span>“A matéria é de interesse local / competência privativa da União...”</span></div><div><b>ARTIGO</b><span>“CF, art. 30, I / art. 22, inciso correspondente.”</span></div><div><b>APLICAÇÃO</b><span>“Como o caso trata exatamente dessa matéria, a competência é...”</span></div></div><p class="callout"><b>Objetivo:</b> treinar cada questão até conseguir montar esse esqueleto mental antes de começar a escrever.</p></div></div>`;
}

function renderVade(){
 const url=affiliateProduct.affiliateUrl||affiliateProduct.productUrl;const affiliate=!!affiliateProduct.affiliateUrl;
 const atlas=vadeAtlas.map(g=>`<details class="vade-group" open><summary>${g.group}</summary>${g.items.map(i=>`<div class="vade-map-row"><b>${i[0]}</b><span>${i[1]}</span></div>`).join('')}</details>`).join('');
 document.getElementById('vade').innerHTML=`<div class="grid"><div class="card span-8"><span class="pill">MAPA DE LOCALIZAÇÃO</span><h2>Vade Mecum: encontre o fundamento sem decorar página</h2><p>Treine por <b>assunto → dispositivo</b>. Na prova, o objetivo é reconhecer o tema do enunciado e chegar rápido ao bloco constitucional ou à lei específica.</p>${atlas}<div class="callout"><b>Marcação segura para o 47º EOU:</b> use apenas marca-texto/traço simples e remissões isoladas a artigo ou lei. Exemplo de remissão isolada de estudo: <span class="law">CF 5º, LXIX ↔ Lei 12.016/09</span>. Não escreva palavras-chave formando roteiro, não use post-it manuscrito e não crie sequência de peça dentro do Vade.</div></div><div class="card span-4"><span class="pill">ESTRATÉGIA</span><h3>Como marcar</h3><div class="task"><span>1</span><span><b>Uma cor/traço simples</b><br><span class="muted">Destaque apenas o dispositivo relevante.</span></span></div><div class="task"><span>2</span><span><b>Remissão isolada</b><br><span class="muted">Artigo ↔ lei ou outro artigo, sem palavras que montem peça.</span></span></div><div class="task"><span>3</span><span><b>Separadores editoriais</b><br><span class="muted">Use separadores permitidos que indiquem somente ramo/lei.</span></span></div><div class="task"><span>4</span><span><b>Mapa fica no sistema</b><br><span class="muted">O roteiro completo de estudo fica aqui; o Vade permanece dentro das regras do edital.</span></span></div><hr><a class="btn full linkbtn" target="_blank" href="https://oab.fgv.br/arq/650/580490_47%C2%BA%20eou.%20edital%20de%20abertura.%20ponto%20para%20publicar.%20%282%29.pdf">Abrir Anexo III do edital ↗</a></div><div class="card span-8"><h2>Mapa do dia</h2><p class="muted">Além do mapa geral, a sessão guiada continua dizendo o que localizar no treino de hoje.</p>${studyGuide().vade.map(v=>`<div class="task vade-map-task"><span class="stepnum">${v[0]}</span><span class="vade-step-text"><b>${v[1]}</b><br>${v[2]}<br><span class="muted">${v[3]}</span></span>${lawOpenButton(v,true)}</div>`).join('')}</div><div class="card span-4 product-card"><span class="pill">Vade recomendado</span><h3>${affiliateProduct.name}</h3><p>${affiliateProduct.note}</p><a class="btn full linkbtn" href="${url}" target="_blank">Ver opção de compra ↗</a><p class="affiliate-note">${affiliate?'Link de afiliado: a plataforma pode receber comissão, sem custo adicional para o comprador.':'O link afiliado está sendo convertido; até lá o botão abre a página do produto.'}</p></div><div class="card span-12 warning"><h3>Regra de ouro do edital</h3><p>O 47º EOU permite legislação não comentada, índices remissivos que não estruturem peças, simples marca-texto/traço/remissão e separação por clipes. Proíbe anotações pessoais e qualquer marcação/remissão usada para estruturar roteiro de peça. Por isso, o <b>mapa completo fica nesta plataforma</b>, e no Vade ficam somente marcações simples permitidas.</p></div></div>`;
}

function renderQuestions(){
 const cards=pastBank.map((q,i)=>{const qs=recentQuestionThemes[q.exam]||[];return `<div class="history-card"><div class="history-head"><span class="pill">${q.exam}</span><span class="piece-badge">${q.piece}</span></div><h3>Peça: ${q.themes}</h3><p>${q.tip}</p>${qs.length?`<details class="question-themes"><summary>Ver as 4 questões discursivas</summary><ul>${qs.map(x=>`<li>${x}</li>`).join('')}</ul></details>`:''}<div class="history-actions"><a class="btn linkbtn" target="_blank" href="${q.url}">Abrir padrão oficial FGV ↗</a><button class="btn secondary" onclick="addHistoryError(${i})">Adicionar ao treino</button></div></div>`}).join('');
 const editions=allOfficialEditions.map(e=>`<a class="edition-chip" target="_blank" href="${e.url}">${e.label.replace(' EXAME DE ORDEM UNIFICADO','').replace('EXAME DE ORDEM UNIFICADO ','')}</a>`).join('');
 document.getElementById('questoes').innerHTML=`<div class="grid"><div class="card span-12"><span class="pill">BANCO HISTÓRICO OFICIAL</span><h2>Questões e peças já cobradas — Constitucional</h2><p>O sistema usa <b>resumos dos gatilhos</b> e abre o padrão oficial da FGV para conferência. O objetivo é aprender a identificar peça, fundamento geral e fundamento específico sem decorar enunciado.</p><div class="history-grid">${cards}</div></div><div class="card span-12"><h2>Arquivo completo de edições oficiais</h2><p class="muted">Importei o índice oficial da FGV: <b>${allOfficialEditions.length} edições</b>, do 46º EOU até 2010.2. Abra qualquer edição para acessar os cadernos e padrões de resposta oficiais. As edições mais recentes acima já estão classificadas por peça e por tema; o índice continuará sendo enriquecido com a mesma classificação nas edições anteriores.</p><div class="edition-cloud">${editions}</div><p class="smallgap"><a class="btn secondary linkbtn" href="${historicalArchive.url}" target="_blank">Abrir arquivo geral FGV/OAB ↗</a></p></div><div class="card span-6"><h2>Padrões que se repetem</h2><div class="task"><span>⚖️</span><span><b>Competência federativa</b><br><span class="muted">Arts. 21, 22, 23, 24, 25 e 30 aparecem constantemente.</span></span></div><div class="task"><span>🏛️</span><span><b>Administração e moralidade</b><br><span class="muted">Art. 37, caput, combinado com ação ou ato concreto.</span></span></div><div class="task"><span>📜</span><span><b>Controle de constitucionalidade</b><br><span class="muted">ADI, ADPF, omissões, interpretação conforme e controle incidental.</span></span></div><div class="task"><span>🧭</span><span><b>Identificação da peça pelos fatos</b><br><span class="muted">A FGV fornece pistas de prova pré-constituída, legitimidade, natureza do ato e tipo de controle.</span></span></div></div><div class="card span-6"><h2>Como estudar cada questão</h2><ol class="study-steps"><li>Leia e marque no rascunho: <b>quem, contra quem, qual ato, qual objetivo</b>.</li><li>Defina se é <b>ato concreto</b> ou <b>controle em tese</b>.</li><li>Escolha a peça e escreva o artigo de cabimento.</li><li>Liste um <b>fundamento geral</b> e depois os <b>fundamentos específicos</b>.</li><li>Abra o padrão FGV e compare ponto por ponto.</li><li>Registre no caderno de erros somente o que você não localizou ou fundamentou.</li></ol></div></div>`;
}

function addHistoryError(i){const q=pastBank[i];state.errors.unshift({at:new Date().toLocaleString('pt-BR'),text:`Treinar ${q.exam}: ${q.piece} — ${q.themes}`});save();renderErrors();alert('Questão adicionada ao seu treino/caderno de erros.');}

function renderErrors(){document.getElementById('erros').innerHTML=`<div class="card"><h2>Caderno de erros e revisão automática</h2><p class="muted">Tudo que você registrar vira material do PDF e pode voltar nas revisões espaçadas.</p><div style="display:flex;gap:8px;margin-bottom:14px"><input id="manualError" type="text" placeholder="Ex.: esqueci subsidiariedade da ADPF"><button class="btn" onclick="addManualError()">Adicionar</button></div>${state.errors.length?state.errors.map((e,i)=>`<div class="task"><span>⚠️</span><span style="flex:1"><b>${e.text}</b><br><small class="muted">${e.at}</small></span><button class="btn secondary" onclick="removeError(${i})">Resolvido</button></div>`).join(''):'<p class="muted">Nenhum erro registrado ainda.</p>'}<hr><h3>Revisões programadas</h3>${state.reviews.length?state.reviews.map((r,i)=>`<label class="task"><input type="checkbox" onchange="toggleReview(${i},this.checked)" ${r.done?'checked':''}><span><b>${r.topic}</b><br><span class="muted">Revisar em ${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></span></label>`).join(''):'<p class="muted">Conclua a primeira sessão para gerar revisões de +1, +3 e +7 dias.</p>'}</div>`;}
function addManualError(){const el=document.getElementById('manualError');if(!el.value.trim())return;state.errors.unshift({at:new Date().toLocaleString('pt-BR'),text:el.value.trim()});save();renderErrors();}
function removeError(i){state.errors.splice(i,1);save();renderErrors();}
function toggleReview(i,v){state.reviews[i].done=v;save();}

let simTimer=null,remaining=5*60*60;
function fmt(s){return [Math.floor(s/3600),Math.floor((s%3600)/60),s%60].map(x=>String(x).padStart(2,'0')).join(':');}
function tick(){remaining--;const e=document.getElementById('simTimer');if(e)e.textContent=fmt(Math.max(0,remaining));if(remaining<=0)pauseSim();}
function startSim(){if(!simTimer)simTimer=setInterval(tick,1000)}function pauseSim(){clearInterval(simTimer);simTimer=null}function resetSim(){pauseSim();remaining=5*60*60;const e=document.getElementById('simTimer');if(e)e.textContent=fmt(remaining)}
function saveScore(){const v=parseFloat(document.getElementById('score').value.replace(',','.'));if(!Number.isFinite(v)||v<0||v>10)return alert('Digite nota entre 0 e 10.');state.scores.unshift({date:new Date().toLocaleDateString('pt-BR'),score:v});save();renderSim();}
function renderSim(){document.getElementById('simulados').innerHTML=`<div class="grid"><div class="card span-8"><h2>Simulado de 5 horas</h2><p>15 min triagem → 2h15 peça → 2h questões → 30 min revisão/margem.</p><div id="simTimer" class="timer">${fmt(remaining)}</div><button class="btn" onclick="startSim()">Iniciar</button> <button class="btn secondary" onclick="pauseSim()">Pausar</button> <button class="btn secondary" onclick="resetSim()">Resetar</button></div><div class="card span-4"><h3>Nota estimada</h3><input id="score" type="text" placeholder="Ex.: 6,4"><button class="btn good" style="margin-top:8px" onclick="saveScore()">Salvar nota</button>${state.scores.slice(0,5).map(s=>`<p><b>${s.score.toFixed(1)}</b> <span class="muted">• ${s.date}</span></p>`).join('')}</div></div>`;}

function generateStudyPDF(){
 const g=studyGuide(),p=closingPractice(),d=currentDay();
 if(!(window.jspdf&&window.jspdf.jsPDF))return alert('Gerador carregando. Tente novamente em instantes.');
 const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'}),W=297,H=210;
 const colors=[[32,88,168],[23,116,72],[211,130,24],[126,71,168],[26,146,164],[190,65,65]];
 const wrap=(txt,w)=>doc.splitTextToSize(String(txt||''),w);
 const node=(x,y,w,h,title,text,c,tag)=>{doc.setFillColor(250,252,255);doc.setDrawColor(...c);doc.setLineWidth(1.1);doc.roundedRect(x,y,w,h,5,5,'FD');doc.setFillColor(...c);doc.circle(x+8,y+8,5,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(7);doc.text(tag,x+8,y+10,{align:'center'});doc.setTextColor(19,34,56);doc.setFontSize(10);doc.text(title,x+16,y+7);doc.setFont('helvetica','normal');doc.setTextColor(70,87,107);doc.setFontSize(7.7);doc.text(wrap(text,w-8).slice(0,5),x+4,y+14);};
 const branch=(x1,y1,x2,y2,c)=>{doc.setDrawColor(...c);doc.setLineWidth(1.3);doc.line(x1,y1,x2,y2);};
 // Page 1 — colorful mind map
 doc.setFillColor(244,247,251);doc.rect(0,0,W,H,'F');
 doc.setTextColor(15,39,71);doc.setFont('helvetica','bold');doc.setFontSize(19);doc.text('MAPA MENTAL • OAB 2ª FASE — CONSTITUCIONAL',14,14);
 doc.setFontSize(9);doc.setTextColor(100,116,139);doc.text(`${d.date} • ${d.title}`,14,21);
 const cx=148.5,cy=99;
 const boxes=[
  [10,34,82,42,'GATILHO',g.why,colors[0],'1'],
  [205,34,82,42,'VADE / LEI',g.vade.slice(0,2).map(v=>`${v[1]} ${v[2]}`).join(' • '),colors[1],'2'],
  [10,126,82,46,'CASO OAB',p.caseText,colors[2],'3'],
  [205,126,82,46,'PEÇA',p.pieceTitle,colors[3],'4'],
  [105,156,87,39,'RESPOSTA FGV',p.qa?.[0]?`${p.qa[0][0]} — ${p.qa[0][1]}`:'Conclusão + regra + artigo + aplicação.',colors[4],'5'],
  [105,28,87,39,'MEMÓRIA',g.memory.slice(0,2).map(m=>`${m[0]} ${m[1]}`).join(' • '),colors[5],'6']
 ];
 boxes.forEach((b,i)=>{const [x,y,w,h,title,text,c,tag]=b;branch(cx,cy,x+w/2,y+h/2,c);node(x,y,w,h,title,text,c,tag)});
 doc.setFillColor(15,39,71);doc.setDrawColor(255,255,255);doc.setLineWidth(2);doc.roundedRect(cx-38,cy-18,76,36,8,8,'FD');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text('TEMA DO DIA',cx,cy-4,{align:'center'});doc.setFontSize(10);doc.text(wrap(d.title,66).slice(0,2),cx,cy+4,{align:'center'});
 // doodle / sticker footer
 doc.setFillColor(255,244,204);doc.setDrawColor(220,170,40);doc.roundedRect(14,184,74,14,5,5,'FD');doc.setTextColor(110,76,0);doc.setFontSize(8);doc.text('FIGURINHA: gatilho → artigo → aplicação',51,193,{align:'center'});
 doc.setFillColor(229,245,236);doc.setDrawColor(23,116,72);doc.roundedRect(209,184,74,14,5,5,'FD');doc.setTextColor(23,90,55);doc.text('MEMÓRIA: explique em voz alta sem olhar',246,193,{align:'center'});
 // Page 2 — colorful study cards
 doc.addPage('a4','portrait');
 doc.setFillColor(244,247,251);doc.rect(0,0,210,297,'F');doc.setTextColor(15,39,71);doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text('Resumo visual para revisão',14,17);doc.setFontSize(9);doc.setTextColor(100,116,139);doc.text(`${d.date} • ${d.title}`,14,24);
 let y=32;
 const card=(title,lines,c)=>{const content=Array.isArray(lines)?lines:[lines];const flat=content.flatMap(v=>wrap(v,174));const h=Math.max(24,14+flat.length*4.3);if(y+h>282){doc.addPage();doc.setFillColor(244,247,251);doc.rect(0,0,210,297,'F');y=16;}doc.setFillColor(255,255,255);doc.setDrawColor(...c);doc.setLineWidth(1);doc.roundedRect(14,y,182,h,5,5,'FD');doc.setFillColor(...c);doc.roundedRect(14,y,182,9,5,5,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(title,19,y+6.3);doc.setTextColor(35,50,68);doc.setFont('helvetica','normal');doc.setFontSize(8.2);doc.text(flat,19,y+15);y+=h+7;};
 card('1 • FUNDAMENTO PRINCIPAL',g.why,colors[0]);
 card('2 • VADE MECUM / LEIS',g.vade.map(v=>`${v[1]} — ${v[2]} — ${v[3]}`),colors[1]);
 card('3 • ANOTAÇÕES-CHAVE',g.notebook.map(x=>'• '+x),colors[2]);
 card('4 • ESTUDO DE CASO OAB',p.caseText,colors[3]);
 card('5 • QUESTÕES E RESPOSTAS-MODELO',p.qa.slice(0,3).map((q,i)=>`${i+1}. ${q[0]} — ${q[1]}`),colors[4]);
 card('6 • MINHAS ANOTAÇÕES',state.notes.filter(n=>n.topic?.includes(d.date)).length?state.notes.filter(n=>n.topic?.includes(d.date)).map(n=>'• '+n.text):['• Nenhuma anotação pessoal registrada para este dia.'],colors[5]);
 // Page 3 — piece in a clean memorization sheet
 doc.addPage('a4','portrait');doc.setFillColor(250,252,255);doc.rect(0,0,210,297,'F');doc.setTextColor(15,39,71);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text('Peça / modelo para copiar e memorizar',14,17);doc.setFontSize(11);doc.text(wrap(p.pieceTitle,180),14,26);doc.setDrawColor(32,88,168);doc.line(14,33,196,33);doc.setFont('times','normal');doc.setFontSize(9);doc.setTextColor(32,42,56);let py=42;for(const para of String(p.pieceCopy||'').split('\n')){const parts=wrap(para||' ',180);if(py+parts.length*4.5>282){doc.addPage('a4','portrait');doc.setFillColor(250,252,255);doc.rect(0,0,210,297,'F');py=18;}doc.text(parts,14,py);py+=Math.max(4.5,parts.length*4.5);}
 doc.save(`mapa-mental-oab-${d.iso}.pdf`);
}
function countdown(){const ms=exam-new Date();const e=document.getElementById('countdown');if(ms<=0){e.innerHTML='DIA DA PROVA';return}const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000);e.innerHTML=`${d} dias<br><small>${h}h restantes</small>`;}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active')}));
syncStudyDay();renderToday();renderSchedule();renderPieces();renderFoundations();renderConstitution();renderMirror();renderVade();renderQuestions();renderSim();renderErrors();countdown();setInterval(countdown,60000);

function renderReview(){
 const today=todayKey();
 const due=state.reviews.filter(r=>!r.done&&r.due<=today);
 document.getElementById('revisao').innerHTML=`<div class="grid"><div class="card span-8"><h2>Revisão automática</h2><p class="muted">O sistema reapresenta os pontos estudados em +1, +3 e +7 dias.</p>${due.length?due.map(r=>`<div class="task"><span>🧠</span><span style="flex:1"><b>${r.topic}</b><br><span class="muted">Revisão: ${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></span></div>`).join(''):'<div class="callout"><b>Nenhuma revisão vencida agora.</b><br>Conclua a sessão guiada de hoje para alimentar a repetição espaçada.</div>'}<h3 style="margin-top:20px">Cartões de memória</h3>${guide.memory.map((m,i)=>`<details class="flash"><summary>${i+1}. ${m[0]}</summary><p><b>${m[1]}</b></p></details>`).join('')}</div><div class="card span-4"><h3>Seu resumo</h3><p>Gere um PDF com fundamentos, suas anotações, erros e cartões de memória.</p><button class="btn good full" onclick="generateStudyPDF()">Baixar PDF de revisão</button><hr><h3>Próximas revisões</h3>${state.reviews.length?state.reviews.filter(r=>!r.done).slice(0,6).map(r=>`<p><b>${r.topic}</b><br><span class="muted">${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></p>`).join(''):'<p class="muted">Ainda não há revisões agendadas.</p>'}</div><div class="card span-12"><span class="pill">APRENDIZADO EM ÁUDIO</span><h2>Biblioteca de resumos narrados</h2><p class="muted">Ouça para revisar caminhando, no carro ou antes de dormir. Cada áudio explica o tema, reforça as associações principais e termina com revisão ativa.</p><div class="audio-library">${audioLibrary()}</div></div></div>`;
}

const SUPPORT_ENDPOINT='https://oab-support-production.up.railway.app';
let lastClientError='';
window.addEventListener('error',e=>{lastClientError=String(e.message||'Erro de interface').slice(0,300)});
window.addEventListener('unhandledrejection',e=>{lastClientError=String(e.reason?.message||e.reason||'Falha assíncrona').slice(0,300)});

function supportCategory(text){
 const t=String(text||'').toLowerCase();
 if(/voltar|fechar|modal|tela cheia|janela/.test(t))return 'overlay';
 if(/branc|trav|carreg|desatual|cache|atualiz/.test(t))return 'cache';
 if(/áudio|audio|som|voz/.test(t))return 'audio';
 if(/progresso|tarefa|marcad/.test(t))return 'progress';
 if(/botão|botao|clique|clic/.test(t))return 'button';
 return 'general';
}
function supportContext(){return {page:location.pathname,day:currentDay()?.iso||'',stage:Number(state.guideStage)||0,online:navigator.onLine,screen:`${window.innerWidth}x${window.innerHeight}`,lastError:lastClientError||''};}
function ensureSupportDesk(){
 if(document.getElementById('supportDesk'))return;
 const wrap=document.createElement('div');wrap.id='supportDesk';
 wrap.innerHTML=`<button class="support-fab" onclick="openSupportDesk()" aria-label="Abrir atendimento">💬 <span>Ajuda</span></button><section class="support-panel" hidden aria-label="Atendimento da plataforma"><div class="support-head"><div><span class="pill">ATENDIMENTO</span><h3>Está tendo alguma falha?</h3></div><button class="support-close" onclick="closeSupportDesk()" aria-label="Fechar atendimento">×</button></div><p class="support-intro">Descreva o problema. O sistema faz um diagnóstico, tenta uma correção segura na hora e registra o relato técnico para acompanhamento.</p><div class="support-quick"><button onclick="quickSupport('O botão não está funcionando')">Botão não funciona</button><button onclick="quickSupport('A tela ficou travada ou não carrega')">Tela travou</button><button onclick="quickSupport('Não consigo voltar ou fechar uma janela')">Não consigo voltar</button><button onclick="quickSupport('O áudio não está funcionando')">Áudio</button></div><textarea id="supportMessage" rows="4" placeholder="Ex.: cliquei em Voltar ao estudo e a janela não fechou..."></textarea><button class="btn good support-send" onclick="submitSupport()">Diagnosticar e corrigir</button><div id="supportReply" class="support-reply" aria-live="polite"></div><p class="support-privacy">O relatório envia apenas a descrição da falha e dados técnicos da tela; não envia suas anotações de estudo.</p></section>`;
 document.body.appendChild(wrap);
}
function openSupportDesk(){ensureSupportDesk();const p=document.querySelector('#supportDesk .support-panel');if(p)p.hidden=false;}
function closeSupportDesk(){const p=document.querySelector('#supportDesk .support-panel');if(p)p.hidden=true;}
function quickSupport(text){openSupportDesk();const el=document.getElementById('supportMessage');if(el){el.value=text;el.focus();}}
function repairOverlays(){
 document.querySelectorAll('.law-reader-modal').forEach(m=>{m.hidden=true;m.setAttribute('aria-hidden','true');});
 document.querySelectorAll('.is-fullscreen').forEach(el=>el.classList.remove('is-fullscreen'));
 document.body.classList.remove('modal-open');
}
async function runSafeRepair(category){
 if(['overlay','button','general'].includes(category)){repairOverlays();renderToday();renderProgress();return 'Fechei janelas que poderiam estar presas e reconstruí a tela de estudo.';}
 if(category==='progress'){renderToday();renderSchedule();renderProgress();return 'Recarreguei o progresso a partir dos dados salvos no aparelho.';}
 if(category==='audio'){document.querySelectorAll('audio').forEach(a=>{try{a.load()}catch{}});return 'Reiniciei os players de áudio sem apagar seu progresso.';}
 if(category==='cache'){
  try{if('caches'in window){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}if('serviceWorker'in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.update()));}}catch{}
  setTimeout(()=>location.reload(),1400);return 'Atualizei os arquivos da plataforma e limpei o cache antigo. A página será recarregada.';
 }
 return 'Executei a recuperação básica da interface.';
}
async function submitSupport(){
 const input=document.getElementById('supportMessage'),reply=document.getElementById('supportReply');const message=String(input?.value||'').trim();
 if(!message){if(reply)reply.innerHTML='<b>Conte em uma frase o que aconteceu.</b>';return;}
 const category=supportCategory(message);if(reply)reply.innerHTML='<span class="support-working">Analisando e tentando corrigir…</span>';
 let ticket='';
 try{const r=await fetch(SUPPORT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,context:supportContext()})});const j=await r.json();if(j?.ok)ticket=j.ticket||'';}catch{}
 const result=await runSafeRepair(category);
 if(reply)reply.innerHTML=`<b>Correção automática executada.</b><br>${escapeHtml(result)}${ticket?`<br><small>Protocolo: ${escapeHtml(ticket)}</small>`:'<br><small>O reparo local foi executado; o envio do relatório técnico não respondeu desta vez.</small>'}`;
}
ensureSupportDesk();

renderReview();
