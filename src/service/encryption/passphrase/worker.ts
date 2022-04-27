self.addEventListener('message', event => {
  console.log(event);
  setTimeout(() => self.postMessage({
    foo: 'boo'
  }), 5000)

  self.
})
