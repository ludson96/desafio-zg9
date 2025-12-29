export const PROLOGO = [
  "A Jornada de Hot Dog",
  "📜 Passado...",
  "Vindo de onde os olhos não conseguiam alcançar, com um som alto passando pelas montanhas e vales, pelos rios e florestas. Todos no mundo puderam ouvir uma voz que parecia um estrondo, que dizia:",
  "Contemplem seu novo mestre, Glozium...",
  "<strong>Demonstrativus potentiaaam!!!</strong>",
  "O terro re caiu sobre as pessoas e o mundo foi tomadao por uma neblina que provocou todo tipo de mazela. Alguns morreram, outros tornaram-se monstros, animais sofreram mutações. Mas após a dissolução dessa terrível onda mortífera, era possível ver em meio a neblina o que pareciam estátuas em pé, onde o som foi mais intenso...",
  "⏳ Agora...",
  "A província de <strong>Hospitalis</strong> é conhecida por seus médicos mágicos poderosos, que foram capazes de erradicar uma doenã terrível lançada pelo grande vilão Glozium.",
  "Infelizmente, os hospitalienses não conseguem lidar com todo o poder de Glozium sozinhos e, por isso, a província depende de guerreiros estrangeiros para ajudá-los a se defender. A famosa <strong>Zerum Glozium</strong> é a principal Guilda do reino, seus ferreiros desenvolvem armas para os guerreiros capazes de travar embates contra as forças de Glozium. Esses guerreiros escolhidos são chamados de <strong>Analyticaes di Glozium</strong>.",
  "Para reduzir os impactos do monstro imortal Glozium, que ressurge a cada ano, a província de Hospitalis realiza um grande ritual chamado <strong>Ciclum Receitatus Hospitalis</strong>. Esse ritual pode dar a um guerreiro condições de destruir Glozium, reduzindo seu poder a zero. Mesmo que não seja destruído, ele é sempre enfraquecido e somente recobra seus poderes no póximo ano.",
  "Para que o ritual se concretize, o guerreiro escolhido deve partir em uma jornada visitando quatro locais para obter os itens necessários. E <strong>Hot Dog</strong> parte nessa jornada..."

]

export const STAGES = [
  {
    id: "florest",
    title: "Floresta do Atendimentus",
    isActive: true
  },
  {
    id: "caves",
    title: "Cavernas de Faturamentus",
    isActive: true
  },
  {
    id: "village",
    title: "Vila da Transmissão",
    isActive: false
  },
  {
    id: "tower",
    title: "Torre de Contas a Receber",
    isActive: false
  },
  {
    id: "final-battle",
    title: "Batalha contra Glozium (final)",
    isActive: false
  },
]

export const FLORESTA = [
  "Um lugar encantado, dizem que pessoas doentes ou com almas feridas podem ir a floresta para serem curadas",
  "A floresta parece mais sinistra que nunca, Hot Dog percorre lugares combrios e neblinados enquanto fala com seu pai Sandubinha, que intrui telepaticamente:",
  "<i>Sandubinha - na floresta de Atendimentus, encontre o ser \"Processus\" ele irá te mostrar o monstro a ser enfrentado.</i>",
  "Porém Hot Dog se perde na floresta, mas de repente seu cachorro fareja algo e começa a correr, o herói o segue pois confia totalmente me seu querido animal.",
  "mergulhando nos arbustos de espinhos que ragam a pele, eles correm até um campo limpo e se deparam com algo terrível...",
  "Processus estava morto, caído aos pés de uma criatura humanoide com um olhar nojento e arrogante, como um demônio:",
  "Hot Dob - não há dúvidas, você é o inimigo, como você feriu o Processus? não era para seu poder afetar seres mágicos do tipo dele!",
  "Monstro - não afeta diretamente, mas interfere no equilíbrio, eu impeço o atendimento das almas, eu sou <strong>Anti-authorizatus!</strong> e mesmo esses seres precisam passar pelo Ciclo de Hospitales HAHAHA que pena, esse já era, agora é sua vez e depois matarei esse pirralho assustado nos arbustos, filho desse aqui",
  "Hot Dog - não se preocupe jovem, irei me vingar pelo amigo de meu pai!",
  "Uma batalha sangrenta se inicia..."
]

export const CAVES = [
  "Existe sempre um preço a se pagar pela cura do corpo e da alma, após a <strong>floresta do atendimentus</strong> seu preço é calculado de acordo com o tipo de contrato divino qeu você tem...",
  "Esplorando a caverna com uma tocha, Hot Dog ouve sons metálicos ao longe. Ao alcançar uma área iluminada por minérios misteriosos, encontra <strong>três caminhos e um enigma</strong> indicando a pista para a escolha certa:"
];

export const CAVES_RIDDLE = {
  question: "Do enfermo vem o início, do registro o meio, do pagamento o fim do anseio. Gira sem parar nos salões do curar — que ciclo é esse a sustentar?",
  options: [
    { text: "O Ciclum Receitatus Hospitalis", isCorrect: true, consequence: null, message: "A porta se abre revelando o caminho correto." },
    { text: "O Rito dos Curandeiros Eternos", isCorrect: false, consequence: "damage", message: "Você segue em frente, porém, cai em uma armadilha e sofre 2 de dano." },
    { text: "A Roda da Vida e da Cura", isCorrect: false, consequence: "buff", message: "Você sente uma energia sombria fortalecendo o inimigo. O chefão da fase ganha +6 de vida." }
  ]
};

export const CAVES_BEFORE_BATTLE = [
  "Hot Dog alcança um novo local, onde os Acições do Faturamento trabalham sem dar atenção aos arredores. De repente, ele encontra o <strong>mostro da caverna</strong> - um <strong> cavaleiro infernal</strong> forjado por Gloizum, afiando sua espada.",
  "Glozium Administratus - você é o herói deste ano? não me parece grande coisa. Não sou muito de conversa, venha lutar, irei te fatiar e servir pros lacaios de meu mestre!",
  "Hot Dog - algmas piadas ruins podem até me fazer rir, você é uma dessas, hahaha...se prepare!"
]