console.log("Hello from module.js");

async function start() {
    return "Hello from async fn!!!";
}

start().then(r => console.log(r));