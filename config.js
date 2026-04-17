// config.js - Configuración del bot
module.exports = {
  // Prefijo de comandos
  prefix: '!',
  
  // Nombre del bot
  botName: '🤖 Bot Amigos',
  
  // Propietario del bot (tu número de WhatsApp)
  owner: '573223138326@s.whatsapp.net', // Número configurado
  
  // Mensajes automáticos
  autoResponses: {
    'hola bot': '¡Hola! 👋 Escribe !menu para ver mis comandos',
    'buenos dias': '¡Buenos días! ☀️ ¿En qué puedo ayudarte?',
    'buenas tardes': '¡Buenas tardes! 🌅',
    'buenas noches': '¡Buenas noches! 🌙'
  },
  
  // APIs
  apis: {
    meme: 'https://meme-api.com/gimme',
    tts: 'https://api.streamelements.com/kappa/v2/speech'
  },
  
  // Listas para comandos aleatorios
  frases: [
    'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    'No cuentes los días, haz que los días cuenten.',
    'La vida es 10% lo que te pasa y 90% cómo reaccionas a ello.',
    'El único modo de hacer un gran trabajo es amar lo que haces.',
    'Si puedes soñarlo, puedes hacerlo.',
    'La mejor forma de predecir el futuro es crearlo.',
    'No esperes oportunidades, créalas.',
    'El fracaso es solo la oportunidad de comenzar de nuevo de forma más inteligente.'
  ],
  
  verdades: [
    '¿Cuál es tu mayor miedo?',
    '¿Has mentido alguna vez a tu mejor amigo?',
    '¿Cuál es tu secreto más vergonzoso?',
    '¿A quién admiras en secreto?',
    '¿Qué es lo más raro que has hecho cuando estás solo?',
    '¿Has roto algo y culpado a otra persona?',
    '¿Cuál es tu peor hábito?',
    '¿Has espiado a alguien por redes sociales?'
  ],
  
  retos: [
    'Envía un audio cantando tu canción favorita',
    'Cambia tu foto de perfil por la que elija el grupo',
    'Escribe un mensaje de amor a la última persona con la que hablaste',
    'Haz 20 flexiones y envía el video',
    'No uses emojis durante 24 horas',
    'Cambia tu estado de WhatsApp a algo gracioso que elija el grupo',
    'Envía un meme de ti mismo',
    'No hables en el grupo durante 1 hora'
  ]
};
