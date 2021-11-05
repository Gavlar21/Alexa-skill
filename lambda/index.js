const Alexa = require('ask-sdk-core');
const { stream } = require('./stream.js');

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
      (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        (handlerInput.requestEnvelope.request.intent.name ===
          'PlayStreamIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.ResumeIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.LoopOnIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.NextIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.PreviousIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.RepeatIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.ShuffleOnIntent' ||
          handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.StartOverIntent'))
    );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .speak(enData.PLAY_STREAM_MESSAGE)
      .addAudioPlayerPlayDirective(
        'REPLACE_ALL',
        stream.url,
        stream.token,
        0,
        null,
        stream.metadata
      );

    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(enData.HELP_MESSAGE)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name ===
        'AMAZON.StopIntent' ||
        handlerInput.requestEnvelope.request.intent.name ===
          'AMAZON.PauseIntent' ||
        handlerInput.requestEnvelope.request.intent.name ===
          'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name ===
          'AMAZON.LoopOffIntent' ||
        handlerInput.requestEnvelope.request.intent.name ===
          'AMAZON.ShuffleOffIntent')
    );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type ===
        'PlaybackController.PauseCommandIssued' ||
      handlerInput.requestEnvelope.request.type ===
        'AudioPlayer.PlaybackStopped'
    );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type ===
      'AudioPlayer.PlaybackStarted'
    );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder.addAudioPlayerClearQueueDirective(
      'CLEAR_ENQUEUED'
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

const ExceptionEncounteredRequestHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type ===
      'System.ExceptionEncountered'
    );
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );

    return true;
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(handlerInput.requestEnvelope.request.type);
    return handlerInput.responseBuilder.getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    CancelAndStopIntentHandler,
    ExceptionEncounteredRequestHandler,
    HelpIntentHandler,
    PlaybackStartedIntentHandler,
    PlaybackStoppedIntentHandler,
    PlayStreamIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

const enData = {
  PLAY_STREAM_MESSAGE: ``,
  HELP_MESSAGE: `To continue listening, say: 'Resume' or say: 'Stop' to end`,
};