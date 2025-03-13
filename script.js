console.log("script log!")

function logFormValues() {
    console.log("log values")
    const directoryName = document.getElementById('directoryName').value;
    const url = document.getElementById('url').value;
    console.log('Directory Name:', directoryName);
    console.log('URL:', url);
}