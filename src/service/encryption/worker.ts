const ctx: Worker = self as any;

ctx.addEventListener('message', event => {
  console.log(event);
  setTimeout(() => ctx.postMessage({
    foo: 'boo'
  }), 5000);
});

export default ctx as any;
