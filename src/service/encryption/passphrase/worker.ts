import { isDecryptRequest, isEncryptRequest, isSetPassphraseRequest } from "./worker-api"

self.addEventListener('message', event => {
  console.log(event);
  const eventData = event.data

  if(isSetPassphraseRequest(eventData)) {
    console.log("passphraseEvent: " + eventData.passphrase)
  } else if(isDecryptRequest(eventData)) {
    console.log("decrypt request: " + eventData.encyptedValue)
  } else if(isEncryptRequest(eventData)) {
    console.log("enrypt request: " + eventData.uncryptedValue)
  } else {
    console.warn("Received unknown event")
  }
})
