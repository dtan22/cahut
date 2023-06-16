const server = "http://localhost:3000/";

async function getData(url, body) {
    const data = await fetch(server + url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    return data.json();
}

async function postData(url, body) {
    const data = await fetch(server + url, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        },
        body: JSON.stringify(body)
    })
    return data.json();
}

export {
    getData,
    postData
}