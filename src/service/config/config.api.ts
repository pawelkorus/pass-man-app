export * from "./Config"

export const fetchConfig = async() => {
    let response = await fetch("/config.json")
    return response.json()
}

