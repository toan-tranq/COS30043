const { createApp, ref } = Vue;

createApp({
  setup() {
    const userGuess = ref(100);
    const message = ref("Start guessing");
    const numberToGuess = ref(generateRandomNumber());

    function generateRandomNumber() {
      return Math.floor(Math.random() * 100) + 1;
    }

    function checkGuess() {
      if (userGuess.value < numberToGuess.value) {
        message.value = "Guess higher";
      } else if (userGuess.value > numberToGuess.value) {
        message.value = "Guess lower";
      } else {
        message.value = "You got it!";
      }
    }

    function giveUp() {
      message.value = `The number was ${numberToGuess.value}`;
    }

    function startOver() {
      userGuess.value = 0;
      message.value = "Start guessing";
      numberToGuess.value = generateRandomNumber();
    }

    return {
      userGuess,
      message,
      checkGuess,
      giveUp,
      startOver
    };
  }
}).mount('#app');
