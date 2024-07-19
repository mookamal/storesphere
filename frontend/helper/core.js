export default async function SiteInfo() {
    const response = await fetch('http://api.nour.com/info');
    const data = await response.json();
    return data[0];
}
